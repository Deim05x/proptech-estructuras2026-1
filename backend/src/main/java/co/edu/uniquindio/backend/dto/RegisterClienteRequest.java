package co.edu.uniquindio.backend.dto;

public class RegisterClienteRequest {

    private String username;
    private String password;

    private String nombre;
    private String correo;
    private String telefono;
    private String tipoCliente;
    private double presupuesto;
    private String zonasInteres;
    private String tipoInmuebleDeseado;
    private int habitacionesMinimas;

    public RegisterClienteRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}