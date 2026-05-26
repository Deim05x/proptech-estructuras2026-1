package co.edu.uniquindio.backend.dto;

/**
 * DTO para representar la proyección de demanda en una zona específica.
 * Incluye datos históricos, predicción y análisis de tendencias.
 */
public class ProyeccionDemandaDTO {
    private String zona;
    private int mesActual;
    private int demandaHistorica;
    private double tasaCrecimiento;
    private int[] proximosTresMeses;
    private String tendencia;
    private int inmueblesDisponibles;
    private double precioPromedio;
    private int visitasPromedio;
    private String recomendacion;

    public ProyeccionDemandaDTO() {
    }

    public ProyeccionDemandaDTO(String zona, int mesActual, int demandaHistorica, 
                               double tasaCrecimiento, int[] proximosTresMeses, 
                               String tendencia, int inmueblesDisponibles, 
                               double precioPromedio, int visitasPromedio, 
                               String recomendacion) {
        this.zona = zona;
        this.mesActual = mesActual;
        this.demandaHistorica = demandaHistorica;
        this.tasaCrecimiento = tasaCrecimiento;
        this.proximosTresMeses = proximosTresMeses;
        this.tendencia = tendencia;
        this.inmueblesDisponibles = inmueblesDisponibles;
        this.precioPromedio = precioPromedio;
        this.visitasPromedio = visitasPromedio;
        this.recomendacion = recomendacion;
    }

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public int getMesActual() {
        return mesActual;
    }

    public void setMesActual(int mesActual) {
        this.mesActual = mesActual;
    }

    public int getDemandaHistorica() {
        return demandaHistorica;
    }

    public void setDemandaHistorica(int demandaHistorica) {
        this.demandaHistorica = demandaHistorica;
    }

    public double getTasaCrecimiento() {
        return tasaCrecimiento;
    }

    public void setTasaCrecimiento(double tasaCrecimiento) {
        this.tasaCrecimiento = tasaCrecimiento;
    }

    public int[] getProximosTresMeses() {
        return proximosTresMeses;
    }

    public void setProximosTresMeses(int[] proximosTresMeses) {
        this.proximosTresMeses = proximosTresMeses;
    }

    public String getTendencia() {
        return tendencia;
    }

    public void setTendencia(String tendencia) {
        this.tendencia = tendencia;
    }

    public int getInmueblesDisponibles() {
        return inmueblesDisponibles;
    }

    public void setInmueblesDisponibles(int inmueblesDisponibles) {
        this.inmueblesDisponibles = inmueblesDisponibles;
    }

    public double getPrecioPromedio() {
        return precioPromedio;
    }

    public void setPrecioPromedio(double precioPromedio) {
        this.precioPromedio = precioPromedio;
    }

    public int getVisitasPromedio() {
        return visitasPromedio;
    }

    public void setVisitasPromedio(int visitasPromedio) {
        this.visitasPromedio = visitasPromedio;
    }

    public String getRecomendacion() {
        return recomendacion;
    }

    public void setRecomendacion(String recomendacion) {
        this.recomendacion = recomendacion;
    }
}
