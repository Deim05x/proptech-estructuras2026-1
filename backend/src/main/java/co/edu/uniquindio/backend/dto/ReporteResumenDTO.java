package co.edu.uniquindio.backend.dto;

public class ReporteResumenDTO {

    private int totalInmuebles;
    private int inmueblesDisponibles;
    private int totalVisitas;
    private int totalOperaciones;
    private int operacionesCerradas;
    private double valorTotalCierres;

    public ReporteResumenDTO() {
    }

    public ReporteResumenDTO(int totalInmuebles, int inmueblesDisponibles, int totalVisitas,
                             int totalOperaciones, int operacionesCerradas, double valorTotalCierres) {
        this.totalInmuebles = totalInmuebles;
        this.inmueblesDisponibles = inmueblesDisponibles;
        this.totalVisitas = totalVisitas;
        this.totalOperaciones = totalOperaciones;
        this.operacionesCerradas = operacionesCerradas;
        this.valorTotalCierres = valorTotalCierres;
    }

    public int getTotalInmuebles() {
        return totalInmuebles;
    }

    public void setTotalInmuebles(int totalInmuebles) {
        this.totalInmuebles = totalInmuebles;
    }

    public int getInmueblesDisponibles() {
        return inmueblesDisponibles;
    }

    public void setInmueblesDisponibles(int inmueblesDisponibles) {
        this.inmueblesDisponibles = inmueblesDisponibles;
    }

    public int getTotalVisitas() {
        return totalVisitas;
    }

    public void setTotalVisitas(int totalVisitas) {
        this.totalVisitas = totalVisitas;
    }

    public int getTotalOperaciones() {
        return totalOperaciones;
    }

    public void setTotalOperaciones(int totalOperaciones) {
        this.totalOperaciones = totalOperaciones;
    }

    public int getOperacionesCerradas() {
        return operacionesCerradas;
    }

    public void setOperacionesCerradas(int operacionesCerradas) {
        this.operacionesCerradas = operacionesCerradas;
    }

    public double getValorTotalCierres() {
        return valorTotalCierres;
    }

    public void setValorTotalCierres(double valorTotalCierres) {
        this.valorTotalCierres = valorTotalCierres;
    }
}