package co.edu.uniquindio.backend.estructuras.pilas;

/**
 * Nodo genérico para la estructura Pila.
 *
 * @param <T> tipo de dato almacenado
 */
public class NodoPila<T> {

    private T dato;
    private NodoPila<T> siguiente;

    public NodoPila(T dato) {
        this.dato = dato;
        this.siguiente = null;
    }

    public T getDato() {
        return dato;
    }

    public void setDato(T dato) {
        this.dato = dato;
    }

    public NodoPila<T> getSiguiente() {
        return siguiente;
    }

    public void setSiguiente(NodoPila<T> siguiente) {
        this.siguiente = siguiente;
    }
}