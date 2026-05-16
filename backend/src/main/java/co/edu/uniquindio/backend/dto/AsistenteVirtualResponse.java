package co.edu.uniquindio.backend.dto;

import java.util.List;

public class AsistenteVirtualResponse {

    private String respuesta;
    private boolean generadoConIa;
    private boolean requiereRegistro;
    private List<String> codigosSugeridos;

    public AsistenteVirtualResponse() {
    }

    public AsistenteVirtualResponse(
            String respuesta,
            boolean generadoConIa,
            boolean requiereRegistro,
            List<String> codigosSugeridos) {
        this.respuesta = respuesta;
        this.generadoConIa = generadoConIa;
        this.requiereRegistro = requiereRegistro;
        this.codigosSugeridos = codigosSugeridos;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public boolean isGeneradoConIa() {
        return generadoConIa;
    }

    public void setGeneradoConIa(boolean generadoConIa) {
        this.generadoConIa = generadoConIa;
    }

    public boolean isRequiereRegistro() {
        return requiereRegistro;
    }

    public void setRequiereRegistro(boolean requiereRegistro) {
        this.requiereRegistro = requiereRegistro;
    }

    public List<String> getCodigosSugeridos() {
        return codigosSugeridos;
    }

    public void setCodigosSugeridos(List<String> codigosSugeridos) {
        this.codigosSugeridos = codigosSugeridos;
    }
}
