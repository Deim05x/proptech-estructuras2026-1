package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.CancelarVisitaRequest;
import co.edu.uniquindio.backend.dto.ReprogramarVisitaRequest;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Visita;
import co.edu.uniquindio.backend.repository.VisitaRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio para agenda y seguimiento de visitas.
 *
 * <p>Uso de estructuras propias: recupera visitas en {@link LinkedSimpleList}
 * y recorre esa estructura para consultas por estado, busquedas por id y
 * conversion a arreglos de respuesta.</p>
 *
 * <p>Justificacion: la agenda requiere recorridos filtrados frecuentes y la
 * lista simple mantiene la logica de consulta alineada con las estructuras del
 * proyecto.</p>
 */
@Service
public class VisitaService {

    private final VisitaRepository visitaRepository;
    private final InteraccionService interaccionService;

    public VisitaService(VisitaRepository visitaRepository,
                         InteraccionService interaccionService) {
        this.visitaRepository = visitaRepository;
        this.interaccionService = interaccionService;
    }

    public String obtenerMensaje() {
        return "Servicio de visitas funcionando correctamente con lista propia y MariaDB";
    }

    private LinkedSimpleList<Visita> obtenerListaDesdeBD() {
        return visitaRepository.obtenerTodos();
    }

    public Visita[] listarVisitas() {
        LinkedSimpleList<Visita> listaVisitas = obtenerListaDesdeBD();
        Visita[] arreglo = new Visita[listaVisitas.getSize()];

        for (int i = 0; i < listaVisitas.getSize(); i++) {
            arreglo[i] = listaVisitas.getNodeValue(i);
        }

        return arreglo;
    }

    public Visita[] listarVisitasPorEstado(String estado) {
        LinkedSimpleList<Visita> listaVisitas = visitaRepository.obtenerPorEstado(estado);
        Visita[] arreglo = new Visita[listaVisitas.getSize()];

        for (int i = 0; i < listaVisitas.getSize(); i++) {
            arreglo[i] = listaVisitas.getNodeValue(i);
        }

        return arreglo;
    }

    public Visita buscarPorId(int id) {
        LinkedSimpleList<Visita> listaVisitas = obtenerListaDesdeBD();

        for (Visita visita : listaVisitas) {
            if (visita.getId() == id) {
                return visita;
            }
        }
        return null;
    }

    public boolean agregarVisita(Visita visita) {
        if (visita == null) {
            return false;
        }

        if (visita.getId() <= 0) {
            visita.setId(generarIdVisita());
        }

        if (visita.getFecha() == null || visita.getHora() == null) {
            return false;
        }

        if (buscarPorId(visita.getId()) != null) {
            return false;
        }

        if (visita.getEstado() == null || visita.getEstado().trim().isEmpty()) {
            visita.setEstado("Programada");
        }

        boolean guardada = visitaRepository.guardar(visita);

        if (guardada) {
            interaccionService.registrarInteraccion(
                    visita.getIdCliente(),
                    visita.getCodigoInmueble(),
                    "AGENDAR_VISITA"
            );
        }

        return guardada;
    }

    public boolean actualizarVisita(int id, Visita visitaActualizada) {
        if (id <= 0) {
            return false;
        }

        if (visitaActualizada == null) {
            return false;
        }

        Visita existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        visitaActualizada.setId(id);

        return visitaRepository.actualizar(id, visitaActualizada);
    }

    public boolean reprogramarVisita(int id, ReprogramarVisitaRequest request) {
        if (id <= 0 || request == null) {
            return false;
        }

        if (request.getFecha() == null || request.getHora() == null) {
            return false;
        }

        Visita existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        if ("Cancelada".equalsIgnoreCase(existente.getEstado())) {
            return false;
        }

        boolean reprogramada = visitaRepository.reprogramar(
                id,
                request.getFecha(),
                request.getHora(),
                request.getObservacion()
        );

        if (reprogramada) {
            interaccionService.registrarInteraccion(
                    existente.getIdCliente(),
                    existente.getCodigoInmueble(),
                    "REPROGRAMAR_VISITA"
            );
        }

        return reprogramada;
    }

    public boolean cancelarVisita(int id, CancelarVisitaRequest request) {
        if (id <= 0 || request == null) {
            return false;
        }

        Visita existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        if ("Cancelada".equalsIgnoreCase(existente.getEstado())) {
            return false;
        }

        boolean cancelada = visitaRepository.cancelar(id, request.getObservacion());

        if (cancelada) {
            interaccionService.registrarInteraccion(
                    existente.getIdCliente(),
                    existente.getCodigoInmueble(),
                    "CANCELAR_VISITA"
            );
        }

        return cancelada;
    }

    public boolean eliminarVisita(int id) {
        if (id <= 0) {
            return false;
        }

        Visita existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        return visitaRepository.eliminar(id);
    }

    private int generarIdVisita() {
        int id = visitaRepository.obtenerSiguienteId();

        while (buscarPorId(id) != null) {
            id++;
        }

        return id;
    }
}
