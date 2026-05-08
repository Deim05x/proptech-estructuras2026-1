package co.edu.uniquindio.backend.model;

import java.time.LocalDateTime;

public class EventoInusual implements Comparable<EventoInusual> {

    private String id;
    private String tipo;
    private String descripcion;
    private String nivelAtencion;
    private LocalDateTime fechaDeteccion;
    private String estado;
    private String entidadReferencia;

    public EventoInusual() {
    }

    public EventoInusual(String id, String tipo, String descripcion,
                         String nivelAtencion, LocalDateTime fechaDeteccion,
                         String estado, String entidadReferencia) {
        this.id = id;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.nivelAtencion = nivelAtencion;
        this.fechaDeteccion = fechaDeteccion;
        this.estado = estado;
        this.entidadReferencia = entidadReferencia;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNivelAtencion() {
        return nivelAtencion;
    }

    public void setNivelAtencion(String nivelAtencion) {
        this.nivelAtencion = nivelAtencion;
    }

    public LocalDateTime getFechaDeteccion() {
        return fechaDeteccion;
    }

    public void setFechaDeteccion(LocalDateTime fechaDeteccion) {
        this.fechaDeteccion = fechaDeteccion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getEntidadReferencia() {
        return entidadReferencia;
    }

    public void setEntidadReferencia(String entidadReferencia) {
        this.entidadReferencia = entidadReferencia;
    }

    @Override
    public int compareTo(EventoInusual otro) {
        return this.id.compareToIgnoreCase(otro.id);
    }
}