package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.model.AuthUsuario;
import co.edu.uniquindio.backend.model.Role;
import co.edu.uniquindio.backend.repository.AuthUsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SesionUsuarioService {

    private final AuthUsuarioRepository authUsuarioRepository;

    public SesionUsuarioService(AuthUsuarioRepository authUsuarioRepository) {
        this.authUsuarioRepository = authUsuarioRepository;
    }

    public AuthUsuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String username = authentication.getName();

        if (username == null || username.isBlank()) {
            return null;
        }

        return authUsuarioRepository.buscarPorUsername(username);
    }

    public boolean esAdmin() {
        AuthUsuario usuario = obtenerUsuarioAutenticado();

        return usuario != null
                && usuario.getRol() != null
                && usuario.getRol() == Role.ADMIN;
    }

    public boolean esCliente() {
        AuthUsuario usuario = obtenerUsuarioAutenticado();

        return usuario != null
                && usuario.getRol() != null
                && usuario.getRol() == Role.CLIENTE;
    }

    public String obtenerClienteIdAutenticado() {
        AuthUsuario usuario = obtenerUsuarioAutenticado();

        if (usuario == null) {
            return null;
        }

        return usuario.getClienteId();
    }

    public boolean puedeAccederACliente(String clienteIdSolicitado) {
        if (clienteIdSolicitado == null || clienteIdSolicitado.isBlank()) {
            return false;
        }

        if (esAdmin()) {
            return true;
        }

        if (!esCliente()) {
            return false;
        }

        String clienteIdAutenticado = obtenerClienteIdAutenticado();

        return clienteIdAutenticado != null
                && clienteIdAutenticado.equalsIgnoreCase(clienteIdSolicitado);
    }
}