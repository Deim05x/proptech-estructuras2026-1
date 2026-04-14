package co.edu.uniquindio.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReprogramarVisitaRequest {

    private LocalDate fecha;
    private LocalTime hora;
    private String observacion;

    public ReprogramarVisitaRequest() {
    }

    public ReprogramarVisitaRequest(LocalDate fecha, LocalTime hora, String observacion) {
        this.fecha = fecha;
        this.hora = hora;
        this.observacion = observacion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}