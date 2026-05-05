package co.edu.uniquindio.backend.estructuras.colas.colaprioridad;

/**
 * Nodo para Cola de Prioridad.
 * Guarda el dato y un valor numérico de prioridad.
 *
 * Mayor número = mayor prioridad.
 */
public class NodoPrioridad<T> {

    private T dato;
    private int prioridad;
    private NodoPrioridad<T> siguiente;

    public NodoPrioridad(T dato, int prioridad) {
        this.dato = dato;
        this.prioridad = prioridad;
        this.siguiente = null;
    }

    public T getDato() {
        return dato;
    }

    public void setDato(T dato) {
        this.dato = dato;
    }

    public int getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(int prioridad) {
        this.prioridad = prioridad;
    }

    public NodoPrioridad<T> getSiguiente() {
        return siguiente;
    }

    public void setSiguiente(NodoPrioridad<T> siguiente) {
        this.siguiente = siguiente;
    }
}