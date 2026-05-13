package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Operacion;
import co.edu.uniquindio.backend.service.OperacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/operaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class OperacionController {

    private final OperacionService operacionService;

    public OperacionController(OperacionService operacionService) {
        this.operacionService = operacionService;
    }

    @GetMapping
    public Operacion[] listarOperaciones() {
        return operacionService.listarOperaciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable String id) {
        Operacion operacion = operacionService.buscarPorId(id);

        if (operacion == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la operación.");
        }

        return ResponseEntity.ok(operacion);
    }

    @PostMapping
    public ResponseEntity<?> registrarOperacion(@RequestBody Operacion operacion) {
        boolean registrada = operacionService.registrarOperacion(operacion);

        if (registrada) {
            return ResponseEntity.status(HttpStatus.CREATED).body(operacion);
        }

        return ResponseEntity.badRequest()
                .body("No se pudo registrar la operación. Verifica inmueble, cliente, asesor y valores.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarOperacion(@PathVariable String id,
                                                 @RequestBody Operacion operacion) {
        boolean actualizada = operacionService.actualizarOperacion(id, operacion);

        if (actualizada) {
            return ResponseEntity.ok(operacionService.buscarPorId(id));
        }

        return ResponseEntity.badRequest()
                .body("No se pudo actualizar la operación.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarOperacion(@PathVariable String id) {
        boolean eliminada = operacionService.eliminarOperacion(id);

        if (eliminada) {
            return ResponseEntity.ok("Operación eliminada correctamente.");
        }

        return ResponseEntity.badRequest()
                .body("No se pudo eliminar la operación.");
    }
}
