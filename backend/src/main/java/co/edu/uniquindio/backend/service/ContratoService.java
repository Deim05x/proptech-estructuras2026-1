package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Contrato;
import co.edu.uniquindio.backend.repository.ContratoRepository;
import org.springframework.stereotype.Service;

@Service
public class ContratoService {

    private final ContratoRepository contratoRepository;

    public ContratoService(ContratoRepository contratoRepository) {
        this.contratoRepository = contratoRepository;
    }

    public Contrato[] listar() {
        actualizarEstadosAutomaticos();
        return convertirAArreglo(contratoRepository.listar());
    }

    public Contrato buscarPorId(String id) {
        Contrato contrato = contratoRepository.buscarPorId(id);

        if (contrato == null) {
            throw new RuntimeException("Contrato no encontrado");
        }

        return contrato;
    }

    public Contrato crear(Contrato contrato) {
        validarContrato(contrato);

        if (contrato.getEstado() == null || contrato.getEstado().isBlank()) {
            contrato.setEstado("ACTIVO");
        }

        return contratoRepository.guardar(contrato);
    }

    public Contrato actualizar(String id, Contrato contrato) {
        validarContrato(contrato);
        return contratoRepository.actualizar(id, contrato);
    }

    public void eliminar(String id) {
        contratoRepository.eliminar(id);
    }

    public Contrato[] listarPorEstado(String estado) {
        actualizarEstadosAutomaticos();
        return convertirAArreglo(contratoRepository.listarPorEstado(estado));
    }

    public Contrato[] listarPorCliente(String idCliente) {
        actualizarEstadosAutomaticos();
        return convertirAArreglo(contratoRepository.listarPorCliente(idCliente));
    }

    public Contrato[] listarProximosAVencer(int dias) {
        actualizarEstadosAutomaticos();
        return convertirAArreglo(contratoRepository.listarProximosAVencer(dias));
    }

    public Contrato[] listarVencidos() {
        actualizarEstadosAutomaticos();
        return convertirAArreglo(contratoRepository.listarVencidos());
    }

    public Contrato cambiarEstado(String id, String nuevoEstado) {
        Contrato contrato = buscarPorId(id);
        contrato.setEstado(nuevoEstado);
        return contratoRepository.actualizar(id, contrato);
    }

    private void validarContrato(Contrato contrato) {
        if (contrato.getId() == null || contrato.getId().isBlank()) {
            throw new RuntimeException("El ID del contrato es obligatorio");
        }

        if (contrato.getCodigoInmueble() == null || contrato.getCodigoInmueble().isBlank()) {
            throw new RuntimeException("El código del inmueble es obligatorio");
        }

        if (contrato.getIdCliente() == null || contrato.getIdCliente().isBlank()) {
            throw new RuntimeException("El ID del cliente es obligatorio");
        }

        if (contrato.getIdAsesor() == null || contrato.getIdAsesor().isBlank()) {
            throw new RuntimeException("El ID del asesor es obligatorio");
        }

        if (contrato.getTipoContrato() == null || contrato.getTipoContrato().isBlank()) {
            throw new RuntimeException("El tipo de contrato es obligatorio");
        }

        if (contrato.getFechaInicio() == null) {
            throw new RuntimeException("La fecha de inicio es obligatoria");
        }

        if (contrato.getFechaFin() == null) {
            throw new RuntimeException("La fecha de fin es obligatoria");
        }

        if (contrato.getFechaFin().isBefore(contrato.getFechaInicio())) {
            throw new RuntimeException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        if (contrato.getValor() < 0) {
            throw new RuntimeException("El valor del contrato no puede ser negativo");
        }
    }

    public void actualizarEstadosAutomaticos() {
        LinkedSimpleList<Contrato> contratos = contratoRepository.listar();

        for (Contrato contrato : contratos) {
            String estadoOriginal = contrato.getEstado();

            if (contrato.getEstado() == null) {
                contrato.setEstado("ACTIVO");
            }

            if (contrato.estaVencido()
                    && !contrato.getEstado().equalsIgnoreCase("CANCELADO")
                    && !contrato.getEstado().equalsIgnoreCase("FINALIZADO")) {
                contrato.setEstado("VENCIDO");
            } else if (contrato.estaProximoAVencer(30)
                    && contrato.getEstado().equalsIgnoreCase("ACTIVO")) {
                contrato.setEstado("PROXIMO_A_VENCER");
            }

            if (estadoOriginal == null || !estadoOriginal.equalsIgnoreCase(contrato.getEstado())) {
                contratoRepository.actualizar(contrato.getId(), contrato);
            }
        }
    }

    private Contrato[] convertirAArreglo(LinkedSimpleList<Contrato> contratos) {
        Contrato[] resultado = new Contrato[contratos.getSize()];
        int indice = 0;

        for (Contrato contrato : contratos) {
            resultado[indice] = contrato;
            indice++;
        }

        return resultado;
    }
}
