package co.edu.uniquindio.backend.model;

public class AuthUsuario implements Comparable<AuthUsuario> {

    private int id;
    private String username;
    private String passwordHash;
    private Role rol;
    private String clienteId;
    private boolean activo;

    public AuthUsuario() {
    }

    public AuthUsuario(int id, String username, String passwordHash, Role rol, String clienteId, boolean activo) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.rol = rol;
        this.clienteId = clienteId;
        this.activo = activo;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRol() { return rol; }
    public void setRol(Role rol) { this.rol = rol; }

    public String getClienteId() { return clienteId; }
    public void setClienteId(String clienteId) { this.clienteId = clienteId; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    @Override
    public int compareTo(AuthUsuario otro) {
        return Integer.compare(this.id, otro.id);
    }
}