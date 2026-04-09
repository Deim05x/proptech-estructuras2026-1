package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Visita;
import co.edu.uniquindio.backend.repository.VisitaRepository;
import org.springframework.stereotype.Service;

@Service
public class VisitaService {

    private final VisitaRepository visitaRepository;

    public VisitaService(VisitaRepository visitaRepository) {
        this.visitaRepository = visitaRepository;
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
            return false;
        }

        if (buscarPorId(visita.getId()) != null) {
            return false;
        }

        return visitaRepository.guardar(visita);
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
}