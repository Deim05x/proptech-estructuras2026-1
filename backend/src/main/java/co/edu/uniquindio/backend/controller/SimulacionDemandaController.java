package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.ProyeccionDemandaDTO;
import co.edu.uniquindio.backend.dto.ResumenSimulacionDemandaDTO;
import co.edu.uniquindio.backend.service.SimulacionDemandaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para el módulo de Simulación de Demanda (RA7).
 * Proporciona endpoints para:
 * - Simular crecimiento de demanda por sector/zona
 * - Proyectar tendencias futuras (3 meses)
 * - Generar recomendaciones estratégicas
 * - Obtener resumen global de mercado
 * 
 * Esta funcionalidad permite a la inmobiliaria:
 * - Identificar zonas con mayor potencial de crecimiento
 * - Tomar decisiones sobre inversión en inventario
 * - Ajustar estrategias de precios según demanda
 * - Prever tendencias del mercado
 */
@RestController
@RequestMapping("/api/simulacion-demanda")
@CrossOrigin(origins = "http://localhost:5173")
public class SimulacionDemandaController {

    private final SimulacionDemandaService simulacionDemandaService;

    public SimulacionDemandaController(SimulacionDemandaService simulacionDemandaService) {
        this.simulacionDemandaService = simulacionDemandaService;
    }

    /**
     * Simula el crecimiento de demanda para todas las zonas del sistema.
     * 
     * @return Array de ProyeccionDemandaDTO con predicciones por zona
     */
    @GetMapping("/zonas")
    public ResponseEntity<ProyeccionDemandaDTO[]> simularDemandaPorZona() {
        ProyeccionDemandaDTO[] proyecciones = simulacionDemandaService.simularDemandaPorZona();
        return ResponseEntity.ok(proyecciones);
    }

    /**
     * Obtiene la proyección de demanda para una zona específica.
     * 
     * @param zona Nombre de la zona/barrio
     * @return ProyeccionDemandaDTO con análisis específico de la zona
     */
    @GetMapping("/zona/{zona}")
    public ResponseEntity<ProyeccionDemandaDTO> calcularProyeccionPorZona(@PathVariable String zona) {
        ProyeccionDemandaDTO proyeccion = simulacionDemandaService.calcularProyeccionPorZona(zona);
        return ResponseEntity.ok(proyeccion);
    }

    /**
     * Obtiene el resumen general de la simulación de demanda.
     * Incluye agregaciones globales y recomendaciones estratégicas.
     * 
     * @return ResumenSimulacionDemandaDTO con análisis global
     */
    @GetMapping("/resumen")
    public ResponseEntity<ResumenSimulacionDemandaDTO> obtenerResumenSimulacion() {
        ResumenSimulacionDemandaDTO resumen = simulacionDemandaService.obtenerResumenSimulacion();
        return ResponseEntity.ok(resumen);
    }
}
