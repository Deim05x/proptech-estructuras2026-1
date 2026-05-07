package co.edu.uniquindio.backend.dto;

import co.edu.uniquindio.backend.model.Inmueble;

/**
 * DTO usado para ordenar inmuebles dentro del árbol.
 */
public class InmuebleOrdenadoDTO implements Comparable<InmuebleOrdenadoDTO> {

    private Inmueble inmueble;
    private String criterio;
    private double valorOrden;
    private int demanda;

    public InmuebleOrdenadoDTO() {
    }

    public InmuebleOrdenadoDTO(Inmueble inmueble, String criterio, double valorOrden, int demanda) {
        this.inmueble = inmueble;
        this.criterio = criterio;
        this.valorOrden = valorOrden;
        this.demanda = demanda;
    }

    public Inmueble getInmueble() {
        return inmueble;
    }

    public void setInmueble(Inmueble inmueble) {
        this.inmueble = inmueble;
    }

    public String getCriterio() {
        return criterio;
    }

    public void setCriterio(String criterio) {
        this.criterio = criterio;
    }

    public double getValorOrden() {
        return valorOrden;
    }

    public void setValorOrden(double valorOrden) {
        this.valorOrden = valorOrden;
    }

    public int getDemanda() {
        return demanda;
    }

    public void setDemanda(int demanda) {
        this.demanda = demanda;
    }

    @Override
    public int compareTo(InmuebleOrdenadoDTO otro) {
        int comparacionValor = Double.compare(this.valorOrden, otro.valorOrden);

        if (comparacionValor != 0) {
            return comparacionValor;
        }

        String codigoActual = "";
        String codigoOtro = "";

        if (this.inmueble != null && this.inmueble.getCodigo() != null) {
            codigoActual = this.inmueble.getCodigo();
        }

        if (otro.inmueble != null && otro.inmueble.getCodigo() != null) {
            codigoOtro = otro.inmueble.getCodigo();
        }

        return codigoActual.compareToIgnoreCase(codigoOtro);
    }
}