package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Visita;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class VisitaRepository {

    private final JdbcTemplate jdbcTemplate;

    public VisitaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LinkedSimpleList<Visita> obtenerTodos() {
        String sql = """
                SELECT id, cliente_id, inmueble_codigo, asesor_id, fecha, hora, estado, observacion
                FROM visita
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, rs -> {
            LinkedSimpleList<Visita> lista = new LinkedSimpleList<>();

            while (rs.next()) {
                lista.addLast(mapearVisita(rs));
            }

            return lista;
        });
    }

    public Visita buscarPorId(int id) {
        String sql = """
                SELECT id, cliente_id, inmueble_codigo, asesor_id, fecha, hora, estado, observacion
                FROM visita
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearVisita(rs);
            }
            return null;
        }, id);
    }

    public boolean guardar(Visita visita) {
        String sql = """
                INSERT INTO visita (
                    id, cliente_id, inmueble_codigo, asesor_id, fecha, hora, estado, observacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        int filasAfectadas = jdbcTemplate.update(
                sql,
                visita.getId(),
                visita.getIdCliente(),
                visita.getCodigoInmueble(),
                visita.getIdAsesor(),
                visita.getFecha(),
                visita.getHora(),
                visita.getEstado(),
                visita.getObservacion()
        );

        return filasAfectadas > 0;
    }

    public boolean actualizar(int id, Visita visita) {
        String sql = """
                UPDATE visita
                SET cliente_id = ?,
                    inmueble_codigo = ?,
                    asesor_id = ?,
                    fecha = ?,
                    hora = ?,
                    estado = ?,
                    observacion = ?
                WHERE id = ?
                """;

        int filasAfectadas = jdbcTemplate.update(
                sql,
                visita.getIdCliente(),
                visita.getCodigoInmueble(),
                visita.getIdAsesor(),
                visita.getFecha(),
                visita.getHora(),
                visita.getEstado(),
                visita.getObservacion(),
                id
        );

        return filasAfectadas > 0;
    }

    public boolean eliminar(int id) {
        String sql = "DELETE FROM visita WHERE id = ?";
        int filasAfectadas = jdbcTemplate.update(sql, id);
        return filasAfectadas > 0;
    }

    private Visita mapearVisita(ResultSet rs) throws SQLException {
        return new Visita(
                rs.getInt("id"),
                rs.getString("cliente_id"),
                rs.getString("inmueble_codigo"),
                rs.getString("asesor_id"),
                rs.getDate("fecha").toLocalDate(),
                rs.getTime("hora").toLocalTime(),
                rs.getString("estado"),
                rs.getString("observacion")
        );
    }
}