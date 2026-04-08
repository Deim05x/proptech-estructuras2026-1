package co.edu.uniquindio.backend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Visita implements Comparable<Visita> {

    private int id;
    private String idCliente;
    private String codigoInmueble;
    private String idAsesor;
    private LocalDate fecha;
    private LocalTime hora;
    private String estado;
    private String observacion;

    public Visita() {
    }

    public Visita(int id, String idCliente, String codigoInmueble, String idAsesor,
            LocalDate fecha, LocalTime hora, String estado, String observacion) {
        this.id = id;
        this.idCliente = idCliente;
        this.codigoInmueble = codigoInmueble;
        this.idAsesor = idAsesor;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = estado;
        this.observacion = observacion;
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

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
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

    @Override
    public int compareTo(Visita otra) {
        return Integer.compare(this.id, otra.id);
    }

    @Override
    public String toString() {
        return "Visita{" +
                "id=" + id +
                ", idCliente='" + idCliente + '\'' +
                ", codigoInmueble='" + codigoInmueble + '\'' +
                ", idAsesor='" + idAsesor + '\'' +
                ", fecha=" + fecha +
                ", hora=" + hora +
                ", estado='" + estado + '\'' +
                ", observacion='" + observacion + '\'' +
                '}';
    }
}