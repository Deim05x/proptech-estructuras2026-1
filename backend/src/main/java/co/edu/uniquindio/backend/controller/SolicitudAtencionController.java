package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.SolicitudAtencion;
import co.edu.uniquindio.backend.service.SolicitudAtencionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudAtencionController {

    private final SolicitudAtencionService solicitudService;

    public SolicitudAtencionController(SolicitudAtencionService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @GetMapping
    public ResponseEntity<SolicitudAtencion[]> listar() {
        return ResponseEntity.ok(solicitudService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudAtencion> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(solicitudService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<SolicitudAtencion> crear(@RequestBody SolicitudAtencion solicitud) {
        return ResponseEntity.ok(solicitudService.crear(solicitud));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitudAtencion> actualizar(
            @PathVariable String id,
            @RequestBody SolicitudAtencion solicitud
    ) {
        return ResponseEntity.ok(solicitudService.actualizar(id, solicitud));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable String id) {
        solicitudService.eliminar(id);
        return ResponseEntity.ok("Solicitud eliminada correctamente");
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<SolicitudAtencion[]> listarPorCliente(@PathVariable String idCliente) {
        return ResponseEntity.ok(solicitudService.listarPorCliente(idCliente));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<SolicitudAtencion[]> listarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(solicitudService.listarPorEstado(estado));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<SolicitudAtencion[]> listarPendientes() {
        return ResponseEntity.ok(solicitudService.listarPendientes());
    }

    @GetMapping("/prioritarias")
    public ResponseEntity<SolicitudAtencion[]> listarPrioritarias() {
        return ResponseEntity.ok(solicitudService.listarAltaPrioridadPendientes());
    }

    @GetMapping("/cola/cantidad")
    public ResponseEntity<Integer> cantidadCola() {
        return ResponseEntity.ok(solicitudService.cantidadCola());
    }

    @GetMapping("/cola-prioridad/cantidad")
    public ResponseEntity<Integer> cantidadColaPrioridad() {
        return ResponseEntity.ok(solicitudService.cantidadColaPrioridad());
    }

    @PostMapping("/cola/recargar")
    public ResponseEntity<String> recargarCola() {
        solicitudService.recargarCola();
        return ResponseEntity.ok("Cola de solicitudes recargada correctamente");
    }

    @PostMapping("/cola-prioridad/recargar")
    public ResponseEntity<String> recargarColaPrioridad() {
        solicitudService.recargarColaPrioridad();
        return ResponseEntity.ok("Cola de prioridad recargada correctamente");
    }

    @PostMapping("/cola/procesar")
    public ResponseEntity<SolicitudAtencion> procesarSiguiente(
            @RequestParam(required = false) String idAsesor,
            @RequestParam(required = false) String respuesta
    ) {
        return ResponseEntity.ok(
                solicitudService.procesarSiguiente(idAsesor, respuesta)
        );
    }

    @PostMapping("/cola-prioridad/procesar")
    public ResponseEntity<SolicitudAtencion> procesarSiguientePrioritaria(
            @RequestParam(required = false) String idAsesor,
            @RequestParam(required = false) String respuesta
    ) {
        return ResponseEntity.ok(
                solicitudService.procesarSiguientePrioritaria(idAsesor, respuesta)
        );
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudAtencion> cambiarEstado(
            @PathVariable String id,
            @RequestParam String estado
    ) {
        return ResponseEntity.ok(solicitudService.cambiarEstado(id, estado));
    }

    @PatchMapping("/{id}/asesor")
    public ResponseEntity<SolicitudAtencion> asignarAsesor(
            @PathVariable String id,
            @RequestParam String idAsesor
    ) {
        return ResponseEntity.ok(solicitudService.asignarAsesor(id, idAsesor));
    }
}
