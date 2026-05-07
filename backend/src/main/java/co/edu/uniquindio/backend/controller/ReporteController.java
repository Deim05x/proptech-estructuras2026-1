package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.ReporteItemDTO;
import co.edu.uniquindio.backend.dto.ReporteResumenDTO;
import co.edu.uniquindio.backend.service.ReporteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/resumen")
    public ReporteResumenDTO resumenGeneral() {
        return reporteService.generarResumenGeneral();
    }

    @GetMapping("/zonas")
    public ReporteItemDTO[] reporteInmueblesPorZona() {
        return reporteService.reporteInmueblesPorZona();
    }

    @GetMapping("/precios")
    public ReporteItemDTO[] reporteInmueblesPorRangoPrecio() {
        return reporteService.reporteInmueblesPorRangoPrecio();
    }

    @GetMapping("/visitas-inmueble")
    public ReporteItemDTO[] reporteVisitasPorInmueble() {
        return reporteService.reporteVisitasPorInmueble();
    }

    @GetMapping("/visitas-zona")
    public ReporteItemDTO[] reporteVisitasPorZona() {
        return reporteService.reporteVisitasPorZona();
    }

    @GetMapping("/cierres-asesor")
    public ReporteItemDTO[] reporteCierresPorAsesor() {
        return reporteService.reporteCierresPorAsesor();
    }

    @GetMapping("/operaciones-tipo")
    public ReporteItemDTO[] reporteOperacionesPorTipo() {
        return reporteService.reporteOperacionesPorTipo();
    }
}