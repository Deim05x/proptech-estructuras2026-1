package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.dto.BusquedaHashDTO;
import co.edu.uniquindio.backend.service.BusquedaHashService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/busqueda-hash")
public class BusquedaHashController {

    private final BusquedaHashService busquedaHashService;

    public BusquedaHashController(BusquedaHashService busquedaHashService) {
        this.busquedaHashService = busquedaHashService;
    }

    @GetMapping("/clientes/{idCliente}")
    public ResponseEntity<BusquedaHashDTO> buscarCliente(@PathVariable String idCliente) {
        return ResponseEntity.ok(busquedaHashService.buscarClientePorId(idCliente));
    }

    @GetMapping("/inmuebles/{codigoInmueble}")
    public ResponseEntity<BusquedaHashDTO> buscarInmueble(@PathVariable String codigoInmueble) {
        return ResponseEntity.ok(busquedaHashService.buscarInmueblePorCodigo(codigoInmueble));
    }

    @GetMapping("/asesores/{idAsesor}")
    public ResponseEntity<BusquedaHashDTO> buscarAsesor(@PathVariable String idAsesor) {
        return ResponseEntity.ok(busquedaHashService.buscarAsesorPorId(idAsesor));
    }
}
