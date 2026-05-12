package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio base del catalogo de inmuebles.
 *
 * <p>Uso de estructuras propias: obtiene inmuebles en {@link LinkedSimpleList}
 * desde el repositorio y los convierte a arreglos solo en el borde de salida
 * hacia la API.</p>
 *
 * <p>Justificacion: el catalogo se recorre con frecuencia para busquedas,
 * filtros y validaciones; la lista simple es suficiente y mantiene bajo el
 * costo conceptual de una coleccion secuencial propia.</p>
 */
@Service
public class InmuebleService {

    private final InmuebleRepository inmuebleRepository;

    public InmuebleService(InmuebleRepository inmuebleRepository) {
        this.inmuebleRepository = inmuebleRepository;
    }

    public String obtenerMensaje() {
        return "Servicio de inmuebles funcionando correctamente con lista propia y MariaDB";
    }

    private LinkedSimpleList<Inmueble> obtenerListaDesdeBD() {
        return inmuebleRepository.obtenerTodos();
    }

    public Inmueble[] listarInmuebles() {
        LinkedSimpleList<Inmueble> listaInmuebles = obtenerListaDesdeBD();
        Inmueble[] arreglo = new Inmueble[listaInmuebles.getSize()];

        for (int i = 0; i < listaInmuebles.getSize(); i++) {
            arreglo[i] = listaInmuebles.getNodeValue(i);
        }

        return arreglo;
    }

    public Inmueble buscarPorCodigo(String codigo) {
        LinkedSimpleList<Inmueble> listaInmuebles = obtenerListaDesdeBD();

        for (Inmueble inmueble : listaInmuebles) {
            if (inmueble.getCodigo().equals(codigo)) {
                return inmueble;
            }
        }
        return null;
    }

    public boolean agregarInmueble(Inmueble inmueble) {
        if (inmueble == null) {
            return false;
        }

        if (inmueble.getCodigo() == null || inmueble.getCodigo().trim().isEmpty()) {
            return false;
        }

        if (buscarPorCodigo(inmueble.getCodigo()) != null) {
            return false;
        }

        return inmuebleRepository.guardar(inmueble);
    }

    public boolean actualizarInmueble(String codigo, Inmueble inmuebleActualizado) {
        if (codigo == null || codigo.trim().isEmpty()) {
            return false;
        }

        if (inmuebleActualizado == null) {
            return false;
        }

        Inmueble existente = buscarPorCodigo(codigo);
        if (existente == null) {
            return false;
        }

        inmuebleActualizado.setCodigo(codigo);

        return inmuebleRepository.actualizar(codigo, inmuebleActualizado);
    }

    public boolean eliminarInmueble(String codigo) {
        if (codigo == null || codigo.trim().isEmpty()) {
            return false;
        }

        Inmueble existente = buscarPorCodigo(codigo);
        if (existente == null) {
            return false;
        }

        return inmuebleRepository.eliminar(codigo);
    }
}
