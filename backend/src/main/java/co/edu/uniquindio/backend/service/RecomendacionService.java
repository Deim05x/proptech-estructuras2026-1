package co.edu.uniquindio.backend.service;

import co.edu.uniquindio.backend.dto.RecomendacionInmuebleDTO;
import co.edu.uniquindio.backend.model.Cliente;
import co.edu.uniquindio.backend.model.Inmueble;
import co.edu.uniquindio.backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class RecomendacionService {

    private final ClienteRepository clienteRepository;
    private final InmuebleService inmuebleService;

    public RecomendacionService(ClienteRepository clienteRepository,
                                InmuebleService inmuebleService) {
        this.clienteRepository = clienteRepository;
        this.inmuebleService = inmuebleService;
    }

    public RecomendacionInmuebleDTO[] recomendarPorCliente(String clienteId) {
        Cliente cliente = clienteRepository.buscarPorId(clienteId);

        if (cliente == null) {
            return new RecomendacionInmuebleDTO[0];
        }

        Inmueble[] inmuebles = inmuebleService.listarInmuebles();

        RecomendacionInmuebleDTO[] temporal = new RecomendacionInmuebleDTO[inmuebles.length];
        int contador = 0;

        for (Inmueble inmueble : inmuebles) {
            if (inmueble == null) continue;

            int puntaje = calcularPuntaje(cliente, inmueble);
            String motivo = construirMotivo(cliente, inmueble, puntaje);

            if (puntaje > 0) {
                temporal[contador] = new RecomendacionInmuebleDTO(
                        inmueble,
                        puntaje,
                        motivo
                );
                contador++;
            }
        }

        RecomendacionInmuebleDTO[] resultado = new RecomendacionInmuebleDTO[contador];

        for (int i = 0; i < contador; i++) {
            resultado[i] = temporal[i];
        }

        ordenarPorPuntaje(resultado);

        return resultado;
    }

    private int calcularPuntaje(Cliente cliente, Inmueble inmueble) {
        int puntaje = 0;

        if (!inmueble.isDisponible()) {
            return 0;
        }

        if (cliente.getPresupuesto() > 0 && inmueble.getPrecio() <= cliente.getPresupuesto()) {
            puntaje += 35;
        }

        if (contieneTexto(cliente.getZonasInteres(), inmueble.getBarrioZona()) ||
                contieneTexto(cliente.getZonasInteres(), inmueble.getCiudad())) {
            puntaje += 25;
        }

        if (coincideTexto(cliente.getTipoInmuebleDeseado(), inmueble.getTipoInmueble())) {
            puntaje += 20;
        }

        if (inmueble.getHabitaciones() >= cliente.getHabitacionesMinimas()) {
            puntaje += 15;
        }

        if (coincideTexto(cliente.getEstadoBusqueda(), inmueble.getFinalidad())) {
            puntaje += 5;
        }

        return puntaje;
    }

    private String construirMotivo(Cliente cliente, Inmueble inmueble, int puntaje) {
        String motivo = "Puntaje " + puntaje + ". Coincidencias: ";

        boolean tieneMotivo = false;

        if (cliente.getPresupuesto() > 0 && inmueble.getPrecio() <= cliente.getPresupuesto()) {
            motivo += "precio dentro del presupuesto";
            tieneMotivo = true;
        }

        if (contieneTexto(cliente.getZonasInteres(), inmueble.getBarrioZona()) ||
                contieneTexto(cliente.getZonasInteres(), inmueble.getCiudad())) {
            motivo += tieneMotivo ? ", zona de interés" : "zona de interés";
            tieneMotivo = true;
        }

        if (coincideTexto(cliente.getTipoInmuebleDeseado(), inmueble.getTipoInmueble())) {
            motivo += tieneMotivo ? ", tipo de inmueble" : "tipo de inmueble";
            tieneMotivo = true;
        }

        if (inmueble.getHabitaciones() >= cliente.getHabitacionesMinimas()) {
            motivo += tieneMotivo ? ", habitaciones suficientes" : "habitaciones suficientes";
            tieneMotivo = true;
        }

        if (!tieneMotivo) {
            motivo += "coincidencia parcial con el perfil del cliente";
        }

        return motivo;
    }

    private boolean coincideTexto(String texto1, String texto2) {
        if (texto1 == null || texto2 == null) return false;

        String a = texto1.toLowerCase().trim();
        String b = texto2.toLowerCase().trim();

        return a.equals(b) || a.contains(b) || b.contains(a);
    }

    private boolean contieneTexto(String textoGrande, String textoBuscado) {
        if (textoGrande == null || textoBuscado == null) return false;

        String grande = textoGrande.toLowerCase().trim();
        String buscado = textoBuscado.toLowerCase().trim();

        return grande.contains(buscado) || buscado.contains(grande);
    }

    private void ordenarPorPuntaje(RecomendacionInmuebleDTO[] recomendaciones) {
        for (int i = 0; i < recomendaciones.length - 1; i++) {
            for (int j = 0; j < recomendaciones.length - i - 1; j++) {
                if (recomendaciones[j].getPuntaje() < recomendaciones[j + 1].getPuntaje()) {
                    RecomendacionInmuebleDTO temp = recomendaciones[j];
                    recomendaciones[j] = recomendaciones[j + 1];
                    recomendaciones[j + 1] = temp;
                }
            }
        }
    }
}