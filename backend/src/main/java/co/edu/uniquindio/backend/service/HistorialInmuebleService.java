package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.AccionInmuebleDTO;
import co.edu.uniquindio.backend.estructuras.pilas.Pila;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Servicio de historial de cambios sobre inmuebles.
 *
 * <p>Uso de estructuras propias: guarda estados previos en una {@link Pila}
 * para permitir deshacer el ultimo cambio registrado.</p>
 *
 * <p>Justificacion: el comportamiento LIFO coincide con la accion de deshacer:
 * se restaura primero el cambio mas reciente.</p>
 */
@Service
public class HistorialInmuebleService {

    private final InmuebleRepository inmuebleRepository;

    private final Pila<AccionInmuebleDTO> pilaCambiosInmuebles = new Pila<>();

    public HistorialInmuebleService(InmuebleRepository inmuebleRepository) {
        this.inmuebleRepository = inmuebleRepository;
    }

    public boolean capturarEstadoAntesDeCambio(String codigoInmueble, String descripcion) {
        if (codigoInmueble == null || codigoInmueble.isBlank()) {
            return false;
        }

        Inmueble inmuebleActual = inmuebleRepository.buscarPorCodigo(codigoInmueble);

        if (inmuebleActual == null) {
            return false;
        }

        Inmueble copiaEstadoAnterior = copiarInmueble(inmuebleActual);

        AccionInmuebleDTO accion = new AccionInmuebleDTO(
                codigoInmueble,
                descripcion == null || descripcion.isBlank()
                        ? "Cambio registrado sobre inmueble"
                        : descripcion,
                LocalDateTime.now(),
                copiaEstadoAnterior
        );

        pilaCambiosInmuebles.apilar(accion);

        return true;
    }

    public AccionInmuebleDTO deshacerUltimoCambio() {
        if (pilaCambiosInmuebles.estaVacia()) {
            return null;
        }

        AccionInmuebleDTO ultimaAccion = pilaCambiosInmuebles.desapilar();

        Inmueble estadoAnterior = ultimaAccion.getEstadoAnterior();

        if (estadoAnterior == null || estadoAnterior.getCodigo() == null) {
            return null;
        }

        boolean restaurado = inmuebleRepository.actualizar(
                estadoAnterior.getCodigo(),
                estadoAnterior
        );

        if (!restaurado) {
            return null;
        }

        return ultimaAccion;
    }

    public AccionInmuebleDTO verUltimaAccion() {
        if (pilaCambiosInmuebles.estaVacia()) {
            return null;
        }

        return pilaCambiosInmuebles.cima();
    }

    public int cantidadCambiosPendientes() {
        return pilaCambiosInmuebles.getTamaño();
    }

    public void limpiarHistorial() {
        pilaCambiosInmuebles.vaciar();
    }

    private Inmueble copiarInmueble(Inmueble original) {
        Inmueble copia = new Inmueble();

        copia.setCodigo(original.getCodigo());
        copia.setDireccion(original.getDireccion());
        copia.setCiudad(original.getCiudad());
        copia.setBarrioZona(original.getBarrioZona());
        copia.setTipoInmueble(original.getTipoInmueble());
        copia.setFinalidad(original.getFinalidad());
        copia.setPrecio(original.getPrecio());
        copia.setArea(original.getArea());
        copia.setHabitaciones(original.getHabitaciones());
        copia.setBanos(original.getBanos());
        copia.setEstado(original.getEstado());
        copia.setDisponible(original.isDisponible());
        copia.setIdAsesorResponsable(original.getIdAsesorResponsable());
        copia.setImagenUrl(original.getImagenUrl());

        return copia;
    }
}
