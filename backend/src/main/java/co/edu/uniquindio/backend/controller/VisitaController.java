package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.CancelarVisitaRequest;
import co.edu.uniquindio.backend.dto.ReprogramarVisitaRequest;
import co.edu.uniquindio.backend.model.Visita;
import co.edu.uniquindio.backend.service.SesionUsuarioService;
import co.edu.uniquindio.backend.service.VisitaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visitas")
@CrossOrigin(origins = "http://localhost:5173")
public class VisitaController {

    private final VisitaService visitaService;
    private final SesionUsuarioService sesionUsuarioService;

    public VisitaController(VisitaService visitaService,
                            SesionUsuarioService sesionUsuarioService) {
        this.visitaService = visitaService;
        this.sesionUsuarioService = sesionUsuarioService;
    }

    @GetMapping("/test")
    public String pruebaVisitas() {
        return visitaService.obtenerMensaje();
    }

    @GetMapping
    public ResponseEntity<?> listarVisitas() {
        Visita[] visitas = visitaService.listarVisitas();

        if (sesionUsuarioService.esAdmin()) {
            return ResponseEntity.ok(visitas);
        }

        if (sesionUsuarioService.esCliente()) {
            String clienteId = sesionUsuarioService.obtenerClienteIdAutenticado();
            return ResponseEntity.ok(filtrarVisitasPorCliente(visitas, clienteId));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("No tienes permiso para consultar visitas.");
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> listarVisitasPorEstado(@PathVariable String estado) {
        Visita[] visitas = visitaService.listarVisitasPorEstado(estado);

        if (sesionUsuarioService.esAdmin()) {
            return ResponseEntity.ok(visitas);
        }

        if (sesionUsuarioService.esCliente()) {
            String clienteId = sesionUsuarioService.obtenerClienteIdAutenticado();
            return ResponseEntity.ok(filtrarVisitasPorCliente(visitas, clienteId));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("No tienes permiso para consultar visitas.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerVisitaPorId(@PathVariable int id) {
        Visita visita = visitaService.buscarPorId(id);

        if (visita == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la visita.");
        }

        if (!puedeAccederAVisita(visita)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para consultar esta visita.");
        }

        return ResponseEntity.ok(visita);
    }

    @PostMapping
    public ResponseEntity<?> agregarVisita(@RequestBody Visita visita) {
        prepararVisitaSegunRol(visita);

        boolean agregado = visitaService.agregarVisita(visita);

        if (agregado) {
            return ResponseEntity.status(HttpStatus.CREATED).body(visita);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo agregar la visita. Verifica que el id exista y que no esté repetido.");
    }

    @PostMapping("/agendar")
    public ResponseEntity<?> agendarVisita(@RequestBody Visita visita) {
        prepararVisitaSegunRol(visita);

        boolean agendada = visitaService.agregarVisita(visita);

        if (agendada) {
            return ResponseEntity.status(HttpStatus.CREATED).body(visita);
        }

        return ResponseEntity.badRequest()
                .body("No se pudo agendar la visita.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarVisita(@PathVariable int id,
                                              @RequestBody Visita visita) {
        Visita visitaActual = visitaService.buscarPorId(id);

        if (visitaActual == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la visita.");
        }

        if (!puedeAccederAVisita(visitaActual)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para actualizar esta visita.");
        }

        if (sesionUsuarioService.esCliente()) {
            visita.setIdCliente(sesionUsuarioService.obtenerClienteIdAutenticado());
        }

        boolean actualizado = visitaService.actualizarVisita(id, visita);

        if (actualizado) {
            Visita actualizadaObj = visitaService.buscarPorId(id);
            return ResponseEntity.ok(actualizadaObj);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo actualizar la visita. Verifica que el id exista.");
    }

    @PutMapping("/{id}/reprogramar")
    public ResponseEntity<?> reprogramarVisita(@PathVariable int id,
                                               @RequestBody ReprogramarVisitaRequest request) {
        Visita visitaActual = visitaService.buscarPorId(id);

        if (visitaActual == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la visita.");
        }

        if (!puedeAccederAVisita(visitaActual)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para reprogramar esta visita.");
        }

        boolean reprogramada = visitaService.reprogramarVisita(id, request);

        if (reprogramada) {
            return ResponseEntity.ok(visitaService.buscarPorId(id));
        }

        return ResponseEntity.badRequest()
                .body("No se pudo reprogramar la visita.");
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarVisita(@PathVariable int id,
                                            @RequestBody CancelarVisitaRequest request) {
        Visita visitaActual = visitaService.buscarPorId(id);

        if (visitaActual == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la visita.");
        }

        if (!puedeAccederAVisita(visitaActual)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para cancelar esta visita.");
        }

        boolean cancelada = visitaService.cancelarVisita(id, request);

        if (cancelada) {
            return ResponseEntity.ok(visitaService.buscarPorId(id));
        }

        return ResponseEntity.badRequest()
                .body("No se pudo cancelar la visita.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarVisita(@PathVariable int id) {
        Visita visitaActual = visitaService.buscarPorId(id);

        if (visitaActual == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la visita.");
        }

        if (!puedeAccederAVisita(visitaActual)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para eliminar esta visita.");
        }

        boolean eliminado = visitaService.eliminarVisita(id);

        if (eliminado) {
            return ResponseEntity.ok("Visita eliminada correctamente.");
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo eliminar la visita. Verifica que el id exista.");
    }

    private void prepararVisitaSegunRol(Visita visita) {
        if (visita == null) {
            return;
        }

        if (sesionUsuarioService.esCliente()) {
            visita.setIdCliente(sesionUsuarioService.obtenerClienteIdAutenticado());
        }
    }

    private boolean puedeAccederAVisita(Visita visita) {
        if (visita == null) {
            return false;
        }

        if (sesionUsuarioService.esAdmin()) {
            return true;
        }

        if (!sesionUsuarioService.esCliente()) {
            return false;
        }

        String clienteAutenticado = sesionUsuarioService.obtenerClienteIdAutenticado();

        return clienteAutenticado != null
                && visita.getIdCliente() != null
                && clienteAutenticado.equalsIgnoreCase(visita.getIdCliente());
    }

    private Visita[] filtrarVisitasPorCliente(Visita[] visitas, String clienteId) {
        if (visitas == null || clienteId == null) {
            return new Visita[0];
        }

        Visita[] temporal = new Visita[visitas.length];
        int contador = 0;

        for (Visita visita : visitas) {
            if (visita == null || visita.getIdCliente() == null) {
                continue;
            }

            if (visita.getIdCliente().equalsIgnoreCase(clienteId)) {
                temporal[contador] = visita;
                contador++;
            }
        }

        Visita[] resultado = new Visita[contador];

        for (int i = 0; i < contador; i++) {
            resultado[i] = temporal[i];
        }

        return resultado;
    }
}