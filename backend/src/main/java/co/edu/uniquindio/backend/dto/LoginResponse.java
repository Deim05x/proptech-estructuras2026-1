package co.edu.uniquindio.backend.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String rol;
    private String clienteId;

    public LoginResponse() {
    }

    public LoginResponse(String token, String username, String rol, String clienteId) {
        this.token = token;
        this.username = username;
        this.rol = rol;
        this.clienteId = clienteId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getClienteId() { return clienteId; }
    public void setClienteId(String clienteId) { this.clienteId = clienteId; }
}