package co.edu.uniquindio.backend.model;

public class Inmueble implements Comparable<Inmueble> {

    private String codigo;
    private String direccion;
    private String ciudad;
    private String barrioZona;
    private String tipoInmueble;
    private String finalidad;
    private double precio;
    private double area;
    private int habitaciones;
    private int banos;
    private String estado;
    private boolean disponible;
    private String idAsesorResponsable;
    private String imagenUrl;

    public Inmueble() {
    }

    public Inmueble(String codigo, String direccion, String ciudad, String barrioZona,
            String tipoInmueble, String finalidad, double precio, double area,
            int habitaciones, int banos, String estado, boolean disponible,
            String idAsesorResponsable, String imagenUrl) {
        this.codigo = codigo;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.barrioZona = barrioZona;
        this.tipoInmueble = tipoInmueble;
        this.finalidad = finalidad;
        this.precio = precio;
        this.area = area;
        this.habitaciones = habitaciones;
        this.banos = banos;
        this.estado = estado;
        this.disponible = disponible;
        this.idAsesorResponsable = idAsesorResponsable;
        this.imagenUrl = imagenUrl;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getBarrioZona() {
        return barrioZona;
    }

    public void setBarrioZona(String barrioZona) {
        this.barrioZona = barrioZona;
    }

    public String getTipoInmueble() {
        return tipoInmueble;
    }

    public void setTipoInmueble(String tipoInmueble) {
        this.tipoInmueble = tipoInmueble;
    }

    public String getFinalidad() {
        return finalidad;
    }

    public void setFinalidad(String finalidad) {
        this.finalidad = finalidad;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

    public int getHabitaciones() {
        return habitaciones;
    }

    public void setHabitaciones(int habitaciones) {
        this.habitaciones = habitaciones;
    }

    public int getBanos() {
        return banos;
    }

    public void setBanos(int banos) {
        this.banos = banos;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public String getIdAsesorResponsable() {
        return idAsesorResponsable;
    }

    public void setIdAsesorResponsable(String idAsesorResponsable) {
        this.idAsesorResponsable = idAsesorResponsable;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    @Override
    public String toString() {
        return "Inmueble{" +
                "codigo='" + codigo + '\'' +
                ", direccion='" + direccion + '\'' +
                ", ciudad='" + ciudad + '\'' +
                ", barrioZona='" + barrioZona + '\'' +
                ", tipoInmueble='" + tipoInmueble + '\'' +
                ", finalidad='" + finalidad + '\'' +
                ", precio=" + precio +
                ", area=" + area +
                ", habitaciones=" + habitaciones +
                ", banos=" + banos +
                ", estado='" + estado + '\'' +
                ", disponible=" + disponible +
                ", idAsesorResponsable='" + idAsesorResponsable + '\'' +
                ", imagenUrl='" + imagenUrl + '\'' +
                '}';
    }

    @Override
    public int compareTo(Inmueble otro) {
        return this.codigo.compareTo(otro.codigo);
    }
}
