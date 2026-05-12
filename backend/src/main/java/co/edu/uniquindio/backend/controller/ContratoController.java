package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Contrato;
import co.edu.uniquindio.backend.service.ContratoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contratos")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @GetMapping
    public ResponseEntity<Contrato[]> listar() {
        return ResponseEntity.ok(contratoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrato> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(contratoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Contrato> crear(@RequestBody Contrato contrato) {
        return ResponseEntity.ok(contratoService.crear(contrato));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contrato> actualizar(
            @PathVariable String id,
            @RequestBody Contrato contrato
    ) {
        return ResponseEntity.ok(contratoService.actualizar(id, contrato));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable String id) {
        contratoService.eliminar(id);
        return ResponseEntity.ok("Contrato eliminado correctamente");
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<Contrato[]> listarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(contratoService.listarPorEstado(estado));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<Contrato[]> listarPorCliente(@PathVariable String idCliente) {
        return ResponseEntity.ok(contratoService.listarPorCliente(idCliente));
    }

    @GetMapping("/proximos-vencer")
    public ResponseEntity<Contrato[]> listarProximosAVencer(
            @RequestParam(defaultValue = "30") int dias
    ) {
        return ResponseEntity.ok(contratoService.listarProximosAVencer(dias));
    }

    @GetMapping("/vencidos")
    public ResponseEntity<Contrato[]> listarVencidos() {
        return ResponseEntity.ok(contratoService.listarVencidos());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Contrato> cambiarEstado(
            @PathVariable String id,
            @RequestParam String estado
    ) {
        return ResponseEntity.ok(contratoService.cambiarEstado(id, estado));
    }
}
