package co.edu.uniquindio.backend.controller;

import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.service.CarruselInmuebleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrusel-inmuebles")
@CrossOrigin(origins = "http://localhost:5173")
public class CarruselInmuebleController {

    private final CarruselInmuebleService carruselInmuebleService;

    public CarruselInmuebleController(CarruselInmuebleService carruselInmuebleService) {
        this.carruselInmuebleService = carruselInmuebleService;
    }

    @GetMapping
    public Inmueble[] obtenerCarruselActual() {
        return carruselInmuebleService.obtenerCarruselActual();
    }

    @GetMapping("/actual")
    public ResponseEntity<?> verActual() {
        Inmueble inmueble = carruselInmuebleService.verActual();

        if (inmueble == null) {
            return ResponseEntity.badRequest().body("No hay inmuebles cargados en el carrusel.");
        }

        return ResponseEntity.ok(inmueble);
    }

    @GetMapping("/siguiente")
    public ResponseEntity<?> siguiente() {
        Inmueble inmueble = carruselInmuebleService.siguiente();

        if (inmueble == null) {
            return ResponseEntity.badRequest().body("No hay inmuebles cargados en el carrusel.");
        }

        return ResponseEntity.ok(inmueble);
    }

    @GetMapping("/anterior")
    public ResponseEntity<?> anterior() {
        Inmueble inmueble = carruselInmuebleService.anterior();

        if (inmueble == null) {
            return ResponseEntity.badRequest().body("No hay inmuebles cargados en el carrusel.");
        }

        return ResponseEntity.ok(inmueble);
    }

    @PostMapping("/reiniciar")
    public ResponseEntity<?> reiniciar() {
        carruselInmuebleService.reiniciarCarrusel();
        return ResponseEntity.ok("Carrusel reiniciado correctamente.");
    }

    @PostMapping("/recargar")
    public ResponseEntity<?> recargar() {
        carruselInmuebleService.recargarCarrusel();
        return ResponseEntity.ok("Carrusel recargado correctamente.");
    }

    @GetMapping("/cantidad")
    public int cantidad() {
        return carruselInmuebleService.obtenerCantidadInmuebles();
    }

    @GetMapping("/indice")
    public int indiceActual() {
        return carruselInmuebleService.obtenerIndiceActual();
    }
}