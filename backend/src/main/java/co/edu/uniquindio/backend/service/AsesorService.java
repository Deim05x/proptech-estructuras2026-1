package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Asesor;
import co.edu.uniquindio.backend.repository.AsesorRepository;
import org.springframework.stereotype.Service;

@Service
public class AsesorService {

    private final AsesorRepository asesorRepository;

    public AsesorService(AsesorRepository asesorRepository) {
        this.asesorRepository = asesorRepository;
    }

    public String obtenerMensaje() {
        return "Servicio de asesores funcionando correctamente con lista propia y MariaDB";
    }

    private LinkedSimpleList<Asesor> obtenerListaDesdeBD() {
        return asesorRepository.obtenerTodos();
    }

    public Asesor[] listarAsesores() {
        LinkedSimpleList<Asesor> listaAsesores = obtenerListaDesdeBD();
        Asesor[] arreglo = new Asesor[listaAsesores.getSize()];

        for (int i = 0; i < listaAsesores.getSize(); i++) {
            arreglo[i] = listaAsesores.getNodeValue(i);
        }

        return arreglo;
    }

    public Asesor buscarPorId(String id) {
        LinkedSimpleList<Asesor> listaAsesores = obtenerListaDesdeBD();

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

        return asesorRepository.guardar(asesor);
    }

    public boolean actualizarAsesor(String id, Asesor asesorActualizado) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        if (asesorActualizado == null) {
            return false;
        }

        Asesor existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        asesorActualizado.setId(id);

        return asesorRepository.actualizar(id, asesorActualizado);
    }

    public boolean eliminarAsesor(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Asesor existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        return asesorRepository.eliminar(id);
    }
}