package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Visita;
import co.edu.uniquindio.backend.repository.VisitaRepository;
import org.springframework.stereotype.Service;

@Service
public class VisitaService {

    private final LinkedSimpleList<Visita> listaVisitas;
    private final VisitaRepository visitaRepository;

    public VisitaService(VisitaRepository visitaRepository) {
        this.visitaRepository = visitaRepository;
        this.listaVisitas = visitaRepository.obtenerTodos();
    }

    public String obtenerMensaje() {
        return "Servicio de visitas funcionando correctamente con lista propia y MariaDB";
    }

    public Visita[] listarVisitas() {
        Visita[] arreglo = new Visita[listaVisitas.getSize()];

        for (int i = 0; i < listaVisitas.getSize(); i++) {
            arreglo[i] = listaVisitas.getNodeValue(i);
        }

        return arreglo;
    }

    public Visita buscarPorId(int id) {
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

        boolean guardado = visitaRepository.guardar(visita);

        if (guardado) {
            listaVisitas.addLast(visita);
        }

        return guardado;
    }
}