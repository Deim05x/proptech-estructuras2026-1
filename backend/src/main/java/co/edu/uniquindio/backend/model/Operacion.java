package co.edu.uniquindio.backend.model;

import java.time.LocalDate;

public class Operacion implements Comparable<Operacion> {

    private String id;
    private String codigoInmueble;
    private String idCliente;
    private String idAsesor;
    private LocalDate fecha;
    private String tipoOperacion;
    private double valorAcordado;
    private double comision;
    private String estadoProceso;

    public Operacion() {
    }

    public Operacion(String id, String codigoInmueble, String idCliente, String idAsesor,
                     LocalDate fecha, String tipoOperacion, double valorAcordado,
                     double comision, String estadoProceso) {
        this.id = id;
        this.codigoInmueble = codigoInmueble;
        this.idCliente = idCliente;
        this.idAsesor = idAsesor;
        this.fecha = fecha;
        this.tipoOperacion = tipoOperacion;
        this.valorAcordado = valorAcordado;
        this.comision = comision;
        this.estadoProceso = estadoProceso;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodigoInmueble() {
        return codigoInmueble;
    }

    public void setCodigoInmueble(String codigoInmueble) {
        this.codigoInmueble = codigoInmueble;
    }

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
    }

    public String getIdAsesor() {
        return idAsesor;
    }

    public void setIdAsesor(String idAsesor) {
        this.idAsesor = idAsesor;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getTipoOperacion() {
        return tipoOperacion;
    }

    public void setTipoOperacion(String tipoOperacion) {
        this.tipoOperacion = tipoOperacion;
    }

    public double getValorAcordado() {
        return valorAcordado;
    }

    public void setValorAcordado(double valorAcordado) {
        this.valorAcordado = valorAcordado;
    }

    public double getComision() {
        return comision;
    }

    public void setComision(double comision) {
        this.comision = comision;
    }

    public String getEstadoProceso() {
        return estadoProceso;
    }

    public void setEstadoProceso(String estadoProceso) {
        this.estadoProceso = estadoProceso;
    }

    @Override
    public int compareTo(Operacion otra) {
        return this.id.compareTo(otra.id);
    }
}