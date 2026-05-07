package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.InmuebleOrdenadoDTO;
import co.edu.uniquindio.backend.service.OrdenamientoInmuebleService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenamientos")
@CrossOrigin(origins = "http://localhost:5173")
public class OrdenamientoInmuebleController {

    private final OrdenamientoInmuebleService ordenamientoInmuebleService;

    public OrdenamientoInmuebleController(OrdenamientoInmuebleService ordenamientoInmuebleService) {
        this.ordenamientoInmuebleService = ordenamientoInmuebleService;
    }

    @GetMapping("/inmuebles")
    public InmuebleOrdenadoDTO[] ordenarInmuebles(
            @RequestParam(defaultValue = "precio") String criterio,
            @RequestParam(defaultValue = "desc") String direccion
    ) {
        return ordenamientoInmuebleService.ordenarInmuebles(criterio, direccion);
    }
}