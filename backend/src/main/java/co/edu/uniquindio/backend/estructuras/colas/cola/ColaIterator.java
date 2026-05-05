package co.edu.uniquindio.backend.estructuras.colas.cola;

import java.util.Iterator;

/**
 * Iterador para la estructura Cola
 * @param <T> Tipo de datos a iterar
 */
public class ColaIterator<T> implements Iterator<T> {
    private Nodo<T> actual;

    /**
     * Constructor del iterador
     * @param inicio El primer nodo de la cola
     */
    public ColaIterator(Nodo<T> inicio) {
        this.actual = inicio;
    }

    /**
     * Verifica si hay un próximo elemento
     * @return true si existe un próximo elemento, false en caso contrario
     */
    @Override
    public boolean hasNext() {
        return actual != null;
    }

    /**
     * Obtiene el próximo elemento
     * @return El próximo elemento
     */
    @Override
    public T next() {
        if (!hasNext()) {
            throw new java.util.NoSuchElementException("No hay más elementos en la cola");
        }
        T dato = actual.getDato();
        actual = actual.getSiguiente();
        return dato;
    }
}
