package co.edu.uniquindio.backend.estructuras.hashTables;

/**
 * Nodo genérico para una tabla hash con manejo de colisiones por encadenamiento.
 *
 * @param <K> Tipo de la clave
 * @param <V> Tipo del valor
 */
public class NodoHash<K, V> {

    private K clave;
    private V valor;
    private NodoHash<K, V> siguiente;

    public NodoHash(K clave, V valor) {
        this.clave = clave;
        this.valor = valor;
        this.siguiente = null;
    }

    public K getClave() {
        return clave;
    }

    public void setClave(K clave) {
        this.clave = clave;
    }

    public V getValor() {
        return valor;
    }

    public void setValor(V valor) {
        this.valor = valor;
    }

    public NodoHash<K, V> getSiguiente() {
        return siguiente;
    }

    public void setSiguiente(NodoHash<K, V> siguiente) {
        this.siguiente = siguiente;
    }
}