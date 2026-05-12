package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.ResultadoValidacionDTO;
import co.edu.uniquindio.backend.dto.ValidacionNegocioDTO;
import co.edu.uniquindio.backend.service.ValidacionNegocioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/validaciones")
public class ValidacionNegocioController {

    private final ValidacionNegocioService validacionNegocioService;

    public ValidacionNegocioController(ValidacionNegocioService validacionNegocioService) {
        this.validacionNegocioService = validacionNegocioService;
    }

    @PostMapping
    public ResponseEntity<ResultadoValidacionDTO> validar(
            @RequestBody ValidacionNegocioDTO dto
    ) {
        return ResponseEntity.ok(validacionNegocioService.validar(dto));
    }

    @PostMapping("/agendar-visita")
    public ResponseEntity<ResultadoValidacionDTO> validarAgendarVisita(
            @RequestBody ValidacionNegocioDTO dto
    ) {
        return ResponseEntity.ok(validacionNegocioService.validarAgendarVisita(dto));
    }

    @PostMapping("/crear-operacion")
    public ResponseEntity<ResultadoValidacionDTO> validarCrearOperacion(
            @RequestBody ValidacionNegocioDTO dto
    ) {
        return ResponseEntity.ok(validacionNegocioService.validarCrearOperacion(dto));
    }

    @PostMapping("/crear-contrato")
    public ResponseEntity<ResultadoValidacionDTO> validarCrearContrato(
            @RequestBody ValidacionNegocioDTO dto
    ) {
        return ResponseEntity.ok(validacionNegocioService.validarCrearContrato(dto));
    }

    @PostMapping("/intencion-comercial")
    public ResponseEntity<ResultadoValidacionDTO> validarIntencionComercial(
            @RequestBody ValidacionNegocioDTO dto
    ) {
        return ResponseEntity.ok(validacionNegocioService.validarIntencionComercial(dto));
    }

    @GetMapping("/consistencia-general")
    public ResponseEntity<ResultadoValidacionDTO> validarConsistenciaGeneral() {
        return ResponseEntity.ok(validacionNegocioService.validarConsistenciaGeneral());
    }
}
