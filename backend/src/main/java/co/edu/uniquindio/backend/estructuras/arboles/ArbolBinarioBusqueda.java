package co.edu.uniquindio.backend.estructuras.arboles;

/**
 * Arbol binario de busqueda generico para elementos comparables.
 *
 * <p>Justificacion en PropTech: organiza elementos comparables para entregar
 * resultados ascendentes o descendentes, especialmente en ordenamientos
 * comerciales de inmuebles por precio, demanda u otros criterios medibles.</p>
 *
 * @param <T> tipo de dato comparable
 */
public class ArbolBinarioBusqueda<T extends Comparable<T>> {

    private NodoArbol<T> raiz;
    private int tamanio;

    public ArbolBinarioBusqueda() {
        this.raiz = null;
        this.tamanio = 0;
    }

    public boolean estaVacio() {
        return raiz == null;
    }

    public int getTamanio() {
        return tamanio;
    }

    public void insertar(T dato) {
        if (dato == null) {
            return;
        }

        raiz = insertarRecursivo(raiz, dato);
        tamanio++;
    }

    private NodoArbol<T> insertarRecursivo(NodoArbol<T> actual, T dato) {
        if (actual == null) {
            return new NodoArbol<>(dato);
        }

        int comparacion = dato.compareTo(actual.getDato());

        if (comparacion < 0) {
            actual.setIzquierdo(insertarRecursivo(actual.getIzquierdo(), dato));
        } else {
            actual.setDerecho(insertarRecursivo(actual.getDerecho(), dato));
        }

        return actual;
    }

    public boolean contiene(T dato) {
        return contieneRecursivo(raiz, dato);
    }

    private boolean contieneRecursivo(NodoArbol<T> actual, T dato) {
        if (actual == null || dato == null) {
            return false;
        }

        int comparacion = dato.compareTo(actual.getDato());

        if (comparacion == 0) {
            return true;
        }

        if (comparacion < 0) {
            return contieneRecursivo(actual.getIzquierdo(), dato);
        }

        return contieneRecursivo(actual.getDerecho(), dato);
    }

    public void llenarInOrdenAscendente(T[] arreglo) {
        int[] posicion = {0};
        llenarInOrdenAscendenteRecursivo(raiz, arreglo, posicion);
    }

    private void llenarInOrdenAscendenteRecursivo(
            NodoArbol<T> actual,
            T[] arreglo,
            int[] posicion
    ) {
        if (actual == null) {
            return;
        }

        llenarInOrdenAscendenteRecursivo(actual.getIzquierdo(), arreglo, posicion);

        if (posicion[0] < arreglo.length) {
            arreglo[posicion[0]] = actual.getDato();
            posicion[0]++;
        }

        llenarInOrdenAscendenteRecursivo(actual.getDerecho(), arreglo, posicion);
    }

    public void llenarInOrdenDescendente(T[] arreglo) {
        int[] posicion = {0};
        llenarInOrdenDescendenteRecursivo(raiz, arreglo, posicion);
    }

    private void llenarInOrdenDescendenteRecursivo(
            NodoArbol<T> actual,
            T[] arreglo,
            int[] posicion
    ) {
        if (actual == null) {
            return;
        }

        llenarInOrdenDescendenteRecursivo(actual.getDerecho(), arreglo, posicion);

        if (posicion[0] < arreglo.length) {
            arreglo[posicion[0]] = actual.getDato();
            posicion[0]++;
        }

        llenarInOrdenDescendenteRecursivo(actual.getIzquierdo(), arreglo, posicion);
    }

    public int calcularAltura() {
        return calcularAlturaRecursivo(raiz);
    }

    private int calcularAlturaRecursivo(NodoArbol<T> actual) {
        if (actual == null) {
            return 0;
        }

        int alturaIzquierda = calcularAlturaRecursivo(actual.getIzquierdo());
        int alturaDerecha = calcularAlturaRecursivo(actual.getDerecho());

        return Math.max(alturaIzquierda, alturaDerecha) + 1;
    }

    public void limpiar() {
        raiz = null;
        tamanio = 0;
    }
}
