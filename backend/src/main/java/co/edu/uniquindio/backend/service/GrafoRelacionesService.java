package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.NodoGrafoDTO;
import co.edu.uniquindio.backend.dto.RelacionGrafoDTO;
import co.edu.uniquindio.backend.dto.ResumenGrafoDTO;
import co.edu.uniquindio.backend.estructuras.grafos.GrafoNoDirigido;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.model.Operacion;
import co.edu.uniquindio.backend.model.Visita;
import org.springframework.stereotype.Service;

@Service
public class GrafoRelacionesService {

    private final InmuebleService inmuebleService;
    private final VisitaService visitaService;
    private final OperacionService operacionService;

    public GrafoRelacionesService(InmuebleService inmuebleService,
                                  VisitaService visitaService,
                                  OperacionService operacionService) {
        this.inmuebleService = inmuebleService;
        this.visitaService = visitaService;
        this.operacionService = operacionService;
    }

    public ResumenGrafoDTO obtenerResumen() {
        GrafoNoDirigido<String> grafo = construirGrafoRelaciones();

        String nodoMayor = grafo.obtenerVerticeMayorGrado();
        int gradoMayor = nodoMayor == null ? 0 : grafo.grado(nodoMayor);

        return new ResumenGrafoDTO(
                grafo.getCantidadVertices(),
                grafo.cantidadAristas(),
                nodoMayor,
                gradoMayor
        );
    }

    public NodoGrafoDTO[] listarNodos() {
        GrafoNoDirigido<String> grafo = construirGrafoRelaciones();

        NodoGrafoDTO[] nodos = new NodoGrafoDTO[grafo.getCantidadVertices()];

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String vertice = grafo.obtenerVertice(i);

            nodos[i] = new NodoGrafoDTO(
                    vertice,
                    obtenerTipoNodo(vertice),
                    obtenerEtiquetaNodo(vertice),
                    grafo.gradoPorIndice(i)
            );
        }

        ordenarNodosPorGrado(nodos);

        return nodos;
    }

    public RelacionGrafoDTO[] listarRelaciones() {
        GrafoNoDirigido<String> grafo = construirGrafoRelaciones();

        RelacionGrafoDTO[] relaciones = new RelacionGrafoDTO[grafo.cantidadAristas()];
        int posicion = 0;

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            for (int j = i + 1; j < grafo.getCantidadVertices(); j++) {
                double peso = grafo.obtenerPesoPorIndice(i, j);

                if (peso > 0) {
                    String origen = grafo.obtenerVertice(i);
                    String destino = grafo.obtenerVertice(j);

                    relaciones[posicion] = new RelacionGrafoDTO(
                            origen,
                            destino,
                            obtenerTipoRelacion(origen, destino),
                            peso
                    );

                    posicion++;
                }
            }
        }

        return relaciones;
    }

    public RelacionGrafoDTO[] inmueblesVisitadosPorCliente(String clienteId) {
        GrafoNoDirigido<String> grafo = construirGrafoRelaciones();
        String nodoCliente = "CLI:" + clienteId;

        int indiceCliente = grafo.indiceDe(nodoCliente);

        if (indiceCliente == -1) {
            return new RelacionGrafoDTO[0];
        }

        int cantidad = 0;

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String vertice = grafo.obtenerVertice(i);

            if (vertice != null
                    && vertice.startsWith("INM:")
                    && grafo.obtenerPesoPorIndice(indiceCliente, i) > 0) {
                cantidad++;
            }
        }

        RelacionGrafoDTO[] resultado = new RelacionGrafoDTO[cantidad];
        int posicion = 0;

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String vertice = grafo.obtenerVertice(i);
            double peso = grafo.obtenerPesoPorIndice(indiceCliente, i);

            if (vertice != null && vertice.startsWith("INM:") && peso > 0) {
                resultado[posicion] = new RelacionGrafoDTO(
                        nodoCliente,
                        vertice,
                        "CLIENTE_VISITO_INMUEBLE",
                        peso
                );
                posicion++;
            }
        }

        return resultado;
    }

    public RelacionGrafoDTO[] clientesRelacionadosConInmueble(String codigoInmueble) {
        GrafoNoDirigido<String> grafo = construirGrafoRelaciones();
        String nodoInmueble = "INM:" + codigoInmueble;

        int indiceInmueble = grafo.indiceDe(nodoInmueble);

        if (indiceInmueble == -1) {
            return new RelacionGrafoDTO[0];
        }

        int cantidad = 0;

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String vertice = grafo.obtenerVertice(i);

            if (vertice != null
                    && vertice.startsWith("CLI:")
                    && grafo.obtenerPesoPorIndice(indiceInmueble, i) > 0) {
                cantidad++;
            }
        }

        RelacionGrafoDTO[] resultado = new RelacionGrafoDTO[cantidad];
        int posicion = 0;

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String vertice = grafo.obtenerVertice(i);
            double peso = grafo.obtenerPesoPorIndice(indiceInmueble, i);

            if (vertice != null && vertice.startsWith("CLI:") && peso > 0) {
                resultado[posicion] = new RelacionGrafoDTO(
                        nodoInmueble,
                        vertice,
                        "INMUEBLE_RELACIONADO_CON_CLIENTE",
                        peso
                );
                posicion++;
            }
        }

        return resultado;
    }

    public RelacionGrafoDTO[] inmueblesSimilares(String codigoInmueble) {
        GrafoNoDirigido<String> grafo = construirGrafoRelaciones();
        String nodoInmueble = "INM:" + codigoInmueble;

        int indiceInmueble = grafo.indiceDe(nodoInmueble);

        if (indiceInmueble == -1) {
            return new RelacionGrafoDTO[0];
        }

        String zonaBase = obtenerZonaDelInmueble(grafo, indiceInmueble);

        RelacionGrafoDTO[] temporal = new RelacionGrafoDTO[grafo.getCantidadVertices()];
        int contador = 0;

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String candidato = grafo.obtenerVertice(i);

            if (candidato == null) continue;
            if (!candidato.startsWith("INM:")) continue;
            if (candidato.equalsIgnoreCase(nodoInmueble)) continue;

            double puntajeSimilitud = 0;

            String zonaCandidato = obtenerZonaDelInmueble(grafo, i);

            if (zonaBase != null && zonaBase.equalsIgnoreCase(zonaCandidato)) {
                puntajeSimilitud += 2;
            }

            puntajeSimilitud += contarClientesEnComun(grafo, indiceInmueble, i);

            if (puntajeSimilitud > 0) {
                temporal[contador] = new RelacionGrafoDTO(
                        nodoInmueble,
                        candidato,
                        "INMUEBLE_SIMILAR",
                        puntajeSimilitud
                );
                contador++;
            }
        }

        RelacionGrafoDTO[] resultado = new RelacionGrafoDTO[contador];

        for (int i = 0; i < contador; i++) {
            resultado[i] = temporal[i];
        }

        ordenarRelacionesPorPeso(resultado);

        return resultado;
    }

    private GrafoNoDirigido<String> construirGrafoRelaciones() {
        GrafoNoDirigido<String> grafo = new GrafoNoDirigido<>(200);

        Inmueble[] inmuebles = inmuebleService.listarInmuebles();
        Visita[] visitas = visitaService.listarVisitas();
        Operacion[] operaciones = operacionService.listarOperaciones();

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;
            if (inmueble.getCodigo() == null) continue;

            String nodoInmueble = "INM:" + inmueble.getCodigo();
            String nodoZona = "ZONA:" + normalizar(inmueble.getBarrioZona());

            grafo.agregarVertice(nodoInmueble);
            grafo.agregarVertice(nodoZona);
            grafo.agregarArista(nodoInmueble, nodoZona, 1);

            if (inmueble.getIdAsesorResponsable() != null
                    && !inmueble.getIdAsesorResponsable().isBlank()) {
                String nodoAsesor = "ASE:" + inmueble.getIdAsesorResponsable();
                grafo.agregarVertice(nodoAsesor);
                grafo.agregarArista(nodoAsesor, nodoInmueble, 1);
            }
        }

        for (Visita visita : visitas) {
            if (visita == null) continue;
            if (visita.getIdCliente() == null || visita.getCodigoInmueble() == null) continue;

            String nodoCliente = "CLI:" + visita.getIdCliente();
            String nodoInmueble = "INM:" + visita.getCodigoInmueble();

            grafo.agregarVertice(nodoCliente);
            grafo.agregarVertice(nodoInmueble);
            grafo.agregarArista(nodoCliente, nodoInmueble, 1);
        }

        for (Operacion operacion : operaciones) {
            if (operacion == null) continue;
            if (operacion.getIdCliente() == null || operacion.getCodigoInmueble() == null) continue;

            String nodoCliente = "CLI:" + operacion.getIdCliente();
            String nodoInmueble = "INM:" + operacion.getCodigoInmueble();

            grafo.agregarVertice(nodoCliente);
            grafo.agregarVertice(nodoInmueble);
            grafo.agregarArista(nodoCliente, nodoInmueble, 3);

            if (operacion.getIdAsesor() != null && !operacion.getIdAsesor().isBlank()) {
                String nodoAsesor = "ASE:" + operacion.getIdAsesor();
                grafo.agregarVertice(nodoAsesor);
                grafo.agregarArista(nodoAsesor, nodoInmueble, 2);
            }
        }

        return grafo;
    }

    private String obtenerZonaDelInmueble(GrafoNoDirigido<String> grafo, int indiceInmueble) {
        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String vertice = grafo.obtenerVertice(i);

            if (vertice != null
                    && vertice.startsWith("ZONA:")
                    && grafo.obtenerPesoPorIndice(indiceInmueble, i) > 0) {
                return vertice;
            }
        }

        return null;
    }

    private int contarClientesEnComun(GrafoNoDirigido<String> grafo, int indiceInmuebleA, int indiceInmuebleB) {
        int comunes = 0;

        for (int i = 0; i < grafo.getCantidadVertices(); i++) {
            String vertice = grafo.obtenerVertice(i);

            if (vertice != null && vertice.startsWith("CLI:")) {
                boolean conectadoA = grafo.obtenerPesoPorIndice(indiceInmuebleA, i) > 0;
                boolean conectadoB = grafo.obtenerPesoPorIndice(indiceInmuebleB, i) > 0;

                if (conectadoA && conectadoB) {
                    comunes++;
                }
            }
        }

        return comunes;
    }

    private String obtenerTipoNodo(String nodo) {
        if (nodo == null) return "DESCONOCIDO";
        if (nodo.startsWith("CLI:")) return "CLIENTE";
        if (nodo.startsWith("INM:")) return "INMUEBLE";
        if (nodo.startsWith("ZONA:")) return "ZONA";
        if (nodo.startsWith("ASE:")) return "ASESOR";
        return "DESCONOCIDO";
    }

    private String obtenerEtiquetaNodo(String nodo) {
        if (nodo == null) return "Sin dato";

        int posicion = nodo.indexOf(":");

        if (posicion == -1 || posicion == nodo.length() - 1) {
            return nodo;
        }

        return nodo.substring(posicion + 1);
    }

    private String obtenerTipoRelacion(String origen, String destino) {
        if (origen.startsWith("CLI:") && destino.startsWith("INM:")
                || origen.startsWith("INM:") && destino.startsWith("CLI:")) {
            return "CLIENTE_INMUEBLE";
        }

        if (origen.startsWith("INM:") && destino.startsWith("ZONA:")
                || origen.startsWith("ZONA:") && destino.startsWith("INM:")) {
            return "INMUEBLE_ZONA";
        }

        if (origen.startsWith("ASE:") && destino.startsWith("INM:")
                || origen.startsWith("INM:") && destino.startsWith("ASE:")) {
            return "ASESOR_INMUEBLE";
        }

        return "RELACION_GENERAL";
    }

    private String normalizar(String texto) {
        if (texto == null || texto.isBlank()) {
            return "SIN_DATO";
        }

        return texto.trim().toUpperCase();
    }

    private void ordenarNodosPorGrado(NodoGrafoDTO[] nodos) {
        for (int i = 0; i < nodos.length - 1; i++) {
            for (int j = 0; j < nodos.length - i - 1; j++) {
                if (nodos[j].getGrado() < nodos[j + 1].getGrado()) {
                    NodoGrafoDTO temp = nodos[j];
                    nodos[j] = nodos[j + 1];
                    nodos[j + 1] = temp;
                }
            }
        }
    }

    private void ordenarRelacionesPorPeso(RelacionGrafoDTO[] relaciones) {
        for (int i = 0; i < relaciones.length - 1; i++) {
            for (int j = 0; j < relaciones.length - i - 1; j++) {
                if (relaciones[j].getPeso() < relaciones[j + 1].getPeso()) {
                    RelacionGrafoDTO temp = relaciones[j];
                    relaciones[j] = relaciones[j + 1];
                    relaciones[j + 1] = temp;
                }
            }
        }
    }
}