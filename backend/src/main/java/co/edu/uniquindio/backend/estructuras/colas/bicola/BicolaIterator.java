package co.edu.uniquindio.backend.estructuras.colas.bicola;

import java.util.Iterator;

/**
 * Iterador para la estructura Bicola (ambas direcciones)
 * @param <T> Tipo de datos a iterar
 */
public class BicolaIterator<T> implements Iterator<T> {
    private NodoBicola<T> actual;
    private boolean haciaAdelante;

    /**
     * Constructor del iterador (por defecto hacia adelante)
     * @param inicio El primer nodo de la bicola
     */
    public BicolaIterator(NodoBicola<T> inicio) {
        this.actual = inicio;
        this.haciaAdelante = true;
    }

    /**
     * Constructor del iterador con dirección especificada
     * @param inicio El nodo inicial
     * @param haciaAdelante true para iterar hacia adelante, false hacia atrás
     */
    public BicolaIterator(NodoBicola<T> inicio, boolean haciaAdelante) {
        this.actual = inicio;
        this.haciaAdelante = haciaAdelante;
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
            throw new java.util.NoSuchElementException("No hay más elementos en la bicola");
        }
        
        T dato = actual.getDato();
        
        if (haciaAdelante) {
            actual = actual.getSiguiente();
        } else {
            actual = actual.getAnterior();
        }
        
        return dato;
    }
}
