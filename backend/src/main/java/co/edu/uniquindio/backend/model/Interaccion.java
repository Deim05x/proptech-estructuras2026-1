package co.edu.uniquindio.backend.model;

import java.time.LocalDateTime;

public class Interaccion implements Comparable<Interaccion> {

    private int id;
    private String idCliente;
    private String codigoInmueble;
    private String tipoInteraccion;
    private LocalDateTime fecha;

    public Interaccion() {
    }

    public Interaccion(int id, String idCliente, String codigoInmueble, String tipoInteraccion, LocalDateTime fecha) {
        this.id = id;
        this.idCliente = idCliente;
        this.codigoInmueble = codigoInmueble;
        this.tipoInteraccion = tipoInteraccion;
        this.fecha = fecha;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getTipoInteraccion() {
        return tipoInteraccion;
    }

    public void setTipoInteraccion(String tipoInteraccion) {
        this.tipoInteraccion = tipoInteraccion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    @Override
    public int compareTo(Interaccion otra) {
        return Integer.compare(this.id, otra.id);
    }

    @Override
    public String toString() {
        return "Interaccion{" +
                "id=" + id +
                ", idCliente='" + idCliente + '\'' +
                ", codigoInmueble='" + codigoInmueble + '\'' +
                ", tipoInteraccion='" + tipoInteraccion + '\'' +
                ", fecha=" + fecha +
                '}';
    }
}