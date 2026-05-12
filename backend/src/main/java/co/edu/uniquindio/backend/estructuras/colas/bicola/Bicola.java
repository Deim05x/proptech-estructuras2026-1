package co.edu.uniquindio.backend.estructuras.colas.bicola;

import java.util.Iterator;

/**
 * Bicola propia que permite insertar y extraer por ambos extremos.
 *
 * <p>Justificacion en PropTech: queda disponible para procesos donde una
 * agenda o flujo de atencion necesite agregar y retirar elementos tanto por el
 * frente como por el final, manteniendo una estructura propia y controlada.</p>
 *
 * @param <T> tipo de dato almacenado en la bicola
 */
public class Bicola<T> implements Iterable<T> {
    private NodoBicola<T> inicio;
    private NodoBicola<T> fin;
    private int tamaño;

    /**
     * Constructor de la bicola
     */
    public Bicola() {
        this.inicio = null;
        this.fin = null;
        this.tamaño = 0;
    }

    /**
     * Verifica si la bicola está vacía
     * @return true si está vacía, false en caso contrario
     */
    public boolean estaVacia() {
        return tamaño == 0;
    }

    /**
     * Obtiene el tamaño de la bicola
     * @return El número de elementos en la bicola
     */
    public int getTamaño() {
        return tamaño;
    }

    /**
     * Añade un elemento al inicio de la bicola
     * @param dato El dato a añadir
     */
    public void agregarInicio(T dato) {
        NodoBicola<T> nuevoNodo = new NodoBicola<>(dato);
        
        if (estaVacia()) {
            inicio = nuevoNodo;
            fin = nuevoNodo;
        } else {
            nuevoNodo.setSiguiente(inicio);
            inicio.setAnterior(nuevoNodo);
            inicio = nuevoNodo;
        }
        
        tamaño++;
    }

    /**
     * Añade un elemento al final de la bicola
     * @param dato El dato a añadir
     */
    public void agregarFin(T dato) {
        NodoBicola<T> nuevoNodo = new NodoBicola<>(dato);
        
        if (estaVacia()) {
            inicio = nuevoNodo;
            fin = nuevoNodo;
        } else {
            fin.setSiguiente(nuevoNodo);
            nuevoNodo.setAnterior(fin);
            fin = nuevoNodo;
        }
        
        tamaño++;
    }

    /**
     * Extrae un elemento del inicio de la bicola
     * @return El dato del primer elemento
     * @throws IllegalStateException si la bicola está vacía
     */
    public T extraerInicio() {
        if (estaVacia()) {
            throw new IllegalStateException("La bicola está vacía");
        }
        
        T dato = inicio.getDato();
        
        if (tamaño == 1) {
            inicio = null;
            fin = null;
        } else {
            inicio = inicio.getSiguiente();
            inicio.setAnterior(null);
        }
        
        tamaño--;
        return dato;
    }

    /**
     * Extrae un elemento del final de la bicola
     * @return El dato del último elemento
     * @throws IllegalStateException si la bicola está vacía
     */
    public T extraerFin() {
        if (estaVacia()) {
            throw new IllegalStateException("La bicola está vacía");
        }
        
        T dato = fin.getDato();
        
        if (tamaño == 1) {
            inicio = null;
            fin = null;
        } else {
            fin = fin.getAnterior();
            fin.setSiguiente(null);
        }
        
        tamaño--;
        return dato;
    }

    /**
     * Obtiene el primer elemento sin extraer
     * @return El dato del primer elemento
     * @throws IllegalStateException si la bicola está vacía
     */
    public T obtenerInicio() {
        if (estaVacia()) {
            throw new IllegalStateException("La bicola está vacía");
        }
        return inicio.getDato();
    }

    /**
     * Obtiene el último elemento sin extraer
     * @return El dato del último elemento
     * @throws IllegalStateException si la bicola está vacía
     */
    public T obtenerFin() {
        if (estaVacia()) {
            throw new IllegalStateException("La bicola está vacía");
        }
        return fin.getDato();
    }

    /**
     * Vacía la bicola
     */
    public void vaciar() {
        inicio = null;
        fin = null;
        tamaño = 0;
    }

    /**
     * Retorna un iterador sobre la bicola (hacia adelante)
     * @return Un BicolaIterator hacia adelante
     */
    @Override
    public Iterator<T> iterator() {
        return new BicolaIterator<>(inicio, true);
    }

    /**
     * Retorna un iterador sobre la bicola (hacia atrás)
     * @return Un BicolaIterator hacia atrás
     */
    public Iterator<T> iteratorReverso() {
        return new BicolaIterator<>(fin, false);
    }

    /**
     * Representación en string de la bicola
     * @return String con los elementos de la bicola
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Bicola[");
        NodoBicola<T> actual = inicio;
        
        while (actual != null) {
            sb.append(actual.getDato());
            if (actual.getSiguiente() != null) {
                sb.append(" <-> ");
            }
            actual = actual.getSiguiente();
        }
        
        sb.append("]");
        return sb.toString();
    }
}
