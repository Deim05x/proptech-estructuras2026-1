package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Interaccion;
import co.edu.uniquindio.backend.service.InteraccionService;
import co.edu.uniquindio.backend.service.SesionUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interacciones")
@CrossOrigin(origins = "http://localhost:5173")
public class InteraccionController {

    private final InteraccionService interaccionService;
    private final SesionUsuarioService sesionUsuarioService;

    public InteraccionController(InteraccionService interaccionService,
                                 SesionUsuarioService sesionUsuarioService) {
        this.interaccionService = interaccionService;
        this.sesionUsuarioService = sesionUsuarioService;
    }

    @PostMapping
    public ResponseEntity<?> registrarInteraccion(@RequestBody Interaccion interaccion) {
        if (interaccion == null) {
            return ResponseEntity.badRequest()
                    .body("La interacción no puede ser nula.");
        }

        if (interaccion.getIdCliente() == null || interaccion.getIdCliente().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("El ID del cliente es obligatorio.");
        }

        if (!sesionUsuarioService.puedeAccederACliente(interaccion.getIdCliente())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para registrar interacciones de este cliente.");
        }

        boolean registrada = interaccionService.registrarInteraccion(interaccion);

        if (registrada) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(interaccion);
        }

        return ResponseEntity.badRequest()
                .body("No se pudo registrar la interacción.");
    }
}