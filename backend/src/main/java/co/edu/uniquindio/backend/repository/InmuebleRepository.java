package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class InmuebleRepository {

    private final JdbcTemplate jdbcTemplate;

    public InmuebleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LinkedSimpleList<Inmueble> obtenerTodos() {
        String sql = """
                SELECT codigo, direccion, ciudad, barrio_zona, tipo_inmueble, finalidad,
                       precio, area, habitaciones, banos, estado, disponible, asesor_id_responsable
                FROM inmueble
                ORDER BY codigo
                """;

        return jdbcTemplate.query(sql, rs -> {
            LinkedSimpleList<Inmueble> lista = new LinkedSimpleList<>();

            while (rs.next()) {
                lista.addLast(mapearInmueble(rs));
            }

            return lista;
        });
    }

    public Inmueble buscarPorCodigo(String codigo) {
        String sql = """
                SELECT codigo, direccion, ciudad, barrio_zona, tipo_inmueble, finalidad,
                       precio, area, habitaciones, banos, estado, disponible, asesor_id_responsable
                FROM inmueble
                WHERE codigo = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearInmueble(rs);
            }
            return null;
        }, codigo);
    }

    public boolean guardar(Inmueble inmueble) {
        String sql = """
                INSERT INTO inmueble (
                    codigo, direccion, ciudad, barrio_zona, tipo_inmueble, finalidad,
                    precio, area, habitaciones, banos, estado, disponible, asesor_id_responsable
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        int filasAfectadas = jdbcTemplate.update(
                sql,
                inmueble.getCodigo(),
                inmueble.getDireccion(),
                inmueble.getCiudad(),
                inmueble.getBarrioZona(),
                inmueble.getTipoInmueble(),
                inmueble.getFinalidad(),
                inmueble.getPrecio(),
                inmueble.getArea(),
                inmueble.getHabitaciones(),
                inmueble.getBanos(),
                inmueble.getEstado(),
                inmueble.isDisponible(),
                inmueble.getIdAsesorResponsable()
        );

        return filasAfectadas > 0;
    }

    public boolean actualizar(String codigo, Inmueble inmueble) {
        String sql = """
                UPDATE inmueble
                SET direccion = ?,
                    ciudad = ?,
                    barrio_zona = ?,
                    tipo_inmueble = ?,
                    finalidad = ?,
                    precio = ?,
                    area = ?,
                    habitaciones = ?,
                    banos = ?,
                    estado = ?,
                    disponible = ?,
                    asesor_id_responsable = ?
                WHERE codigo = ?
                """;

        int filasAfectadas = jdbcTemplate.update(
                sql,
                inmueble.getDireccion(),
                inmueble.getCiudad(),
                inmueble.getBarrioZona(),
                inmueble.getTipoInmueble(),
                inmueble.getFinalidad(),
                inmueble.getPrecio(),
                inmueble.getArea(),
                inmueble.getHabitaciones(),
                inmueble.getBanos(),
                inmueble.getEstado(),
                inmueble.isDisponible(),
                inmueble.getIdAsesorResponsable(),
                codigo
        );

        return filasAfectadas > 0;
    }

    public boolean eliminar(String codigo) {
        String sql = "DELETE FROM inmueble WHERE codigo = ?";
        int filasAfectadas = jdbcTemplate.update(sql, codigo);
        return filasAfectadas > 0;
    }

    private Inmueble mapearInmueble(ResultSet rs) throws SQLException {
        return new Inmueble(
                rs.getString("codigo"),
                rs.getString("direccion"),
                rs.getString("ciudad"),
                rs.getString("barrio_zona"),
                rs.getString("tipo_inmueble"),
                rs.getString("finalidad"),
                rs.getDouble("precio"),
                rs.getDouble("area"),
                rs.getInt("habitaciones"),
                rs.getInt("banos"),
                rs.getString("estado"),
                rs.getBoolean("disponible"),
                rs.getString("asesor_id_responsable")
        );
    }
}