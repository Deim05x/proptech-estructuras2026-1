package co.edu.uniquindio.backend.model;

import java.time.LocalDateTime;

public class Alerta implements Comparable<Alerta> {

    private String id;
    private String tipo;
    private String descripcion;
    private String nivelAtencion;
    private LocalDateTime fechaCreacion;
    private String estado;

    public Alerta() {
    }

    public Alerta(String id, String tipo, String descripcion, String nivelAtencion,
                  LocalDateTime fechaCreacion, String estado) {
        this.id = id;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.nivelAtencion = nivelAtencion;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    @Override
    public int compareTo(Alerta otra) {
        return this.id.compareTo(otra.id);
    }
}