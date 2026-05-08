package co.edu.uniquindio.backend.dto;

import co.edu.uniquindio.backend.model.Inmueble;

import java.time.LocalDateTime;

public class AccionInmuebleDTO {

    private String codigoInmueble;
    private String descripcion;
    private LocalDateTime fechaAccion;
    private Inmueble estadoAnterior;

    public AccionInmuebleDTO() {
    }

    public AccionInmuebleDTO(String codigoInmueble, String descripcion,
                             LocalDateTime fechaAccion, Inmueble estadoAnterior) {
        this.codigoInmueble = codigoInmueble;
        this.descripcion = descripcion;
        this.fechaAccion = fechaAccion;
        this.estadoAnterior = estadoAnterior;
    }

    public String getCodigoInmueble() {
        return codigoInmueble;
    }

    public void setCodigoInmueble(String codigoInmueble) {
        this.codigoInmueble = codigoInmueble;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaAccion() {
        return fechaAccion;
    }

    public void setFechaAccion(LocalDateTime fechaAccion) {
        this.fechaAccion = fechaAccion;
    }

    public Inmueble getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(Inmueble estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }
}