package co.edu.uniquindio.backend.dto;

import co.edu.uniquindio.backend.model.Inmueble;

public class RecomendacionInmuebleDTO implements Comparable<RecomendacionInmuebleDTO> {

    private Inmueble inmueble;
    private int puntaje;
    private String motivo;

    public RecomendacionInmuebleDTO() {
    }

    public RecomendacionInmuebleDTO(Inmueble inmueble, int puntaje, String motivo) {
        this.inmueble = inmueble;
        this.puntaje = puntaje;
        this.motivo = motivo;
    }

    public Inmueble getInmueble() {
        return inmueble;
    }

    public void setInmueble(Inmueble inmueble) {
        this.inmueble = inmueble;
    }

    public int getPuntaje() {
        return puntaje;
    }

    public void setPuntaje(int puntaje) {
        this.puntaje = puntaje;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    @Override
    public int compareTo(RecomendacionInmuebleDTO otra) {
        return Integer.compare(otra.puntaje, this.puntaje);
    }
}