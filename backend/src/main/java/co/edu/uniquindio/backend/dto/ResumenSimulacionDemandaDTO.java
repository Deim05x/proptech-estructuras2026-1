package co.edu.uniquindio.backend.dto;

/**
 * DTO para el resumen general de simulación de demanda por sector.
 * Contiene análisis agregado de todas las zonas.
 */
public class ResumenSimulacionDemandaDTO {
    private int totalZonas;
    private String zonaConMayorCrecimiento;
    private double tasaGlobalCrecimiento;
    private int inmueblesDisponiblesTotales;
    private int totalVisitasPromedio;
    private String recomendacionGlobal;
    private String fechaAnalisis;

    public ResumenSimulacionDemandaDTO() {
    }

    public ResumenSimulacionDemandaDTO(int totalZonas, String zonaConMayorCrecimiento,
                                       double tasaGlobalCrecimiento, int inmueblesDisponiblesTotales,
                                       int totalVisitasPromedio, String recomendacionGlobal,
                                       String fechaAnalisis) {
        this.totalZonas = totalZonas;
        this.zonaConMayorCrecimiento = zonaConMayorCrecimiento;
        this.tasaGlobalCrecimiento = tasaGlobalCrecimiento;
        this.inmueblesDisponiblesTotales = inmueblesDisponiblesTotales;
        this.totalVisitasPromedio = totalVisitasPromedio;
        this.recomendacionGlobal = recomendacionGlobal;
        this.fechaAnalisis = fechaAnalisis;
    }

    public int getTotalZonas() {
        return totalZonas;
    }

    public void setTotalZonas(int totalZonas) {
        this.totalZonas = totalZonas;
    }

    public String getZonaConMayorCrecimiento() {
        return zonaConMayorCrecimiento;
    }

    public void setZonaConMayorCrecimiento(String zonaConMayorCrecimiento) {
        this.zonaConMayorCrecimiento = zonaConMayorCrecimiento;
    }

    public double getTasaGlobalCrecimiento() {
        return tasaGlobalCrecimiento;
    }

    public void setTasaGlobalCrecimiento(double tasaGlobalCrecimiento) {
        this.tasaGlobalCrecimiento = tasaGlobalCrecimiento;
    }

    public int getInmueblesDisponiblesTotales() {
        return inmueblesDisponiblesTotales;
    }

    public void setInmueblesDisponiblesTotales(int inmueblesDisponiblesTotales) {
        this.inmueblesDisponiblesTotales = inmueblesDisponiblesTotales;
    }

    public int getTotalVisitasPromedio() {
        return totalVisitasPromedio;
    }

    public void setTotalVisitasPromedio(int totalVisitasPromedio) {
        this.totalVisitasPromedio = totalVisitasPromedio;
    }

    public String getRecomendacionGlobal() {
        return recomendacionGlobal;
    }

    public void setRecomendacionGlobal(String recomendacionGlobal) {
        this.recomendacionGlobal = recomendacionGlobal;
    }

    public String getFechaAnalisis() {
        return fechaAnalisis;
    }

    public void setFechaAnalisis(String fechaAnalisis) {
        this.fechaAnalisis = fechaAnalisis;
    }
}
