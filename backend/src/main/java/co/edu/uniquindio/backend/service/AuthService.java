package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.LoginRequest;
import co.edu.uniquindio.backend.dto.LoginResponse;
import co.edu.uniquindio.backend.dto.RegisterClienteRequest;
import co.edu.uniquindio.backend.model.AuthToken;
import co.edu.uniquindio.backend.model.AuthUsuario;
import co.edu.uniquindio.backend.model.Cliente;
import co.edu.uniquindio.backend.model.Role;
import co.edu.uniquindio.backend.repository.AuthTokenRepository;
import co.edu.uniquindio.backend.repository.AuthUsuarioRepository;
import co.edu.uniquindio.backend.repository.ClienteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthUsuarioRepository authUsuarioRepository;
    private final AuthTokenRepository authTokenRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthUsuarioRepository authUsuarioRepository,
            AuthTokenRepository authTokenRepository,
            ClienteRepository clienteRepository,
            PasswordEncoder passwordEncoder) {
        this.authUsuarioRepository = authUsuarioRepository;
        this.authTokenRepository = authTokenRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void sembrarAdminSiNoExiste() {
        if (!authUsuarioRepository.existeUsername("admin")) {
            AuthUsuario admin = new AuthUsuario(
                    0,
                    "admin",
                    passwordEncoder.encode("Admin123*"),
                    Role.ADMIN,
                    null,
                    true);

            authUsuarioRepository.guardar(admin);
        }

        sembrarClienteSiNoExiste("cliente1", "Cliente123*", "CLI-001");
        sembrarClienteSiNoExiste("cliente2", "Cliente123*", "CLI-002");
    }

    private void sembrarClienteSiNoExiste(String username, String password, String clienteId) {
        if (authUsuarioRepository.existeUsername(username)) {
            return;
        }

        AuthUsuario usuario = new AuthUsuario(
                0,
                username,
                passwordEncoder.encode(password),
                Role.CLIENTE,
                clienteId,
                true);

        authUsuarioRepository.guardar(usuario);
    }

    public boolean registrarCliente(RegisterClienteRequest request) {
        if (request == null)
            return false;
        if (request.getUsername() == null || request.getUsername().isBlank())
            return false;
        if (request.getPassword() == null || request.getPassword().isBlank())
            return false;
        if (request.getNombre() == null || request.getNombre().isBlank())
            return false;
        if (request.getCorreo() == null || request.getCorreo().isBlank())
            return false;

        if (authUsuarioRepository.existeUsername(request.getUsername())) {
            return false;
        }

        String nuevoClienteId = clienteRepository.generarNuevoIdCliente();

        Cliente cliente = new Cliente();
        cliente.setId(nuevoClienteId);
        cliente.setNombre(request.getNombre());
        cliente.setCorreo(request.getCorreo());
        cliente.setTelefono(request.getTelefono());
        cliente.setTipoCliente("COMPRADOR");
        cliente.setPresupuesto(0);
        cliente.setZonasInteres("");
        cliente.setTipoInmuebleDeseado("");
        cliente.setHabitacionesMinimas(0);
        cliente.setEstadoBusqueda("ACTIVO");

        boolean clienteCreado = clienteRepository.guardar(cliente);

        if (!clienteCreado) {
            return false;
        }

        AuthUsuario usuario = new AuthUsuario(
                0,
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                Role.CLIENTE,
                nuevoClienteId,
                true);

        return authUsuarioRepository.guardar(usuario);
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null)
            return null;

        AuthUsuario usuario = authUsuarioRepository.buscarPorUsername(request.getUsername());

        if (usuario == null || !usuario.isActivo()) {
            return null;
        }

        boolean passwordOk = passwordEncoder.matches(
                request.getPassword(),
                usuario.getPasswordHash());

        if (!passwordOk) {
            return null;
        }

        String tokenPlano = UUID.randomUUID().toString();
        LocalDateTime ahora = LocalDateTime.now();

        AuthToken token = new AuthToken(
                0,
                tokenPlano,
                usuario.getUsername(),
                usuario.getRol(),
                usuario.getClienteId(),
                ahora,
                ahora.plusHours(12),
                false);

        boolean guardado = authTokenRepository.guardar(token);

        if (!guardado) {
            return null;
        }

        return new LoginResponse(
                tokenPlano,
                usuario.getUsername(),
                usuario.getRol().name(),
                usuario.getClienteId());
    }

    public boolean logout(String bearerToken) {
        if (bearerToken == null || bearerToken.isBlank())
            return false;
        return authTokenRepository.revocar(bearerToken);
    }

    public AuthToken validarToken(String tokenPlano) {
        if (tokenPlano == null || tokenPlano.isBlank())
            return null;

        authTokenRepository.revocarExpirados();

        AuthToken token = authTokenRepository.buscarTokenValido(tokenPlano);

        if (token == null)
            return null;
        if (token.isRevocado())
            return null;
        if (token.getExpiraEn().isBefore(LocalDateTime.now()))
            return null;

        return token;
    }

}
