package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.AlertaComercialDTO;
import co.edu.uniquindio.backend.estructuras.hashTables.TablaHashPropia;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Contrato;
import co.edu.uniquindio.backend.model.SolicitudAtencion;
import co.edu.uniquindio.backend.repository.ContratoRepository;
import co.edu.uniquindio.backend.repository.SolicitudAtencionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Servicio que genera alertas comerciales a partir de contratos y solicitudes.
 *
 * <p>Uso de estructuras propias: acumula alertas en {@link LinkedSimpleList} y
 * usa {@link TablaHashPropia} para detectar clientes o inmuebles repetidos en
 * reglas de alta intencion comercial.</p>
 *
 * <p>Justificacion: las listas mantienen una salida ordenada y controlada,
 * mientras la tabla hash evita reprocesar claves ya detectadas durante la
 * generacion de alertas.</p>
 */
@Service
public class MotorAlertasComercialesService {

    private final ContratoRepository contratoRepository;
    private final SolicitudAtencionRepository solicitudRepository;

    public MotorAlertasComercialesService(
            ContratoRepository contratoRepository,
            SolicitudAtencionRepository solicitudRepository
    ) {
        this.contratoRepository = contratoRepository;
        this.solicitudRepository = solicitudRepository;
    }

    public AlertaComercialDTO[] generarAlertasComerciales() {
        LinkedSimpleList<AlertaComercialDTO> alertas = new LinkedSimpleList<>();

        agregarAlertas(alertas, detectarContratosProximosAVencerEstructura());
        agregarAlertas(alertas, detectarContratosVencidosEstructura());
        agregarAlertas(alertas, detectarSolicitudesAltaPrioridadEstructura());
        agregarAlertas(alertas, detectarSolicitudesPendientesEstructura());
        agregarAlertas(alertas, detectarClientesConAltaIntencionEstructura());
        agregarAlertas(alertas, detectarInmueblesConAltaIntencionEstructura());

        return convertirAArreglo(alertas);
    }

    public AlertaComercialDTO[] detectarContratosProximosAVencer() {
        return convertirAArreglo(detectarContratosProximosAVencerEstructura());
    }

    public AlertaComercialDTO[] detectarContratosVencidos() {
        return convertirAArreglo(detectarContratosVencidosEstructura());
    }

    public AlertaComercialDTO[] detectarSolicitudesAltaPrioridad() {
        return convertirAArreglo(detectarSolicitudesAltaPrioridadEstructura());
    }

    public AlertaComercialDTO[] detectarSolicitudesPendientes() {
        return convertirAArreglo(detectarSolicitudesPendientesEstructura());
    }

    public AlertaComercialDTO[] detectarClientesConAltaIntencion() {
        return convertirAArreglo(detectarClientesConAltaIntencionEstructura());
    }

    public AlertaComercialDTO[] detectarInmueblesConAltaIntencion() {
        return convertirAArreglo(detectarInmueblesConAltaIntencionEstructura());
    }

    private LinkedSimpleList<AlertaComercialDTO> detectarContratosProximosAVencerEstructura() {
        LinkedSimpleList<AlertaComercialDTO> alertas = new LinkedSimpleList<>();
        LinkedSimpleList<Contrato> contratos = contratoRepository.listarProximosAVencer(30);

        for (Contrato contrato : contratos) {
            alertas.addLast(new AlertaComercialDTO(
                    "AL-CONTRATO-PROX-" + contrato.getId(),
                    "CONTRATO_PROXIMO_A_VENCER",
                    "ALTA",
                    contrato.getId(),
                    "Contrato próximo a vencer",
                    "El contrato " + contrato.getId()
                            + " del inmueble " + contrato.getCodigoInmueble()
                            + " vence el " + contrato.getFechaFin()
                            + ". Se recomienda contactar al cliente "
                            + contrato.getIdCliente()
                            + " para renovación o cierre administrativo.",
                    "PENDIENTE",
                    LocalDateTime.now()
            ));
        }

        return alertas;
    }

    private LinkedSimpleList<AlertaComercialDTO> detectarContratosVencidosEstructura() {
        LinkedSimpleList<AlertaComercialDTO> alertas = new LinkedSimpleList<>();
        LinkedSimpleList<Contrato> contratos = contratoRepository.listarVencidos();

        for (Contrato contrato : contratos) {
            alertas.addLast(new AlertaComercialDTO(
                    "AL-CONTRATO-VENC-" + contrato.getId(),
                    "CONTRATO_VENCIDO",
                    "CRITICA",
                    contrato.getId(),
                    "Contrato vencido",
                    "El contrato " + contrato.getId()
                            + " asociado al inmueble " + contrato.getCodigoInmueble()
                            + " ya se encuentra vencido. Debe revisarse su estado contractual.",
                    "PENDIENTE",
                    LocalDateTime.now()
            ));
        }

        return alertas;
    }

    private LinkedSimpleList<AlertaComercialDTO> detectarSolicitudesAltaPrioridadEstructura() {
        LinkedSimpleList<AlertaComercialDTO> alertas = new LinkedSimpleList<>();
        LinkedSimpleList<SolicitudAtencion> solicitudes =
                solicitudRepository.listarAltaPrioridadPendientes();

        for (SolicitudAtencion solicitud : solicitudes) {
            alertas.addLast(new AlertaComercialDTO(
                    "AL-SOL-PRIORIDAD-" + solicitud.getId(),
                    "SOLICITUD_ALTA_PRIORIDAD",
                    "ALTA",
                    solicitud.getId(),
                    "Solicitud comercial prioritaria",
                    "La solicitud " + solicitud.getId()
                            + " del cliente " + solicitud.getIdCliente()
                            + " indica intención de " + solicitud.getTipoSolicitud()
                            + " sobre el inmueble " + solicitud.getCodigoInmueble()
                            + ". Debe ser atendida antes que solicitudes informativas.",
                    "PENDIENTE",
                    LocalDateTime.now()
            ));
        }

        return alertas;
    }

    private LinkedSimpleList<AlertaComercialDTO> detectarSolicitudesPendientesEstructura() {
        LinkedSimpleList<AlertaComercialDTO> alertas = new LinkedSimpleList<>();
        LinkedSimpleList<SolicitudAtencion> solicitudes = solicitudRepository.listarPendientes();

        for (SolicitudAtencion solicitud : solicitudes) {
            if (solicitud.getPrioridad() != null
                    && solicitud.getPrioridad().equalsIgnoreCase("ALTA")) {
                continue;
            }

            alertas.addLast(new AlertaComercialDTO(
                    "AL-SOL-PEND-" + solicitud.getId(),
                    "SOLICITUD_PENDIENTE",
                    "MEDIA",
                    solicitud.getId(),
                    "Solicitud pendiente de atención",
                    "La solicitud " + solicitud.getId()
                            + " del cliente " + solicitud.getIdCliente()
                            + " aún se encuentra pendiente. Tipo: "
                            + solicitud.getTipoSolicitud() + ".",
                    "PENDIENTE",
                    LocalDateTime.now()
            ));
        }

        return alertas;
    }

    private LinkedSimpleList<AlertaComercialDTO> detectarClientesConAltaIntencionEstructura() {
        LinkedSimpleList<AlertaComercialDTO> alertas = new LinkedSimpleList<>();
        LinkedSimpleList<SolicitudAtencion> solicitudes = solicitudRepository.listar();
        TablaHashPropia<String, String> clientesProcesados = new TablaHashPropia<>(53);

        for (SolicitudAtencion solicitud : solicitudes) {
            String idCliente = solicitud.getIdCliente();

            if (idCliente == null || clientesProcesados.contieneClave(idCliente)) {
                continue;
            }

            int contadorIntenciones = contarIntencionesComercialesCliente(idCliente, solicitudes);

            if (contadorIntenciones >= 2) {
                clientesProcesados.insertar(idCliente, idCliente);

                alertas.addLast(new AlertaComercialDTO(
                        "AL-CLIENTE-INTENCION-" + idCliente,
                        "CLIENTE_ALTA_PROBABILIDAD_CIERRE",
                        "ALTA",
                        idCliente,
                        "Cliente con alta probabilidad de cierre",
                        "El cliente " + idCliente
                                + " tiene " + contadorIntenciones
                                + " solicitudes comerciales de compra o arriendo. "
                                + "Se recomienda asignar seguimiento prioritario.",
                        "PENDIENTE",
                        LocalDateTime.now()
                ));
            }
        }

        return alertas;
    }

    private LinkedSimpleList<AlertaComercialDTO> detectarInmueblesConAltaIntencionEstructura() {
        LinkedSimpleList<AlertaComercialDTO> alertas = new LinkedSimpleList<>();
        LinkedSimpleList<SolicitudAtencion> solicitudes = solicitudRepository.listar();
        TablaHashPropia<String, String> inmueblesProcesados = new TablaHashPropia<>(53);

        for (SolicitudAtencion solicitud : solicitudes) {
            String codigoInmueble = solicitud.getCodigoInmueble();

            if (codigoInmueble == null
                    || codigoInmueble.isBlank()
                    || inmueblesProcesados.contieneClave(codigoInmueble)) {
                continue;
            }

            int contador = contarSolicitudesPorInmueble(codigoInmueble, solicitudes);

            if (contador >= 3) {
                inmueblesProcesados.insertar(codigoInmueble, codigoInmueble);

                alertas.addLast(new AlertaComercialDTO(
                        "AL-INMUEBLE-DEMANDA-" + codigoInmueble,
                        "INMUEBLE_ALTA_DEMANDA",
                        "MEDIA",
                        codigoInmueble,
                        "Inmueble con alta demanda",
                        "El inmueble " + codigoInmueble
                                + " tiene " + contador
                                + " solicitudes asociadas. Puede considerarse de alta demanda.",
                        "PENDIENTE",
                        LocalDateTime.now()
                ));
            }
        }

        return alertas;
    }

    private int contarIntencionesComercialesCliente(
            String idCliente,
            LinkedSimpleList<SolicitudAtencion> solicitudes
    ) {
        int contador = 0;

        for (SolicitudAtencion solicitud : solicitudes) {
            if (solicitud.getIdCliente() != null
                    && solicitud.getIdCliente().equalsIgnoreCase(idCliente)
                    && solicitud.esIntencionComercial()
                    && solicitud.getEstado() != null
                    && !solicitud.getEstado().equalsIgnoreCase("CANCELADA")
                    && !solicitud.getEstado().equalsIgnoreCase("RECHAZADA")) {
                contador++;
            }
        }

        return contador;
    }

    private int contarSolicitudesPorInmueble(
            String codigoInmueble,
            LinkedSimpleList<SolicitudAtencion> solicitudes
    ) {
        int contador = 0;

        for (SolicitudAtencion solicitud : solicitudes) {
            if (solicitud.getCodigoInmueble() != null
                    && solicitud.getCodigoInmueble().equalsIgnoreCase(codigoInmueble)
                    && solicitud.getEstado() != null
                    && !solicitud.getEstado().equalsIgnoreCase("CANCELADA")
                    && !solicitud.getEstado().equalsIgnoreCase("RECHAZADA")) {
                contador++;
            }
        }

        return contador;
    }

    private void agregarAlertas(
            LinkedSimpleList<AlertaComercialDTO> destino,
            LinkedSimpleList<AlertaComercialDTO> origen
    ) {
        for (AlertaComercialDTO alerta : origen) {
            destino.addLast(alerta);
        }
    }

    private AlertaComercialDTO[] convertirAArreglo(
            LinkedSimpleList<AlertaComercialDTO> alertas
    ) {
        AlertaComercialDTO[] resultado = new AlertaComercialDTO[alertas.getSize()];
        int indice = 0;

        for (AlertaComercialDTO alerta : alertas) {
            resultado[indice] = alerta;
            indice++;
        }

        return resultado;
    }

}
