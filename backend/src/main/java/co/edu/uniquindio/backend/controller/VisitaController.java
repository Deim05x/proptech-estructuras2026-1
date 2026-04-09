package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Visita;
import co.edu.uniquindio.backend.service.VisitaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visitas")
public class VisitaController {

    private final VisitaService visitaService;

    public VisitaController(VisitaService visitaService) {
        this.visitaService = visitaService;
    }

    @GetMapping("/test")
    public String pruebaVisitas() {
        return visitaService.obtenerMensaje();
    }

    @GetMapping
    public Visita[] listarVisitas() {
        return visitaService.listarVisitas();
    }

    @GetMapping("/{id}")
    public Visita obtenerVisitaPorId(@PathVariable int id) {
        return visitaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<?> agregarVisita(@RequestBody Visita visita) {
        boolean agregado = visitaService.agregarVisita(visita);

        if (agregado) {
            return ResponseEntity.status(HttpStatus.CREATED).body(visita);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo agregar la visita. Verifica que el id exista y que no esté repetido.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarVisita(@PathVariable int id,
                                              @RequestBody Visita visita) {
        boolean actualizado = visitaService.actualizarVisita(id, visita);

        if (actualizado) {
            Visita actualizadaObj = visitaService.buscarPorId(id);
            return ResponseEntity.ok(actualizadaObj);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo actualizar la visita. Verifica que el id exista.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarVisita(@PathVariable int id) {
        boolean eliminado = visitaService.eliminarVisita(id);

        if (eliminado) {
            return ResponseEntity.ok("Visita eliminada correctamente.");
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo eliminar la visita. Verifica que el id exista.");
    }
}