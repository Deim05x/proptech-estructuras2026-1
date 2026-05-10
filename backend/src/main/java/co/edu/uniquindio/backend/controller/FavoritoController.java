package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.Interaccion;
import co.edu.uniquindio.backend.service.FavoritoService;
import co.edu.uniquindio.backend.service.InteraccionService;
import co.edu.uniquindio.backend.service.SesionUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoritoController {

    private final FavoritoService favoritoService;
    private final InteraccionService interaccionService;
    private final SesionUsuarioService sesionUsuarioService;

    public FavoritoController(FavoritoService favoritoService,
                              InteraccionService interaccionService,
                              SesionUsuarioService sesionUsuarioService) {
        this.favoritoService = favoritoService;
        this.interaccionService = interaccionService;
        this.sesionUsuarioService = sesionUsuarioService;
    }

    @GetMapping("/{clienteId}/favoritos")
    public ResponseEntity<?> obtenerFavoritos(@PathVariable String clienteId) {
        if (!sesionUsuarioService.puedeAccederACliente(clienteId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para consultar los favoritos de este cliente.");
        }

        Inmueble[] favoritos = favoritoService.obtenerFavoritosPorCliente(clienteId);
        return ResponseEntity.ok(favoritos);
    }

    @PostMapping("/{clienteId}/favoritos/{codigoInmueble}")
    public ResponseEntity<?> agregarFavorito(@PathVariable String clienteId,
                                             @PathVariable String codigoInmueble) {
        if (!sesionUsuarioService.puedeAccederACliente(clienteId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para agregar favoritos a este cliente.");
        }

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
        if (!sesionUsuarioService.puedeAccederACliente(clienteId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para eliminar favoritos de este cliente.");
        }

        boolean eliminado = favoritoService.eliminarFavorito(clienteId, codigoInmueble);

        if (eliminado) {
            return ResponseEntity.ok("Favorito eliminado correctamente.");
        }

        return ResponseEntity.badRequest()
                .body("No se pudo eliminar el favorito.");
    }

    @GetMapping("/{clienteId}/historial")
    public ResponseEntity<?> obtenerHistorial(@PathVariable String clienteId) {
        if (!sesionUsuarioService.puedeAccederACliente(clienteId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para consultar el historial de este cliente.");
        }

        Interaccion[] historial = interaccionService.obtenerHistorialCliente(clienteId);
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/{clienteId}/historial/reverso")
    public ResponseEntity<?> obtenerHistorialReverso(@PathVariable String clienteId) {
        if (!sesionUsuarioService.puedeAccederACliente(clienteId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para consultar el historial de este cliente.");
        }

        Interaccion[] historial = interaccionService.obtenerHistorialClienteReverso(clienteId);
        return ResponseEntity.ok(historial);
    }
}