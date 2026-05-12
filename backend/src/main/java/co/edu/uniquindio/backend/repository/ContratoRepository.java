package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Contrato;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ContratoRepository {

    private final JdbcTemplate jdbcTemplate;

    public ContratoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LinkedSimpleList<Contrato> listar() {
        String sql = """
                SELECT id, codigo_inmueble, id_cliente, id_asesor, id_operacion,
                       tipo_contrato, fecha_inicio, fecha_fin, valor, estado, observacion
                FROM contrato
                ORDER BY fecha_fin, id
                """;

        return consultarLista(sql);
    }

    public Contrato buscarPorId(String id) {
        String sql = """
                SELECT id, codigo_inmueble, id_cliente, id_asesor, id_operacion,
                       tipo_contrato, fecha_inicio, fecha_fin, valor, estado, observacion
                FROM contrato
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearContrato(rs);
            }

            return null;
        }, id);
    }

    public boolean existe(String id) {
        String sql = "SELECT COUNT(*) FROM contrato WHERE id = ?";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return total != null && total > 0;
    }

    public Contrato guardar(Contrato contrato) {
        if (existe(contrato.getId())) {
            throw new RuntimeException("Ya existe un contrato con el ID " + contrato.getId());
        }

        String sql = """
                INSERT INTO contrato (
                    id, codigo_inmueble, id_cliente, id_asesor, id_operacion,
                    tipo_contrato, fecha_inicio, fecha_fin, valor, estado, observacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                contrato.getId(),
                contrato.getCodigoInmueble(),
                contrato.getIdCliente(),
                contrato.getIdAsesor(),
                contrato.getIdOperacion(),
                contrato.getTipoContrato(),
                contrato.getFechaInicio(),
                contrato.getFechaFin(),
                contrato.getValor(),
                contrato.getEstado(),
                contrato.getObservacion()
        );

        return contrato;
    }

    public Contrato actualizar(String id, Contrato contratoActualizado) {
        if (!existe(id)) {
            throw new RuntimeException("No existe un contrato con el ID " + id);
        }

        String sql = """
                UPDATE contrato
                SET codigo_inmueble = ?,
                    id_cliente = ?,
                    id_asesor = ?,
                    id_operacion = ?,
                    tipo_contrato = ?,
                    fecha_inicio = ?,
                    fecha_fin = ?,
                    valor = ?,
                    estado = ?,
                    observacion = ?
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                contratoActualizado.getCodigoInmueble(),
                contratoActualizado.getIdCliente(),
                contratoActualizado.getIdAsesor(),
                contratoActualizado.getIdOperacion(),
                contratoActualizado.getTipoContrato(),
                contratoActualizado.getFechaInicio(),
                contratoActualizado.getFechaFin(),
                contratoActualizado.getValor(),
                contratoActualizado.getEstado(),
                contratoActualizado.getObservacion(),
                id
        );

        contratoActualizado.setId(id);
        return contratoActualizado;
    }

    public void eliminar(String id) {
        int filas = jdbcTemplate.update("DELETE FROM contrato WHERE id = ?", id);

        if (filas == 0) {
            throw new RuntimeException("No existe un contrato con el ID " + id);
        }
    }

    public LinkedSimpleList<Contrato> listarPorEstado(String estado) {
        String sql = """
                SELECT id, codigo_inmueble, id_cliente, id_asesor, id_operacion,
                       tipo_contrato, fecha_inicio, fecha_fin, valor, estado, observacion
                FROM contrato
                WHERE UPPER(estado) = UPPER(?)
                ORDER BY fecha_fin, id
                """;

        return consultarLista(sql, estado);
    }

    public LinkedSimpleList<Contrato> listarPorCliente(String idCliente) {
        String sql = """
                SELECT id, codigo_inmueble, id_cliente, id_asesor, id_operacion,
                       tipo_contrato, fecha_inicio, fecha_fin, valor, estado, observacion
                FROM contrato
                WHERE UPPER(id_cliente) = UPPER(?)
                ORDER BY fecha_fin, id
                """;

        return consultarLista(sql, idCliente);
    }

    public LinkedSimpleList<Contrato> listarProximosAVencer(int dias) {
        LinkedSimpleList<Contrato> contratos = listar();
        LinkedSimpleList<Contrato> resultado = new LinkedSimpleList<>();

        for (Contrato contrato : contratos) {
            if (contrato.estaProximoAVencer(dias)) {
                resultado.addLast(contrato);
            }
        }

        return resultado;
    }

    public LinkedSimpleList<Contrato> listarVencidos() {
        LinkedSimpleList<Contrato> contratos = listar();
        LinkedSimpleList<Contrato> resultado = new LinkedSimpleList<>();

        for (Contrato contrato : contratos) {
            if (contrato.estaVencido()) {
                resultado.addLast(contrato);
            }
        }

        return resultado;
    }

    private LinkedSimpleList<Contrato> consultarLista(String sql, Object... params) {
        return jdbcTemplate.query(sql, rs -> {
            LinkedSimpleList<Contrato> contratos = new LinkedSimpleList<>();

            while (rs.next()) {
                contratos.addLast(mapearContrato(rs));
            }

            return contratos;
        }, params);
    }

    private Contrato mapearContrato(ResultSet rs) throws SQLException {
        java.sql.Date fechaInicio = rs.getDate("fecha_inicio");
        java.sql.Date fechaFin = rs.getDate("fecha_fin");

        return new Contrato(
                rs.getString("id"),
                rs.getString("codigo_inmueble"),
                rs.getString("id_cliente"),
                rs.getString("id_asesor"),
                rs.getString("id_operacion"),
                rs.getString("tipo_contrato"),
                fechaInicio == null ? null : fechaInicio.toLocalDate(),
                fechaFin == null ? null : fechaFin.toLocalDate(),
                rs.getDouble("valor"),
                rs.getString("estado"),
                rs.getString("observacion")
        );
    }
}
