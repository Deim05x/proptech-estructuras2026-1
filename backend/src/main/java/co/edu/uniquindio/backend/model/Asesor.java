package co.edu.uniquindio.backend.model;

public class Asesor implements Comparable<Asesor> {

    private String id;
    private String nombre;
    private String contacto;
    private String especialidadZona;
    private int cantidadCierres;

    public Asesor() {
    }

    public Asesor(String id, String nombre, String contacto, String especialidadZona, int cantidadCierres) {
        this.id = id;
        this.nombre = nombre;
        this.contacto = contacto;
        this.especialidadZona = especialidadZona;
        this.cantidadCierres = cantidadCierres;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getContacto() {
        return contacto;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
    }

    public String getEspecialidadZona() {
        return especialidadZona;
    }

    public void setEspecialidadZona(String especialidadZona) {
        this.especialidadZona = especialidadZona;
    }

    public int getCantidadCierres() {
        return cantidadCierres;
    }

    public void setCantidadCierres(int cantidadCierres) {
        this.cantidadCierres = cantidadCierres;
    }

    @Override
    public int compareTo(Asesor otro) {
        return this.id.compareTo(otro.id);
    }

    @Override
    public String toString() {
        return "Asesor{" +
                "id='" + id + '\'' +
                ", nombre='" + nombre + '\'' +
                ", contacto='" + contacto + '\'' +
                ", especialidadZona='" + especialidadZona + '\'' +
                ", cantidadCierres=" + cantidadCierres +
                '}';
    }
}