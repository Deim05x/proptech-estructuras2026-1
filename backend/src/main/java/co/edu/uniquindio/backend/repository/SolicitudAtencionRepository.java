package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.SolicitudAtencion;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

@Repository
public class SolicitudAtencionRepository {

    private final JdbcTemplate jdbcTemplate;

    public SolicitudAtencionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LinkedSimpleList<SolicitudAtencion> listar() {
        String sql = """
                SELECT id, id_cliente, codigo_inmueble, tipo_solicitud, descripcion,
                       estado, prioridad, fecha_creacion, fecha_atencion,
                       id_asesor_asignado, respuesta
                FROM solicitud_atencion
                ORDER BY fecha_creacion DESC, id
                """;

        return consultarLista(sql);
    }

    public SolicitudAtencion buscarPorId(String id) {
        String sql = """
                SELECT id, id_cliente, codigo_inmueble, tipo_solicitud, descripcion,
                       estado, prioridad, fecha_creacion, fecha_atencion,
                       id_asesor_asignado, respuesta
                FROM solicitud_atencion
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return mapearSolicitud(rs);
            }

            return null;
        }, id);
    }

    public boolean existe(String id) {
        String sql = "SELECT COUNT(*) FROM solicitud_atencion WHERE id = ?";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return total != null && total > 0;
    }

    public SolicitudAtencion guardar(SolicitudAtencion solicitud) {
        if (existe(solicitud.getId())) {
            throw new RuntimeException("Ya existe una solicitud con el ID " + solicitud.getId());
        }

        String sql = """
                INSERT INTO solicitud_atencion (
                    id, id_cliente, codigo_inmueble, tipo_solicitud, descripcion,
                    estado, prioridad, fecha_creacion, fecha_atencion,
                    id_asesor_asignado, respuesta
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                solicitud.getId(),
                solicitud.getIdCliente(),
                solicitud.getCodigoInmueble(),
                solicitud.getTipoSolicitud(),
                solicitud.getDescripcion(),
                solicitud.getEstado(),
                solicitud.getPrioridad(),
                solicitud.getFechaCreacion(),
                solicitud.getFechaAtencion(),
                solicitud.getIdAsesorAsignado(),
                solicitud.getRespuesta()
        );

        return solicitud;
    }

    public SolicitudAtencion actualizar(String id, SolicitudAtencion solicitudActualizada) {
        if (!existe(id)) {
            throw new RuntimeException("No existe una solicitud con el ID " + id);
        }

        String sql = """
                UPDATE solicitud_atencion
                SET id_cliente = ?,
                    codigo_inmueble = ?,
                    tipo_solicitud = ?,
                    descripcion = ?,
                    estado = ?,
                    prioridad = ?,
                    fecha_creacion = ?,
                    fecha_atencion = ?,
                    id_asesor_asignado = ?,
                    respuesta = ?
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                solicitudActualizada.getIdCliente(),
                solicitudActualizada.getCodigoInmueble(),
                solicitudActualizada.getTipoSolicitud(),
                solicitudActualizada.getDescripcion(),
                solicitudActualizada.getEstado(),
                solicitudActualizada.getPrioridad(),
                solicitudActualizada.getFechaCreacion(),
                solicitudActualizada.getFechaAtencion(),
                solicitudActualizada.getIdAsesorAsignado(),
                solicitudActualizada.getRespuesta(),
                id
        );

        solicitudActualizada.setId(id);
        return solicitudActualizada;
    }

    public void eliminar(String id) {
        int filas = jdbcTemplate.update("DELETE FROM solicitud_atencion WHERE id = ?", id);

        if (filas == 0) {
            throw new RuntimeException("No existe una solicitud con el ID " + id);
        }
    }

    public LinkedSimpleList<SolicitudAtencion> listarPorCliente(String idCliente) {
        String sql = """
                SELECT id, id_cliente, codigo_inmueble, tipo_solicitud, descripcion,
                       estado, prioridad, fecha_creacion, fecha_atencion,
                       id_asesor_asignado, respuesta
                FROM solicitud_atencion
                WHERE UPPER(id_cliente) = UPPER(?)
                ORDER BY fecha_creacion DESC, id
                """;

        return consultarLista(sql, idCliente);
    }

    public LinkedSimpleList<SolicitudAtencion> listarPorEstado(String estado) {
        String sql = """
                SELECT id, id_cliente, codigo_inmueble, tipo_solicitud, descripcion,
                       estado, prioridad, fecha_creacion, fecha_atencion,
                       id_asesor_asignado, respuesta
                FROM solicitud_atencion
                WHERE UPPER(estado) = UPPER(?)
                ORDER BY fecha_creacion DESC, id
                """;

        return consultarLista(sql, estado);
    }

    public LinkedSimpleList<SolicitudAtencion> listarPendientes() {
        return listarPorEstado("PENDIENTE");
    }

    public LinkedSimpleList<SolicitudAtencion> listarAltaPrioridadPendientes() {
        String sql = """
                SELECT id, id_cliente, codigo_inmueble, tipo_solicitud, descripcion,
                       estado, prioridad, fecha_creacion, fecha_atencion,
                       id_asesor_asignado, respuesta
                FROM solicitud_atencion
                WHERE UPPER(estado) = 'PENDIENTE'
                  AND UPPER(prioridad) = 'ALTA'
                ORDER BY fecha_creacion ASC, id
                """;

        return consultarLista(sql);
    }

    private LinkedSimpleList<SolicitudAtencion> consultarLista(String sql, Object... params) {
        return jdbcTemplate.query(sql, rs -> {
            LinkedSimpleList<SolicitudAtencion> solicitudes = new LinkedSimpleList<>();

            while (rs.next()) {
                solicitudes.addLast(mapearSolicitud(rs));
            }

            return solicitudes;
        }, params);
    }

    private SolicitudAtencion mapearSolicitud(ResultSet rs) throws SQLException {
        return new SolicitudAtencion(
                rs.getString("id"),
                rs.getString("id_cliente"),
                rs.getString("codigo_inmueble"),
                rs.getString("tipo_solicitud"),
                rs.getString("descripcion"),
                rs.getString("estado"),
                rs.getString("prioridad"),
                obtenerFecha(rs, "fecha_creacion"),
                obtenerFecha(rs, "fecha_atencion"),
                rs.getString("id_asesor_asignado"),
                rs.getString("respuesta")
        );
    }

    private java.time.LocalDateTime obtenerFecha(ResultSet rs, String columna) throws SQLException {
        Timestamp timestamp = rs.getTimestamp(columna);
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
}
