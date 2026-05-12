package co.edu.uniquindio.backend.estructuras.hashTables;

/**
 * Tabla hash propia con encadenamiento separado y metricas de uso.
 *
 * <p>Justificacion en PropTech: permite busquedas directas por identificador
 * de cliente, inmueble o asesor, y tambien evita duplicados al generar alertas
 * comerciales. Sus metricas de colisiones, cubetas ocupadas y factor de carga
 * ayudan a explicar el comportamiento de la estructura.</p>
 *
 * @param <K> tipo de clave
 * @param <V> tipo de valor asociado
 */
public class TablaHashPropia<K, V> {

    private EntradaHash<K, V>[] tabla;
    private int capacidad;
    private int cantidadElementos;
    private int colisiones;

    @SuppressWarnings("unchecked")
    public TablaHashPropia(int capacidad) {
        this.capacidad = capacidad;
        this.cantidadElementos = 0;
        this.colisiones = 0;
        this.tabla = new EntradaHash[capacidad];
    }

    private int calcularIndice(K clave) {
        if (clave == null) {
            return 0;
        }

        return Math.abs(clave.hashCode()) % capacidad;
    }

    public void insertar(K clave, V valor) {
        int indice = calcularIndice(clave);

        EntradaHash<K, V> nuevaEntrada = new EntradaHash<>(clave, valor);

        if (tabla[indice] == null) {
            tabla[indice] = nuevaEntrada;
            cantidadElementos++;
            return;
        }

        colisiones++;

        EntradaHash<K, V> actual = tabla[indice];

        while (actual != null) {
            if (actual.getClave().equals(clave)) {
                actual.setValor(valor);
                return;
            }

            if (actual.getSiguiente() == null) {
                break;
            }

            actual = actual.getSiguiente();
        }

        actual.setSiguiente(nuevaEntrada);
        cantidadElementos++;
    }

    public V buscar(K clave) {
        int indice = calcularIndice(clave);

        EntradaHash<K, V> actual = tabla[indice];

        while (actual != null) {
            if (actual.getClave().equals(clave)) {
                return actual.getValor();
            }

            actual = actual.getSiguiente();
        }

        return null;
    }

    public boolean contieneClave(K clave) {
        return buscar(clave) != null;
    }

    public boolean eliminar(K clave) {
        int indice = calcularIndice(clave);

        EntradaHash<K, V> actual = tabla[indice];
        EntradaHash<K, V> anterior = null;

        while (actual != null) {
            if (actual.getClave().equals(clave)) {
                if (anterior == null) {
                    tabla[indice] = actual.getSiguiente();
                } else {
                    anterior.setSiguiente(actual.getSiguiente());
                }

                cantidadElementos--;
                return true;
            }

            anterior = actual;
            actual = actual.getSiguiente();
        }

        return false;
    }

    public int contarElementosEnIndice(int indice) {
        if (indice < 0 || indice >= capacidad) {
            return 0;
        }

        int contador = 0;
        EntradaHash<K, V> actual = tabla[indice];

        while (actual != null) {
            contador++;
            actual = actual.getSiguiente();
        }

        return contador;
    }

    public int contarCubetasOcupadas() {
        int ocupadas = 0;

        for (int i = 0; i < capacidad; i++) {
            if (tabla[i] != null) {
                ocupadas++;
            }
        }

        return ocupadas;
    }

    public int obtenerIndice(K clave) {
        return calcularIndice(clave);
    }

    public int getCapacidad() {
        return capacidad;
    }

    public int getCantidadElementos() {
        return cantidadElementos;
    }

    public int getColisiones() {
        return colisiones;
    }

    public double getFactorCarga() {
        if (capacidad == 0) {
            return 0;
        }

        return (double) cantidadElementos / capacidad;
    }
}
