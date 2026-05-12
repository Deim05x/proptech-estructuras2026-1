package co.edu.uniquindio.backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ResultadoValidacionDTO {

    private String tipoValidacion;
    private boolean valido;
    private String mensajeGeneral;
    private List<String> errores;
    private List<String> advertencias;
    private List<String> recomendaciones;
    private LocalDateTime fechaValidacion;

    public ResultadoValidacionDTO() {
        this.errores = new ArrayList<>();
        this.advertencias = new ArrayList<>();
        this.recomendaciones = new ArrayList<>();
        this.fechaValidacion = LocalDateTime.now();
        this.valido = true;
    }

    public void agregarError(String error) {
        this.errores.add(error);
        this.valido = false;
    }

    public void agregarAdvertencia(String advertencia) {
        this.advertencias.add(advertencia);
    }

    public void agregarRecomendacion(String recomendacion) {
        this.recomendaciones.add(recomendacion);
    }

    public String getTipoValidacion() {
        return tipoValidacion;
    }

    public void setTipoValidacion(String tipoValidacion) {
        this.tipoValidacion = tipoValidacion;
    }

    public boolean isValido() {
        return valido;
    }

    public void setValido(boolean valido) {
        this.valido = valido;
    }

    public String getMensajeGeneral() {
        return mensajeGeneral;
    }

    public void setMensajeGeneral(String mensajeGeneral) {
        this.mensajeGeneral = mensajeGeneral;
    }

    public List<String> getErrores() {
        return errores;
    }

    public void setErrores(List<String> errores) {
        this.errores = errores;
    }

    public List<String> getAdvertencias() {
        return advertencias;
    }

    public void setAdvertencias(List<String> advertencias) {
        this.advertencias = advertencias;
    }

    public List<String> getRecomendaciones() {
        return recomendaciones;
    }

    public void setRecomendaciones(List<String> recomendaciones) {
        this.recomendaciones = recomendaciones;
    }

    public LocalDateTime getFechaValidacion() {
        return fechaValidacion;
    }

    public void setFechaValidacion(LocalDateTime fechaValidacion) {
        this.fechaValidacion = fechaValidacion;
    }
}