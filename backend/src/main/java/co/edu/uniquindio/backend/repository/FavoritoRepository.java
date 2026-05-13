package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.estructuras.listas.SimpleList.LinkedSimpleList;
import co.edu.uniquindio.backend.model.Inmueble;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FavoritoRepository {

    private final JdbcTemplate jdbcTemplate;

    public FavoritoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LinkedSimpleList<Inmueble> obtenerFavoritosPorCliente(String clienteId) {
        String sql = """
                SELECT i.codigo, i.direccion, i.ciudad, i.barrio_zona, i.tipo_inmueble, i.finalidad,
                       i.precio, i.area, i.habitaciones, i.banos, i.estado, i.disponible,
                       i.asesor_id_responsable, i.imagen_url
                FROM favorito f
                INNER JOIN inmueble i ON f.inmueble_codigo = i.codigo
                WHERE f.cliente_id = ?
                ORDER BY i.codigo
                """;

        return jdbcTemplate.query(sql, rs -> {
            LinkedSimpleList<Inmueble> lista = new LinkedSimpleList<>();

            while (rs.next()) {
                lista.addLast(new Inmueble(
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
                        rs.getString("asesor_id_responsable"),
                        rs.getString("imagen_url")
                ));
            }

            return lista;
        }, clienteId);
    }

    public boolean existeFavorito(String clienteId, String codigoInmueble) {
        String sql = """
                SELECT COUNT(*)
                FROM favorito
                WHERE cliente_id = ? AND inmueble_codigo = ?
                """;

        Integer cantidad = jdbcTemplate.queryForObject(sql, Integer.class, clienteId, codigoInmueble);
        return cantidad != null && cantidad > 0;
    }

    public boolean guardarFavorito(String clienteId, String codigoInmueble) {
        String sql = """
                INSERT INTO favorito (cliente_id, inmueble_codigo)
                VALUES (?, ?)
                """;

        int filas = jdbcTemplate.update(sql, clienteId, codigoInmueble);
        return filas > 0;
    }

    public boolean eliminarFavorito(String clienteId, String codigoInmueble) {
        String sql = """
                DELETE FROM favorito
                WHERE cliente_id = ? AND inmueble_codigo = ?
                """;

        int filas = jdbcTemplate.update(sql, clienteId, codigoInmueble);
        return filas > 0;
    }
}
