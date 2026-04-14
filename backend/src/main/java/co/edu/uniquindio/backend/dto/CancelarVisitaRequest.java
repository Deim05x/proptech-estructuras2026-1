package co.edu.uniquindio.backend.dto;

public class CancelarVisitaRequest {

    private String observacion;

    public CancelarVisitaRequest() {
    }

    public CancelarVisitaRequest(String observacion) {
        this.observacion = observacion;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}