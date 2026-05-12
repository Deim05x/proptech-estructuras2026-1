package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.InmuebleOrdenadoDTO;
import co.edu.uniquindio.backend.estructuras.arboles.ArbolBinarioBusqueda;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.Visita;
import org.springframework.stereotype.Service;

/**
 * Servicio de ordenamiento comercial de inmuebles.
 *
 * <p>Uso de estructuras propias: inserta DTOs comparables en
 * {@link ArbolBinarioBusqueda} y luego recorre el arbol en orden ascendente o
 * descendente segun el criterio solicitado.</p>
 *
 * <p>Justificacion: el arbol separa el criterio de comparacion de la salida y
 * hace visible el mecanismo usado para ordenar por precio, area o demanda.</p>
 */
@Service
public class OrdenamientoInmuebleService {

    private final InmuebleService inmuebleService;
    private final VisitaService visitaService;

    public OrdenamientoInmuebleService(InmuebleService inmuebleService,
                                       VisitaService visitaService) {
        this.inmuebleService = inmuebleService;
        this.visitaService = visitaService;
    }

    public InmuebleOrdenadoDTO[] ordenarInmuebles(String criterio, String direccion) {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();

        ArbolBinarioBusqueda<InmuebleOrdenadoDTO> arbol = new ArbolBinarioBusqueda<>();

        String criterioNormalizado = normalizar(criterio);

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            int demanda = contarDemanda(inmueble, visitas);
            double valorOrden = obtenerValorOrden(inmueble, demanda, criterioNormalizado);

            InmuebleOrdenadoDTO dto = new InmuebleOrdenadoDTO(
                    inmueble,
                    criterioNormalizado,
                    valorOrden,
                    demanda
            );

            arbol.insertar(dto);
        }

        InmuebleOrdenadoDTO[] resultado = new InmuebleOrdenadoDTO[arbol.getTamanio()];

        if ("asc".equalsIgnoreCase(direccion)) {
            arbol.llenarInOrdenAscendente(resultado);
        } else {
            arbol.llenarInOrdenDescendente(resultado);
        }

        return resultado;
    }

    private double obtenerValorOrden(Inmueble inmueble, int demanda, String criterio) {
        if ("area".equalsIgnoreCase(criterio)) {
            return inmueble.getArea();
        }

        if ("demanda".equalsIgnoreCase(criterio)) {
            return demanda;
        }

        return inmueble.getPrecio();
    }

    private int contarDemanda(Inmueble inmueble, Visita[] visitas) {
        if (inmueble == null || inmueble.getCodigo() == null) {
            return 0;
        }

        int contador = 0;

        for (Visita visita : visitas) {
            if (visita == null) continue;

            if (visita.getCodigoInmueble() == null) continue;

            boolean mismoInmueble = visita.getCodigoInmueble()
                    .equalsIgnoreCase(inmueble.getCodigo());

            boolean cancelada = visita.getEstado() != null
                    && visita.getEstado().toLowerCase().contains("cancelada");

            if (mismoInmueble && !cancelada) {
                contador++;
            }
        }

        return contador;
    }

    private String normalizar(String criterio) {
        if (criterio == null || criterio.isBlank()) {
            return "precio";
        }

        String texto = criterio.toLowerCase().trim();

        if (texto.equals("area") || texto.equals("área")) {
            return "area";
        }

        if (texto.equals("demanda")) {
            return "demanda";
        }

        return "precio";
    }
}
