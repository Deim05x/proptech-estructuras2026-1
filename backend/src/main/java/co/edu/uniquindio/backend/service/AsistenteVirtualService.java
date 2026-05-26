package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.AsistenteVirtualRequest;
import co.edu.uniquindio.backend.dto.AsistenteVirtualResponse;
import co.edu.uniquindio.backend.dto.ChatMessageDTO;
import co.edu.uniquindio.backend.model.Asesor;
import co.edu.uniquindio.backend.model.Cliente;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.SolicitudAtencion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AsistenteVirtualService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AsistenteVirtualService.class);
    private static final Pattern CODIGO_INMUEBLE = Pattern.compile("INM-\\d{3}", Pattern.CASE_INSENSITIVE);
    private static final Pattern NUMERO = Pattern.compile("(\\d+(?:[\\.,]\\d+)?)\\s*(millones|millon|m)?");
    private static final int MAX_INMUEBLES_CONTEXTO = 20;
    private static final int MAX_HISTORIAL = 6;

    private final InmuebleService inmuebleService;
    private final ClienteService clienteService;
    private final AsesorService asesorService;
    private final SolicitudAtencionService solicitudAtencionService;
    private final RestClient restClient;
    private final boolean iaActiva;
    private final String proveedor;
    private final String apiUrl;
    private final String apiKey;
    private final String modelo;
    private final String conocimientoBase;

    public AsistenteVirtualService(
            InmuebleService inmuebleService,
            ClienteService clienteService,
            AsesorService asesorService,
            SolicitudAtencionService solicitudAtencionService,
            @Value("${hogarxpress.ai.enabled:false}") boolean iaActiva,
            @Value("${hogarxpress.ai.provider:openai}") String proveedor,
            @Value("${hogarxpress.ai.api-url:}") String apiUrl,
            @Value("${hogarxpress.ai.api-key:}") String apiKey,
            @Value("${hogarxpress.ai.model:}") String modelo,
            @Value("classpath:asesor-ia-conocimiento.md") Resource conocimientoResource) {
        this.inmuebleService = inmuebleService;
        this.clienteService = clienteService;
        this.asesorService = asesorService;
        this.solicitudAtencionService = solicitudAtencionService;
        this.restClient = RestClient.builder().build();
        this.iaActiva = iaActiva;
        this.proveedor = proveedor;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.modelo = modelo;
        this.conocimientoBase = cargarConocimientoBase(conocimientoResource);
    }

    public AsistenteVirtualResponse responder(
            AsistenteVirtualRequest request,
            String clienteId,
            String rol) {
        String mensaje = limpiar(request == null ? null : request.getMensaje());

        if (mensaje.isBlank()) {
            return new AsistenteVirtualResponse(
                    "Cuentalo con una pregunta concreta y te ayudo a buscar inmuebles, zonas o pasos para continuar.",
                    false,
                    false,
                    List.of());
        }

        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        boolean requiereRegistro = requiereCuenta(mensaje, rol);

        if (iaActiva && !estaVacio(apiKey)) {
            try {
                String respuestaIa = llamarProveedorIa(request, mensaje, inmuebles, clienteId, rol);
                if (!estaVacio(respuestaIa)) {
                    return new AsistenteVirtualResponse(
                            respuestaIa,
                            true,
                            requiereRegistro,
                            extraerCodigos(respuestaIa));
                }
            } catch (RuntimeException ex) {
                LOGGER.warn("No se pudo generar respuesta con IA externa. Se usara respuesta local.", ex);
            }
        }

        return responderLocalmente(mensaje, inmuebles, requiereRegistro, rol);
    }

    private String llamarProveedorIa(
            AsistenteVirtualRequest request,
            String mensaje,
            Inmueble[] inmuebles,
            String clienteId,
            String rol) {
        if ("gemini".equalsIgnoreCase(valor(proveedor, ""))) {
            return llamarGemini(request, mensaje, inmuebles, clienteId, rol);
        }

        return llamarOpenAi(request, mensaje, inmuebles, clienteId, rol);
    }

    private String llamarOpenAi(
            AsistenteVirtualRequest request,
            String mensaje,
            Inmueble[] inmuebles,
            String clienteId,
            String rol) {
        Map<String, Object> body = Map.of(
                "model", obtenerModeloOpenAi(),
                "instructions", instruccionesSistema(),
                "input", construirEntradaUsuario(request, mensaje, inmuebles, clienteId, rol),
                "max_output_tokens", 450);

        JsonNode response = restClient
                .post()
                .uri(obtenerUrlOpenAi())
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        return extraerTextoRespuesta(response);
    }

    private String llamarGemini(
            AsistenteVirtualRequest request,
            String mensaje,
            Inmueble[] inmuebles,
            String clienteId,
            String rol) {
        Map<String, Object> body = Map.of(
                "systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", instruccionesSistema()))),
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of(
                                "text", construirEntradaUsuario(request, mensaje, inmuebles, clienteId, rol))))),
                "generationConfig", Map.of(
                        "maxOutputTokens", 450,
                        "temperature", 0.4));

        JsonNode response = restClient
                .post()
                .uri(obtenerUrlGemini())
                .header("x-goog-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        return extraerTextoGemini(response);
    }

    private String instruccionesSistema() {
        return """
                Eres el asesor virtual de HogarXpress, una plataforma inmobiliaria.
                Responde en espanol claro, amable y breve.
                Puedes responder preguntas del portal ADMIN, CLIENTE e INVITADO usando la guia operativa y el catalogo entregados por el sistema.
                Prioriza la base de conocimiento entregada por el sistema cuando responda preguntas sobre HogarXpress.
                Usa solo el contexto disponible; no inventes inmuebles, precios, disponibilidad, credenciales ni datos personales.
                Si recomiendas propiedades, menciona codigo, tipo, zona, precio y motivo.
                Si el usuario pide guardar favoritos, agendar visitas, comprar, arrendar o enviar solicitudes, explica que debe iniciar sesion o registrarse como cliente.
                Si pregunta por administracion, explica el panel o modulo correcto y los pasos generales.
                El chat orienta y recomienda, pero no ejecuta operaciones CRUD directamente.
                Si no hay datos suficientes, pide el dato que falta.
                """;
    }

    private String construirEntradaUsuario(
            AsistenteVirtualRequest request,
            String mensaje,
            Inmueble[] inmuebles,
            String clienteId,
            String rol) {
        StringBuilder entrada = new StringBuilder();
        entrada.append("Rol actual: ").append(valor(rol, "INVITADO")).append('\n');
        entrada.append("Cliente autenticado: ").append(valor(clienteId, "sin cliente")).append('\n');
        entrada.append("Guia operativa HogarXpress:\n");
        entrada.append(construirGuiaOperativa());
        if (!estaVacio(conocimientoBase)) {
            entrada.append("\nBase de conocimiento HogarXpress:\n");
            entrada.append(conocimientoBase).append('\n');
        }
        entrada.append("\nResumen del sistema:\n");
        entrada.append(construirResumenSistema(inmuebles, rol));
        entrada.append("Catalogo disponible:\n");
        entrada.append(construirContextoInmuebles(inmuebles));

        List<ChatMessageDTO> historial = request == null ? List.of() : request.getHistorial();
        if (historial != null && !historial.isEmpty()) {
            entrada.append("\nHistorial reciente:\n");
            int inicio = Math.max(0, historial.size() - MAX_HISTORIAL);
            for (int i = inicio; i < historial.size(); i++) {
                ChatMessageDTO item = historial.get(i);
                if (item != null && !estaVacio(item.getContent())) {
                    entrada
                            .append(valor(item.getRole(), "mensaje"))
                            .append(": ")
                            .append(limitar(item.getContent(), 260))
                            .append('\n');
                }
            }
        }

        entrada.append("\nPregunta actual: ").append(mensaje);
        return entrada.toString();
    }

    private String construirContextoInmuebles(Inmueble[] inmuebles) {
        if (inmuebles == null || inmuebles.length == 0) {
            return "No hay inmuebles cargados.\n";
        }

        StringBuilder contexto = new StringBuilder();
        int agregados = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null || !inmueble.isDisponible()) {
                continue;
            }

            contexto
                    .append("- ")
                    .append(inmueble.getCodigo())
                    .append(" | ")
                    .append(valor(inmueble.getTipoInmueble(), "tipo no definido"))
                    .append(" | ")
                    .append(valor(inmueble.getFinalidad(), "finalidad no definida"))
                    .append(" | ")
                    .append(valor(inmueble.getBarrioZona(), "zona no definida"))
                    .append(", ")
                    .append(valor(inmueble.getCiudad(), "ciudad no definida"))
                    .append(" | $")
                    .append(Math.round(inmueble.getPrecio()))
                    .append(" | ")
                    .append(inmueble.getHabitaciones())
                    .append(" hab | ")
                    .append(inmueble.getBanos())
                    .append(" banos | asesor ")
                    .append(valor(inmueble.getIdAsesorResponsable(), "sin asesor"))
                    .append('\n');

            agregados++;
            if (agregados >= MAX_INMUEBLES_CONTEXTO) {
                break;
            }
        }

        if (agregados == 0) {
            return "No hay inmuebles disponibles en este momento.\n";
        }

        return contexto.toString();
    }

    private String extraerTextoRespuesta(JsonNode response) {
        if (response == null || response.isMissingNode() || response.isNull()) {
            return "";
        }

        JsonNode outputText = response.path("output_text");
        if (outputText.isTextual() && !outputText.asText().isBlank()) {
            return outputText.asText().trim();
        }

        JsonNode output = response.path("output");
        if (output.isArray()) {
            StringBuilder texto = new StringBuilder();
            for (JsonNode item : output) {
                JsonNode content = item.path("content");
                if (!content.isArray()) {
                    continue;
                }
                for (JsonNode contentItem : content) {
                    String type = contentItem.path("type").asText();
                    if ("output_text".equals(type) || "text".equals(type)) {
                        String value = contentItem.path("text").asText("");
                        if (!value.isBlank()) {
                            texto.append(value).append('\n');
                        }
                    }
                }
            }
            return texto.toString().trim();
        }

        return "";
    }

    private String extraerTextoGemini(JsonNode response) {
        if (response == null || response.isMissingNode() || response.isNull()) {
            return "";
        }

        StringBuilder texto = new StringBuilder();
        JsonNode candidates = response.path("candidates");

        if (candidates.isArray()) {
            for (JsonNode candidate : candidates) {
                JsonNode parts = candidate.path("content").path("parts");

                if (!parts.isArray()) {
                    continue;
                }

                for (JsonNode part : parts) {
                    String value = part.path("text").asText("");
                    if (!value.isBlank()) {
                        texto.append(value).append('\n');
                    }
                }
            }
        }

        return texto.toString().trim();
    }

    private AsistenteVirtualResponse responderLocalmente(
            String mensaje,
            Inmueble[] inmuebles,
            boolean requiereRegistro,
            String rol) {
        String consulta = normalizar(mensaje);

        if (esPreguntaDeConfiguracion(consulta)) {
            return new AsistenteVirtualResponse(
                    respuestaConfiguracionLocal(),
                    false,
                    false,
                    List.of());
        }

        if (esPreguntaAdministrativa(consulta)) {
            return new AsistenteVirtualResponse(
                    respuestaAdminLocal(),
                    false,
                    false,
                    List.of());
        }

        if (esPreguntaDeCapacidades(consulta)) {
            return new AsistenteVirtualResponse(
                    respuestaCapacidadesLocal(rol),
                    false,
                    false,
                    List.of());
        }

        if (esPreguntaCliente(consulta)) {
            return new AsistenteVirtualResponse(
                    respuestaClienteLocal(rol),
                    false,
                    requiereRegistro,
                    List.of());
        }

        if (!esPreguntaDeCatalogo(consulta)) {
            return new AsistenteVirtualResponse(
                    respuestaGeneralLocal(rol),
                    false,
                    requiereRegistro,
                    List.of());
        }

        List<Inmueble> sugeridos = filtrarInmuebles(mensaje, inmuebles);
        List<String> codigos = sugeridos.stream().map(Inmueble::getCodigo).toList();
        StringBuilder respuesta = new StringBuilder();

        if (sugeridos.isEmpty()) {
            respuesta.append("Puedo ayudarte a buscar por zona, presupuesto, tipo de inmueble o finalidad. ");
            respuesta.append("En este momento no encontre una coincidencia clara con tu pregunta.");
        } else {
            respuesta.append("Estas opciones pueden ajustarse a lo que buscas: ");
            for (int i = 0; i < sugeridos.size(); i++) {
                Inmueble inmueble = sugeridos.get(i);
                if (i > 0) {
                    respuesta.append(" ");
                }
                respuesta.append(inmueble.getCodigo())
                        .append(" es ")
                        .append(valor(inmueble.getTipoInmueble(), "un inmueble"))
                        .append(" en ")
                        .append(valor(inmueble.getBarrioZona(), "zona por confirmar"))
                        .append(" por $")
                        .append(Math.round(inmueble.getPrecio()))
                        .append(", con ")
                        .append(inmueble.getHabitaciones())
                        .append(" habitaciones.");
            }
        }

        if (requiereRegistro && !"CLIENTE".equalsIgnoreCase(valor(rol, ""))) {
            respuesta.append(" Para guardar favoritos, agendar visitas o enviar solicitudes, registrate o inicia sesion como cliente.");
        }

        return new AsistenteVirtualResponse(respuesta.toString(), false, requiereRegistro, codigos);
    }

    private String construirGuiaOperativa() {
        return """
                - Invitado: puede explorar /descubrir-inmuebles, filtrar catalogo y preguntar por zonas, precios, tipos y finalidad.
                - Cliente: puede ver inicio cliente, catalogo, recomendaciones, favoritos, visitas, historial, actividad y solicitudes.
                - Admin: puede gestionar dashboard, inmuebles, clientes, asesores, rotacion, visitas, solicitudes, operaciones, contratos, alertas, reportes, grafos, busqueda hash y validaciones.
                - Registro: crea cuenta cliente, genera ID CLI-### y envia correo de bienvenida si SMTP esta configurado.
                - Inmuebles admin: codigo INM-### automatico; tipo, finalidad, zona, estado y asesor responsable se eligen desde listas; asesores se filtran por zona.
                - Asesores admin: ID ASE-### automatico y especialidad por zona.
                - Acciones protegidas: favoritos, visitas, solicitudes, actividad y paneles internos requieren login.
                """;
    }

    private String construirResumenSistema(Inmueble[] inmuebles, String rol) {
        int totalInmuebles = 0;
        int disponibles = 0;
        Set<String> zonas = new LinkedHashSet<>();

        if (inmuebles != null) {
            for (Inmueble inmueble : inmuebles) {
                if (inmueble == null) {
                    continue;
                }

                totalInmuebles++;
                if (inmueble.isDisponible()) {
                    disponibles++;
                }
                if (!estaVacio(inmueble.getBarrioZona())) {
                    zonas.add(inmueble.getBarrioZona());
                }
            }
        }

        StringBuilder resumen = new StringBuilder();
        resumen.append("- Inmuebles registrados: ").append(totalInmuebles).append('\n');
        resumen.append("- Inmuebles disponibles: ").append(disponibles).append('\n');
        resumen.append("- Zonas con catalogo: ").append(zonas.isEmpty() ? "sin zonas" : String.join(", ", zonas)).append('\n');

        if ("ADMIN".equalsIgnoreCase(valor(rol, ""))) {
            resumen.append("- Clientes registrados: ").append(contarClientesSeguro()).append('\n');
            resumen.append("- Asesores registrados: ").append(contarAsesoresSeguro()).append('\n');
            resumen.append("- Solicitudes registradas: ").append(contarSolicitudesSeguro()).append('\n');
        }

        return resumen.toString();
    }

    private String respuestaCapacidadesLocal(String rol) {
        if ("ADMIN".equalsIgnoreCase(valor(rol, ""))) {
            return "Como asesor virtual puedo orientarte en tareas de administrador: registrar y editar inmuebles, revisar clientes y asesores, explicar solicitudes, visitas, operaciones, contratos, reportes, alertas, validaciones y estructuras usadas por el sistema. Tambien puedo resumir como funcionan los IDs automaticos y los filtros por zona.";
        }

        if ("CLIENTE".equalsIgnoreCase(valor(rol, ""))) {
            return "Como asesor virtual puedo ayudarte como cliente a encontrar inmuebles, comparar zonas y presupuestos, entender recomendaciones, favoritos, visitas, solicitudes y actividad. Si quieres, dime zona, presupuesto, tipo de inmueble y finalidad.";
        }

        return "Como asesor virtual puedo ayudarte como invitado a explorar inmuebles, filtrar por zona, tipo, precio o finalidad y explicarte como registrarte. Para guardar favoritos, agendar visitas o crear solicitudes necesitas una cuenta de cliente.";
    }

    private String respuestaAdminLocal() {
        return "Para administrador, HogarXpress se organiza en modulos: Dashboard para resumen, Inmuebles para registrar propiedades con codigo automatico INM-###, Personas para clientes y asesores con IDs CLI-### y ASE-###, Comercial para visitas, solicitudes, operaciones y contratos, Monitoreo para alertas y validaciones, y Analitica para reportes, grafos y busqueda hash. El chat te orienta, pero los cambios se hacen desde cada formulario del panel.";
    }

    private String respuestaClienteLocal(String rol) {
        if (!"CLIENTE".equalsIgnoreCase(valor(rol, ""))) {
            return "Como cliente registrado puedes explorar catalogo, ver recomendaciones, guardar favoritos, solicitar visitas, crear solicitudes y revisar tu actividad. Ahora estas como invitado, asi que puedes explorar inmuebles, pero para esas acciones debes iniciar sesion o registrarte.";
        }

        return "En tu portal cliente puedes explorar inmuebles, recibir recomendaciones, guardar favoritos, enviar solicitudes, agendar visitas y revisar tu actividad. Puedo ayudarte a decidir por zona, presupuesto, tipo de inmueble, habitaciones o finalidad.";
    }

    private String respuestaConfiguracionLocal() {
        return "La IA real depende de AI_ENABLED=true, AI_PROVIDER y una API key valida en backend/.env.local. Para Gemini usa AI_PROVIDER=gemini y GEMINI_API_KEY; para OpenAI usa AI_PROVIDER=openai y OPENAI_API_KEY. El conocimiento editable del asesor esta en backend/src/main/resources/asesor-ia-conocimiento.md. Si el chat muestra respuestas sin etiqueta 'Respuesta IA', esta usando la respuesta local de respaldo; reinicia el backend con .\\run-local.ps1 despues de cambiar variables.";
    }

    private String respuestaGeneralLocal(String rol) {
        return respuestaCapacidadesLocal(rol) + " Puedes preguntarme, por ejemplo: 'que hace el modulo de solicitudes', 'como registro un inmueble', 'que puede hacer un cliente' o 'que apartamentos hay en el norte hasta 300 millones'.";
    }

    private List<Inmueble> filtrarInmuebles(String mensaje, Inmueble[] inmuebles) {
        List<Inmueble> disponibles = new ArrayList<>();
        if (inmuebles == null) {
            return disponibles;
        }

        String consulta = normalizar(mensaje);
        Double presupuestoMaximo = extraerPresupuestoMaximo(consulta);
        String zonaSolicitada = extraerPrimeraCoincidencia(consulta, "norte", "sur", "centro", "occidente");
        String tipoSolicitado = extraerPrimeraCoincidencia(
                consulta,
                "casa",
                "apartamento",
                "local",
                "oficina",
                "bodega",
                "lote",
                "finca");
        String finalidadSolicitada = extraerPrimeraCoincidencia(consulta, "venta", "arriendo");

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null || !inmueble.isDisponible()) {
                continue;
            }

            boolean consultaGeneral = consulta.contains("opcion")
                    || consulta.contains("inmueble")
                    || consulta.contains("casa")
                    || consulta.contains("apartamento")
                    || consulta.contains("recomienda")
                    || consulta.contains("busco");

            boolean coincidePrecio = presupuestoMaximo == null || inmueble.getPrecio() <= presupuestoMaximo;
            boolean coincideZona = zonaSolicitada == null
                    || normalizar(inmueble.getBarrioZona()).contains(zonaSolicitada)
                    || normalizar(inmueble.getCiudad()).contains(zonaSolicitada);
            boolean coincideTipo = tipoSolicitado == null
                    || normalizar(inmueble.getTipoInmueble()).contains(tipoSolicitado);
            boolean coincideFinalidad = finalidadSolicitada == null
                    || normalizar(inmueble.getFinalidad()).contains(finalidadSolicitada);

            if (consultaGeneral && coincidePrecio && coincideZona && coincideTipo && coincideFinalidad) {
                disponibles.add(inmueble);
            }

            if (disponibles.size() == 3) {
                break;
            }
        }

        if (disponibles.isEmpty()) {
            for (Inmueble inmueble : inmuebles) {
                if (inmueble != null && inmueble.isDisponible()) {
                    disponibles.add(inmueble);
                }
                if (disponibles.size() == 3) {
                    break;
                }
            }
        }

        return disponibles;
    }

    private boolean requiereCuenta(String mensaje, String rol) {
        if ("CLIENTE".equalsIgnoreCase(valor(rol, ""))) {
            return false;
        }

        String consulta = normalizar(mensaje);
        return consulta.contains("favorito")
                || consulta.contains("guardar")
                || consulta.contains("visita")
                || consulta.contains("agendar")
                || consulta.contains("solicitud")
                || consulta.contains("comprar")
                || consulta.contains("arrendar")
                || consulta.contains("arriendo")
                || consulta.contains("actividad")
                || consulta.contains("historial");
    }

    private boolean esPreguntaDeCatalogo(String consulta) {
        return contieneAlguno(
                consulta,
                "inmueble",
                "propiedad",
                "casa",
                "apartamento",
                "local",
                "oficina",
                "bodega",
                "lote",
                "finca",
                "zona",
                "norte",
                "sur",
                "centro",
                "occidente",
                "precio",
                "presupuesto",
                "habitacion",
                "bano",
                "venta",
                "arriendo",
                "comprar",
                "arrendar",
                "recomienda",
                "busco",
                "catalogo",
                "disponible");
    }

    private boolean esPreguntaAdministrativa(String consulta) {
        return contieneAlguno(
                consulta,
                "admin",
                "administrador",
                "dashboard",
                "registrar inmueble",
                "agregar inmueble",
                "editar inmueble",
                "clientes",
                "gestion de clientes",
                "agregar cliente",
                "editar cliente",
                "asesores",
                "agregar asesor",
                "editar asesor",
                "especialidad de zona",
                "rotacion",
                "visita",
                "solicitud",
                "operacion",
                "contrato",
                "alerta",
                "monitoreo",
                "validacion",
                "reporte",
                "analitica",
                "grafo",
                "busqueda hash",
                "id automatico",
                "codigo automatico");
    }

    private boolean esPreguntaCliente(String consulta) {
        return contieneAlguno(
                consulta,
                "portal cliente",
                "como cliente",
                "un cliente",
                "el cliente",
                "favorito",
                "mis solicitudes",
                "mi actividad",
                "historial",
                "recomendacion",
                "agendar",
                "registrarme",
                "registro",
                "iniciar sesion",
                "login");
    }

    private boolean esPreguntaDeCapacidades(String consulta) {
        return contieneAlguno(
                consulta,
                "que puedes hacer",
                "como ayudas",
                "ayudar",
                "funciones",
                "capacidades",
                "para que sirves",
                "que respondes",
                "que haces");
    }

    private String obtenerUrlOpenAi() {
        if (!estaVacio(apiUrl)) {
            return apiUrl;
        }

        return "https://api.openai.com/v1/responses";
    }

    private String obtenerUrlGemini() {
        if (!estaVacio(apiUrl)) {
            return apiUrl;
        }

        return "https://generativelanguage.googleapis.com/v1beta/models/"
                + obtenerModeloGemini()
                + ":generateContent";
    }

    private String obtenerModeloOpenAi() {
        return estaVacio(modelo) ? "gpt-4.1-mini" : modelo.trim();
    }

    private String obtenerModeloGemini() {
        if (estaVacio(modelo) || modelo.toLowerCase(Locale.ROOT).startsWith("gpt-")) {
            return "gemini-2.5-flash";
        }

        return modelo.trim();
    }

    private boolean esPreguntaDeConfiguracion(String consulta) {
        return contieneAlguno(
                consulta,
                "openai",
                "gemini",
                "api key",
                "apikey",
                "ia real",
                "generado con ia",
                "correo",
                "gmail",
                "smtp",
                "mail_enabled",
                "ai_enabled",
                "env.local",
                "variables");
    }

    private boolean contieneAlguno(String consulta, String... palabras) {
        for (String palabra : palabras) {
            if (consulta.contains(palabra)) {
                return true;
            }
        }

        return false;
    }

    private String extraerPrimeraCoincidencia(String consulta, String... opciones) {
        for (String opcion : opciones) {
            if (consulta.contains(opcion)) {
                return opcion;
            }
        }

        return null;
    }

    private int contarClientesSeguro() {
        try {
            Cliente[] clientes = clienteService.listarClientes();
            return clientes == null ? 0 : clientes.length;
        } catch (RuntimeException ex) {
            LOGGER.debug("No se pudo contar clientes para contexto IA.", ex);
            return 0;
        }
    }

    private int contarAsesoresSeguro() {
        try {
            Asesor[] asesores = asesorService.listarAsesores();
            return asesores == null ? 0 : asesores.length;
        } catch (RuntimeException ex) {
            LOGGER.debug("No se pudo contar asesores para contexto IA.", ex);
            return 0;
        }
    }

    private int contarSolicitudesSeguro() {
        try {
            SolicitudAtencion[] solicitudes = solicitudAtencionService.listar();
            return solicitudes == null ? 0 : solicitudes.length;
        } catch (RuntimeException ex) {
            LOGGER.debug("No se pudo contar solicitudes para contexto IA.", ex);
            return 0;
        }
    }

    private Double extraerPresupuestoMaximo(String consulta) {
        if (!(consulta.contains("menos")
                || consulta.contains("hasta")
                || consulta.contains("maximo")
                || consulta.contains("debajo")
                || consulta.contains("presupuesto"))) {
            return null;
        }

        Matcher matcher = NUMERO.matcher(consulta);
        while (matcher.find()) {
            String numeroTexto = matcher.group(1).replace(",", ".");
            String unidad = matcher.group(2);
            try {
                double numero = Double.parseDouble(numeroTexto);
                if (unidad != null && !unidad.isBlank()) {
                    return numero * 1_000_000D;
                }
                if (numero < 10_000) {
                    return numero * 1_000_000D;
                }
                return numero;
            } catch (NumberFormatException ignored) {
                // Ignora numeros que no puedan convertirse.
            }
        }

        return null;
    }

    private boolean coincide(String consulta, String valor) {
        String normalizado = normalizar(valor);
        return !normalizado.isBlank() && consulta.contains(normalizado);
    }

    private List<String> extraerCodigos(String respuesta) {
        Set<String> codigos = new LinkedHashSet<>();
        Matcher matcher = CODIGO_INMUEBLE.matcher(valor(respuesta, ""));

        while (matcher.find()) {
            codigos.add(matcher.group().toUpperCase(Locale.ROOT));
        }

        return new ArrayList<>(codigos);
    }

    private String normalizar(String valor) {
        String texto = valor(valor, "").toLowerCase(Locale.ROOT);
        return Normalizer
                .normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }

    private String limpiar(String valor) {
        return valor(valor, "").trim();
    }

    private String cargarConocimientoBase(Resource resource) {
        if (resource == null || !resource.exists()) {
            return "";
        }

        try {
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8).trim();
        } catch (IOException ex) {
            LOGGER.warn("No se pudo cargar la base de conocimiento del asesor IA.", ex);
            return "";
        }
    }

    private String limitar(String valor, int maximo) {
        String limpio = limpiar(valor);
        if (limpio.length() <= maximo) {
            return limpio;
        }
        return limpio.substring(0, maximo) + "...";
    }

    private boolean estaVacio(String valor) {
        return valor == null || valor.isBlank();
    }

    private String valor(String valor, String respaldo) {
        if (valor == null || valor.isBlank()) {
            return respaldo;
        }
        return valor.trim();
    }
}
