package co.edu.uniquindio.backend.dto;

public class RelacionGrafoDTO {

    private String origen;
    private String destino;
    private String tipoRelacion;
    private double peso;

    public RelacionGrafoDTO() {
    }

    public RelacionGrafoDTO(String origen, String destino, String tipoRelacion, double peso) {
        this.origen = origen;
        this.destino = destino;
        this.tipoRelacion = tipoRelacion;
        this.peso = peso;
    }

    public String getOrigen() {
        return origen;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public String getTipoRelacion() {
        return tipoRelacion;
    }

    public void setTipoRelacion(String tipoRelacion) {
        this.tipoRelacion = tipoRelacion;
    }

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }
}