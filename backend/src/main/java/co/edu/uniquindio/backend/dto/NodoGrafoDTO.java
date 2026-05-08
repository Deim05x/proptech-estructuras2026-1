package co.edu.uniquindio.backend.dto;

public class NodoGrafoDTO {

    private String id;
    private String tipo;
    private String etiqueta;
    private int grado;

    public NodoGrafoDTO() {
    }

    public NodoGrafoDTO(String id, String tipo, String etiqueta, int grado) {
        this.id = id;
        this.tipo = tipo;
        this.etiqueta = etiqueta;
        this.grado = grado;
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

    public String getEtiqueta() {
        return etiqueta;
    }

    public void setEtiqueta(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public int getGrado() {
        return grado;
    }

    public void setGrado(int grado) {
        this.grado = grado;
    }
}