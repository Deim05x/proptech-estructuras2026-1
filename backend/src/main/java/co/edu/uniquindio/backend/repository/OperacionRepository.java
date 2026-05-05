package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.model.Operacion;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class OperacionRepository {

    private final JdbcTemplate jdbcTemplate;

    public OperacionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean guardar(Operacion operacion) {
        String sql = """
                INSERT INTO operaciones
                (id, codigo_inmueble, id_cliente, id_asesor, fecha, tipo_operacion,
                 valor_acordado, comision, estado_proceso)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        int filas = jdbcTemplate.update(
                sql,
                operacion.getId(),
                operacion.getCodigoInmueble(),
                operacion.getIdCliente(),
                operacion.getIdAsesor(),
                operacion.getFecha(),
                operacion.getTipoOperacion(),
                operacion.getValorAcordado(),
                operacion.getComision(),
                operacion.getEstadoProceso()
        );

        return filas > 0;
    }

    public Operacion buscarPorId(String id) {
        String sql = """
                SELECT id, codigo_inmueble, id_cliente, id_asesor, fecha, tipo_operacion,
                       valor_acordado, comision, estado_proceso
                FROM operaciones
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearOperacion(rs);
            }
            return null;
        }, id);
    }

    public Operacion[] listar() {
        String sql = """
                SELECT id, codigo_inmueble, id_cliente, id_asesor, fecha, tipo_operacion,
                       valor_acordado, comision, estado_proceso
                FROM operaciones
                """;

        return jdbcTemplate.query(sql, rs -> {
            Operacion[] temporal = new Operacion[1000];
            int contador = 0;

            while (rs.next()) {
                temporal[contador] = mapearOperacion(rs);
                contador++;
            }

            Operacion[] resultado = new Operacion[contador];

            for (int i = 0; i < contador; i++) {
                resultado[i] = temporal[i];
            }

            return resultado;
        });
    }

    public boolean actualizar(String id, Operacion operacion) {
        String sql = """
                UPDATE operaciones
                SET codigo_inmueble = ?,
                    id_cliente = ?,
                    id_asesor = ?,
                    fecha = ?,
                    tipo_operacion = ?,
                    valor_acordado = ?,
                    comision = ?,
                    estado_proceso = ?
                WHERE id = ?
                """;

        int filas = jdbcTemplate.update(
                sql,
                operacion.getCodigoInmueble(),
                operacion.getIdCliente(),
                operacion.getIdAsesor(),
                operacion.getFecha(),
                operacion.getTipoOperacion(),
                operacion.getValorAcordado(),
                operacion.getComision(),
                operacion.getEstadoProceso(),
                id
        );

        return filas > 0;
    }

    public boolean eliminar(String id) {
        String sql = "DELETE FROM operaciones WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

    private Operacion mapearOperacion(java.sql.ResultSet rs) throws java.sql.SQLException {
        return new Operacion(
                rs.getString("id"),
                rs.getString("codigo_inmueble"),
                rs.getString("id_cliente"),
                rs.getString("id_asesor"),
                rs.getDate("fecha").toLocalDate(),
                rs.getString("tipo_operacion"),
                rs.getDouble("valor_acordado"),
                rs.getDouble("comision"),
                rs.getString("estado_proceso")
        );
    }
}