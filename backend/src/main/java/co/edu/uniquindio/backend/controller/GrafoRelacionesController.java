package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.NodoGrafoDTO;
import co.edu.uniquindio.backend.dto.RelacionGrafoDTO;
import co.edu.uniquindio.backend.dto.ResumenGrafoDTO;
import co.edu.uniquindio.backend.service.GrafoRelacionesService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grafos")
@CrossOrigin(origins = "http://localhost:5173")
public class GrafoRelacionesController {

    private final GrafoRelacionesService grafoRelacionesService;

    public GrafoRelacionesController(GrafoRelacionesService grafoRelacionesService) {
        this.grafoRelacionesService = grafoRelacionesService;
    }

    @GetMapping("/resumen")
    public ResumenGrafoDTO obtenerResumen() {
        return grafoRelacionesService.obtenerResumen();
    }

    @GetMapping("/nodos")
    public NodoGrafoDTO[] listarNodos() {
        return grafoRelacionesService.listarNodos();
    }

    @GetMapping("/relaciones")
    public RelacionGrafoDTO[] listarRelaciones() {
        return grafoRelacionesService.listarRelaciones();
    }

    @GetMapping("/cliente/{clienteId}/inmuebles")
    public RelacionGrafoDTO[] inmueblesVisitadosPorCliente(@PathVariable String clienteId) {
        return grafoRelacionesService.inmueblesVisitadosPorCliente(clienteId);
    }

    @GetMapping("/inmueble/{codigo}/clientes")
    public RelacionGrafoDTO[] clientesRelacionadosConInmueble(@PathVariable String codigo) {
        return grafoRelacionesService.clientesRelacionadosConInmueble(codigo);
    }

    @GetMapping("/inmueble/{codigo}/similares")
    public RelacionGrafoDTO[] inmueblesSimilares(@PathVariable String codigo) {
        return grafoRelacionesService.inmueblesSimilares(codigo);
    }
}