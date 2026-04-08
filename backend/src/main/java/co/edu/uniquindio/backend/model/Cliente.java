package co.edu.uniquindio.backend.model;

public class Cliente implements Comparable<Cliente> {

    private String id;
    private String nombre;
    private String correo;
    private String telefono;
    private String tipoCliente;
    private double presupuesto;
    private String zonasInteres;
    private String tipoInmuebleDeseado;
    private int habitacionesMinimas;
    private String estadoBusqueda;

    public Cliente() {
    }

    public Cliente(String id, String nombre, String correo, String telefono,
            String tipoCliente, double presupuesto, String zonasInteres,
            String tipoInmuebleDeseado, int habitacionesMinimas,
            String estadoBusqueda) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.tipoCliente = tipoCliente;
        this.presupuesto = presupuesto;
        this.zonasInteres = zonasInteres;
        this.tipoInmuebleDeseado = tipoInmuebleDeseado;
        this.habitacionesMinimas = habitacionesMinimas;
        this.estadoBusqueda = estadoBusqueda;
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

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getTipoCliente() {
        return tipoCliente;
    }

    public void setTipoCliente(String tipoCliente) {
        this.tipoCliente = tipoCliente;
    }

    public double getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(double presupuesto) {
        this.presupuesto = presupuesto;
    }

    public String getZonasInteres() {
        return zonasInteres;
    }

    public void setZonasInteres(String zonasInteres) {
        this.zonasInteres = zonasInteres;
    }

    public String getTipoInmuebleDeseado() {
        return tipoInmuebleDeseado;
    }

    public void setTipoInmuebleDeseado(String tipoInmuebleDeseado) {
        this.tipoInmuebleDeseado = tipoInmuebleDeseado;
    }

    public int getHabitacionesMinimas() {
        return habitacionesMinimas;
    }

    public void setHabitacionesMinimas(int habitacionesMinimas) {
        this.habitacionesMinimas = habitacionesMinimas;
    }

    public String getEstadoBusqueda() {
        return estadoBusqueda;
    }

    public void setEstadoBusqueda(String estadoBusqueda) {
        this.estadoBusqueda = estadoBusqueda;
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "id='" + id + '\'' +
                ", nombre='" + nombre + '\'' +
                ", correo='" + correo + '\'' +
                ", telefono='" + telefono + '\'' +
                ", tipoCliente='" + tipoCliente + '\'' +
                ", presupuesto=" + presupuesto +
                ", zonasInteres='" + zonasInteres + '\'' +
                ", tipoInmuebleDeseado='" + tipoInmuebleDeseado + '\'' +
                ", habitacionesMinimas=" + habitacionesMinimas +
                ", estadoBusqueda='" + estadoBusqueda + '\'' +
                '}';
    }

    @Override
    public int compareTo(Cliente otro) {
        return this.id.compareTo(otro.id);
    }
}