package co.edu.uniquindio.backend.dto;

public class BusquedaHashDTO {

    private String tipoBusqueda;
    private String claveBuscada;
    private boolean encontrado;
    private Object resultado;

    private int indiceHash;
    private int capacidadTabla;
    private int totalElementos;
    private int cubetasOcupadas;
    private int colisiones;
    private double factorCarga;
    private int elementosEnCubeta;

    private String mensaje;

    public BusquedaHashDTO() {
    }

    public BusquedaHashDTO(
            String tipoBusqueda,
            String claveBuscada,
            boolean encontrado,
            Object resultado,
            int indiceHash,
            int capacidadTabla,
            int totalElementos,
            int cubetasOcupadas,
            int colisiones,
            double factorCarga,
            int elementosEnCubeta,
            String mensaje
    ) {
        this.tipoBusqueda = tipoBusqueda;
        this.claveBuscada = claveBuscada;
        this.encontrado = encontrado;
        this.resultado = resultado;
        this.indiceHash = indiceHash;
        this.capacidadTabla = capacidadTabla;
        this.totalElementos = totalElementos;
        this.cubetasOcupadas = cubetasOcupadas;
        this.colisiones = colisiones;
        this.factorCarga = factorCarga;
        this.elementosEnCubeta = elementosEnCubeta;
        this.mensaje = mensaje;
    }

    public String getTipoBusqueda() {
        return tipoBusqueda;
    }

    public void setTipoBusqueda(String tipoBusqueda) {
        this.tipoBusqueda = tipoBusqueda;
    }

    public String getClaveBuscada() {
        return claveBuscada;
    }

    public void setClaveBuscada(String claveBuscada) {
        this.claveBuscada = claveBuscada;
    }

    public boolean isEncontrado() {
        return encontrado;
    }

    public void setEncontrado(boolean encontrado) {
        this.encontrado = encontrado;
    }

    public Object getResultado() {
        return resultado;
    }

    public void setResultado(Object resultado) {
        this.resultado = resultado;
    }

    public int getIndiceHash() {
        return indiceHash;
    }

    public void setIndiceHash(int indiceHash) {
        this.indiceHash = indiceHash;
    }

    public int getCapacidadTabla() {
        return capacidadTabla;
    }

    public void setCapacidadTabla(int capacidadTabla) {
        this.capacidadTabla = capacidadTabla;
    }

    public int getTotalElementos() {
        return totalElementos;
    }

    public void setTotalElementos(int totalElementos) {
        this.totalElementos = totalElementos;
    }

    public int getCubetasOcupadas() {
        return cubetasOcupadas;
    }

    public void setCubetasOcupadas(int cubetasOcupadas) {
        this.cubetasOcupadas = cubetasOcupadas;
    }

    public int getColisiones() {
        return colisiones;
    }

    public void setColisiones(int colisiones) {
        this.colisiones = colisiones;
    }

    public double getFactorCarga() {
        return factorCarga;
    }

    public void setFactorCarga(double factorCarga) {
        this.factorCarga = factorCarga;
    }

    public int getElementosEnCubeta() {
        return elementosEnCubeta;
    }

    public void setElementosEnCubeta(int elementosEnCubeta) {
        this.elementosEnCubeta = elementosEnCubeta;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}