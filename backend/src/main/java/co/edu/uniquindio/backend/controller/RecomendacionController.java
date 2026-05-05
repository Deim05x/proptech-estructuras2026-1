package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.RecomendacionInmuebleDTO;
import co.edu.uniquindio.backend.service.RecomendacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recomendaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class RecomendacionController {

    private final RecomendacionService recomendacionService;

    public RecomendacionController(RecomendacionService recomendacionService) {
        this.recomendacionService = recomendacionService;
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<RecomendacionInmuebleDTO[]> recomendarPorCliente(
            @PathVariable String clienteId
    ) {
        RecomendacionInmuebleDTO[] recomendaciones =
                recomendacionService.recomendarPorCliente(clienteId);

        return ResponseEntity.ok(recomendaciones);
    }
}