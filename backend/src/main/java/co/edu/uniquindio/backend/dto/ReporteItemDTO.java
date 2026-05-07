package co.edu.uniquindio.backend.dto;

public class ReporteItemDTO {

    private String criterio;
    private int cantidad;
    private double valorTotal;

    public ReporteItemDTO() {
    }

    public ReporteItemDTO(String criterio, int cantidad, double valorTotal) {
        this.criterio = criterio;
        this.cantidad = cantidad;
        this.valorTotal = valorTotal;
    }

    public String getCriterio() {
        return criterio;
    }

    public void setCriterio(String criterio) {
        this.criterio = criterio;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }
}