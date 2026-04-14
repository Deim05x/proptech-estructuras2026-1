package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.Interaccion;
import co.edu.uniquindio.backend.service.FavoritoService;
import co.edu.uniquindio.backend.service.InteraccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoritoController {

    private final FavoritoService favoritoService;
    private final InteraccionService interaccionService;

    public FavoritoController(FavoritoService favoritoService,
                              InteraccionService interaccionService) {
        this.favoritoService = favoritoService;
        this.interaccionService = interaccionService;
    }

    @GetMapping("/{clienteId}/favoritos")
    public Inmueble[] obtenerFavoritos(@PathVariable String clienteId) {
        return favoritoService.obtenerFavoritosPorCliente(clienteId);
    }

    @PostMapping("/{clienteId}/favoritos/{codigoInmueble}")
    public ResponseEntity<?> agregarFavorito(@PathVariable String clienteId,
                                             @PathVariable String codigoInmueble) {
        boolean agregado = favoritoService.agregarFavorito(clienteId, codigoInmueble);

        if (agregado) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Favorito agregado correctamente.");
        }

        return ResponseEntity.badRequest()
                .body("No se pudo agregar el favorito.");
    }

    @DeleteMapping("/{clienteId}/favoritos/{codigoInmueble}")
    public ResponseEntity<?> eliminarFavorito(@PathVariable String clienteId,
                                              @PathVariable String codigoInmueble) {
        boolean eliminado = favoritoService.eliminarFavorito(clienteId, codigoInmueble);

        if (eliminado) {
            return ResponseEntity.ok("Favorito eliminado correctamente.");
        }

        return ResponseEntity.badRequest()
                .body("No se pudo eliminar el favorito.");
    }

    @GetMapping("/{clienteId}/historial")
    public Interaccion[] obtenerHistorial(@PathVariable String clienteId) {
        return interaccionService.obtenerHistorialCliente(clienteId);
    }

    @GetMapping("/{clienteId}/historial/reverso")
    public Interaccion[] obtenerHistorialReverso(@PathVariable String clienteId) {
        return interaccionService.obtenerHistorialClienteReverso(clienteId);
    }
}