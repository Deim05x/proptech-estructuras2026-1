import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/login.css";

function LoginPage() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    username: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setCargando(true);

      const respuesta = await authService.login(formulario);
      authService.guardarSesion(respuesta);

      if (respuesta.rol === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/inicio-cliente");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Credenciales incorrectas. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay"></div>
        <div className="orb orb-one"></div>
        <div className="orb orb-two"></div>
      </div>

      <main className="login-container">
        <section className="login-brand">
          <div className="brand-row">
            <div className="brand-icon">⌂</div>
            <h1>
              Prop<span>Tech</span>
            </h1>
          </div>

          <h2>
            Gestión inmobiliaria <br />
            <strong>al más alto nivel.</strong>
          </h2>

          <p>
            Accede a tu panel de control y administra inmuebles, clientes,
            visitas y operaciones desde una plataforma moderna.
          </p>

          <div className="floating-badges">
            <div className="trust-badge badge-one">
              <div className="trust-icon">🏘️</div>
              <div>
                <strong>Panel integral</strong>
                <small>Control de propiedades</small>
              </div>
            </div>

            <div className="trust-badge badge-two">
              <div className="trust-icon">🔒</div>
              <div>
                <strong>Acceso seguro</strong>
                <small>Roles admin y cliente</small>
              </div>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="card-glow"></div>

          <div className="login-card-content">
            <h3>Bienvenido de nuevo</h3>
            <p className="login-subtitle">
              Ingresa con tu usuario y contraseña.
            </p>

            <form onSubmit={manejarSubmit}>
              <div className="login-field">
                <label>Usuario</label>
                <div className="input-wrapper">
                  <span>👤</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="admin o cliente1"
                    value={formulario.username}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Contraseña</label>
                <div className="input-wrapper">
                  <span>🔐</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formulario.password}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                {error && <small className="login-error">{error}</small>}
              </div>

              <div className="login-help">
                <span>¿Olvidaste tu contraseña?</span>
              </div>

              <button type="submit" className="login-button" disabled={cargando}>
                {cargando ? "Ingresando..." : "Ingresar a tu cuenta"}
              </button>
            </form>

            <div className="login-demo">
              <p>
                <strong>Admin:</strong> admin / Admin123*
              </p>
              <p>
                <strong>Cliente:</strong> cliente1 / Cliente123*
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;