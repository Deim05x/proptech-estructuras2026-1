package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Alerta;
import co.edu.uniquindio.backend.service.AlertaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertaController {

    private final AlertaService alertaService;

    public AlertaController(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    @GetMapping
    public Alerta[] listarAlertas() {
        return alertaService.listarAlertas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable String id) {
        Alerta alerta = alertaService.buscarPorId(id);

        if (alerta == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la alerta.");
        }

        return ResponseEntity.ok(alerta);
    }

    @GetMapping("/estado/{estado}")
    public Alerta[] listarPorEstado(@PathVariable String estado) {
        return alertaService.listarAlertasPorEstado(estado);
    }

    @PostMapping
    public ResponseEntity<?> registrarAlerta(@RequestBody Alerta alerta) {
        boolean registrada = alertaService.registrarAlerta(alerta);

        if (registrada) {
            return ResponseEntity.status(HttpStatus.CREATED).body(alerta);
        }

        return ResponseEntity.badRequest()
                .body("No se pudo registrar la alerta.");
    }

    @PostMapping("/generar")
    public ResponseEntity<?> generarAlertasAutomaticas() {
        int generadas = alertaService.generarAlertasAutomaticas();

        return ResponseEntity.ok(
                "Alertas automáticas generadas: " + generadas
        );
    }

    @PostMapping("/recargar-cola")
    public ResponseEntity<?> recargarColaPendientes() {
        alertaService.recargarColaPendientes();

        return ResponseEntity.ok(
                "Cola de alertas pendientes recargada correctamente."
        );
    }

    @PostMapping("/procesar-siguiente")
    public ResponseEntity<?> procesarSiguienteAlerta() {
        Alerta alerta = alertaService.procesarSiguienteAlerta();

        if (alerta == null) {
            return ResponseEntity.ok("No hay alertas pendientes en la cola.");
        }

        return ResponseEntity.ok(alerta);
    }

    @GetMapping("/cola/cantidad")
    public int cantidadPendientesEnCola() {
        return alertaService.cantidadPendientesEnCola();
    }

    @PostMapping("/recargar-cola-prioridad")
    public ResponseEntity<?> recargarColaPrioridad() {
        alertaService.recargarColaPrioridad();

        return ResponseEntity.ok(
                "Cola de prioridad de alertas recargada correctamente."
        );
    }

    @PostMapping("/procesar-siguiente-prioritaria")
    public ResponseEntity<?> procesarSiguienteAlertaPrioritaria() {
        Alerta alerta = alertaService.procesarSiguienteAlertaPrioritaria();

        if (alerta == null) {
            return ResponseEntity.ok("No hay alertas pendientes en la cola de prioridad.");
        }

        return ResponseEntity.ok(alerta);
    }

    @GetMapping("/cola-prioridad/cantidad")
    public int cantidadPendientesEnColaPrioridad() {
        return alertaService.cantidadPendientesEnColaPrioridad();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable String id,
                                           @RequestParam String estado) {
        boolean actualizada = alertaService.cambiarEstado(id, estado);

        if (actualizada) {
            return ResponseEntity.ok("Estado de alerta actualizado correctamente.");
        }

        return ResponseEntity.badRequest()
                .body("No se pudo actualizar el estado de la alerta.");
    }
}