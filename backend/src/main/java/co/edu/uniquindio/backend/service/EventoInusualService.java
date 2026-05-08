package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.model.Alerta;
import co.edu.uniquindio.backend.model.EventoInusual;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.Operacion;
import co.edu.uniquindio.backend.model.Visita;
import co.edu.uniquindio.backend.repository.EventoInusualRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventoInusualService {

    private final EventoInusualRepository eventoInusualRepository;
    private final InmuebleService inmuebleService;
    private final VisitaService visitaService;
    private final OperacionService operacionService;
    private final AlertaService alertaService;

    public EventoInusualService(EventoInusualRepository eventoInusualRepository,
                                InmuebleService inmuebleService,
                                VisitaService visitaService,
                                OperacionService operacionService,
                                AlertaService alertaService) {
        this.eventoInusualRepository = eventoInusualRepository;
        this.inmuebleService = inmuebleService;
        this.visitaService = visitaService;
        this.operacionService = operacionService;
        this.alertaService = alertaService;
    }

    public EventoInusual[] listarEventos() {
        return eventoInusualRepository.listar();
    }

    public EventoInusual[] listarPorEstado(String estado) {
        return eventoInusualRepository.listarPorEstado(estado);
    }

    public EventoInusual buscarPorId(String id) {
        return eventoInusualRepository.buscarPorId(id);
    }

    public boolean cambiarEstado(String id, String estado) {
        if (id == null || id.isBlank()) return false;
        if (estado == null || estado.isBlank()) return false;

        if (eventoInusualRepository.buscarPorId(id) == null) {
            return false;
        }

        return eventoInusualRepository.actualizarEstado(id, estado);
    }

    public int detectarEventosInusuales() {
        int total = 0;

        total += detectarInmueblesConMuchasVisitasSinCierre();
        total += detectarClientesConMuchasVisitasSinCierre();
        total += detectarAsesoresSobrecargados();
        total += detectarConcentracionInteresPorZona();
        total += detectarInmueblesReservadosSinCierre();

        return total;
    }

    private int detectarInmueblesConMuchasVisitasSinCierre() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();
        Operacion[] operaciones = operacionService.listarOperaciones();

        int generados = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null || inmueble.getCodigo() == null) continue;

            int cantidadVisitas = contarVisitasPorInmueble(visitas, inmueble.getCodigo());
            int cierres = contarOperacionesCerradasPorInmueble(operaciones, inmueble.getCodigo());

            if (cantidadVisitas >= 3 && cierres == 0) {
                String idEvento = "EV-INM-VISITAS-" + inmueble.getCodigo();

                String nivel = cantidadVisitas >= 5 ? "CRITICO" : "ALTO";

                String descripcion = "El inmueble " + inmueble.getCodigo()
                        + " tiene " + cantidadVisitas
                        + " visitas registradas y no presenta cierres comerciales.";

                boolean creado = registrarEventoAutomatico(
                        idEvento,
                        "INMUEBLE_MUCHAS_VISITAS_SIN_CIERRE",
                        descripcion,
                        nivel,
                        inmueble.getCodigo()
                );

                if (creado) generados++;
            }
        }

        return generados;
    }

    private int detectarClientesConMuchasVisitasSinCierre() {
        Visita[] visitas = visitaService.listarVisitas();
        Operacion[] operaciones = operacionService.listarOperaciones();

        String[] clientes = obtenerClientesUnicosDesdeVisitas(visitas);
        int generados = 0;

        for (String clienteId : clientes) {
            if (clienteId == null) continue;

            int cantidadVisitas = contarVisitasPorCliente(visitas, clienteId);
            int cierres = contarOperacionesCerradasPorCliente(operaciones, clienteId);

            if (cantidadVisitas >= 3 && cierres == 0) {
                String idEvento = "EV-CLI-VISITAS-" + clienteId;

                String descripcion = "El cliente " + clienteId
                        + " registra " + cantidadVisitas
                        + " visitas, pero no tiene operaciones cerradas.";

                boolean creado = registrarEventoAutomatico(
                        idEvento,
                        "CLIENTE_MUCHAS_VISITAS_SIN_CONTINUIDAD",
                        descripcion,
                        "ALTO",
                        clienteId
                );

                if (creado) generados++;
            }
        }

        return generados;
    }

    private int detectarAsesoresSobrecargados() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();
        Operacion[] operaciones = operacionService.listarOperaciones();

        String[] asesores = obtenerAsesoresUnicos(inmuebles, visitas, operaciones);
        int generados = 0;

        for (String asesorId : asesores) {
            if (asesorId == null) continue;

            int inmueblesAsignados = contarInmueblesPorAsesor(inmuebles, asesorId);
            int visitasPendientes = contarVisitasPendientesPorAsesor(visitas, asesorId);
            int operacionesEnProceso = contarOperacionesEnProcesoPorAsesor(operaciones, asesorId);

            int cargaTotal = inmueblesAsignados + visitasPendientes + operacionesEnProceso;

            if (cargaTotal >= 5) {
                String idEvento = "EV-ASE-CARGA-" + asesorId;

                String nivel = cargaTotal >= 8 ? "CRITICO" : "ALTO";

                String descripcion = "El asesor " + asesorId
                        + " presenta posible sobrecarga: "
                        + inmueblesAsignados + " inmuebles asignados, "
                        + visitasPendientes + " visitas pendientes y "
                        + operacionesEnProceso + " operaciones en proceso.";

                boolean creado = registrarEventoAutomatico(
                        idEvento,
                        "ASESOR_SOBRECARGADO",
                        descripcion,
                        nivel,
                        asesorId
                );

                if (creado) generados++;
            }
        }

        return generados;
    }

    private int detectarConcentracionInteresPorZona() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();

        String[] zonas = obtenerZonasUnicas(inmuebles);
        int generados = 0;

        for (String zona : zonas) {
            if (zona == null) continue;

            int visitasZona = contarVisitasPorZona(inmuebles, visitas, zona);

            if (visitasZona >= 5) {
                String idEvento = "EV-ZONA-INTERES-" + zona.replace(" ", "_");

                String descripcion = "La zona " + zona
                        + " presenta concentración de interés con "
                        + visitasZona + " visitas registradas.";

                boolean creado = registrarEventoAutomatico(
                        idEvento,
                        "CONCENTRACION_INTERES_ZONA",
                        descripcion,
                        "ALTO",
                        zona
                );

                if (creado) generados++;
            }
        }

        return generados;
    }

    private int detectarInmueblesReservadosSinCierre() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Operacion[] operaciones = operacionService.listarOperaciones();

        int generados = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null || inmueble.getCodigo() == null) continue;

            String estado = normalizar(inmueble.getEstado());

            if (estado.contains("reserv")) {
                int cierres = contarOperacionesCerradasPorInmueble(
                        operaciones,
                        inmueble.getCodigo()
                );

                if (cierres == 0) {
                    String idEvento = "EV-INM-RESERVADO-" + inmueble.getCodigo();

                    String descripcion = "El inmueble " + inmueble.getCodigo()
                            + " aparece reservado, pero no tiene una operación cerrada asociada.";

                    boolean creado = registrarEventoAutomatico(
                            idEvento,
                            "INMUEBLE_RESERVADO_SIN_CIERRE",
                            descripcion,
                            "MEDIO",
                            inmueble.getCodigo()
                    );

                    if (creado) generados++;
                }
            }
        }

        return generados;
    }

    public boolean registrarEventoManual(EventoInusual evento) {
        if (evento == null) return false;
        if (evento.getId() == null || evento.getId().isBlank()) return false;
        if (eventoInusualRepository.buscarPorId(evento.getId()) != null) return false;

        if (evento.getFechaDeteccion() == null) {
            evento.setFechaDeteccion(LocalDateTime.now());
        }

        if (evento.getEstado() == null || evento.getEstado().isBlank()) {
            evento.setEstado("PENDIENTE");
        }

        return eventoInusualRepository.guardar(evento);
    }

    private boolean registrarEventoAutomatico(String id, String tipo, String descripcion,
                                              String nivelAtencion, String entidadReferencia) {
        if (eventoInusualRepository.buscarPorId(id) != null) {
            return false;
        }

        EventoInusual evento = new EventoInusual(
                id,
                tipo,
                descripcion,
                nivelAtencion,
                LocalDateTime.now(),
                "PENDIENTE",
                entidadReferencia
        );

        boolean guardado = eventoInusualRepository.guardar(evento);

        if (guardado) {
            registrarAlertaDesdeEvento(evento);
        }

        return guardado;
    }

    private void registrarAlertaDesdeEvento(EventoInusual evento) {
        String idAlerta = "AL-" + evento.getId();

        if (alertaService.buscarPorId(idAlerta) != null) {
            return;
        }

        Alerta alerta = new Alerta(
                idAlerta,
                "EVENTO_INUSUAL",
                evento.getDescripcion(),
                evento.getNivelAtencion(),
                LocalDateTime.now(),
                "PENDIENTE"
        );

        alertaService.registrarAlerta(alerta);
    }

    private int contarVisitasPorInmueble(Visita[] visitas, String codigoInmueble) {
        int contador = 0;

        for (Visita visita : visitas) {
            if (visita == null) continue;
            if (visita.getCodigoInmueble() == null) continue;

            boolean mismoInmueble = visita.getCodigoInmueble()
                    .equalsIgnoreCase(codigoInmueble);

            boolean cancelada = normalizar(visita.getEstado()).contains("cancelada");

            if (mismoInmueble && !cancelada) {
                contador++;
            }
        }

        return contador;
    }

    private int contarVisitasPorCliente(Visita[] visitas, String clienteId) {
        int contador = 0;

        for (Visita visita : visitas) {
            if (visita == null) continue;
            if (visita.getIdCliente() == null) continue;

            boolean mismoCliente = visita.getIdCliente().equalsIgnoreCase(clienteId);
            boolean cancelada = normalizar(visita.getEstado()).contains("cancelada");

            if (mismoCliente && !cancelada) {
                contador++;
            }
        }

        return contador;
    }

    private int contarVisitasPendientesPorAsesor(Visita[] visitas, String asesorId) {
        int contador = 0;

        for (Visita visita : visitas) {
            if (visita == null) continue;
            if (visita.getIdAsesor() == null) continue;

            boolean mismoAsesor = visita.getIdAsesor().equalsIgnoreCase(asesorId);

            String estado = normalizar(visita.getEstado());

            boolean pendiente = estado.contains("pendiente")
                    || estado.contains("programada")
                    || estado.contains("confirmada");

            if (mismoAsesor && pendiente) {
                contador++;
            }
        }

        return contador;
    }

    private int contarOperacionesCerradasPorInmueble(Operacion[] operaciones, String codigoInmueble) {
        int contador = 0;

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;
            if (operacion.getCodigoInmueble() == null) continue;

            if (operacion.getCodigoInmueble().equalsIgnoreCase(codigoInmueble)
                    && esOperacionCerrada(operacion.getEstadoProceso())) {
                contador++;
            }
        }

        return contador;
    }

    private int contarOperacionesCerradasPorCliente(Operacion[] operaciones, String clienteId) {
        int contador = 0;

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;
            if (operacion.getIdCliente() == null) continue;

            if (operacion.getIdCliente().equalsIgnoreCase(clienteId)
                    && esOperacionCerrada(operacion.getEstadoProceso())) {
                contador++;
            }
        }

        return contador;
    }

    private int contarOperacionesEnProcesoPorAsesor(Operacion[] operaciones, String asesorId) {
        int contador = 0;

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;
            if (operacion.getIdAsesor() == null) continue;

            String estado = normalizar(operacion.getEstadoProceso());

            boolean enProceso = estado.contains("proceso")
                    || estado.contains("pendiente")
                    || estado.contains("negociacion")
                    || estado.contains("negociación");

            if (operacion.getIdAsesor().equalsIgnoreCase(asesorId) && enProceso) {
                contador++;
            }
        }

        return contador;
    }

    private int contarInmueblesPorAsesor(Inmueble[] inmuebles, String asesorId) {
        int contador = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;
            if (inmueble.getIdAsesorResponsable() == null) continue;

            if (inmueble.getIdAsesorResponsable().equalsIgnoreCase(asesorId)) {
                contador++;
            }
        }

        return contador;
    }

    private int contarVisitasPorZona(Inmueble[] inmuebles, Visita[] visitas, String zona) {
        int contador = 0;

        for (Visita visita : visitas) {
            if (visita == null || visita.getCodigoInmueble() == null) continue;

            Inmueble inmueble = buscarInmueblePorCodigo(inmuebles, visita.getCodigoInmueble());

            if (inmueble == null) continue;

            String zonaInmueble = obtenerZonaInmueble(inmueble);

            if (zonaInmueble.equalsIgnoreCase(zona)
                    && !normalizar(visita.getEstado()).contains("cancelada")) {
                contador++;
            }
        }

        return contador;
    }

    private Inmueble buscarInmueblePorCodigo(Inmueble[] inmuebles, String codigo) {
        if (codigo == null) return null;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            if (codigo.equalsIgnoreCase(inmueble.getCodigo())) {
                return inmueble;
            }
        }

        return null;
    }

    private String[] obtenerClientesUnicosDesdeVisitas(Visita[] visitas) {
        String[] clientes = new String[visitas.length];
        int contador = 0;

        for (Visita visita : visitas) {
            if (visita == null || visita.getIdCliente() == null) continue;

            String clienteId = visita.getIdCliente();

            if (!existeEnArreglo(clientes, clienteId)) {
                clientes[contador] = clienteId;
                contador++;
            }
        }

        return clientes;
    }

    private String[] obtenerAsesoresUnicos(Inmueble[] inmuebles, Visita[] visitas, Operacion[] operaciones) {
        String[] asesores = new String[
                inmuebles.length + visitas.length + operaciones.length
        ];

        int contador = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null || inmueble.getIdAsesorResponsable() == null) continue;

            String asesorId = inmueble.getIdAsesorResponsable();

            if (!existeEnArreglo(asesores, asesorId)) {
                asesores[contador] = asesorId;
                contador++;
            }
        }

        for (Visita visita : visitas) {
            if (visita == null || visita.getIdAsesor() == null) continue;

            String asesorId = visita.getIdAsesor();

            if (!existeEnArreglo(asesores, asesorId)) {
                asesores[contador] = asesorId;
                contador++;
            }
        }

        for (Operacion operacion : operaciones) {
            if (operacion == null || operacion.getIdAsesor() == null) continue;

            String asesorId = operacion.getIdAsesor();

            if (!existeEnArreglo(asesores, asesorId)) {
                asesores[contador] = asesorId;
                contador++;
            }
        }

        return asesores;
    }

    private String[] obtenerZonasUnicas(Inmueble[] inmuebles) {
        String[] zonas = new String[inmuebles.length];
        int contador = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            String zona = obtenerZonaInmueble(inmueble);

            if (!existeEnArreglo(zonas, zona)) {
                zonas[contador] = zona;
                contador++;
            }
        }

        return zonas;
    }

    private boolean existeEnArreglo(String[] arreglo, String valor) {
        if (valor == null) return true;

        for (String item : arreglo) {
            if (item == null) continue;

            if (item.equalsIgnoreCase(valor)) {
                return true;
            }
        }

        return false;
    }

    private String obtenerZonaInmueble(Inmueble inmueble) {
        if (inmueble == null) {
            return "SIN_DATO";
        }

        if (inmueble.getBarrioZona() != null && !inmueble.getBarrioZona().isBlank()) {
            return inmueble.getBarrioZona().trim().toUpperCase();
        }

        if (inmueble.getCiudad() != null && !inmueble.getCiudad().isBlank()) {
            return inmueble.getCiudad().trim().toUpperCase();
        }

        return "SIN_DATO";
    }

    private boolean esOperacionCerrada(String estado) {
        String texto = normalizar(estado);

        return texto.contains("cerrada")
                || texto.contains("cerrado")
                || texto.contains("finalizada")
                || texto.contains("finalizado")
                || texto.contains("completada")
                || texto.contains("completado");
    }

    private String normalizar(String texto) {
        if (texto == null) return "";
        return texto.toLowerCase().trim();
    }
}