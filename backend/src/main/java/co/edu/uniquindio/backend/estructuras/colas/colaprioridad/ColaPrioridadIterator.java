package co.edu.uniquindio.backend.estructuras.colas.colaprioridad;

import java.util.Iterator;

/**
 * Iterador para la estructura Cola de Prioridad
 * @param <T> Tipo de datos a iterar
 */
public class ColaPrioridadIterator<T> implements Iterator<T> {
    private NodoPrioridad<T> actual;

    /**
     * Constructor del iterador
     * @param inicio El primer nodo de la cola de prioridad
     */
    public ColaPrioridadIterator(NodoPrioridad<T> inicio) {
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
            throw new java.util.NoSuchElementException("No hay más elementos en la cola de prioridad");
        }
        T dato = actual.getDato();
        actual = actual.getSiguiente();
        return dato;
    }
}
