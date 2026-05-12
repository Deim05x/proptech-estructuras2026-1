package co.edu.uniquindio.backend.estructuras.arboles;

import co.edu.uniquindio.backend.model.Inmueble;

public class NodoArbolPrecio {

    private Inmueble inmueble;
    private NodoArbolPrecio izquierdo;
    private NodoArbolPrecio derecho;

    public NodoArbolPrecio(Inmueble inmueble) {
        this.inmueble = inmueble;
        this.izquierdo = null;
        this.derecho = null;
    }

    public Inmueble getInmueble() {
        return inmueble;
    }

    public void setInmueble(Inmueble inmueble) {
        this.inmueble = inmueble;
    }

    public NodoArbolPrecio getIzquierdo() {
        return izquierdo;
    }

    public void setIzquierdo(NodoArbolPrecio izquierdo) {
        this.izquierdo = izquierdo;
    }

    public NodoArbolPrecio getDerecho() {
        return derecho;
    }

    public void setDerecho(NodoArbolPrecio derecho) {
        this.derecho = derecho;
    }
}