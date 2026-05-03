package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.LoginRequest;
import co.edu.uniquindio.backend.dto.LoginResponse;
import co.edu.uniquindio.backend.dto.RegisterClienteRequest;
import co.edu.uniquindio.backend.model.AuthToken;
import co.edu.uniquindio.backend.service.AuthService;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostConstruct
    public void init() {
        authService.sembrarAdminSiNoExiste();
    }

    @PostMapping("/register-cliente")
    public ResponseEntity<?> registerCliente(@RequestBody RegisterClienteRequest request) {
        boolean ok = authService.registrarCliente(request);

        if (ok) {
            return ResponseEntity.ok("Cliente registrado para autenticación correctamente.");
        }

        return ResponseEntity.badRequest().body("No se pudo registrar el cliente.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);

        if (response == null) {
            return ResponseEntity.status(401).body("Credenciales inválidas.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Token no enviado.");
        }

        boolean ok = authService.logout(header.substring(7));

        if (ok) {
            return ResponseEntity.ok("Sesión cerrada correctamente.");
        }

        return ResponseEntity.badRequest().body("No se pudo cerrar la sesión.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || authentication.getDetails() == null) {
            return ResponseEntity.status(401).body("No autenticado.");
        }

        AuthToken token = (AuthToken) authentication.getDetails();
        return ResponseEntity.ok(new LoginResponse(
                token.getToken(),
                token.getUsername(),
                token.getRol().name(),
                token.getClienteId()
        ));
    }
}