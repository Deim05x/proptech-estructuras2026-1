package co.edu.uniquindio.backend.dto;

import co.edu.uniquindio.backend.model.Inmueble;

public class InmuebleRangoPrecioDTO {

    private double precioMinimo;
    private double precioMaximo;
    private int cantidadResultados;
    private int totalNodosArbol;
    private int alturaArbol;
    private Inmueble[] inmuebles;

    public InmuebleRangoPrecioDTO() {
    }

    public InmuebleRangoPrecioDTO(
            double precioMinimo,
            double precioMaximo,
            int cantidadResultados,
            int totalNodosArbol,
            int alturaArbol,
            Inmueble[] inmuebles
    ) {
        this.precioMinimo = precioMinimo;
        this.precioMaximo = precioMaximo;
        this.cantidadResultados = cantidadResultados;
        this.totalNodosArbol = totalNodosArbol;
        this.alturaArbol = alturaArbol;
        this.inmuebles = inmuebles;
    }

    public double getPrecioMinimo() {
        return precioMinimo;
    }

    public void setPrecioMinimo(double precioMinimo) {
        this.precioMinimo = precioMinimo;
    }

    public double getPrecioMaximo() {
        return precioMaximo;
    }

    public void setPrecioMaximo(double precioMaximo) {
        this.precioMaximo = precioMaximo;
    }

    public int getCantidadResultados() {
        return cantidadResultados;
    }

    public void setCantidadResultados(int cantidadResultados) {
        this.cantidadResultados = cantidadResultados;
    }

    public int getTotalNodosArbol() {
        return totalNodosArbol;
    }

    public void setTotalNodosArbol(int totalNodosArbol) {
        this.totalNodosArbol = totalNodosArbol;
    }

    public int getAlturaArbol() {
        return alturaArbol;
    }

    public void setAlturaArbol(int alturaArbol) {
        this.alturaArbol = alturaArbol;
    }

    public Inmueble[] getInmuebles() {
        return inmuebles;
    }

    public void setInmuebles(Inmueble[] inmuebles) {
        this.inmuebles = inmuebles;
    }
}
