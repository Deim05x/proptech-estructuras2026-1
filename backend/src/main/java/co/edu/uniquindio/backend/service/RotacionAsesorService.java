package co.edu.uniquindio.backend.service;
import co.edu.uniquindio.backend.estructuras.listas.CircularSimpleList.LinkedCircularSimpleList;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Asesor;
import co.edu.uniquindio.backend.repository.AsesorRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio de asignacion rotativa de asesores.
 *
 * <p>Uso de estructuras propias: carga asesores desde {@link LinkedSimpleList}
 * y los organiza en {@link LinkedCircularSimpleList} para avanzar de forma
 * continua por la rueda de asignacion.</p>
 *
 * <p>Justificacion: la lista circular expresa naturalmente la regla de rotar
 * asesores y volver al inicio cuando todos han tenido turno.</p>
 */
@Service
public class RotacionAsesorService {

    private final AsesorRepository asesorRepository;
    private LinkedCircularSimpleList<Asesor> ruedaAsesores;
    private int indiceActual;

    public RotacionAsesorService(AsesorRepository asesorRepository) {
        this.asesorRepository = asesorRepository;
        this.ruedaAsesores = new LinkedCircularSimpleList<>();
        this.indiceActual = 0;
        recargarRueda();
    }

    public void recargarRueda() {
        LinkedSimpleList<Asesor> asesoresDesdeBD = asesorRepository.obtenerTodos();
        LinkedCircularSimpleList<Asesor> nuevaRueda = new LinkedCircularSimpleList<>();

        for (Asesor asesor : asesoresDesdeBD) {
            nuevaRueda.addLast(asesor);
        }

        this.ruedaAsesores = nuevaRueda;
        this.indiceActual = 0;
    }

    public Asesor[] obtenerRuedaActual() {
        Asesor[] arreglo = new Asesor[ruedaAsesores.getSize()];

        for (int i = 0; i < ruedaAsesores.getSize(); i++) {
            arreglo[i] = ruedaAsesores.getNodeValue(i);
        }

        return arreglo;
    }

    public Asesor obtenerSiguienteAsesor() {
        if (ruedaAsesores.isEmpty()) {
            return null;
        }

        if (indiceActual >= ruedaAsesores.getSize()) {
            indiceActual = 0;
        }

        Asesor asesor = ruedaAsesores.getNodeValue(indiceActual);
        indiceActual = (indiceActual + 1) % ruedaAsesores.getSize();

        return asesor;
    }

    public Asesor verAsesorActual() {
        if (ruedaAsesores.isEmpty()) {
            return null;
        }

        if (indiceActual >= ruedaAsesores.getSize()) {
            indiceActual = 0;
        }

        return ruedaAsesores.getNodeValue(indiceActual);
    }

    public void reiniciarRotacion() {
        indiceActual = 0;
    }

    public int obtenerIndiceActual() {
        return indiceActual;
    }

    public int obtenerCantidadAsesores() {
        return ruedaAsesores.getSize();
    }
} 


    

