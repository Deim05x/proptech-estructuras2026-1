package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Asesor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class AsesorRepository {

    private final JdbcTemplate jdbcTemplate;

    public AsesorRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LinkedSimpleList<Asesor> obtenerTodos() {
        String sql = """
                SELECT id, nombre, contacto, especialidad_zona, cantidad_cierres
                FROM asesor
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, rs -> {
            LinkedSimpleList<Asesor> lista = new LinkedSimpleList<>();

            while (rs.next()) {
                lista.addLast(mapearAsesor(rs));
            }

            return lista;
        });
    }

    public Asesor buscarPorId(String id) {
        String sql = """
                SELECT id, nombre, contacto, especialidad_zona, cantidad_cierres
                FROM asesor
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearAsesor(rs);
            }
            return null;
        }, id);
    }

    public boolean guardar(Asesor asesor) {
        String sql = """
                INSERT INTO asesor (
                    id, nombre, contacto, especialidad_zona, cantidad_cierres
                ) VALUES (?, ?, ?, ?, ?)
                """;

        int filasAfectadas = jdbcTemplate.update(
                sql,
                asesor.getId(),
                asesor.getNombre(),
                asesor.getContacto(),
                asesor.getEspecialidadZona(),
                asesor.getCantidadCierres()
        );

        return filasAfectadas > 0;
    }

    private Asesor mapearAsesor(ResultSet rs) throws SQLException {
        return new Asesor(
                rs.getString("id"),
                rs.getString("nombre"),
                rs.getString("contacto"),
                rs.getString("especialidad_zona"),
                rs.getInt("cantidad_cierres")
        );
    }
}