package co.edu.uniquindio.backend.estructuras.hashTables;

/**
 * Tabla hash generica propia con manejo de colisiones por encadenamiento.
 *
 * <p>Justificacion en PropTech: se usa en reportes y agregaciones cuando el
 * sistema necesita acumular datos por clave, como conteos por estado, tipo o
 * categoria, evitando recorridos repetidos sobre toda la coleccion.</p>
 *
 * @param <K> tipo de clave
 * @param <V> tipo de valor asociado
 */
public class TablaHash<K, V> {

    private NodoHash<K, V>[] tabla;
    private int tamaño;

    @SuppressWarnings("unchecked")
    public TablaHash() {
        this.tabla = new NodoHash[101];
        this.tamaño = 0;
    }

    @SuppressWarnings("unchecked")
    public TablaHash(int capacidad) {
        this.tabla = new NodoHash[capacidad];
        this.tamaño = 0;
    }

    public int getTamaño() {
        return tamaño;
    }

    public int getTamano() {
        return tamaño;
    }

    public boolean estaVacia() {
        return tamaño == 0;
    }

    public void poner(K clave, V valor) {
        if (clave == null) {
            throw new IllegalArgumentException("La clave no puede ser null");
        }

        int indice = calcularIndice(clave);
        NodoHash<K, V> actual = tabla[indice];

        while (actual != null) {
            if (actual.getClave().equals(clave)) {
                actual.setValor(valor);
                return;
            }

            actual = actual.getSiguiente();
        }

        NodoHash<K, V> nuevoNodo = new NodoHash<>(clave, valor);
        nuevoNodo.setSiguiente(tabla[indice]);
        tabla[indice] = nuevoNodo;
        tamaño++;
    }

    public V obtener(K clave) {
        if (clave == null) {
            return null;
        }

        int indice = calcularIndice(clave);
        NodoHash<K, V> actual = tabla[indice];

        while (actual != null) {
            if (actual.getClave().equals(clave)) {
                return actual.getValor();
            }

            actual = actual.getSiguiente();
        }

        return null;
    }

    public boolean contieneClave(K clave) {
        return obtener(clave) != null;
    }

    public boolean eliminar(K clave) {
        if (clave == null) {
            return false;
        }

        int indice = calcularIndice(clave);
        NodoHash<K, V> actual = tabla[indice];
        NodoHash<K, V> anterior = null;

        while (actual != null) {
            if (actual.getClave().equals(clave)) {
                if (anterior == null) {
                    tabla[indice] = actual.getSiguiente();
                } else {
                    anterior.setSiguiente(actual.getSiguiente());
                }

                actual.setSiguiente(null);
                tamaño--;
                return true;
            }

            anterior = actual;
            actual = actual.getSiguiente();
        }

        return false;
    }

    public void limpiar() {
        for (int i = 0; i < tabla.length; i++) {
            tabla[i] = null;
        }

        tamaño = 0;
    }

    public void recorrer(RecorredorHash<K, V> recorredor) {
        if (recorredor == null) {
            return;
        }

        for (NodoHash<K, V> nodoHash : tabla) {
            NodoHash<K, V> actual = nodoHash;

            while (actual != null) {
                recorredor.procesar(actual.getClave(), actual.getValor());
                actual = actual.getSiguiente();
            }
        }
    }

    private int calcularIndice(K clave) {
        return (clave.hashCode() & 0x7fffffff) % tabla.length;
    }
}
