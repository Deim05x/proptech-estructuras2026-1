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
}