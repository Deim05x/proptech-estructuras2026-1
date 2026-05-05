package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.model.Alerta;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AlertaRepository {

    private final JdbcTemplate jdbcTemplate;

    public AlertaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean guardar(Alerta alerta) {
        String sql = """
                INSERT INTO alertas
                (id, tipo, descripcion, nivel_atencion, fecha_creacion, estado)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        int filas = jdbcTemplate.update(
                sql,
                alerta.getId(),
                alerta.getTipo(),
                alerta.getDescripcion(),
                alerta.getNivelAtencion(),
                alerta.getFechaCreacion(),
                alerta.getEstado()
        );

        return filas > 0;
    }

    public Alerta buscarPorId(String id) {
        String sql = """
                SELECT id, tipo, descripcion, nivel_atencion, fecha_creacion, estado
                FROM alertas
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearAlerta(rs);
            }
            return null;
        }, id);
    }

    public Alerta[] listar() {
        String sql = """
                SELECT id, tipo, descripcion, nivel_atencion, fecha_creacion, estado
                FROM alertas
                ORDER BY fecha_creacion DESC
                """;

        return jdbcTemplate.query(sql, rs -> {
            Alerta[] temporal = new Alerta[1000];
            int contador = 0;

            while (rs.next()) {
                temporal[contador] = mapearAlerta(rs);
                contador++;
            }

            Alerta[] resultado = new Alerta[contador];

            for (int i = 0; i < contador; i++) {
                resultado[i] = temporal[i];
            }

            return resultado;
        });
    }

    public Alerta[] listarPorEstado(String estado) {
        String sql = """
                SELECT id, tipo, descripcion, nivel_atencion, fecha_creacion, estado
                FROM alertas
                WHERE estado = ?
                ORDER BY fecha_creacion ASC
                """;

        return jdbcTemplate.query(sql, rs -> {
            Alerta[] temporal = new Alerta[1000];
            int contador = 0;

            while (rs.next()) {
                temporal[contador] = mapearAlerta(rs);
                contador++;
            }

            Alerta[] resultado = new Alerta[contador];

            for (int i = 0; i < contador; i++) {
                resultado[i] = temporal[i];
            }

            return resultado;
        }, estado);
    }

    public boolean actualizarEstado(String id, String estado) {
        String sql = "UPDATE alertas SET estado = ? WHERE id = ?";
        return jdbcTemplate.update(sql, estado, id) > 0;
    }

    private Alerta mapearAlerta(java.sql.ResultSet rs) throws java.sql.SQLException {
        return new Alerta(
                rs.getString("id"),
                rs.getString("tipo"),
                rs.getString("descripcion"),
                rs.getString("nivel_atencion"),
                rs.getTimestamp("fecha_creacion").toLocalDateTime(),
                rs.getString("estado")
        );
    }
}