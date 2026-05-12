package co.edu.uniquindio.backend.estructuras.colas.cola;

import java.util.Iterator;

/**
 * Cola FIFO propia para procesar elementos en orden de llegada.
 *
 * <p>Justificacion en PropTech: modela la atencion de solicitudes pendientes
 * cuando se debe respetar el turno de registro y todas comparten la misma
 * urgencia operativa.</p>
 *
 * @param <T> tipo de dato almacenado en la cola
 */
public class Cola<T> implements Iterable<T> {
    private Nodo<T> inicio;
    private Nodo<T> fin;
    private int tamaño;

    /**
     * Constructor de la cola
     */
    public Cola() {
        this.inicio = null;
        this.fin = null;
        this.tamaño = 0;
    }

    /**
     * Verifica si la cola está vacía
     * @return true si está vacía, false en caso contrario
     */
    public boolean estaVacia() {
        return tamaño == 0;
    }

    /**
     * Obtiene el tamaño de la cola
     * @return El número de elementos en la cola
     */
    public int getTamaño() {
        return tamaño;
    }

    public int getTamano() {
        return tamaño;
    }

    /**
     * Encola un elemento (lo añade al final)
     * @param dato El dato a encolar
     */
    public void encolar(T dato) {
        Nodo<T> nuevoNodo = new Nodo<>(dato);
        
        if (estaVacia()) {
            inicio = nuevoNodo;
        } else {
            fin.setSiguiente(nuevoNodo);
        }
        
        fin = nuevoNodo;
        tamaño++;
    }

    /**
     * Desencola un elemento (lo extrae del inicio)
     * @return El dato del primer elemento
     * @throws IllegalStateException si la cola está vacía
     */
    public T desencolar() {
        if (estaVacia()) {
            throw new IllegalStateException("La cola está vacía");
        }
        
        T dato = inicio.getDato();
        inicio = inicio.getSiguiente();
        tamaño--;
        
        if (estaVacia()) {
            fin = null;
        }
        
        return dato;
    }

    /**
     * Obtiene el primer elemento sin desencolar
     * @return El dato del primer elemento
     * @throws IllegalStateException si la cola está vacía
     */
    public T frente() {
        if (estaVacia()) {
            throw new IllegalStateException("La cola está vacía");
        }
        return inicio.getDato();
    }

    /**
     * Vacía la cola
     */
    public void vaciar() {
        inicio = null;
        fin = null;
        tamaño = 0;
    }

    /**
     * Retorna un iterador sobre la cola
     * @return Un ColaIterator
     */
    @Override
    public Iterator<T> iterator() {
        return new ColaIterator<>(inicio);
    }

    /**
     * Representación en string de la cola
     * @return String con los elementos de la cola
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Cola[");
        Nodo<T> actual = inicio;
        
        while (actual != null) {
            sb.append(actual.getDato());
            if (actual.getSiguiente() != null) {
                sb.append(", ");
            }
            actual = actual.getSiguiente();
        }
        
        sb.append("]");
        return sb.toString();
    }
}
