package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.CircularDoubleList.LinkedCircularDoubleList;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import org.springframework.stereotype.Service;

@Service
public class CarruselInmuebleService {

    private final InmuebleRepository inmuebleRepository;
    private LinkedCircularDoubleList<Inmueble> carrusel;
    private int indiceActual;

    public CarruselInmuebleService(InmuebleRepository inmuebleRepository) {
        this.inmuebleRepository = inmuebleRepository;
        this.carrusel = new LinkedCircularDoubleList<>();
        this.indiceActual = 0;
        recargarCarrusel();
    }

    public void recargarCarrusel() {
        LinkedSimpleList<Inmueble> inmueblesDesdeBD = inmuebleRepository.obtenerTodos();
        LinkedCircularDoubleList<Inmueble> nuevoCarrusel = new LinkedCircularDoubleList<>();

        for (Inmueble inmueble : inmueblesDesdeBD) {
            nuevoCarrusel.addLast(inmueble);
        }

        this.carrusel = nuevoCarrusel;
        this.indiceActual = 0;
    }

    public Inmueble[] obtenerCarruselActual() {
        Inmueble[] arreglo = new Inmueble[carrusel.getSize()];

        for (int i = 0; i < carrusel.getSize(); i++) {
            arreglo[i] = carrusel.getNodeValue(i);
        }

        return arreglo;
    }

    public Inmueble verActual() {
        if (carrusel.isEmpty()) {
            return null;
        }

        normalizarIndice();
        return carrusel.getNodeValue(indiceActual);
    }

    public Inmueble siguiente() {
        if (carrusel.isEmpty()) {
            return null;
        }

        normalizarIndice();
        Inmueble actual = carrusel.getNodeValue(indiceActual);
        indiceActual = (indiceActual + 1) % carrusel.getSize();

        return actual;
    }

    public Inmueble anterior() {
        if (carrusel.isEmpty()) {
            return null;
        }

        normalizarIndice();
        Inmueble actual = carrusel.getNodeValue(indiceActual);
        indiceActual = (indiceActual - 1 + carrusel.getSize()) % carrusel.getSize();

        return actual;
    }

    public void reiniciarCarrusel() {
        indiceActual = 0;
    }

    public int obtenerIndiceActual() {
        return indiceActual;
    }

    public int obtenerCantidadInmuebles() {
        return carrusel.getSize();
    }

    private void normalizarIndice() {
        if (carrusel.getSize() == 0) {
            indiceActual = 0;
            return;
        }

        if (indiceActual >= carrusel.getSize()) {
            indiceActual = 0;
        }

        if (indiceActual < 0) {
            indiceActual = carrusel.getSize() - 1;
        }
    }
}