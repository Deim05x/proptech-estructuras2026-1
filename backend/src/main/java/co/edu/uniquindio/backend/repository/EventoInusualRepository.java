package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.model.EventoInusual;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class EventoInusualRepository {

    private final JdbcTemplate jdbcTemplate;

    public EventoInusualRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean guardar(EventoInusual evento) {
        String sql = """
                INSERT INTO eventos_inusuales
                (id, tipo, descripcion, nivel_atencion, fecha_deteccion, estado, entidad_referencia)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        int filas = jdbcTemplate.update(
                sql,
                evento.getId(),
                evento.getTipo(),
                evento.getDescripcion(),
                evento.getNivelAtencion(),
                evento.getFechaDeteccion(),
                evento.getEstado(),
                evento.getEntidadReferencia()
        );

        return filas > 0;
    }

    public EventoInusual buscarPorId(String id) {
        String sql = """
                SELECT id, tipo, descripcion, nivel_atencion, fecha_deteccion, estado, entidad_referencia
                FROM eventos_inusuales
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearEvento(rs);
            }

            return null;
        }, id);
    }

    public EventoInusual[] listar() {
        String sql = """
                SELECT id, tipo, descripcion, nivel_atencion, fecha_deteccion, estado, entidad_referencia
                FROM eventos_inusuales
                ORDER BY fecha_deteccion DESC
                """;

        return jdbcTemplate.query(sql, rs -> {
            EventoInusual[] temporal = new EventoInusual[1000];
            int contador = 0;

            while (rs.next()) {
                temporal[contador] = mapearEvento(rs);
                contador++;
            }

            EventoInusual[] resultado = new EventoInusual[contador];

            for (int i = 0; i < contador; i++) {
                resultado[i] = temporal[i];
            }

            return resultado;
        });
    }

    public EventoInusual[] listarPorEstado(String estado) {
        String sql = """
                SELECT id, tipo, descripcion, nivel_atencion, fecha_deteccion, estado, entidad_referencia
                FROM eventos_inusuales
                WHERE estado = ?
                ORDER BY fecha_deteccion DESC
                """;

        return jdbcTemplate.query(sql, rs -> {
            EventoInusual[] temporal = new EventoInusual[1000];
            int contador = 0;

            while (rs.next()) {
                temporal[contador] = mapearEvento(rs);
                contador++;
            }

            EventoInusual[] resultado = new EventoInusual[contador];

            for (int i = 0; i < contador; i++) {
                resultado[i] = temporal[i];
            }

            return resultado;
        }, estado);
    }

    public boolean actualizarEstado(String id, String estado) {
        String sql = "UPDATE eventos_inusuales SET estado = ? WHERE id = ?";
        return jdbcTemplate.update(sql, estado, id) > 0;
    }

    private EventoInusual mapearEvento(java.sql.ResultSet rs) throws java.sql.SQLException {
        return new EventoInusual(
                rs.getString("id"),
                rs.getString("tipo"),
                rs.getString("descripcion"),
                rs.getString("nivel_atencion"),
                rs.getTimestamp("fecha_deteccion").toLocalDateTime(),
                rs.getString("estado"),
                rs.getString("entidad_referencia")
        );
    }
}