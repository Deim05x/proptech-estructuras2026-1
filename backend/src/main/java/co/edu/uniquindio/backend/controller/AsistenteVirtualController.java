package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.AsistenteVirtualRequest;
import co.edu.uniquindio.backend.dto.AsistenteVirtualResponse;
import co.edu.uniquindio.backend.model.AuthToken;
import co.edu.uniquindio.backend.service.AsistenteVirtualService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ia")
@CrossOrigin(origins = "http://localhost:5173")
public class AsistenteVirtualController {

    private final AsistenteVirtualService asistenteVirtualService;

    public AsistenteVirtualController(AsistenteVirtualService asistenteVirtualService) {
        this.asistenteVirtualService = asistenteVirtualService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AsistenteVirtualResponse> responder(
            @RequestBody AsistenteVirtualRequest request,
            Authentication authentication) {
        AuthToken token = obtenerToken(authentication);
        String clienteId = token == null ? null : token.getClienteId();
        String rol = token == null ? "INVITADO" : token.getRol().name();

        return ResponseEntity.ok(asistenteVirtualService.responder(request, clienteId, rol));
    }

    private AuthToken obtenerToken(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof AuthToken token)) {
            return null;
        }

        return token;
    }
}
