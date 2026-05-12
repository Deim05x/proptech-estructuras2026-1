package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.InmuebleRangoPrecioDTO;
import co.edu.uniquindio.backend.estructuras.arboles.ArbolPrecioInmuebles;
import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.InmuebleRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio de consulta de inmuebles por rango de precio.
 *
 * <p>Uso de estructuras propias: construye un {@link ArbolPrecioInmuebles}
 * desde los inmuebles persistidos y devuelve el resultado en
 * {@link LinkedSimpleList} antes de convertirlo a arreglo para JSON.</p>
 *
 * <p>Justificacion: el arbol permite recorrer solo las ramas necesarias para
 * rangos de precio y conservar una explicacion clara sobre cantidad de nodos y
 * altura de la estructura consultada.</p>
 */
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
