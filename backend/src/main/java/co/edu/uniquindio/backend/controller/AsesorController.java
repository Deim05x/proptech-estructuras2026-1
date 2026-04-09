package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Asesor;
import co.edu.uniquindio.backend.service.AsesorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/asesores")
public class AsesorController {

    private final AsesorService asesorService;

    public AsesorController(AsesorService asesorService) {
        this.asesorService = asesorService;
    }

    @GetMapping("/test")
    public String pruebaAsesores() {
        return asesorService.obtenerMensaje();
    }

    @GetMapping
    public Asesor[] listarAsesores() {
        return asesorService.listarAsesores();
    }

    @GetMapping("/{id}")
    public Asesor obtenerAsesorPorId(@PathVariable String id) {
        return asesorService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<?> agregarAsesor(@RequestBody Asesor asesor) {
        boolean agregado = asesorService.agregarAsesor(asesor);

        if (agregado) {
            return ResponseEntity.status(HttpStatus.CREATED).body(asesor);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo agregar el asesor. Verifica que el id exista y que no esté repetido.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAsesor(@PathVariable String id,
                                              @RequestBody Asesor asesor) {
        boolean actualizado = asesorService.actualizarAsesor(id, asesor);

        if (actualizado) {
            Asesor actualizadoObj = asesorService.buscarPorId(id);
            return ResponseEntity.ok(actualizadoObj);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo actualizar el asesor. Verifica que el id exista.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAsesor(@PathVariable String id) {
        boolean eliminado = asesorService.eliminarAsesor(id);

        if (eliminado) {
            return ResponseEntity.ok("Asesor eliminado correctamente.");
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo eliminar el asesor. Verifica que el id exista.");
    }
}