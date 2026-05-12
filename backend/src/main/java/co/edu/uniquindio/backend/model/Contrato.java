package co.edu.uniquindio.backend.model;

import java.time.LocalDate;

public class Contrato implements Comparable<Contrato> {

    private String id;
    private String codigoInmueble;
    private String idCliente;
    private String idAsesor;
    private String idOperacion;

    private String tipoContrato; 
    // ARRIENDO, VENTA, RENOVACION

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private double valor;
    private String estado;
    // ACTIVO, VENCIDO, CANCELADO, FINALIZADO, PROXIMO_A_VENCER

    private String observacion;

    public Contrato() {
    }

    public Contrato(
            String id,
            String codigoInmueble,
            String idCliente,
            String idAsesor,
            String idOperacion,
            String tipoContrato,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            double valor,
            String estado,
            String observacion
    ) {
        this.id = id;
        this.codigoInmueble = codigoInmueble;
        this.idCliente = idCliente;
        this.idAsesor = idAsesor;
        this.idOperacion = idOperacion;
        this.tipoContrato = tipoContrato;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.valor = valor;
        this.estado = estado;
        this.observacion = observacion;
    }

    @Override
    public int compareTo(Contrato otro) {
        if (this.fechaFin == null && otro.fechaFin == null) return 0;
        if (this.fechaFin == null) return -1;
        if (otro.fechaFin == null) return 1;
        return this.fechaFin.compareTo(otro.fechaFin);
    }

    public boolean estaProximoAVencer(int dias) {
        if (fechaFin == null) return false;

        LocalDate hoy = LocalDate.now();
        LocalDate limite = hoy.plusDays(dias);

        return !fechaFin.isBefore(hoy) && !fechaFin.isAfter(limite);
    }

    public boolean estaVencido() {
        if (fechaFin == null) return false;
        return fechaFin.isBefore(LocalDate.now());
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

    public String getIdOperacion() {
        return idOperacion;
    }

    public void setIdOperacion(String idOperacion) {
        this.idOperacion = idOperacion;
    }

    public String getTipoContrato() {
        return tipoContrato;
    }

    public void setTipoContrato(String tipoContrato) {
        this.tipoContrato = tipoContrato;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}