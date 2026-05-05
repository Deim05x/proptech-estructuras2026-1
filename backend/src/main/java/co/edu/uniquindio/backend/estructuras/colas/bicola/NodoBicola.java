package co.edu.uniquindio.backend.estructuras.colas.bicola;

/**
 * Clase genérica Nodo para la estructura Bicola
 * @param <T> Tipo de datos del nodo
 */
public class NodoBicola<T> {
    private T dato;
    private NodoBicola<T> siguiente;
    private NodoBicola<T> anterior;

    /**
     * Constructor del nodo
     * @param dato El dato a almacenar
     */
    public NodoBicola(T dato) {
        this.dato = dato;
        this.siguiente = null;
        this.anterior = null;
    }

    /**
     * Obtiene el dato del nodo
     * @return El dato almacenado
     */
    public T getDato() {
        return dato;
    }

    /**
     * Establece el dato del nodo
     * @param dato El dato a establecer
     */
    public void setDato(T dato) {
        this.dato = dato;
    }

    /**
     * Obtiene el siguiente nodo
     * @return El siguiente nodo
     */
    public NodoBicola<T> getSiguiente() {
        return siguiente;
    }

    /**
     * Establece el siguiente nodo
     * @param siguiente El nodo siguiente
     */
    public void setSiguiente(NodoBicola<T> siguiente) {
        this.siguiente = siguiente;
    }

    /**
     * Obtiene el nodo anterior
     * @return El nodo anterior
     */
    public NodoBicola<T> getAnterior() {
        return anterior;
    }

    /**
     * Establece el nodo anterior
     * @param anterior El nodo anterior
     */
    public void setAnterior(NodoBicola<T> anterior) {
        this.anterior = anterior;
    }
}
