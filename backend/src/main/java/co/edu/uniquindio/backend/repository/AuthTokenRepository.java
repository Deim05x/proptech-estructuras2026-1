package co.edu.uniquindio.backend.repository;

import co.edu.uniquindio.backend.model.AuthToken;
import co.edu.uniquindio.backend.model.Role;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public class AuthTokenRepository {

    private final JdbcTemplate jdbcTemplate;

    public AuthTokenRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean guardar(AuthToken token) {
        String sql = """
                INSERT INTO auth_token (token, username, rol, cliente_id, creado_en, expira_en, revocado)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        int filas = jdbcTemplate.update(
                sql,
                token.getToken(),
                token.getUsername(),
                token.getRol().name(),
                token.getClienteId(),
                token.getCreadoEn(),
                token.getExpiraEn(),
                token.isRevocado()
        );

        return filas > 0;
    }

    public AuthToken buscarTokenValido(String token) {
        String sql = """
                SELECT id, token, username, rol, cliente_id, creado_en, expira_en, revocado
                FROM auth_token
                WHERE token = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return new AuthToken(
                        rs.getInt("id"),
                        rs.getString("token"),
                        rs.getString("username"),
                        Role.valueOf(rs.getString("rol")),
                        rs.getString("cliente_id"),
                        rs.getTimestamp("creado_en").toLocalDateTime(),
                        rs.getTimestamp("expira_en").toLocalDateTime(),
                        rs.getBoolean("revocado")
                );
            }
            return null;
        }, token);
    }

    public boolean revocar(String token) {
        String sql = "UPDATE auth_token SET revocado = TRUE WHERE token = ?";
        return jdbcTemplate.update(sql, token) > 0;
    }

    public void revocarExpirados() {
        String sql = "UPDATE auth_token SET revocado = TRUE WHERE expira_en < ? AND revocado = FALSE";
        jdbcTemplate.update(sql, LocalDateTime.now());
    }
}