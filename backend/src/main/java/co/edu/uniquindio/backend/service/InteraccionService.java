package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.DoubleList.LinkedDoubleList;
import co.edu.uniquindio.backend.model.Interaccion;
import co.edu.uniquindio.backend.repository.InteraccionRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio de historial de interacciones del cliente.
 *
 * <p>Uso de estructuras propias: recibe una {@link LinkedDoubleList} desde el
 * repositorio para entregar historial normal y reverso.</p>
 *
 * <p>Justificacion: la lista doble permite recorrer actividad hacia adelante y
 * hacia atras sin duplicar los datos ni reconstruir la secuencia.</p>
 */
@Service
public class InteraccionService {

    private final InteraccionRepository interaccionRepository;

    public InteraccionService(InteraccionRepository interaccionRepository) {
        this.interaccionRepository = interaccionRepository;
    }

    public boolean registrarInteraccion(String clienteId, String codigoInmueble, String tipoInteraccion) {
        if (clienteId == null || clienteId.trim().isEmpty()) {
            return false;
        }

        if (codigoInmueble == null || codigoInmueble.trim().isEmpty()) {
            return false;
        }

        if (tipoInteraccion == null || tipoInteraccion.trim().isEmpty()) {
            return false;
        }

        return interaccionRepository.guardarInteraccion(
                clienteId,
                codigoInmueble,
                tipoInteraccion
        );
    }

    public boolean registrarInteraccion(Interaccion interaccion) {
        if (interaccion == null) {
            return false;
        }

        return registrarInteraccion(
                interaccion.getIdCliente(),
                interaccion.getCodigoInmueble(),
                interaccion.getTipoInteraccion()
        );
    }

    public Interaccion[] obtenerHistorialCliente(String clienteId) {
        LinkedDoubleList<Interaccion> lista =
                interaccionRepository.obtenerHistorialPorCliente(clienteId);

        Interaccion[] arreglo = new Interaccion[lista.getSize()];

        for (int i = 0; i < lista.getSize(); i++) {
            arreglo[i] = lista.getNodeValue(i);
        }

        return arreglo;
    }

    public Interaccion[] obtenerHistorialClienteReverso(String clienteId) {
        LinkedDoubleList<Interaccion> lista =
                interaccionRepository.obtenerHistorialPorCliente(clienteId);

        Interaccion[] arreglo = new Interaccion[lista.getSize()];

        int posicion = 0;

        for (int i = lista.getSize() - 1; i >= 0; i--) {
            arreglo[posicion] = lista.getNodeValue(i);
            posicion++;
        }

        return arreglo;
    }
}
