package co.edu.uniquindio.backend.model;

import java.time.LocalDateTime;

public class SolicitudAtencion implements Comparable<SolicitudAtencion> {

    private String id;
    private String idCliente;
    private String codigoInmueble;
    private String tipoSolicitud;
    // ATENCION, VISITA, COMPRA, ARRIENDO, INFORMACION

    private String descripcion;
    private String estado;
    // PENDIENTE, EN_ATENCION, ATENDIDA, RECHAZADA, CANCELADA

    private String prioridad;
    // BAJA, MEDIA, ALTA

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaAtencion;

    private String idAsesorAsignado;
    private String respuesta;

    public SolicitudAtencion() {
    }

    public SolicitudAtencion(
            String id,
            String idCliente,
            String codigoInmueble,
            String tipoSolicitud,
            String descripcion,
            String estado,
            String prioridad,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaAtencion,
            String idAsesorAsignado,
            String respuesta
    ) {
        this.id = id;
        this.idCliente = idCliente;
        this.codigoInmueble = codigoInmueble;
        this.tipoSolicitud = tipoSolicitud;
        this.descripcion = descripcion;
        this.estado = estado;
        this.prioridad = prioridad;
        this.fechaCreacion = fechaCreacion;
        this.fechaAtencion = fechaAtencion;
        this.idAsesorAsignado = idAsesorAsignado;
        this.respuesta = respuesta;
    }

    public boolean estaPendiente() {
        return estado != null && estado.equalsIgnoreCase("PENDIENTE");
    }

    public boolean esAltaPrioridad() {
        return prioridad != null && prioridad.equalsIgnoreCase("ALTA");
    }

    public boolean esSolicitudDeVisita() {
        return tipoSolicitud != null && tipoSolicitud.equalsIgnoreCase("VISITA");
    }

    public boolean esIntencionComercial() {
        if (tipoSolicitud == null) return false;

        return tipoSolicitud.equalsIgnoreCase("COMPRA")
                || tipoSolicitud.equalsIgnoreCase("ARRIENDO");
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
    }

    public String getCodigoInmueble() {
        return codigoInmueble;
    }

    public void setCodigoInmueble(String codigoInmueble) {
        this.codigoInmueble = codigoInmueble;
    }

    public String getTipoSolicitud() {
        return tipoSolicitud;
    }

    public void setTipoSolicitud(String tipoSolicitud) {
        this.tipoSolicitud = tipoSolicitud;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaAtencion() {
        return fechaAtencion;
    }

    public void setFechaAtencion(LocalDateTime fechaAtencion) {
        this.fechaAtencion = fechaAtencion;
    }

    public String getIdAsesorAsignado() {
        return idAsesorAsignado;
    }

    public void setIdAsesorAsignado(String idAsesorAsignado) {
        this.idAsesorAsignado = idAsesorAsignado;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    @Override
    public int compareTo(SolicitudAtencion otra) {
        if (otra == null || otra.getId() == null) {
            return 1;
        }

        if (this.id == null) {
            return -1;
        }

        return this.id.compareTo(otra.getId());
    }
}
