package co.edu.uniquindio.backend.estructuras.grafos;

/**
 * Grafo no dirigido genérico usando matriz de adyacencia.
 *
 * @param <T> tipo de dato que representa cada vértice
 */
public class GrafoNoDirigido<T> {

    private Object[] vertices;
    private double[][] matrizAdyacencia;
    private int cantidadVertices;

    public GrafoNoDirigido() {
        this.vertices = new Object[100];
        this.matrizAdyacencia = new double[100][100];
        this.cantidadVertices = 0;
    }

    public GrafoNoDirigido(int capacidadInicial) {
        this.vertices = new Object[capacidadInicial];
        this.matrizAdyacencia = new double[capacidadInicial][capacidadInicial];
        this.cantidadVertices = 0;
    }

    public int getCantidadVertices() {
        return cantidadVertices;
    }

    public boolean estaVacio() {
        return cantidadVertices == 0;
    }

    public boolean agregarVertice(T dato) {
        if (dato == null) {
            return false;
        }

        if (indiceDe(dato) != -1) {
            return false;
        }

        if (cantidadVertices == vertices.length) {
            ampliarCapacidad();
        }

        vertices[cantidadVertices] = dato;
        cantidadVertices++;

        return true;
    }

    public void agregarArista(T origen, T destino, double peso) {
        if (origen == null || destino == null) {
            return;
        }

        if (peso <= 0) {
            peso = 1;
        }

        if (indiceDe(origen) == -1) {
            agregarVertice(origen);
        }

        if (indiceDe(destino) == -1) {
            agregarVertice(destino);
        }

        int indiceOrigen = indiceDe(origen);
        int indiceDestino = indiceDe(destino);

        matrizAdyacencia[indiceOrigen][indiceDestino] += peso;
        matrizAdyacencia[indiceDestino][indiceOrigen] += peso;
    }

    public boolean existeArista(T origen, T destino) {
        int indiceOrigen = indiceDe(origen);
        int indiceDestino = indiceDe(destino);

        if (indiceOrigen == -1 || indiceDestino == -1) {
            return false;
        }

        return matrizAdyacencia[indiceOrigen][indiceDestino] > 0;
    }

    public double obtenerPeso(T origen, T destino) {
        int indiceOrigen = indiceDe(origen);
        int indiceDestino = indiceDe(destino);

        if (indiceOrigen == -1 || indiceDestino == -1) {
            return 0;
        }

        return matrizAdyacencia[indiceOrigen][indiceDestino];
    }

    public double obtenerPesoPorIndice(int origen, int destino) {
        if (!indiceValido(origen) || !indiceValido(destino)) {
            return 0;
        }

        return matrizAdyacencia[origen][destino];
    }

    @SuppressWarnings("unchecked")
    public T obtenerVertice(int indice) {
        if (!indiceValido(indice)) {
            return null;
        }

        return (T) vertices[indice];
    }

    public int indiceDe(T dato) {
        if (dato == null) {
            return -1;
        }

        for (int i = 0; i < cantidadVertices; i++) {
            if (vertices[i].equals(dato)) {
                return i;
            }
        }

        return -1;
    }

    public int grado(T dato) {
        int indice = indiceDe(dato);

        if (indice == -1) {
            return 0;
        }

        int grado = 0;

        for (int i = 0; i < cantidadVertices; i++) {
            if (matrizAdyacencia[indice][i] > 0) {
                grado++;
            }
        }

        return grado;
    }

    public int gradoPorIndice(int indice) {
        if (!indiceValido(indice)) {
            return 0;
        }

        int grado = 0;

        for (int i = 0; i < cantidadVertices; i++) {
            if (matrizAdyacencia[indice][i] > 0) {
                grado++;
            }
        }

        return grado;
    }

    public int cantidadAristas() {
        int cantidad = 0;

        for (int i = 0; i < cantidadVertices; i++) {
            for (int j = i + 1; j < cantidadVertices; j++) {
                if (matrizAdyacencia[i][j] > 0) {
                    cantidad++;
                }
            }
        }

        return cantidad;
    }

    public T obtenerVerticeMayorGrado() {
        if (estaVacio()) {
            return null;
        }

        int indiceMayor = 0;
        int gradoMayor = gradoPorIndice(0);

        for (int i = 1; i < cantidadVertices; i++) {
            int gradoActual = gradoPorIndice(i);

            if (gradoActual > gradoMayor) {
                gradoMayor = gradoActual;
                indiceMayor = i;
            }
        }

        return obtenerVertice(indiceMayor);
    }

    public void limpiar() {
        for (int i = 0; i < cantidadVertices; i++) {
            vertices[i] = null;
        }

        for (int i = 0; i < matrizAdyacencia.length; i++) {
            for (int j = 0; j < matrizAdyacencia[i].length; j++) {
                matrizAdyacencia[i][j] = 0;
            }
        }

        cantidadVertices = 0;
    }

    private boolean indiceValido(int indice) {
        return indice >= 0 && indice < cantidadVertices;
    }

    private void ampliarCapacidad() {
        int nuevaCapacidad = vertices.length * 2;

        Object[] nuevosVertices = new Object[nuevaCapacidad];
        double[][] nuevaMatriz = new double[nuevaCapacidad][nuevaCapacidad];

        for (int i = 0; i < vertices.length; i++) {
            nuevosVertices[i] = vertices[i];
        }

        for (int i = 0; i < matrizAdyacencia.length; i++) {
            for (int j = 0; j < matrizAdyacencia[i].length; j++) {
                nuevaMatriz[i][j] = matrizAdyacencia[i][j];
            }
        }

        vertices = nuevosVertices;
        matrizAdyacencia = nuevaMatriz;
    }
}