package co.edu.uniquindio.backend.estructuras.hashTables;

public class EntradaHash<K, V> {

    private K clave;
    private V valor;
    private EntradaHash<K, V> siguiente;

    public EntradaHash(K clave, V valor) {
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

    public EntradaHash<K, V> getSiguiente() {
        return siguiente;
    }

    public void setSiguiente(EntradaHash<K, V> siguiente) {
        this.siguiente = siguiente;
    }
}