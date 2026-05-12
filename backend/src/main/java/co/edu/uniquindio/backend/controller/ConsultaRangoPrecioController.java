package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.InmuebleRangoPrecioDTO;
import co.edu.uniquindio.backend.service.ConsultaRangoPrecioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rangos-precio")
public class ConsultaRangoPrecioController {

    private final ConsultaRangoPrecioService consultaRangoPrecioService;

    public ConsultaRangoPrecioController(ConsultaRangoPrecioService consultaRangoPrecioService) {
        this.consultaRangoPrecioService = consultaRangoPrecioService;
    }

    @GetMapping
    public ResponseEntity<InmuebleRangoPrecioDTO> buscarPorRango(
            @RequestParam double minimo,
            @RequestParam double maximo
    ) {
        return ResponseEntity.ok(
                consultaRangoPrecioService.buscarPorRango(minimo, maximo)
        );
    }

    @GetMapping("/ordenados")
    public ResponseEntity<InmuebleRangoPrecioDTO> listarOrdenadosPorPrecio() {
        return ResponseEntity.ok(
                consultaRangoPrecioService.listarOrdenadosPorPrecio()
        );
    }
}
