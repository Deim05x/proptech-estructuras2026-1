package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.AlertaComercialDTO;
import co.edu.uniquindio.backend.service.MotorAlertasComercialesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/motor-alertas")
public class MotorAlertasComercialesController {

    private final MotorAlertasComercialesService motorAlertasComercialesService;

    public MotorAlertasComercialesController(
            MotorAlertasComercialesService motorAlertasComercialesService
    ) {
        this.motorAlertasComercialesService = motorAlertasComercialesService;
    }

    @GetMapping
    public ResponseEntity<AlertaComercialDTO[]> generarAlertasComerciales() {
        return ResponseEntity.ok(
                motorAlertasComercialesService.generarAlertasComerciales()
        );
    }

    @GetMapping("/contratos-proximos")
    public ResponseEntity<AlertaComercialDTO[]> contratosProximosAVencer() {
        return ResponseEntity.ok(
                motorAlertasComercialesService.detectarContratosProximosAVencer()
        );
    }

    @GetMapping("/contratos-vencidos")
    public ResponseEntity<AlertaComercialDTO[]> contratosVencidos() {
        return ResponseEntity.ok(
                motorAlertasComercialesService.detectarContratosVencidos()
        );
    }

    @GetMapping("/solicitudes-prioritarias")
    public ResponseEntity<AlertaComercialDTO[]> solicitudesPrioritarias() {
        return ResponseEntity.ok(
                motorAlertasComercialesService.detectarSolicitudesAltaPrioridad()
        );
    }

    @GetMapping("/clientes-alta-intencion")
    public ResponseEntity<AlertaComercialDTO[]> clientesAltaIntencion() {
        return ResponseEntity.ok(
                motorAlertasComercialesService.detectarClientesConAltaIntencion()
        );
    }

    @GetMapping("/inmuebles-alta-demanda")
    public ResponseEntity<AlertaComercialDTO[]> inmueblesAltaDemanda() {
        return ResponseEntity.ok(
                motorAlertasComercialesService.detectarInmueblesConAltaIntencion()
        );
    }
}
