package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.service.InmuebleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inmuebles")
public class InmuebleController {

    private final InmuebleService inmuebleService;

    public InmuebleController(InmuebleService inmuebleService) {
        this.inmuebleService = inmuebleService;
    }

    @GetMapping("/test")
    public String pruebaInmuebles() {
        return inmuebleService.obtenerMensaje();
    }

    @GetMapping
    public Inmueble[] listarInmuebles() {
        return inmuebleService.listarInmuebles();
    }

    @GetMapping("/{codigo}")
    public Inmueble obtenerInmueblePorCodigo(@PathVariable String codigo) {
        return inmuebleService.buscarPorCodigo(codigo);
    }

    @PostMapping
    public ResponseEntity<?> agregarInmueble(@RequestBody Inmueble inmueble) {
        boolean agregado = inmuebleService.agregarInmueble(inmueble);

        if (agregado) {
            return ResponseEntity.status(HttpStatus.CREATED).body(inmueble);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo agregar el inmueble. Verifica que el código exista y que no esté repetido.");
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizarInmueble(@PathVariable String codigo,
                                                @RequestBody Inmueble inmueble) {
        boolean actualizado = inmuebleService.actualizarInmueble(codigo, inmueble);

        if (actualizado) {
            Inmueble actualizadoObj = inmuebleService.buscarPorCodigo(codigo);
            return ResponseEntity.ok(actualizadoObj);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo actualizar el inmueble. Verifica que el código exista.");
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<?> eliminarInmueble(@PathVariable String codigo) {
        boolean eliminado = inmuebleService.eliminarInmueble(codigo);

        if (eliminado) {
            return ResponseEntity.ok("Inmueble eliminado correctamente.");
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo eliminar el inmueble. Verifica que el código exista.");
    }
}