package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.ReporteItemDTO;
import co.edu.uniquindio.backend.dto.ReporteResumenDTO;
import co.edu.uniquindio.backend.estructuras.hashTables.TablaHash;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.Operacion;
import co.edu.uniquindio.backend.model.Visita;
import org.springframework.stereotype.Service;

/**
 * Servicio de reportes agregados.
 *
 * <p>Uso de estructuras propias: usa {@link TablaHash} para acumular conteos y
 * valores por clave, como zona, rango de precio, inmueble o estado de
 * operacion.</p>
 *
 * <p>Justificacion: las agregaciones por clave son el caso natural de una tabla
 * hash y evitan comparar cada registro contra todos los demas.</p>
 */
@Service
public class ReporteService {

    private final InmuebleService inmuebleService;
    private final VisitaService visitaService;
    private final OperacionService operacionService;

    public ReporteService(InmuebleService inmuebleService,
                          VisitaService visitaService,
                          OperacionService operacionService) {
        this.inmuebleService = inmuebleService;
        this.visitaService = visitaService;
        this.operacionService = operacionService;
    }

    public ReporteResumenDTO generarResumenGeneral() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();
        Operacion[] operaciones = operacionService.listarOperaciones();

        int totalInmuebles = 0;
        int inmueblesDisponibles = 0;
        int totalVisitas = 0;
        int totalOperaciones = 0;
        int operacionesCerradas = 0;
        double valorTotalCierres = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            totalInmuebles++;

            if (inmueble.isDisponible()) {
                inmueblesDisponibles++;
            }
        }

        for (Visita visita : visitas) {
            if (visita == null) continue;
            totalVisitas++;
        }

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;

            totalOperaciones++;

            if (esOperacionCerrada(operacion.getEstadoProceso())) {
                operacionesCerradas++;
                valorTotalCierres += operacion.getValorAcordado();
            }
        }

        return new ReporteResumenDTO(
                totalInmuebles,
                inmueblesDisponibles,
                totalVisitas,
                totalOperaciones,
                operacionesCerradas,
                valorTotalCierres
        );
    }

    public ReporteItemDTO[] reporteInmueblesPorZona() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        TablaHash<String, ReporteItemDTO> tabla = new TablaHash<>();

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            String zona = inmueble.getBarrioZona();

            if (zona == null || zona.isBlank()) {
                zona = inmueble.getCiudad();
            }

            incrementarReporte(tabla, zona, 0);
        }

        return convertirTablaAReporte(tabla);
    }

    public ReporteItemDTO[] reporteInmueblesPorRangoPrecio() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        TablaHash<String, ReporteItemDTO> tabla = new TablaHash<>();

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            String rango = clasificarRangoPrecio(inmueble.getPrecio());
            incrementarReporte(tabla, rango, 0);
        }

        return convertirTablaAReporte(tabla);
    }

    public ReporteItemDTO[] reporteVisitasPorInmueble() {
        Visita[] visitas = visitaService.listarVisitas();
        TablaHash<String, ReporteItemDTO> tabla = new TablaHash<>();

        for (Visita visita : visitas) {
            if (visita == null) continue;

            incrementarReporte(tabla, visita.getCodigoInmueble(), 0);
        }

        return convertirTablaAReporte(tabla);
    }

    public ReporteItemDTO[] reporteVisitasPorZona() {
        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();
        TablaHash<String, ReporteItemDTO> tabla = new TablaHash<>();

        for (Visita visita : visitas) {
            if (visita == null) continue;

            Inmueble inmueble = buscarInmueblePorCodigo(
                    inmuebles,
                    visita.getCodigoInmueble()
            );

            if (inmueble != null) {
                String zona = inmueble.getBarrioZona();

                if (zona == null || zona.isBlank()) {
                    zona = inmueble.getCiudad();
                }

                incrementarReporte(tabla, zona, 0);
            } else {
                incrementarReporte(tabla, "SIN_INMUEBLE", 0);
            }
        }

        return convertirTablaAReporte(tabla);
    }

    public ReporteItemDTO[] reporteCierresPorAsesor() {
        Operacion[] operaciones = operacionService.listarOperaciones();
        TablaHash<String, ReporteItemDTO> tabla = new TablaHash<>();

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;

            if (esOperacionCerrada(operacion.getEstadoProceso())) {
                incrementarReporte(
                        tabla,
                        operacion.getIdAsesor(),
                        operacion.getValorAcordado()
                );
            }
        }

        return convertirTablaAReporte(tabla);
    }

    public ReporteItemDTO[] reporteOperacionesPorTipo() {
        Operacion[] operaciones = operacionService.listarOperaciones();
        TablaHash<String, ReporteItemDTO> tabla = new TablaHash<>();

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;

            incrementarReporte(
                    tabla,
                    operacion.getTipoOperacion(),
                    operacion.getValorAcordado()
            );
        }

        return convertirTablaAReporte(tabla);
    }

    private void incrementarReporte(
            TablaHash<String, ReporteItemDTO> tabla,
            String criterio,
            double valor
    ) {
        String criterioNormalizado = normalizarCriterio(criterio);

        ReporteItemDTO item = tabla.obtener(criterioNormalizado);

        if (item == null) {
            item = new ReporteItemDTO(
                    criterioNormalizado,
                    1,
                    valor
            );

            tabla.poner(criterioNormalizado, item);
        } else {
            item.setCantidad(item.getCantidad() + 1);
            item.setValorTotal(item.getValorTotal() + valor);
        }
    }

    private ReporteItemDTO[] convertirTablaAReporte(
            TablaHash<String, ReporteItemDTO> tabla
    ) {
        ReporteItemDTO[] resultado = new ReporteItemDTO[tabla.getTamaño()];
        int[] posicion = {0};

        tabla.recorrer((clave, valor) -> {
            resultado[posicion[0]] = valor;
            posicion[0]++;
        });

        ordenarPorCantidadDescendente(resultado);

        return resultado;
    }

    private void ordenarPorCantidadDescendente(ReporteItemDTO[] datos) {
        for (int i = 0; i < datos.length - 1; i++) {
            for (int j = 0; j < datos.length - i - 1; j++) {
                if (datos[j].getCantidad() < datos[j + 1].getCantidad()) {
                    ReporteItemDTO temp = datos[j];
                    datos[j] = datos[j + 1];
                    datos[j + 1] = temp;
                }
            }
        }
    }

    private Inmueble buscarInmueblePorCodigo(Inmueble[] inmuebles, String codigo) {
        if (codigo == null) return null;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            if (codigo.equalsIgnoreCase(inmueble.getCodigo())) {
                return inmueble;
            }
        }

        return null;
    }

    private String clasificarRangoPrecio(double precio) {
        if (precio < 100_000_000) {
            return "MENOS_DE_100M";
        }

        if (precio < 300_000_000) {
            return "100M_A_300M";
        }

        if (precio < 600_000_000) {
            return "300M_A_600M";
        }

        if (precio < 1_000_000_000) {
            return "600M_A_1000M";
        }

        return "MAS_DE_1000M";
    }

    private boolean esOperacionCerrada(String estado) {
        if (estado == null) return false;

        String texto = estado.toLowerCase().trim();

        return texto.contains("cerrada")
                || texto.contains("cerrado")
                || texto.contains("finalizada")
                || texto.contains("finalizado")
                || texto.contains("completada")
                || texto.contains("completado");
    }

    private String normalizarCriterio(String criterio) {
        if (criterio == null || criterio.isBlank()) {
            return "SIN_DATO";
        }

        return criterio.trim().toUpperCase();
    }
}
