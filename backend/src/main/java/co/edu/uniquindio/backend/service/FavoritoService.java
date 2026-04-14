package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.ClienteRepository;
import co.edu.uniquindio.backend.repository.FavoritoRepository;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import org.springframework.stereotype.Service;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final ClienteRepository clienteRepository;
    private final InmuebleRepository inmuebleRepository;
    private final InteraccionService interaccionService;

    public FavoritoService(FavoritoRepository favoritoRepository,
                           ClienteRepository clienteRepository,
                           InmuebleRepository inmuebleRepository,
                           InteraccionService interaccionService) {
        this.favoritoRepository = favoritoRepository;
        this.clienteRepository = clienteRepository;
        this.inmuebleRepository = inmuebleRepository;
        this.interaccionService = interaccionService;
    }

    public Inmueble[] obtenerFavoritosPorCliente(String clienteId) {
        LinkedSimpleList<Inmueble> lista = favoritoRepository.obtenerFavoritosPorCliente(clienteId);
        Inmueble[] arreglo = new Inmueble[lista.getSize()];

        for (int i = 0; i < lista.getSize(); i++) {
            arreglo[i] = lista.getNodeValue(i);
        }

        return arreglo;
    }

    public boolean agregarFavorito(String clienteId, String codigoInmueble) {
        if (clienteId == null || clienteId.trim().isEmpty()) {
            return false;
        }

        if (codigoInmueble == null || codigoInmueble.trim().isEmpty()) {
            return false;
        }

        if (clienteRepository.buscarPorId(clienteId) == null) {
            return false;
        }

        if (inmuebleRepository.buscarPorCodigo(codigoInmueble) == null) {
            return false;
        }

        if (favoritoRepository.existeFavorito(clienteId, codigoInmueble)) {
            return false;
        }

        boolean guardado = favoritoRepository.guardarFavorito(clienteId, codigoInmueble);

        if (guardado) {
            interaccionService.registrarInteraccion(clienteId, codigoInmueble, "FAVORITO");
        }

        return guardado;
    }

    public boolean eliminarFavorito(String clienteId, String codigoInmueble) {
        boolean eliminado = favoritoRepository.eliminarFavorito(clienteId, codigoInmueble);

        if (eliminado) {
            interaccionService.registrarInteraccion(clienteId, codigoInmueble, "ELIMINAR_FAVORITO");
        }

        return eliminado;
    }
}