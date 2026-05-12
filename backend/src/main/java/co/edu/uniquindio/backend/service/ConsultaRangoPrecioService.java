package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.InmuebleRangoPrecioDTO;
import co.edu.uniquindio.backend.estructuras.arboles.ArbolPrecioInmuebles;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import org.springframework.stereotype.Service;

@Service
public class ConsultaRangoPrecioService {

    private final InmuebleRepository inmuebleRepository;

    public ConsultaRangoPrecioService(InmuebleRepository inmuebleRepository) {
        this.inmuebleRepository = inmuebleRepository;
    }

    public InmuebleRangoPrecioDTO buscarPorRango(double precioMinimo, double precioMaximo) {
        if (precioMinimo < 0 || precioMaximo < 0) {
            throw new RuntimeException("Los precios no pueden ser negativos");
        }

        if (precioMinimo > precioMaximo) {
            throw new RuntimeException("El precio mínimo no puede ser mayor al precio máximo");
        }

        ArbolPrecioInmuebles arbol = construirArbolDesdeInmuebles();

        LinkedSimpleList<Inmueble> inmueblesEncontrados =
                arbol.buscarPorRango(precioMinimo, precioMaximo);

        return new InmuebleRangoPrecioDTO(
                precioMinimo,
                precioMaximo,
                inmueblesEncontrados.getSize(),
                arbol.contarNodos(),
                arbol.calcularAltura(),
                convertirAArreglo(inmueblesEncontrados)
        );
    }

    public InmuebleRangoPrecioDTO listarOrdenadosPorPrecio() {
        ArbolPrecioInmuebles arbol = construirArbolDesdeInmuebles();

        LinkedSimpleList<Inmueble> inmueblesOrdenados = arbol.listarOrdenadoAscendente();

        return new InmuebleRangoPrecioDTO(
                0,
                0,
                inmueblesOrdenados.getSize(),
                arbol.contarNodos(),
                arbol.calcularAltura(),
                convertirAArreglo(inmueblesOrdenados)
        );
    }

    private ArbolPrecioInmuebles construirArbolDesdeInmuebles() {
        ArbolPrecioInmuebles arbol = new ArbolPrecioInmuebles();

        LinkedSimpleList<Inmueble> inmuebles = inmuebleRepository.obtenerTodos();

        for (Inmueble inmueble : inmuebles) {
            arbol.insertar(inmueble);
        }

        return arbol;
    }

    private Inmueble[] convertirAArreglo(LinkedSimpleList<Inmueble> inmuebles) {
        Inmueble[] resultado = new Inmueble[inmuebles.getSize()];
        int indice = 0;

        for (Inmueble inmueble : inmuebles) {
            resultado[indice] = inmueble;
            indice++;
        }

        return resultado;
    }
}
