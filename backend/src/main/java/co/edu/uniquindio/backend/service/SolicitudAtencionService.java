package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.colas.cola.Cola;
import co.edu.uniquindio.backend.estructuras.colas.colaprioridad.ColaPrioridad;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.SolicitudAtencion;
import co.edu.uniquindio.backend.repository.SolicitudAtencionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SolicitudAtencionService {

    private final SolicitudAtencionRepository solicitudRepository;

    private final Cola<SolicitudAtencion> colaSolicitudes = new Cola<>();
    private final ColaPrioridad<SolicitudAtencion> colaAltaPrioridad = new ColaPrioridad<>();

    public SolicitudAtencionService(SolicitudAtencionRepository solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }

    public SolicitudAtencion[] listar() {
        return convertirAArreglo(solicitudRepository.listar());
    }

    public SolicitudAtencion buscarPorId(String id) {
        SolicitudAtencion solicitud = solicitudRepository.buscarPorId(id);

        if (solicitud == null) {
            throw new RuntimeException("Solicitud no encontrada");
        }

        return solicitud;
    }

    public SolicitudAtencion crear(SolicitudAtencion solicitud) {
        validarSolicitud(solicitud);

        if (solicitud.getEstado() == null || solicitud.getEstado().isBlank()) {
            solicitud.setEstado("PENDIENTE");
        }

        if (solicitud.getPrioridad() == null || solicitud.getPrioridad().isBlank()) {
            solicitud.setPrioridad(calcularPrioridad(solicitud));
        }

        if (solicitud.getFechaCreacion() == null) {
            solicitud.setFechaCreacion(LocalDateTime.now());
        }

        SolicitudAtencion guardada = solicitudRepository.guardar(solicitud);

        if (guardada.estaPendiente()) {
            colaSolicitudes.encolar(guardada);

            if (guardada.esAltaPrioridad()) {
                colaAltaPrioridad.encolar(guardada, obtenerPrioridadNumerica(guardada));
            }
        }

        return guardada;
    }

    public SolicitudAtencion actualizar(String id, SolicitudAtencion solicitud) {
        validarSolicitud(solicitud);
        SolicitudAtencion actualizada = solicitudRepository.actualizar(id, solicitud);
        recargarCola();
        recargarColaPrioridad();
        return actualizada;
    }

    public void eliminar(String id) {
        solicitudRepository.eliminar(id);
        recargarCola();
        recargarColaPrioridad();
    }

    public SolicitudAtencion[] listarPorCliente(String idCliente) {
        return convertirAArreglo(solicitudRepository.listarPorCliente(idCliente));
    }

    public SolicitudAtencion[] listarPorEstado(String estado) {
        return convertirAArreglo(solicitudRepository.listarPorEstado(estado));
    }

    public SolicitudAtencion[] listarPendientes() {
        return convertirAArreglo(solicitudRepository.listarPendientes());
    }

    public SolicitudAtencion[] listarAltaPrioridadPendientes() {
        return convertirAArreglo(solicitudRepository.listarAltaPrioridadPendientes());
    }

    public int cantidadCola() {
        return colaSolicitudes.getTamano();
    }

    public int cantidadColaPrioridad() {
        return colaAltaPrioridad.getTamano();
    }

    public void recargarCola() {
        colaSolicitudes.vaciar();

        LinkedSimpleList<SolicitudAtencion> pendientes = solicitudRepository.listarPendientes();

        for (SolicitudAtencion solicitud : pendientes) {
            colaSolicitudes.encolar(solicitud);
        }
    }

    public void recargarColaPrioridad() {
        colaAltaPrioridad.vaciar();

        LinkedSimpleList<SolicitudAtencion> prioritarias = solicitudRepository.listarAltaPrioridadPendientes();

        for (SolicitudAtencion solicitud : prioritarias) {
            colaAltaPrioridad.encolar(solicitud, obtenerPrioridadNumerica(solicitud));
        }
    }

    public SolicitudAtencion procesarSiguiente(String idAsesor, String respuesta) {
        if (colaSolicitudes.estaVacia()) {
            recargarCola();
        }

        SolicitudAtencion solicitud = colaSolicitudes.estaVacia()
                ? null
                : colaSolicitudes.desencolar();

        if (solicitud == null) {
            throw new RuntimeException("No hay solicitudes pendientes para procesar");
        }

        solicitud.setEstado("EN_ATENCION");
        solicitud.setFechaAtencion(LocalDateTime.now());
        solicitud.setIdAsesorAsignado(idAsesor);
        solicitud.setRespuesta(respuesta);

        solicitudRepository.actualizar(solicitud.getId(), solicitud);
        recargarColaPrioridad();

        return solicitud;
    }

    public SolicitudAtencion procesarSiguientePrioritaria(String idAsesor, String respuesta) {
        if (colaAltaPrioridad.estaVacia()) {
            recargarColaPrioridad();
        }

        SolicitudAtencion solicitud = colaAltaPrioridad.estaVacia()
                ? null
                : colaAltaPrioridad.desencolar();

        if (solicitud == null) {
            throw new RuntimeException("No hay solicitudes prioritarias pendientes");
        }

        solicitud.setEstado("EN_ATENCION");
        solicitud.setFechaAtencion(LocalDateTime.now());
        solicitud.setIdAsesorAsignado(idAsesor);
        solicitud.setRespuesta(respuesta);

        solicitudRepository.actualizar(solicitud.getId(), solicitud);
        recargarCola();

        return solicitud;
    }

    public SolicitudAtencion cambiarEstado(String id, String estado) {
        SolicitudAtencion solicitud = buscarPorId(id);

        solicitud.setEstado(estado);
        SolicitudAtencion actualizada = solicitudRepository.actualizar(id, solicitud);

        recargarCola();
        recargarColaPrioridad();

        return actualizada;
    }

    public SolicitudAtencion asignarAsesor(String id, String idAsesor) {
        SolicitudAtencion solicitud = buscarPorId(id);
        solicitud.setIdAsesorAsignado(idAsesor);
        return solicitudRepository.actualizar(id, solicitud);
    }

    private void validarSolicitud(SolicitudAtencion solicitud) {
        if (solicitud.getId() == null || solicitud.getId().isBlank()) {
            throw new RuntimeException("El ID de la solicitud es obligatorio");
        }

        if (solicitud.getIdCliente() == null || solicitud.getIdCliente().isBlank()) {
            throw new RuntimeException("El ID del cliente es obligatorio");
        }

        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().isBlank()) {
            throw new RuntimeException("El tipo de solicitud es obligatorio");
        }

        if (solicitud.getDescripcion() == null || solicitud.getDescripcion().isBlank()) {
            throw new RuntimeException("La descripción es obligatoria");
        }
    }

    private String calcularPrioridad(SolicitudAtencion solicitud) {
        if (solicitud.esIntencionComercial()) {
            return "ALTA";
        }

        if (solicitud.esSolicitudDeVisita()) {
            return "MEDIA";
        }

        return "BAJA";
    }

    private int obtenerPrioridadNumerica(SolicitudAtencion solicitud) {
        if (solicitud == null || solicitud.getPrioridad() == null) {
            return 1;
        }

        if (solicitud.getPrioridad().equalsIgnoreCase("ALTA")) {
            return 3;
        }

        if (solicitud.getPrioridad().equalsIgnoreCase("MEDIA")) {
            return 2;
        }

        return 1;
    }

    private SolicitudAtencion[] convertirAArreglo(
            LinkedSimpleList<SolicitudAtencion> solicitudes
    ) {
        SolicitudAtencion[] resultado = new SolicitudAtencion[solicitudes.getSize()];
        int indice = 0;

        for (SolicitudAtencion solicitud : solicitudes) {
            resultado[indice] = solicitud;
            indice++;
        }

        return resultado;
    }

}
