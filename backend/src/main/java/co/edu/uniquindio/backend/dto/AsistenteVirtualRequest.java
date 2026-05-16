package co.edu.uniquindio.backend.dto;

import java.util.List;

public class AsistenteVirtualRequest {

    private String mensaje;
    private List<ChatMessageDTO> historial;

    public AsistenteVirtualRequest() {
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public List<ChatMessageDTO> getHistorial() {
        return historial;
    }

    public void setHistorial(List<ChatMessageDTO> historial) {
        this.historial = historial;
    }
}
