package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Cliente;
import co.edu.uniquindio.backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final LinkedSimpleList<Cliente> listaClientes;
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
        this.listaClientes = clienteRepository.obtenerTodos();
    }

    public String obtenerMensaje() {
        return "Servicio de clientes funcionando correctamente con lista propia y MariaDB";
    }

    public Cliente[] listarClientes() {
        Cliente[] arreglo = new Cliente[listaClientes.getSize()];

        for (int i = 0; i < listaClientes.getSize(); i++) {
            arreglo[i] = listaClientes.getNodeValue(i);
        }

        return arreglo;
    }

    public Cliente buscarPorId(String id) {
        for (Cliente cliente : listaClientes) {
            if (cliente.getId().equals(id)) {
                return cliente;
            }
        }
        return null;
    }

    public boolean agregarCliente(Cliente cliente) {
        if (cliente == null) {
            return false;
        }

        if (cliente.getId() == null || cliente.getId().trim().isEmpty()) {
            return false;
        }

        if (buscarPorId(cliente.getId()) != null) {
            return false;
        }

        boolean guardado = clienteRepository.guardar(cliente);

        if (guardado) {
            listaClientes.addLast(cliente);
        }

        return guardado;
    }
}