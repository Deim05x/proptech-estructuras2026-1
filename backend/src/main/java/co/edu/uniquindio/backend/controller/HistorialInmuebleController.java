package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.AccionInmuebleDTO;
import co.edu.uniquindio.backend.service.HistorialInmuebleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/historial-inmuebles")
@CrossOrigin(origins = "http://localhost:5173")
public class HistorialInmuebleController {

    private final HistorialInmuebleService historialInmuebleService;

    public HistorialInmuebleController(HistorialInmuebleService historialInmuebleService) {
        this.historialInmuebleService = historialInmuebleService;
    }

    @PostMapping("/capturar/{codigo}")
    public ResponseEntity<?> capturarEstadoAntesDeCambio(
            @PathVariable String codigo,
            @RequestParam(defaultValue = "Cambio manual sobre inmueble") String descripcion
    ) {
        boolean capturado = historialInmuebleService.capturarEstadoAntesDeCambio(
                codigo,
                descripcion
        );

        if (capturado) {
            return ResponseEntity.ok("Estado anterior del inmueble guardado en la pila.");
        }

        return ResponseEntity.badRequest()
                .body("No se pudo capturar el estado anterior del inmueble.");
    }

    @PostMapping("/deshacer")
    public ResponseEntity<?> deshacerUltimoCambio() {
        AccionInmuebleDTO accion = historialInmuebleService.deshacerUltimoCambio();

        if (accion == null) {
            return ResponseEntity.ok("No hay cambios pendientes para deshacer.");
        }

        return ResponseEntity.ok(accion);
    }

    @GetMapping("/ultima-accion")
    public ResponseEntity<?> verUltimaAccion() {
        AccionInmuebleDTO accion = historialInmuebleService.verUltimaAccion();

        if (accion == null) {
            return ResponseEntity.ok("No hay acciones guardadas en la pila.");
        }

        return ResponseEntity.ok(accion);
    }

    @GetMapping("/cantidad")
    public int cantidadCambiosPendientes() {
        return historialInmuebleService.cantidadCambiosPendientes();
    }

    @DeleteMapping("/limpiar")
    public ResponseEntity<?> limpiarHistorial() {
        historialInmuebleService.limpiarHistorial();
        return ResponseEntity.ok("Historial de cambios de inmuebles limpiado correctamente.");
    }
}