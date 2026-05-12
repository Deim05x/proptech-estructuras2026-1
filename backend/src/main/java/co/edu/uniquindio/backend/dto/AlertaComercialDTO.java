package co.edu.uniquindio.backend.dto;

import java.time.LocalDateTime;

public class AlertaComercialDTO implements Comparable<AlertaComercialDTO> {

    private String id;
    private String tipo;
    private String prioridad;
    private String entidadReferencia;
    private String titulo;
    private String descripcion;
    private String estado;
    private LocalDateTime fechaDeteccion;

    public AlertaComercialDTO() {
    }

    public AlertaComercialDTO(
            String id,
            String tipo,
            String prioridad,
            String entidadReferencia,
            String titulo,
            String descripcion,
            String estado,
            LocalDateTime fechaDeteccion
    ) {
        this.id = id;
        this.tipo = tipo;
        this.prioridad = prioridad;
        this.entidadReferencia = entidadReferencia;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.fechaDeteccion = fechaDeteccion;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getEntidadReferencia() {
        return entidadReferencia;
    }

    public void setEntidadReferencia(String entidadReferencia) {
        this.entidadReferencia = entidadReferencia;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
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

    public LocalDateTime getFechaDeteccion() {
        return fechaDeteccion;
    }

    public void setFechaDeteccion(LocalDateTime fechaDeteccion) {
        this.fechaDeteccion = fechaDeteccion;
    }

    @Override
    public int compareTo(AlertaComercialDTO otra) {
        if (otra == null || otra.getId() == null) {
            return 1;
        }

        if (this.id == null) {
            return -1;
        }

        return this.id.compareTo(otra.getId());
    }
}
