package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Asesor;
import co.edu.uniquindio.backend.repository.AsesorRepository;
import org.springframework.stereotype.Service;

@Service
public class AsesorService {

    private final LinkedSimpleList<Asesor> listaAsesores;
    private final AsesorRepository asesorRepository;

    public AsesorService(AsesorRepository asesorRepository) {
        this.asesorRepository = asesorRepository;
        this.listaAsesores = asesorRepository.obtenerTodos();
    }

    public String obtenerMensaje() {
        return "Servicio de asesores funcionando correctamente con lista propia y MariaDB";
    }

    public Asesor[] listarAsesores() {
        Asesor[] arreglo = new Asesor[listaAsesores.getSize()];

        for (int i = 0; i < listaAsesores.getSize(); i++) {
            arreglo[i] = listaAsesores.getNodeValue(i);
        }

        return arreglo;
    }

    public Asesor buscarPorId(String id) {
        for (Asesor asesor : listaAsesores) {
            if (asesor.getId().equals(id)) {
                return asesor;
            }
        }
        return null;
    }

    public boolean agregarAsesor(Asesor asesor) {
        if (asesor == null) {
            return false;
        }

        if (asesor.getId() == null || asesor.getId().trim().isEmpty()) {
            return false;
        }

        if (buscarPorId(asesor.getId()) != null) {
            return false;
        }

        boolean guardado = asesorRepository.guardar(asesor);

        if (guardado) {
            listaAsesores.addLast(asesor);
        }

        return guardado;
    }
}