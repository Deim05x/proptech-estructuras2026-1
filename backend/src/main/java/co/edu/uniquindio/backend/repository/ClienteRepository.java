package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Cliente;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ClienteRepository {

    private final JdbcTemplate jdbcTemplate;

    public ClienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LinkedSimpleList<Cliente> obtenerTodos() {
        String sql = """
                SELECT id, nombre, correo, telefono, tipo_cliente, presupuesto,
                       zonas_interes, tipo_inmueble_deseado, habitaciones_minimas, estado_busqueda
                FROM cliente
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, rs -> {
            LinkedSimpleList<Cliente> lista = new LinkedSimpleList<>();

            while (rs.next()) {
                lista.addLast(mapearCliente(rs));
            }

            return lista;
        });
    }

    public Cliente buscarPorId(String id) {
        String sql = """
                SELECT id, nombre, correo, telefono, tipo_cliente, presupuesto,
                       zonas_interes, tipo_inmueble_deseado, habitaciones_minimas, estado_busqueda
                FROM cliente
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearCliente(rs);
            }
            return null;
        }, id);
    }

    public boolean guardar(Cliente cliente) {
        String sql = """
                INSERT INTO cliente (
                    id, nombre, correo, telefono, tipo_cliente, presupuesto,
                    zonas_interes, tipo_inmueble_deseado, habitaciones_minimas, estado_busqueda
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        int filasAfectadas = jdbcTemplate.update(
                sql,
                cliente.getId(),
                cliente.getNombre(),
                cliente.getCorreo(),
                cliente.getTelefono(),
                cliente.getTipoCliente(),
                cliente.getPresupuesto(),
                cliente.getZonasInteres(),
                cliente.getTipoInmuebleDeseado(),
                cliente.getHabitacionesMinimas(),
                cliente.getEstadoBusqueda()
        );

        return filasAfectadas > 0;
    }

    private Cliente mapearCliente(ResultSet rs) throws SQLException {
        return new Cliente(
                rs.getString("id"),
                rs.getString("nombre"),
                rs.getString("correo"),
                rs.getString("telefono"),
                rs.getString("tipo_cliente"),
                rs.getDouble("presupuesto"),
                rs.getString("zonas_interes"),
                rs.getString("tipo_inmueble_deseado"),
                rs.getInt("habitaciones_minimas"),
                rs.getString("estado_busqueda")
        );
    }
}