package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Cliente;
import co.edu.uniquindio.backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio base para clientes.
 *
 * <p>Uso de estructuras propias: trabaja con {@link LinkedSimpleList} para
 * listar y buscar clientes cargados desde la persistencia.</p>
 *
 * <p>Justificacion: las operaciones de clientes son recorridos secuenciales
 * simples, por lo que la lista propia cubre el caso sin introducir estructuras
 * mas complejas.</p>
 */
@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public String obtenerMensaje() {
        return "Servicio de clientes funcionando correctamente con lista propia y MariaDB";
    }

    private LinkedSimpleList<Cliente> obtenerListaDesdeBD() {
        return clienteRepository.obtenerTodos();
    }

    public Cliente[] listarClientes() {
        LinkedSimpleList<Cliente> listaClientes = obtenerListaDesdeBD();
        Cliente[] arreglo = new Cliente[listaClientes.getSize()];

        for (int i = 0; i < listaClientes.getSize(); i++) {
            arreglo[i] = listaClientes.getNodeValue(i);
        }

        return arreglo;
    }

    public Cliente buscarPorId(String id) {
        LinkedSimpleList<Cliente> listaClientes = obtenerListaDesdeBD();

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

        return clienteRepository.guardar(cliente);
    }

    public boolean actualizarCliente(String id, Cliente clienteActualizado) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        if (clienteActualizado == null) {
            return false;
        }

        Cliente existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        clienteActualizado.setId(id);

        return clienteRepository.actualizar(id, clienteActualizado);
    }

    public boolean eliminarCliente(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Cliente existente = buscarPorId(id);
        if (existente == null) {
            return false;
        }

        return clienteRepository.eliminar(id);
    }
}
