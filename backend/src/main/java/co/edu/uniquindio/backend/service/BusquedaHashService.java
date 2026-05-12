package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.BusquedaHashDTO;
import co.edu.uniquindio.backend.estructuras.hashTables.TablaHashPropia;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Asesor;
import co.edu.uniquindio.backend.model.Cliente;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.AsesorRepository;
import co.edu.uniquindio.backend.repository.ClienteRepository;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio de busqueda directa por identificadores del dominio.
 *
 * <p>Uso de estructuras propias: carga clientes, inmuebles o asesores en una
 * {@link TablaHashPropia} y usa {@link LinkedSimpleList} como fuente de datos
 * proveniente de los repositorios.</p>
 *
 * <p>Justificacion: la tabla hash permite explicar busquedas por clave con
 * indice, colisiones, cubetas ocupadas y factor de carga, datos utiles para
 * documentar el comportamiento de la estructura.</p>
 */
@Service
public class BusquedaHashService {

    private final ClienteRepository clienteRepository;
    private final InmuebleRepository inmuebleRepository;
    private final AsesorRepository asesorRepository;

    public BusquedaHashService(
            ClienteRepository clienteRepository,
            InmuebleRepository inmuebleRepository,
            AsesorRepository asesorRepository
    ) {
        this.clienteRepository = clienteRepository;
        this.inmuebleRepository = inmuebleRepository;
        this.asesorRepository = asesorRepository;
    }

    public BusquedaHashDTO buscarClientePorId(String idCliente) {
        TablaHashPropia<String, Cliente> tabla = new TablaHashPropia<>(31);

        LinkedSimpleList<Cliente> clientes = clienteRepository.obtenerTodos();

        for (Cliente cliente : clientes) {
            String clave = obtenerIdCliente(cliente);

            if (clave != null && !clave.isBlank()) {
                tabla.insertar(clave, cliente);
            }
        }

        Cliente encontrado = tabla.buscar(idCliente);

        return construirRespuesta(
                "CLIENTE",
                idCliente,
                encontrado != null,
                encontrado,
                tabla
        );
    }

    public BusquedaHashDTO buscarInmueblePorCodigo(String codigoInmueble) {
        TablaHashPropia<String, Inmueble> tabla = new TablaHashPropia<>(31);

        LinkedSimpleList<Inmueble> inmuebles = inmuebleRepository.obtenerTodos();

        for (Inmueble inmueble : inmuebles) {
            if (inmueble.getCodigo() != null && !inmueble.getCodigo().isBlank()) {
                tabla.insertar(inmueble.getCodigo(), inmueble);
            }
        }

        Inmueble encontrado = tabla.buscar(codigoInmueble);

        return construirRespuesta(
                "INMUEBLE",
                codigoInmueble,
                encontrado != null,
                encontrado,
                tabla
        );
    }

    public BusquedaHashDTO buscarAsesorPorId(String idAsesor) {
        TablaHashPropia<String, Asesor> tabla = new TablaHashPropia<>(31);

        LinkedSimpleList<Asesor> asesores = asesorRepository.obtenerTodos();

        for (Asesor asesor : asesores) {
            String clave = obtenerIdAsesor(asesor);

            if (clave != null && !clave.isBlank()) {
                tabla.insertar(clave, asesor);
            }
        }

        Asesor encontrado = tabla.buscar(idAsesor);

        return construirRespuesta(
                "ASESOR",
                idAsesor,
                encontrado != null,
                encontrado,
                tabla
        );
    }

    private BusquedaHashDTO construirRespuesta(
            String tipoBusqueda,
            String clave,
            boolean encontrado,
            Object resultado,
            TablaHashPropia<String, ?> tabla
    ) {
        int indice = tabla.obtenerIndice(clave);

        return new BusquedaHashDTO(
                tipoBusqueda,
                clave,
                encontrado,
                resultado,
                indice,
                tabla.getCapacidad(),
                tabla.getCantidadElementos(),
                tabla.contarCubetasOcupadas(),
                tabla.getColisiones(),
                tabla.getFactorCarga(),
                tabla.contarElementosEnIndice(indice),
                encontrado
                        ? "Elemento encontrado mediante búsqueda hash."
                        : "No se encontró un elemento asociado a la clave."
        );
    }

    private String obtenerIdCliente(Cliente cliente) {
        if (cliente == null) return null;

        /*
         * Ajusta aquí según tu clase Cliente.
         * Deja solo el getter que realmente exista en tu proyecto.
         */

        if (cliente.getId() != null) {
            return cliente.getId();
        }

        return null;
    }

    private String obtenerIdAsesor(Asesor asesor) {
        if (asesor == null) return null;

        /*
         * Ajusta aquí según tu clase Asesor.
         * Deja solo el getter que realmente exista en tu proyecto.
         */

        if (asesor.getId() != null) {
            return asesor.getId();
        }

        return null;
    }
}
