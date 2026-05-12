package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.ResultadoValidacionDTO;
import co.edu.uniquindio.backend.dto.ValidacionNegocioDTO;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.*;
import co.edu.uniquindio.backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class ValidacionNegocioService {

    private final ClienteRepository clienteRepository;
    private final InmuebleRepository inmuebleRepository;
    private final AsesorRepository asesorRepository;
    private final VisitaRepository visitaRepository;
    private final OperacionRepository operacionRepository;
    private final ContratoRepository contratoRepository;
    private final SolicitudAtencionRepository solicitudRepository;

    public ValidacionNegocioService(
            ClienteRepository clienteRepository,
            InmuebleRepository inmuebleRepository,
            AsesorRepository asesorRepository,
            VisitaRepository visitaRepository,
            OperacionRepository operacionRepository,
            ContratoRepository contratoRepository,
            SolicitudAtencionRepository solicitudRepository
    ) {
        this.clienteRepository = clienteRepository;
        this.inmuebleRepository = inmuebleRepository;
        this.asesorRepository = asesorRepository;
        this.visitaRepository = visitaRepository;
        this.operacionRepository = operacionRepository;
        this.contratoRepository = contratoRepository;
        this.solicitudRepository = solicitudRepository;
    }

    public ResultadoValidacionDTO validar(ValidacionNegocioDTO dto) {
        if (dto.getTipoValidacion() == null || dto.getTipoValidacion().isBlank()) {
            ResultadoValidacionDTO resultado = crearResultado("GENERAL");
            resultado.agregarError("Debes indicar el tipo de validación.");
            resultado.setMensajeGeneral("Validación incompleta.");
            return resultado;
        }

        String tipo = dto.getTipoValidacion().toUpperCase();

        return switch (tipo) {
            case "AGENDAR_VISITA" -> validarAgendarVisita(dto);
            case "CREAR_OPERACION" -> validarCrearOperacion(dto);
            case "CREAR_CONTRATO" -> validarCrearContrato(dto);
            case "INTENCION_COMERCIAL" -> validarIntencionComercial(dto);
            case "CONSISTENCIA_GENERAL" -> validarConsistenciaGeneral();
            default -> {
                ResultadoValidacionDTO resultado = crearResultado(tipo);
                resultado.agregarError("Tipo de validación no reconocido: " + tipo);
                resultado.setMensajeGeneral("No se pudo ejecutar la validación.");
                yield resultado;
            }
        };
    }

    public ResultadoValidacionDTO validarAgendarVisita(ValidacionNegocioDTO dto) {
        ResultadoValidacionDTO resultado = crearResultado("AGENDAR_VISITA");

        Cliente cliente = buscarCliente(dto.getIdCliente());
        Inmueble inmueble = buscarInmueble(dto.getCodigoInmueble());
        Asesor asesor = buscarAsesor(dto.getIdAsesor());

        if (cliente == null) {
            resultado.agregarError("El cliente no existe.");
        }

        if (inmueble == null) {
            resultado.agregarError("El inmueble no existe.");
        }

        if (asesor == null) {
            resultado.agregarError("El asesor no existe.");
        }

        if (inmueble != null && !inmueble.isDisponible()) {
            resultado.agregarError("No se puede agendar visita porque el inmueble no está disponible.");
        }

        if (inmueble != null && inmueble.getEstado() != null &&
                inmueble.getEstado().equalsIgnoreCase("RESERVADO")) {
            resultado.agregarAdvertencia("El inmueble está reservado. Verifica si aún se puede visitar.");
        }

        if (cliente != null && inmueble != null) {
            validarPresupuestoCliente(cliente, inmueble, resultado);
        }

        if (asesor != null) {
            int visitasPendientes = contarVisitasPendientesAsesor(dto.getIdAsesor());

            if (visitasPendientes >= 5) {
                resultado.agregarAdvertencia(
                        "El asesor tiene " + visitasPendientes +
                        " visitas pendientes. Puede existir sobrecarga."
                );
            }
        }

        cerrarResultado(resultado);
        return resultado;
    }

    public ResultadoValidacionDTO validarCrearOperacion(ValidacionNegocioDTO dto) {
        ResultadoValidacionDTO resultado = crearResultado("CREAR_OPERACION");

        Cliente cliente = buscarCliente(dto.getIdCliente());
        Inmueble inmueble = buscarInmueble(dto.getCodigoInmueble());
        Asesor asesor = buscarAsesor(dto.getIdAsesor());

        if (cliente == null) {
            resultado.agregarError("El cliente no existe.");
        }

        if (inmueble == null) {
            resultado.agregarError("El inmueble no existe.");
        }

        if (asesor == null) {
            resultado.agregarError("El asesor no existe.");
        }

        if (inmueble != null && !inmueble.isDisponible()) {
            resultado.agregarAdvertencia(
                    "El inmueble no está disponible. Verifica si la operación corresponde a reserva, cierre o renovación."
            );
        }

        if (cliente != null && inmueble != null) {
            validarPresupuestoCliente(cliente, inmueble, resultado);
        }

        if (dto.getValorOperacion() <= 0) {
            resultado.agregarError("El valor de la operación debe ser mayor a cero.");
        }

        if (inmueble != null && dto.getValorOperacion() > 0) {
            double precio = inmueble.getPrecio();

            if (dto.getValorOperacion() < precio * 0.7) {
                resultado.agregarAdvertencia(
                        "El valor de operación está muy por debajo del precio registrado del inmueble."
                );
            }
        }

        cerrarResultado(resultado);
        return resultado;
    }

    public ResultadoValidacionDTO validarCrearContrato(ValidacionNegocioDTO dto) {
        ResultadoValidacionDTO resultado = crearResultado("CREAR_CONTRATO");

        Contrato contrato = null;

        if (dto.getIdContrato() != null && !dto.getIdContrato().isBlank()) {
            contrato = contratoRepository.buscarPorId(dto.getIdContrato());
        }

        Cliente cliente = buscarCliente(dto.getIdCliente());
        Inmueble inmueble = buscarInmueble(dto.getCodigoInmueble());
        Asesor asesor = buscarAsesor(dto.getIdAsesor());

        if (cliente == null) {
            resultado.agregarError("El cliente asociado al contrato no existe.");
        }

        if (inmueble == null) {
            resultado.agregarError("El inmueble asociado al contrato no existe.");
        }

        if (asesor == null) {
            resultado.agregarError("El asesor asociado al contrato no existe.");
        }

        if (contrato != null) {
            if (contrato.getFechaInicio() == null || contrato.getFechaFin() == null) {
                resultado.agregarError("El contrato debe tener fecha de inicio y fecha de fin.");
            } else if (contrato.getFechaFin().isBefore(contrato.getFechaInicio())) {
                resultado.agregarError("La fecha fin del contrato no puede ser anterior a la fecha inicio.");
            }

            if (contrato.getValor() <= 0) {
                resultado.agregarError("El valor del contrato debe ser mayor a cero.");
            }

            if (contrato.estaProximoAVencer(30)) {
                resultado.agregarAdvertencia("El contrato está próximo a vencer en los próximos 30 días.");
            }

            if (contrato.estaVencido()) {
                resultado.agregarAdvertencia("El contrato ya se encuentra vencido.");
            }
        } else {
            resultado.agregarAdvertencia(
                    "No se encontró contrato por ID. Se validaron únicamente las entidades asociadas."
            );
        }

        cerrarResultado(resultado);
        return resultado;
    }

    public ResultadoValidacionDTO validarIntencionComercial(ValidacionNegocioDTO dto) {
        ResultadoValidacionDTO resultado = crearResultado("INTENCION_COMERCIAL");

        Cliente cliente = buscarCliente(dto.getIdCliente());
        Inmueble inmueble = buscarInmueble(dto.getCodigoInmueble());

        if (cliente == null) {
            resultado.agregarError("El cliente no existe.");
        }

        if (inmueble == null) {
            resultado.agregarError("El inmueble no existe.");
        }

        if (inmueble != null && !inmueble.isDisponible()) {
            resultado.agregarAdvertencia(
                    "El inmueble no está disponible. La intención comercial puede requerir revisión manual."
            );
        }

        if (cliente != null && inmueble != null) {
            validarPresupuestoCliente(cliente, inmueble, resultado);
        }

        int intencionesCliente = contarIntencionesComercialesCliente(dto.getIdCliente());

        if (intencionesCliente >= 2) {
            resultado.agregarRecomendacion(
                    "El cliente tiene varias intenciones comerciales. Se recomienda priorizar seguimiento."
            );
        }

        int solicitudesInmueble = contarSolicitudesPorInmueble(dto.getCodigoInmueble());

        if (solicitudesInmueble >= 3) {
            resultado.agregarRecomendacion(
                    "El inmueble tiene alta demanda. Puede requerir gestión prioritaria."
            );
        }

        cerrarResultado(resultado);
        return resultado;
    }

    public ResultadoValidacionDTO validarConsistenciaGeneral() {
        ResultadoValidacionDTO resultado = crearResultado("CONSISTENCIA_GENERAL");

        validarVisitasConEntidades(resultado);
        validarOperacionesConEntidades(resultado);
        validarContratosConEntidades(resultado);
        validarSolicitudesConEntidades(resultado);
        validarInmueblesReservadosSinOperacion(resultado);

        cerrarResultado(resultado);
        return resultado;
    }

    private void validarVisitasConEntidades(ResultadoValidacionDTO resultado) {
        LinkedSimpleList<Visita> visitas = visitaRepository.obtenerTodos();

        for (Visita visita : visitas) {
            if (buscarCliente(visita.getIdCliente()) == null) {
                resultado.agregarError("La visita " + visita.getId() + " tiene un cliente inexistente.");
            }

            if (buscarInmueble(visita.getCodigoInmueble()) == null) {
                resultado.agregarError("La visita " + visita.getId() + " tiene un inmueble inexistente.");
            }

            if (buscarAsesor(visita.getIdAsesor()) == null) {
                resultado.agregarError("La visita " + visita.getId() + " tiene un asesor inexistente.");
            }

            if (visita.getEstado() == null || visita.getEstado().isBlank()) {
                resultado.agregarAdvertencia("La visita " + visita.getId() + " no tiene estado definido.");
            }
        }
    }

    private void validarOperacionesConEntidades(ResultadoValidacionDTO resultado) {
        Operacion[] operaciones = operacionRepository.listar();

        for (Operacion operacion : operaciones) {
            if (buscarCliente(operacion.getIdCliente()) == null) {
                resultado.agregarError("La operación " + operacion.getId() + " tiene un cliente inexistente.");
            }

            if (buscarInmueble(operacion.getCodigoInmueble()) == null) {
                resultado.agregarError("La operación " + operacion.getId() + " tiene un inmueble inexistente.");
            }

            if (buscarAsesor(operacion.getIdAsesor()) == null) {
                resultado.agregarError("La operación " + operacion.getId() + " tiene un asesor inexistente.");
            }

            if (operacion.getValorAcordado() <= 0) {
                resultado.agregarAdvertencia("La operación " + operacion.getId() + " tiene valor inválido.");
            }
        }
    }

    private void validarContratosConEntidades(ResultadoValidacionDTO resultado) {
        LinkedSimpleList<Contrato> contratos = contratoRepository.listar();

        for (Contrato contrato : contratos) {
            if (buscarCliente(contrato.getIdCliente()) == null) {
                resultado.agregarError("El contrato " + contrato.getId() + " tiene un cliente inexistente.");
            }

            if (buscarInmueble(contrato.getCodigoInmueble()) == null) {
                resultado.agregarError("El contrato " + contrato.getId() + " tiene un inmueble inexistente.");
            }

            if (buscarAsesor(contrato.getIdAsesor()) == null) {
                resultado.agregarError("El contrato " + contrato.getId() + " tiene un asesor inexistente.");
            }

            if (contrato.getFechaInicio() != null &&
                    contrato.getFechaFin() != null &&
                    contrato.getFechaFin().isBefore(contrato.getFechaInicio())) {
                resultado.agregarError("El contrato " + contrato.getId() + " tiene fechas inconsistentes.");
            }
        }
    }

    private void validarSolicitudesConEntidades(ResultadoValidacionDTO resultado) {
        LinkedSimpleList<SolicitudAtencion> solicitudes = solicitudRepository.listar();

        for (SolicitudAtencion solicitud : solicitudes) {
            if (buscarCliente(solicitud.getIdCliente()) == null) {
                resultado.agregarError("La solicitud " + solicitud.getId() + " tiene un cliente inexistente.");
            }

            if (solicitud.getCodigoInmueble() != null &&
                    !solicitud.getCodigoInmueble().isBlank() &&
                    buscarInmueble(solicitud.getCodigoInmueble()) == null) {
                resultado.agregarError("La solicitud " + solicitud.getId() + " tiene un inmueble inexistente.");
            }

            if (solicitud.getEstado() == null || solicitud.getEstado().isBlank()) {
                resultado.agregarAdvertencia("La solicitud " + solicitud.getId() + " no tiene estado definido.");
            }

            if (solicitud.getPrioridad() == null || solicitud.getPrioridad().isBlank()) {
                resultado.agregarAdvertencia("La solicitud " + solicitud.getId() + " no tiene prioridad definida.");
            }
        }
    }

    private void validarInmueblesReservadosSinOperacion(ResultadoValidacionDTO resultado) {
        LinkedSimpleList<Inmueble> inmuebles = inmuebleRepository.obtenerTodos();

        for (Inmueble inmueble : inmuebles) {
            if (inmueble.getEstado() != null &&
                    inmueble.getEstado().equalsIgnoreCase("RESERVADO")) {

                boolean tieneOperacion = existeOperacionPorInmueble(inmueble.getCodigo());

                if (!tieneOperacion) {
                    resultado.agregarAdvertencia(
                            "El inmueble " + inmueble.getCodigo() +
                            " está reservado, pero no tiene una operación asociada."
                    );
                }
            }
        }
    }

    private void validarPresupuestoCliente(
            Cliente cliente,
            Inmueble inmueble,
            ResultadoValidacionDTO resultado
    ) {
        double presupuesto = cliente.getPresupuesto();
        double precio = inmueble.getPrecio();

        if (presupuesto <= 0) {
            resultado.agregarAdvertencia("El cliente no tiene presupuesto registrado.");
            return;
        }

        if (precio > presupuesto) {
            resultado.agregarAdvertencia(
                    "El precio del inmueble supera el presupuesto del cliente. " +
                    "Presupuesto: " + presupuesto + ", precio inmueble: " + precio + "."
            );
        } else {
            resultado.agregarRecomendacion(
                    "El inmueble está dentro del presupuesto del cliente."
            );
        }
    }

    private Cliente buscarCliente(String idCliente) {
        if (idCliente == null || idCliente.isBlank()) return null;

        return clienteRepository.buscarPorId(idCliente);
    }

    private Inmueble buscarInmueble(String codigoInmueble) {
        if (codigoInmueble == null || codigoInmueble.isBlank()) return null;
        return inmuebleRepository.buscarPorCodigo(codigoInmueble);
    }

    private Asesor buscarAsesor(String idAsesor) {
        if (idAsesor == null || idAsesor.isBlank()) return null;

        return asesorRepository.buscarPorId(idAsesor);
    }

    private int contarVisitasPendientesAsesor(String idAsesor) {
        if (idAsesor == null || idAsesor.isBlank()) return 0;

        int contador = 0;
        LinkedSimpleList<Visita> visitas = visitaRepository.obtenerTodos();

        for (Visita visita : visitas) {
            if (visita.getIdAsesor() != null &&
                    visita.getIdAsesor().equalsIgnoreCase(idAsesor) &&
                    visita.getEstado() != null &&
                    (
                            visita.getEstado().equalsIgnoreCase("PENDIENTE") ||
                            visita.getEstado().equalsIgnoreCase("PROGRAMADA") ||
                            visita.getEstado().equalsIgnoreCase("CONFIRMADA")
                    )) {
                contador++;
            }
        }

        return contador;
    }

    private int contarIntencionesComercialesCliente(String idCliente) {
        if (idCliente == null || idCliente.isBlank()) return 0;

        int contador = 0;
        LinkedSimpleList<SolicitudAtencion> solicitudes = solicitudRepository.listar();

        for (SolicitudAtencion solicitud : solicitudes) {
            if (solicitud.getIdCliente() != null &&
                    solicitud.getIdCliente().equalsIgnoreCase(idCliente) &&
                    solicitud.esIntencionComercial() &&
                    solicitud.getEstado() != null &&
                    !solicitud.getEstado().equalsIgnoreCase("CANCELADA") &&
                    !solicitud.getEstado().equalsIgnoreCase("RECHAZADA")) {
                contador++;
            }
        }

        return contador;
    }

    private int contarSolicitudesPorInmueble(String codigoInmueble) {
        if (codigoInmueble == null || codigoInmueble.isBlank()) return 0;

        int contador = 0;
        LinkedSimpleList<SolicitudAtencion> solicitudes = solicitudRepository.listar();

        for (SolicitudAtencion solicitud : solicitudes) {
            if (solicitud.getCodigoInmueble() != null &&
                    solicitud.getCodigoInmueble().equalsIgnoreCase(codigoInmueble) &&
                    solicitud.getEstado() != null &&
                    !solicitud.getEstado().equalsIgnoreCase("CANCELADA") &&
                    !solicitud.getEstado().equalsIgnoreCase("RECHAZADA")) {
                contador++;
            }
        }

        return contador;
    }

    private boolean existeOperacionPorInmueble(String codigoInmueble) {
        if (codigoInmueble == null || codigoInmueble.isBlank()) return false;

        Operacion[] operaciones = operacionRepository.listar();

        for (Operacion operacion : operaciones) {
            if (operacion.getCodigoInmueble() != null &&
                    operacion.getCodigoInmueble().equalsIgnoreCase(codigoInmueble) &&
                    operacion.getEstadoProceso() != null &&
                    (
                            operacion.getEstadoProceso().equalsIgnoreCase("EN_PROCESO") ||
                            operacion.getEstadoProceso().equalsIgnoreCase("CERRADA") ||
                            operacion.getEstadoProceso().equalsIgnoreCase("FINALIZADA")
                    )) {
                return true;
            }
        }

        return false;
    }

    private ResultadoValidacionDTO crearResultado(String tipo) {
        ResultadoValidacionDTO resultado = new ResultadoValidacionDTO();
        resultado.setTipoValidacion(tipo);
        return resultado;
    }

    private void cerrarResultado(ResultadoValidacionDTO resultado) {
        if (resultado.isValido()) {
            resultado.setMensajeGeneral("Validación completada sin errores críticos.");
        } else {
            resultado.setMensajeGeneral("La validación encontró errores que deben corregirse.");
        }

        if (!resultado.getAdvertencias().isEmpty()) {
            resultado.agregarRecomendacion(
                    "Revisa las advertencias antes de continuar con la operación."
            );
        }
    }
}
