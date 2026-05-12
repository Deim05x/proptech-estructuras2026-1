package co.edu.uniquindio.backend.dto;

public class ValidacionNegocioDTO {

    private String tipoValidacion;

    private String idCliente;
    private String codigoInmueble;
    private String idAsesor;
    private String idVisita;
    private String idOperacion;
    private String idContrato;
    private String idSolicitud;

    private double valorOperacion;
    private String estadoObjetivo;

    public ValidacionNegocioDTO() {
    }

    public String getTipoValidacion() {
        return tipoValidacion;
    }

    public void setTipoValidacion(String tipoValidacion) {
        this.tipoValidacion = tipoValidacion;
    }

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
    }

    public String getCodigoInmueble() {
        return codigoInmueble;
    }

    public void setCodigoInmueble(String codigoInmueble) {
        this.codigoInmueble = codigoInmueble;
    }

    public String getIdAsesor() {
        return idAsesor;
    }

    public void setIdAsesor(String idAsesor) {
        this.idAsesor = idAsesor;
    }

    public String getIdVisita() {
        return idVisita;
    }

    public void setIdVisita(String idVisita) {
        this.idVisita = idVisita;
    }

    public String getIdOperacion() {
        return idOperacion;
    }

    public void setIdOperacion(String idOperacion) {
        this.idOperacion = idOperacion;
    }

    public String getIdContrato() {
        return idContrato;
    }

    public void setIdContrato(String idContrato) {
        this.idContrato = idContrato;
    }

    public String getIdSolicitud() {
        return idSolicitud;
    }

    public void setIdSolicitud(String idSolicitud) {
        this.idSolicitud = idSolicitud;
    }

    public double getValorOperacion() {
        return valorOperacion;
    }

    public void setValorOperacion(double valorOperacion) {
        this.valorOperacion = valorOperacion;
    }

    public String getEstadoObjetivo() {
        return estadoObjetivo;
    }

    public void setEstadoObjetivo(String estadoObjetivo) {
        this.estadoObjetivo = estadoObjetivo;
    }
}