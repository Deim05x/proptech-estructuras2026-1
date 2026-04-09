package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Cliente;
import co.edu.uniquindio.backend.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/test")
    public String pruebaClientes() {
        return clienteService.obtenerMensaje();
    }

    @GetMapping
    public Cliente[] listarClientes() {
        return clienteService.listarClientes();
    }

    @GetMapping("/{id}")
    public Cliente obtenerClientePorId(@PathVariable String id) {
        return clienteService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<?> agregarCliente(@RequestBody Cliente cliente) {
        boolean agregado = clienteService.agregarCliente(cliente);

        if (agregado) {
            return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo agregar el cliente. Verifica que el id exista y que no esté repetido.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCliente(@PathVariable String id,
                                               @RequestBody Cliente cliente) {
        boolean actualizado = clienteService.actualizarCliente(id, cliente);

        if (actualizado) {
            Cliente actualizadoObj = clienteService.buscarPorId(id);
            return ResponseEntity.ok(actualizadoObj);
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo actualizar el cliente. Verifica que el id exista.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable String id) {
        boolean eliminado = clienteService.eliminarCliente(id);

        if (eliminado) {
            return ResponseEntity.ok("Cliente eliminado correctamente.");
        }

        return ResponseEntity
                .badRequest()
                .body("No se pudo eliminar el cliente. Verifica que el id exista.");
    }
}