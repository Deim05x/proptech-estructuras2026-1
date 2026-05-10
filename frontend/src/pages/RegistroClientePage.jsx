import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/login.css";

function RegistroClientePage() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
    confirmarPassword: "",
  });

  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const registrarCliente = async (e) => {
    e.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.telefono.trim() ||
      !formulario.correo.trim() ||
      !formulario.password.trim() ||
      !formulario.confirmarPassword.trim()
    ) {
      alert("Debes completar todos los campos.");
      return;
    }

    if (formulario.password !== formulario.confirmarPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      await authService.registrarCliente({
  username: formulario.correo,
  password: formulario.password,
  nombre: formulario.nombre,
  correo: formulario.correo,
  telefono: formulario.telefono,
  tipoCliente: "COMPRADOR",
  presupuesto: 0,
  zonasInteres: "",
  tipoInmuebleDeseado: "",
  habitacionesMinimas: 0,
});

      alert("Cliente registrado correctamente. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar cliente:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "No se pudo registrar el cliente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes fadeUpRegister {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 640px) {
            .registro-card {
              padding: 26px !important;
              border-radius: 26px !important;
            }

            .registro-title {
              font-size: 2rem !important;
            }
          }
        `}
      </style>

      <div style={backgroundOverlay}></div>

      <div className="registro-card" style={cardStyle}>
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={backButton}
        >
          ← Volver al login
        </button>

        <div style={iconStyle}>🏡</div>

        <h1 className="registro-title" style={titleStyle}>
          Crear cuenta de cliente
        </h1>

        <p style={subtitleStyle}>
          Registra tus datos básicos. Tu correo será usado como usuario para
          iniciar sesión.
        </p>

        <form onSubmit={registrarCliente} style={formStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ingresa tu nombre completo"
              value={formulario.nombre}
              onChange={manejarCambio}
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Teléfono</label>
            <input
              type="text"
              name="telefono"
              placeholder="Ejemplo: 3001234567"
              value={formulario.telefono}
              onChange={manejarCambio}
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Correo</label>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={formulario.correo}
              onChange={manejarCambio}
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Crea tu contraseña"
              value={formulario.password}
              onChange={manejarCambio}
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Confirmar contraseña</label>
            <input
              type="password"
              name="confirmarPassword"
              placeholder="Repite tu contraseña"
              value={formulario.confirmarPassword}
              onChange={manejarCambio}
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={cargando} style={primaryButton}>
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div style={infoBoxStyle}>
          <strong>Importante:</strong> el sistema asignará automáticamente tu ID
          de cliente y lo vinculará con tu cuenta.
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100dvh",
  width: "100vw",
  margin: 0,
  padding: "24px",
  boxSizing: "border-box",
  position: "relative",
  overflowX: "hidden",
  overflowY: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2a1433",
  backgroundImage:
    "linear-gradient(rgba(54, 24, 68, 0.68), rgba(33, 14, 42, 0.84)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1920&auto=format&fit=crop')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  fontFamily: "Inter, Arial, sans-serif",
};

const backgroundOverlay = {
  position: "fixed",
  inset: 0,
  background:
    "radial-gradient(circle at 15% 85%, rgba(255,205,255,0.16), transparent 18%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.10), transparent 20%)",
  pointerEvents: "none",
};

const cardStyle = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: "560px",
  background: "rgba(255,255,255,0.95)",
  borderRadius: "34px",
  padding: "38px",
  boxShadow: "0 24px 60px rgba(0,0,0,0.26)",
  animation: "fadeUpRegister 0.7s ease both",
};

const backButton = {
  border: "none",
  background: "#f8f1fa",
  color: "#5a2f67",
  fontWeight: "800",
  borderRadius: "14px",
  padding: "10px 14px",
  cursor: "pointer",
  marginBottom: "18px",
};

const iconStyle = {
  width: "58px",
  height: "58px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #6b3a78, #4b2358)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.7rem",
  marginBottom: "18px",
};

const titleStyle = {
  margin: "0 0 10px",
  color: "#232027",
  fontSize: "2.4rem",
  fontWeight: "900",
};

const subtitleStyle = {
  color: "#736a75",
  fontSize: "1rem",
  lineHeight: 1.6,
  marginBottom: "28px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#453f47",
  fontWeight: "800",
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid #dbcfe0",
  outline: "none",
  backgroundColor: "white",
  color: "#2a2630",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const primaryButton = {
  width: "100%",
  padding: "17px",
  border: "none",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #6b3a78, #4b2358)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "900",
  cursor: "pointer",
  marginTop: "8px",
  boxShadow: "0 14px 28px rgba(67, 33, 77, 0.28)",
};

const infoBoxStyle = {
  marginTop: "18px",
  padding: "14px",
  borderRadius: "16px",
  background: "#f4ecf0",
  color: "#5c5360",
  fontSize: "0.92rem",
  lineHeight: 1.5,
};

export default RegistroClientePage;