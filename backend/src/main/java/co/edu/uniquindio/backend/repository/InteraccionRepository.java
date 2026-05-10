package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.DoubleList.LinkedDoubleList;
import co.edu.uniquindio.backend.model.Interaccion;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public class InteraccionRepository {

    private final JdbcTemplate jdbcTemplate;

    public InteraccionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean guardarInteraccion(String clienteId, String codigoInmueble, String tipoInteraccion) {
        String sql = """
                INSERT INTO interaccion (cliente_id, inmueble_codigo, tipo_interaccion, fecha)
                VALUES (?, ?, ?, ?)
                """;

        int filas = jdbcTemplate.update(
                sql,
                clienteId,
                codigoInmueble,
                tipoInteraccion,
                LocalDateTime.now()
        );

        return filas > 0;
    }

    public boolean guardar(Interaccion interaccion) {
        if (interaccion == null) {
            return false;
        }

        return guardarInteraccion(
                interaccion.getIdCliente(),
                interaccion.getCodigoInmueble(),
                interaccion.getTipoInteraccion()
        );
    }

    public LinkedDoubleList<Interaccion> obtenerHistorialPorCliente(String clienteId) {
        String sql = """
                SELECT id, cliente_id, inmueble_codigo, tipo_interaccion, fecha
                FROM interaccion
                WHERE cliente_id = ?
                ORDER BY fecha DESC
                """;

        return jdbcTemplate.query(sql, rs -> {
            LinkedDoubleList<Interaccion> lista = new LinkedDoubleList<>();

            while (rs.next()) {
                lista.addLast(new Interaccion(
                        rs.getInt("id"),
                        rs.getString("cliente_id"),
                        rs.getString("inmueble_codigo"),
                        rs.getString("tipo_interaccion"),
                        rs.getTimestamp("fecha").toLocalDateTime()
                ));
            }

            return lista;
        }, clienteId);
    }
}