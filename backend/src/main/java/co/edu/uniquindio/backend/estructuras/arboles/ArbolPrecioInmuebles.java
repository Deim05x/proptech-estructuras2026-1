package co.edu.uniquindio.backend.estructuras.arboles;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;

/**
 * Arbol binario especializado para ordenar inmuebles por precio.
 *
 * <p>Justificacion en PropTech: las consultas por rango de precio son un flujo
 * principal del cliente. El arbol permite podar ramas que quedan por fuera del
 * rango solicitado y devolver inmuebles ordenados por valor de referencia.</p>
 */
public class ArbolPrecioInmuebles {

    private NodoArbolPrecio raiz;

    public ArbolPrecioInmuebles() {
        this.raiz = null;
    }

    public void insertar(Inmueble inmueble) {
        if (inmueble == null) {
            return;
        }

        raiz = insertarRecursivo(raiz, inmueble);
    }

    private NodoArbolPrecio insertarRecursivo(NodoArbolPrecio actual, Inmueble inmueble) {
        if (actual == null) {
            return new NodoArbolPrecio(inmueble);
        }

        double precioNuevo = inmueble.getPrecio();
        double precioActual = actual.getInmueble().getPrecio();

        if (precioNuevo < precioActual) {
            actual.setIzquierdo(insertarRecursivo(actual.getIzquierdo(), inmueble));
        } else {
            actual.setDerecho(insertarRecursivo(actual.getDerecho(), inmueble));
        }

        return actual;
    }

    public LinkedSimpleList<Inmueble> buscarPorRango(double precioMinimo, double precioMaximo) {
        LinkedSimpleList<Inmueble> resultado = new LinkedSimpleList<>();
        buscarPorRangoRecursivo(raiz, precioMinimo, precioMaximo, resultado);
        return resultado;
    }

    private void buscarPorRangoRecursivo(
            NodoArbolPrecio actual,
            double precioMinimo,
            double precioMaximo,
            LinkedSimpleList<Inmueble> resultado
    ) {
        if (actual == null) {
            return;
        }

        double precioActual = actual.getInmueble().getPrecio();

        if (precioActual > precioMinimo) {
            buscarPorRangoRecursivo(actual.getIzquierdo(), precioMinimo, precioMaximo, resultado);
        }

        if (precioActual >= precioMinimo && precioActual <= precioMaximo) {
            resultado.addLast(actual.getInmueble());
        }

        if (precioActual < precioMaximo) {
            buscarPorRangoRecursivo(actual.getDerecho(), precioMinimo, precioMaximo, resultado);
        }
    }

    public LinkedSimpleList<Inmueble> listarOrdenadoAscendente() {
        LinkedSimpleList<Inmueble> resultado = new LinkedSimpleList<>();
        inOrden(raiz, resultado);
        return resultado;
    }

    private void inOrden(NodoArbolPrecio actual, LinkedSimpleList<Inmueble> resultado) {
        if (actual == null) {
            return;
        }

        inOrden(actual.getIzquierdo(), resultado);
        resultado.addLast(actual.getInmueble());
        inOrden(actual.getDerecho(), resultado);
    }

    public int contarNodos() {
        return contarNodosRecursivo(raiz);
    }

    private int contarNodosRecursivo(NodoArbolPrecio actual) {
        if (actual == null) {
            return 0;
        }

        return 1 + contarNodosRecursivo(actual.getIzquierdo())
                 + contarNodosRecursivo(actual.getDerecho());
    }

    public int calcularAltura() {
        return calcularAlturaRecursiva(raiz);
    }

    private int calcularAlturaRecursiva(NodoArbolPrecio actual) {
        if (actual == null) {
            return 0;
        }

        int alturaIzquierda = calcularAlturaRecursiva(actual.getIzquierdo());
        int alturaDerecha = calcularAlturaRecursiva(actual.getDerecho());

        return 1 + Math.max(alturaIzquierda, alturaDerecha);
    }

    public boolean estaVacio() {
        return raiz == null;
    }
}
