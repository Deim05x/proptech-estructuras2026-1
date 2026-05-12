package co.edu.uniquindio.backend.estructuras.pilas;

/**
 * Pila propia LIFO: el ultimo elemento apilado es el primero en salir.
 *
 * <p>Justificacion en PropTech: se usa para consultar historial en sentido
 * inverso, por ejemplo ultimas propiedades revisadas por un cliente. La ultima
 * actividad registrada queda disponible primero.</p>
 *
 * @param <T> tipo de dato almacenado en la pila
 */
public class Pila<T> {

    private NodoPila<T> cima;
    private int tamaño;

    public Pila() {
        this.cima = null;
        this.tamaño = 0;
    }

    public boolean estaVacia() {
        return cima == null;
    }

    public int getTamaño() {
        return tamaño;
    }

    public int getTamanio() {
        return tamaño;
    }

    public void apilar(T dato) {
        NodoPila<T> nuevoNodo = new NodoPila<>(dato);

        nuevoNodo.setSiguiente(cima);
        cima = nuevoNodo;

        tamaño++;
    }

    public T desapilar() {
        if (estaVacia()) {
            throw new IllegalStateException("La pila está vacía");
        }

        T dato = cima.getDato();
        cima = cima.getSiguiente();
        tamaño--;

        return dato;
    }

    public T cima() {
        if (estaVacia()) {
            throw new IllegalStateException("La pila está vacía");
        }

        return cima.getDato();
    }

    public void vaciar() {
        cima = null;
        tamaño = 0;
    }
}
