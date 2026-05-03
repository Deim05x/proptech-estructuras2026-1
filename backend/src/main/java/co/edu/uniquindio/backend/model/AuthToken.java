package co.edu.uniquindio.backend.model;

import java.time.LocalDateTime;

public class AuthToken implements Comparable<AuthToken> {

    private int id;
    private String token;
    private String username;
    private Role rol;
    private String clienteId;
    private LocalDateTime creadoEn;
    private LocalDateTime expiraEn;
    private boolean revocado;

    public AuthToken() {
    }

    public AuthToken(int id, String token, String username, Role rol, String clienteId,
                     LocalDateTime creadoEn, LocalDateTime expiraEn, boolean revocado) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.rol = rol;
        this.clienteId = clienteId;
        this.creadoEn = creadoEn;
        this.expiraEn = expiraEn;
        this.revocado = revocado;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Role getRol() { return rol; }
    public void setRol(Role rol) { this.rol = rol; }

    public String getClienteId() { return clienteId; }
    public void setClienteId(String clienteId) { this.clienteId = clienteId; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }

    public LocalDateTime getExpiraEn() { return expiraEn; }
    public void setExpiraEn(LocalDateTime expiraEn) { this.expiraEn = expiraEn; }

    public boolean isRevocado() { return revocado; }
    public void setRevocado(boolean revocado) { this.revocado = revocado; }

    @Override
    public int compareTo(AuthToken otro) {
        return Integer.compare(this.id, otro.id);
    }
}