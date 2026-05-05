package co.edu.uniquindio.backend.estructuras.colas.cola;

/**
 * Clase genérica Nodo para la estructura Cola
 * @param <T> Tipo de datos del nodo
 */
public class Nodo<T> {
    private T dato;
    private Nodo<T> siguiente;

    /**
     * Constructor del nodo
     * @param dato El dato a almacenar
     */
    public Nodo(T dato) {
        this.dato = dato;
        this.siguiente = null;
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
    public Nodo<T> getSiguiente() {
        return siguiente;
    }

    /**
     * Establece el siguiente nodo
     * @param siguiente El nodo siguiente
     */
    public void setSiguiente(Nodo<T> siguiente) {
        this.siguiente = siguiente;
    }
}
