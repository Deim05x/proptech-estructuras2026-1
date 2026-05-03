package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.model.AuthUsuario;
import co.edu.uniquindio.backend.model.Role;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AuthUsuarioRepository {

    private final JdbcTemplate jdbcTemplate;

    public AuthUsuarioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public AuthUsuario buscarPorUsername(String username) {
        String sql = """
                SELECT id, username, password_hash, rol, cliente_id, activo
                FROM auth_usuario
                WHERE username = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return new AuthUsuario(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("password_hash"),
                        Role.valueOf(rs.getString("rol")),
                        rs.getString("cliente_id"),
                        rs.getBoolean("activo")
                );
            }
            return null;
        }, username);
    }

    public boolean existeUsername(String username) {
        String sql = "SELECT COUNT(*) FROM auth_usuario WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    public boolean guardar(AuthUsuario usuario) {
        String sql = """
                INSERT INTO auth_usuario (username, password_hash, rol, cliente_id, activo)
                VALUES (?, ?, ?, ?, ?)
                """;

        int filas = jdbcTemplate.update(
                sql,
                usuario.getUsername(),
                usuario.getPasswordHash(),
                usuario.getRol().name(),
                usuario.getClienteId(),
                usuario.isActivo()
        );

        return filas > 0;
    }
}