package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.model.Operacion;
import co.edu.uniquindio.backend.repository.AsesorRepository;
import co.edu.uniquindio.backend.repository.ClienteRepository;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import co.edu.uniquindio.backend.repository.OperacionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OperacionService {

    private static final DateTimeFormatter ID_OPERACION_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

    private final OperacionRepository operacionRepository;
    private final InmuebleRepository inmuebleRepository;
    private final ClienteRepository clienteRepository;
    private final AsesorRepository asesorRepository;

    public OperacionService(OperacionRepository operacionRepository,
                            InmuebleRepository inmuebleRepository,
                            ClienteRepository clienteRepository,
                            AsesorRepository asesorRepository) {
        this.operacionRepository = operacionRepository;
        this.inmuebleRepository = inmuebleRepository;
        this.clienteRepository = clienteRepository;
        this.asesorRepository = asesorRepository;
    }

    public Operacion[] listarOperaciones() {
        return operacionRepository.listar();
    }

    public Operacion buscarPorId(String id) {
        return operacionRepository.buscarPorId(id);
    }

    public boolean registrarOperacion(Operacion operacion) {
        if (operacion == null) return false;

        if (operacion.getId() == null || operacion.getId().isBlank()) {
            operacion.setId(generarIdOperacion());
        }

        if (operacionRepository.buscarPorId(operacion.getId()) != null) return false;

        if (inmuebleRepository.buscarPorCodigo(operacion.getCodigoInmueble()) == null) return false;
        if (clienteRepository.buscarPorId(operacion.getIdCliente()) == null) return false;
        if (asesorRepository.buscarPorId(operacion.getIdAsesor()) == null) return false;

        if (operacion.getValorAcordado() <= 0) return false;
        if (operacion.getComision() < 0) return false;

        return operacionRepository.guardar(operacion);
    }

    public boolean actualizarOperacion(String id, Operacion operacion) {
        if (operacion == null) return false;
        if (operacionRepository.buscarPorId(id) == null) return false;

        if (inmuebleRepository.buscarPorCodigo(operacion.getCodigoInmueble()) == null) return false;
        if (clienteRepository.buscarPorId(operacion.getIdCliente()) == null) return false;
        if (asesorRepository.buscarPorId(operacion.getIdAsesor()) == null) return false;

        if (operacion.getValorAcordado() <= 0) return false;
        if (operacion.getComision() < 0) return false;

        return operacionRepository.actualizar(id, operacion);
    }

    public boolean eliminarOperacion(String id) {
        if (operacionRepository.buscarPorId(id) == null) return false;
        return operacionRepository.eliminar(id);
    }

    private String generarIdOperacion() {
        String id;

        do {
            id = "OPE-" +
                    LocalDateTime.now().format(ID_OPERACION_FORMATTER) +
                    "-" +
                    ThreadLocalRandom.current().nextInt(100, 1000);
        } while (operacionRepository.buscarPorId(id) != null);

        return id;
    }
}
