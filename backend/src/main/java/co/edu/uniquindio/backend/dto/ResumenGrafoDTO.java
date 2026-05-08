package co.edu.uniquindio.backend.dto;

public class ResumenGrafoDTO {

    private int totalNodos;
    private int totalRelaciones;
    private String nodoMayorConexion;
    private int gradoMayorConexion;

    public ResumenGrafoDTO() {
    }

    public ResumenGrafoDTO(int totalNodos, int totalRelaciones,
                           String nodoMayorConexion, int gradoMayorConexion) {
        this.totalNodos = totalNodos;
        this.totalRelaciones = totalRelaciones;
        this.nodoMayorConexion = nodoMayorConexion;
        this.gradoMayorConexion = gradoMayorConexion;
    }

    public int getTotalNodos() {
        return totalNodos;
    }

    public void setTotalNodos(int totalNodos) {
        this.totalNodos = totalNodos;
    }

    public int getTotalRelaciones() {
        return totalRelaciones;
    }

    public void setTotalRelaciones(int totalRelaciones) {
        this.totalRelaciones = totalRelaciones;
    }

    public String getNodoMayorConexion() {
        return nodoMayorConexion;
    }

    public void setNodoMayorConexion(String nodoMayorConexion) {
        this.nodoMayorConexion = nodoMayorConexion;
    }

    public int getGradoMayorConexion() {
        return gradoMayorConexion;
    }

    public void setGradoMayorConexion(int gradoMayorConexion) {
        this.gradoMayorConexion = gradoMayorConexion;
    }
}