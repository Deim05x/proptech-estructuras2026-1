package co.edu.uniquindio.backend.estructuras.colas.colaprioridad;

/**
 * Cola propia que conserva primero los elementos con mayor prioridad numerica.
 *
 * <p>Justificacion en PropTech: permite atender primero solicitudes de alta
 * intencion comercial, como compra o arriendo, sin perder el control explicito
 * de la prioridad asignada por las reglas de negocio.</p>
 *
 * @param <T> tipo de dato almacenado en la cola de prioridad
 */
public class ColaPrioridad<T> {

    private NodoPrioridad<T> inicio;
    private int tamaño;

    public ColaPrioridad() {
        this.inicio = null;
        this.tamaño = 0;
    }

    public boolean estaVacia() {
        return tamaño == 0;
    }

    public int getTamaño() {
        return tamaño;
    }

    public int getTamano() {
        return tamaño;
    }

    public void encolar(T dato, int prioridad) {
        NodoPrioridad<T> nuevoNodo = new NodoPrioridad<>(dato, prioridad);

        if (estaVacia() || prioridad > inicio.getPrioridad()) {
            nuevoNodo.setSiguiente(inicio);
            inicio = nuevoNodo;
        } else {
            NodoPrioridad<T> actual = inicio;

            while (
                    actual.getSiguiente() != null &&
                    actual.getSiguiente().getPrioridad() >= prioridad
            ) {
                actual = actual.getSiguiente();
            }

            nuevoNodo.setSiguiente(actual.getSiguiente());
            actual.setSiguiente(nuevoNodo);
        }

        tamaño++;
    }

    public T desencolar() {
        if (estaVacia()) {
            throw new IllegalStateException("La cola de prioridad está vacía");
        }

        T dato = inicio.getDato();
        inicio = inicio.getSiguiente();
        tamaño--;

        return dato;
    }

    public T frente() {
        if (estaVacia()) {
            throw new IllegalStateException("La cola de prioridad está vacía");
        }

        return inicio.getDato();
    }

    public void vaciar() {
        inicio = null;
        tamaño = 0;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("ColaPrioridad[");
        NodoPrioridad<T> actual = inicio;

        while (actual != null) {
            sb.append("{dato=")
                    .append(actual.getDato())
                    .append(", prioridad=")
                    .append(actual.getPrioridad())
                    .append("}");

            if (actual.getSiguiente() != null) {
                sb.append(", ");
            }

            actual = actual.getSiguiente();
        }

        sb.append("]");
        return sb.toString();
    }
}
