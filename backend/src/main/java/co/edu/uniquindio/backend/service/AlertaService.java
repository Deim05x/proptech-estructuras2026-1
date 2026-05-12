package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.colas.cola.Cola;
import co.edu.uniquindio.backend.estructuras.colas.colaprioridad.ColaPrioridad;
import co.edu.uniquindio.backend.model.Alerta;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.Operacion;
import co.edu.uniquindio.backend.model.Visita;
import co.edu.uniquindio.backend.repository.AlertaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Servicio para generar y procesar alertas operativas.
 *
 * <p>Uso de estructuras propias: {@link Cola} conserva alertas pendientes en
 * orden de llegada y {@link ColaPrioridad} permite procesar primero las alertas
 * con mayor nivel de atencion.</p>
 *
 * <p>Justificacion: el monitoreo necesita dos lecturas del mismo flujo: una
 * cronologica y otra priorizada para riesgos comerciales u operativos.</p>
 */
@Service
public class AlertaService {

    private final AlertaRepository alertaRepository;
    private final VisitaService visitaService;
    private final InmuebleService inmuebleService;
    private final OperacionService operacionService;

    private final Cola<Alerta> colaAlertasPendientes = new Cola<>();
    private final ColaPrioridad<Alerta> colaAlertasPrioridad = new ColaPrioridad<>();

    public AlertaService(AlertaRepository alertaRepository,
                         VisitaService visitaService,
                         InmuebleService inmuebleService,
                         OperacionService operacionService) {
        this.alertaRepository = alertaRepository;
        this.visitaService = visitaService;
        this.inmuebleService = inmuebleService;
        this.operacionService = operacionService;
    }

    public Alerta[] listarAlertas() {
        return alertaRepository.listar();
    }

    public Alerta[] listarAlertasPorEstado(String estado) {
        return alertaRepository.listarPorEstado(estado);
    }

    public Alerta buscarPorId(String id) {
        return alertaRepository.buscarPorId(id);
    }

    public boolean registrarAlerta(Alerta alerta) {
        if (alerta == null) return false;

        if (alerta.getId() == null || alerta.getId().isBlank()) {
            return false;
        }

        if (alertaRepository.buscarPorId(alerta.getId()) != null) {
            return false;
        }

        if (alerta.getTipo() == null || alerta.getTipo().isBlank()) {
            return false;
        }

        if (alerta.getDescripcion() == null || alerta.getDescripcion().isBlank()) {
            return false;
        }

        if (alerta.getNivelAtencion() == null || alerta.getNivelAtencion().isBlank()) {
            alerta.setNivelAtencion("MEDIO");
        }

        if (alerta.getFechaCreacion() == null) {
            alerta.setFechaCreacion(LocalDateTime.now());
        }

        if (alerta.getEstado() == null || alerta.getEstado().isBlank()) {
            alerta.setEstado("PENDIENTE");
        }

        boolean guardada = alertaRepository.guardar(alerta);

        if (guardada && "PENDIENTE".equalsIgnoreCase(alerta.getEstado())) {
            colaAlertasPendientes.encolar(alerta);
            colaAlertasPrioridad.encolar(alerta, calcularPrioridad(alerta));
        }

        return guardada;
    }

    public int generarAlertasAutomaticas() {
        int total = 0;

        total += generarAlertasVisitasPendientes();
        total += generarAlertasAltaDemanda();
        total += generarAlertasInmueblesReservados();
        total += generarAlertasOperacionesSinCerrar();

        return total;
    }

    private int generarAlertasVisitasPendientes() {
        Visita[] visitas = visitaService.listarVisitas();
        int generadas = 0;

        for (Visita visita : visitas) {
            if (visita == null) continue;

            String estado = normalizar(visita.getEstado());

            if (
                    estado.contains("pendiente") ||
                    estado.contains("programada") ||
                    estado.contains("confirmar")
            ) {
                String idAlerta = "AL-VISITA-" + visita.getId();

                if (alertaRepository.buscarPorId(idAlerta) == null) {
                    Alerta alerta = new Alerta(
                            idAlerta,
                            "VISITA_PENDIENTE",
                            "La visita " + visita.getId() + " está pendiente o requiere confirmación.",
                            "MEDIO",
                            LocalDateTime.now(),
                            "PENDIENTE"
                    );

                    registrarAlerta(alerta);
                    generadas++;
                }
            }
        }

        return generadas;
    }

    private int generarAlertasAltaDemanda() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();

        int generadas = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            int contadorVisitas = 0;

            for (Visita visita : visitas) {
                if (visita == null) continue;

                if (
                        visita.getCodigoInmueble() != null &&
                        visita.getCodigoInmueble().equalsIgnoreCase(inmueble.getCodigo())
                ) {
                    String estadoVisita = normalizar(visita.getEstado());

                    if (!estadoVisita.contains("cancelada")) {
                        contadorVisitas++;
                    }
                }
            }

            if (contadorVisitas >= 3) {
                String idAlerta = "AL-DEMANDA-" + inmueble.getCodigo();

                if (alertaRepository.buscarPorId(idAlerta) == null) {
                    Alerta alerta = new Alerta(
                            idAlerta,
                            "ALTA_DEMANDA",
                            "El inmueble " + inmueble.getCodigo() +
                                    " tiene " + contadorVisitas +
                                    " visitas registradas. Puede considerarse una propiedad con alta demanda.",
                            "ALTO",
                            LocalDateTime.now(),
                            "PENDIENTE"
                    );

                    registrarAlerta(alerta);
                    generadas++;
                }
            }
        }

        return generadas;
    }

    private int generarAlertasInmueblesReservados() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        int generadas = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            String estado = normalizar(inmueble.getEstado());

            if (estado.contains("reserv")) {
                String idAlerta = "AL-RESERVADO-" + inmueble.getCodigo();

                if (alertaRepository.buscarPorId(idAlerta) == null) {
                    Alerta alerta = new Alerta(
                            idAlerta,
                            "INMUEBLE_RESERVADO",
                            "El inmueble " + inmueble.getCodigo() +
                                    " se encuentra reservado. Se recomienda revisar si ya existe cierre o negociación pendiente.",
                            "MEDIO",
                            LocalDateTime.now(),
                            "PENDIENTE"
                    );

                    registrarAlerta(alerta);
                    generadas++;
                }
            }
        }

        return generadas;
    }

    private int generarAlertasOperacionesSinCerrar() {
        Operacion[] operaciones = operacionService.listarOperaciones();
        int generadas = 0;

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;

            String estado = normalizar(operacion.getEstadoProceso());

            if (
                    estado.contains("proceso") ||
                    estado.contains("pendiente") ||
                    estado.contains("negociacion") ||
                    estado.contains("negociación")
            ) {
                LocalDate fechaOperacion = operacion.getFecha();

                if (fechaOperacion != null) {
                    long dias = ChronoUnit.DAYS.between(fechaOperacion, LocalDate.now());

                    if (dias >= 30) {
                        String idAlerta = "AL-OPERACION-" + operacion.getId();

                        if (alertaRepository.buscarPorId(idAlerta) == null) {
                            Alerta alerta = new Alerta(
                                    idAlerta,
                                    "OPERACION_SIN_CIERRE",
                                    "La operación " + operacion.getId() +
                                            " lleva " + dias +
                                            " días sin cierre. Requiere seguimiento comercial.",
                                    "ALTO",
                                    LocalDateTime.now(),
                                    "PENDIENTE"
                            );

                            registrarAlerta(alerta);
                            generadas++;
                        }
                    }
                }
            }
        }

        return generadas;
    }

    public void recargarColaPendientes() {
        colaAlertasPendientes.vaciar();

        Alerta[] pendientes = alertaRepository.listarPorEstado("PENDIENTE");

        for (Alerta alerta : pendientes) {
            if (alerta != null) {
                colaAlertasPendientes.encolar(alerta);
            }
        }
    }

    public Alerta procesarSiguienteAlerta() {
        if (colaAlertasPendientes.estaVacia()) {
            recargarColaPendientes();
        }

        if (colaAlertasPendientes.estaVacia()) {
            return null;
        }

        Alerta alerta = colaAlertasPendientes.desencolar();

        alerta.setEstado("REVISADA");
        alertaRepository.actualizarEstado(alerta.getId(), "REVISADA");

        return alerta;
    }

    public int cantidadPendientesEnCola() {
        return colaAlertasPendientes.getTamaño();
    }

    public void recargarColaPrioridad() {
        colaAlertasPrioridad.vaciar();

        Alerta[] pendientes = alertaRepository.listarPorEstado("PENDIENTE");

        for (Alerta alerta : pendientes) {
            if (alerta != null) {
                int prioridad = calcularPrioridad(alerta);
                colaAlertasPrioridad.encolar(alerta, prioridad);
            }
        }
    }

    public Alerta procesarSiguienteAlertaPrioritaria() {
        if (colaAlertasPrioridad.estaVacia()) {
            recargarColaPrioridad();
        }

        if (colaAlertasPrioridad.estaVacia()) {
            return null;
        }

        Alerta alerta = colaAlertasPrioridad.desencolar();

        alerta.setEstado("REVISADA");
        alertaRepository.actualizarEstado(alerta.getId(), "REVISADA");

        return alerta;
    }

    public int cantidadPendientesEnColaPrioridad() {
        return colaAlertasPrioridad.getTamaño();
    }

    public boolean cambiarEstado(String id, String estado) {
        if (id == null || id.isBlank()) return false;
        if (estado == null || estado.isBlank()) return false;

        if (alertaRepository.buscarPorId(id) == null) {
            return false;
        }

        return alertaRepository.actualizarEstado(id, estado);
    }

    private int calcularPrioridad(Alerta alerta) {
        if (alerta == null || alerta.getNivelAtencion() == null) {
            return 1;
        }

        String nivel = normalizar(alerta.getNivelAtencion());

        if (nivel.contains("critico") || nivel.contains("crítico")) {
            return 4;
        }

        if (nivel.contains("alto")) {
            return 3;
        }

        if (nivel.contains("medio")) {
            return 2;
        }

        return 1;
    }

    private String normalizar(String texto) {
        if (texto == null) return "";
        return texto.toLowerCase().trim();
    }
}
