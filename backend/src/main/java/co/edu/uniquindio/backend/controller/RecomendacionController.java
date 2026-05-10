package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.RecomendacionInmuebleDTO;
import co.edu.uniquindio.backend.service.RecomendacionService;
import co.edu.uniquindio.backend.service.SesionUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recomendaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class RecomendacionController {

    private final RecomendacionService recomendacionService;
    private final SesionUsuarioService sesionUsuarioService;

    public RecomendacionController(RecomendacionService recomendacionService,
                                   SesionUsuarioService sesionUsuarioService) {
        this.recomendacionService = recomendacionService;
        this.sesionUsuarioService = sesionUsuarioService;
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<?> recomendarPorCliente(@PathVariable String clienteId) {
        if (!sesionUsuarioService.puedeAccederACliente(clienteId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para consultar recomendaciones de este cliente.");
        }

        RecomendacionInmuebleDTO[] recomendaciones =
                recomendacionService.recomendarPorCliente(clienteId);

        return ResponseEntity.ok(recomendaciones);
    }
}