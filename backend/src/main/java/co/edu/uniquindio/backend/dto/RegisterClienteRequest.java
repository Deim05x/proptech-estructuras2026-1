package co.edu.uniquindio.backend.dto;

public class RegisterClienteRequest {
    private String clienteId;
    private String username;
    private String password;

    public RegisterClienteRequest() {
    }

    public String getClienteId() { return clienteId; }
    public void setClienteId(String clienteId) { this.clienteId = clienteId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}