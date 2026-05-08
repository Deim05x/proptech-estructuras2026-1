package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.EventoInusual;
import co.edu.uniquindio.backend.service.EventoInusualService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eventos-inusuales")
@CrossOrigin(origins = "http://localhost:5173")
public class EventoInusualController {

    private final EventoInusualService eventoInusualService;

    public EventoInusualController(EventoInusualService eventoInusualService) {
        this.eventoInusualService = eventoInusualService;
    }

    @GetMapping
    public EventoInusual[] listarEventos() {
        return eventoInusualService.listarEventos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable String id) {
        EventoInusual evento = eventoInusualService.buscarPorId(id);

        if (evento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró el evento inusual.");
        }

        return ResponseEntity.ok(evento);
    }

    @GetMapping("/estado/{estado}")
    public EventoInusual[] listarPorEstado(@PathVariable String estado) {
        return eventoInusualService.listarPorEstado(estado);
    }

    @PostMapping("/detectar")
    public ResponseEntity<?> detectarEventosInusuales() {
        int generados = eventoInusualService.detectarEventosInusuales();

        return ResponseEntity.ok(
                "Eventos inusuales generados: " + generados
        );
    }

    @PostMapping
    public ResponseEntity<?> registrarEventoManual(@RequestBody EventoInusual evento) {
        boolean registrado = eventoInusualService.registrarEventoManual(evento);

        if (registrado) {
            return ResponseEntity.status(HttpStatus.CREATED).body(evento);
        }

        return ResponseEntity.badRequest()
                .body("No se pudo registrar el evento inusual.");
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable String id,
                                           @RequestParam String estado) {
        boolean actualizado = eventoInusualService.cambiarEstado(id, estado);

        if (actualizado) {
            return ResponseEntity.ok("Estado del evento actualizado correctamente.");
        }

        return ResponseEntity.badRequest()
                .body("No se pudo actualizar el estado del evento.");
    }
}