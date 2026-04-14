package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Asesor;
import co.edu.uniquindio.backend.service.RotacionAsesorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rotacion-asesores")
@CrossOrigin(origins = "http://localhost:5173")
public class RotacionAsesorController {

    private final RotacionAsesorService rotacionAsesorService;

    public RotacionAsesorController(RotacionAsesorService rotacionAsesorService) {
        this.rotacionAsesorService = rotacionAsesorService;
    }

    @GetMapping
    public Asesor[] obtenerRuedaActual() {
        return rotacionAsesorService.obtenerRuedaActual();
    }

    @GetMapping("/actual")
    public ResponseEntity<?> verAsesorActual() {
        Asesor asesor = rotacionAsesorService.verAsesorActual();

        if (asesor == null) {
            return ResponseEntity.badRequest().body("No hay asesores cargados en la rueda.");
        }

        return ResponseEntity.ok(asesor);
    }

    @GetMapping("/siguiente")
    public ResponseEntity<?> obtenerSiguienteAsesor() {
        Asesor asesor = rotacionAsesorService.obtenerSiguienteAsesor();

        if (asesor == null) {
            return ResponseEntity.badRequest().body("No hay asesores cargados en la rueda.");
        }

        return ResponseEntity.ok(asesor);
    }

    @PostMapping("/reiniciar")
    public ResponseEntity<?> reiniciarRotacion() {
        rotacionAsesorService.reiniciarRotacion();
        return ResponseEntity.ok("Rotación reiniciada correctamente.");
    }

    @PostMapping("/recargar")
    public ResponseEntity<?> recargarRueda() {
        rotacionAsesorService.recargarRueda();
        return ResponseEntity.ok("Rueda de asesores recargada correctamente.");
    }

    @GetMapping("/cantidad")
    public int obtenerCantidadAsesores() {
        return rotacionAsesorService.obtenerCantidadAsesores();
    }
}