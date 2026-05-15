import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/login.css";

const backgroundImage =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80";

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

  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.background = "#15121b";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#15121b";
    document.body.style.overflowX = "hidden";

    const root = document.getElementById("root");
    if (root) {
      root.style.margin = "0";
      root.style.padding = "0";
      root.style.minHeight = "100dvh";
      root.style.background = "#15121b";
    }
  }, []);

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
    <main style={pageStyle}>
      <style>{responsiveStyles}</style>

      <div style={backgroundStyle}>
        <img src={backgroundImage} alt="Casa moderna" style={backgroundImageStyle} />
        <div style={backgroundOverlayStyle}></div>
      </div>

      <div className="auth-shell register-shell" style={shellStyle}>
        <section className="auth-hero register-hero" style={heroColumnStyle}>
          <header style={brandStyle}>
            <div className="brand-pulse" style={brandIconStyle}>
              <HomeIcon />
            </div>

            <span style={brandTextStyle}>
              Hogar<span style={brandAccentStyle}>Xpress</span>
            </span>
          </header>

          <div style={heroCopyStyle}>
            <p style={eyebrowStyle}>Portal cliente</p>

            <h1 className="auth-title" style={heroTitleStyle}>
              Crea tu cuenta <br />
              <span style={heroHighlightStyle}>y empieza a buscar.</span>
            </h1>

            <p style={heroTextStyle}>
              Regístrate para guardar favoritos, solicitar visitas y recibir
              seguimiento personalizado sobre los inmuebles que te interesan.
            </p>
          </div>

          <div className="auth-stats" style={statsGridStyle}>
            <FeatureCard
              icon={<HeartIcon />}
              iconStyle={purpleIconStyle}
              title="Favoritos"
              text="Guarda inmuebles para revisarlos después."
            />
            <FeatureCard
              icon={<CalendarIcon />}
              iconStyle={blueIconStyle}
              title="Visitas"
              text="Solicita recorridos y seguimiento comercial."
            />
            <FeatureCard
              icon={<SparkIcon />}
              iconStyle={orangeIconStyle}
              title="Recomendaciones"
              text="Recibe opciones alineadas con tu perfil."
            />
          </div>
        </section>

        <section className="auth-form-column" style={formColumnStyle}>
          <div className="auth-form-card register-card" style={formCardStyle}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={backButtonStyle}
            >
              <ArrowLeftIcon />
              Volver al login
            </button>

            <div style={formHeaderStyle}>
              <h2 style={formTitleStyle}>Crear cuenta de cliente</h2>
              <p style={formSubtitleStyle}>
                Tu correo será usado como usuario para iniciar sesión.
              </p>
            </div>

            <form onSubmit={registrarCliente} style={formStyle}>
              <InputField
                label="Nombre completo"
                name="nombre"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formulario.nombre}
                onChange={manejarCambio}
                icon={<UserIcon />}
              />

              <InputField
                label="Teléfono"
                name="telefono"
                type="text"
                placeholder="Ejemplo: 3001234567"
                value={formulario.telefono}
                onChange={manejarCambio}
                icon={<PhoneIcon />}
              />

              <InputField
                label="Correo"
                name="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formulario.correo}
                onChange={manejarCambio}
                icon={<MailIcon />}
              />

              <InputField
                label="Contraseña"
                name="password"
                type="password"
                placeholder="Crea tu contraseña"
                value={formulario.password}
                onChange={manejarCambio}
                autoComplete="new-password"
                icon={<LockIcon />}
              />

              <InputField
                label="Confirmar contraseña"
                name="confirmarPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formulario.confirmarPassword}
                onChange={manejarCambio}
                autoComplete="new-password"
                icon={<LockIcon />}
              />

              <button type="submit" disabled={cargando} style={primaryButtonStyle}>
                {cargando ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            <div style={infoBoxStyle}>
              <strong>Importante:</strong> el sistema asignará automáticamente
              tu ID de cliente y lo vinculará con tu cuenta.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon,
  autoComplete,
}) {
  return (
    <div style={fieldGroupStyle}>
      <label htmlFor={name} style={labelStyle}>
        {label}
      </label>

      <div style={inputShellStyle}>
        <span style={inputIconStyle}>{icon}</span>
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={inputStyle}
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, iconStyle, title, text }) {
  return (
    <article className="floating-info-card" style={featureCardStyle}>
      <div style={{ ...featureIconStyle, ...iconStyle }}>{icon}</div>
      <div>
        <p style={featureTitleStyle}>{title}</p>
        <p style={featureTextStyle}>{text}</p>
      </div>
    </article>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8V6a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={smallSvgStyle}>
      <path
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M4.32 6.32a4.5 4.5 0 016.36 0L12 7.64l1.32-1.32a4.5 4.5 0 116.36 6.36L12 20.36l-7.68-7.68a4.5 4.5 0 010-6.36z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M5 3l1.8 4.2L11 9l-4.2 1.8L5 15l-1.8-4.2L-1 9l4.2-1.8L5 3zm13 4l1.2 2.8L22 11l-2.8 1.2L18 15l-1.2-2.8L14 11l2.8-1.2L18 7zm-5 8l1.5 3.5L18 20l-3.5 1.5L13 25l-1.5-3.5L8 20l3.5-1.5L13 15z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const responsiveStyles = `
  @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");

  @keyframes authFadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes waveFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    25% {
      transform: translate3d(5px, -12px, 0) rotate(0.45deg);
    }
    50% {
      transform: translate3d(0, 2px, 0) rotate(0deg);
    }
    75% {
      transform: translate3d(-5px, -7px, 0) rotate(-0.45deg);
    }
  }

  @keyframes cardGlow {
    0%, 100% {
      box-shadow: 0 8px 32px rgba(0,0,0,0.36);
      border-color: rgba(255,255,255,0.10);
    }
    50% {
      box-shadow: 0 16px 42px rgba(124,58,237,0.20);
      border-color: rgba(124,58,237,0.24);
    }
  }

  @keyframes brandPulse {
    0%, 100% {
      box-shadow: 0 16px 34px rgba(124,58,237,0.30);
      transform: translateY(0) scale(1);
    }
    50% {
      box-shadow: 0 18px 46px rgba(124,58,237,0.48);
      transform: translateY(-2px) scale(1.035);
    }
  }

  @keyframes formBreath {
    0%, 100% {
      box-shadow: 0 25px 50px rgba(0,0,0,0.50);
      border-color: rgba(124,58,237,0.32);
    }
    50% {
      box-shadow: 0 28px 62px rgba(124,58,237,0.18);
      border-color: rgba(124,58,237,0.46);
    }
  }

  .floating-info-card {
    animation:
      waveFloat 7.2s ease-in-out infinite,
      cardGlow 6.8s ease-in-out infinite;
    will-change: transform;
  }

  .floating-info-card:nth-child(2) {
    animation-delay: 0.75s, 0.25s;
  }

  .floating-info-card:nth-child(3) {
    animation-delay: 1.5s, 0.5s;
  }

  .brand-pulse {
    animation: brandPulse 4.8s ease-in-out infinite;
  }

  .auth-form-card {
    animation: formBreath 7.5s ease-in-out infinite;
  }

  .auth-form-card button:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .auth-form-card button:disabled {
    opacity: 0.72;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    .floating-info-card,
    .brand-pulse,
    .auth-form-card {
      animation: none !important;
    }
  }

  @media (max-width: 1120px) {
    .register-shell {
      grid-template-columns: 1fr !important;
      min-height: auto !important;
      padding-top: 28px !important;
      padding-bottom: 28px !important;
    }

    .register-hero {
      min-height: auto !important;
      gap: 34px !important;
    }

    .auth-form-column {
      justify-content: flex-start !important;
      min-height: auto !important;
    }
  }

  @media (max-width: 720px) {
    .auth-shell {
      padding-left: 18px !important;
      padding-right: 18px !important;
      gap: 28px !important;
    }

    .auth-title {
      font-size: 2.9rem !important;
    }

    .auth-stats {
      grid-template-columns: 1fr !important;
    }

    .register-card {
      padding: 28px !important;
      border-radius: 30px !important;
    }
  }
`;

const svgStyle = {
  width: "100%",
  height: "100%",
};

const smallSvgStyle = {
  width: "18px",
  height: "18px",
};

const pageStyle = {
  position: "relative",
  minHeight: "100dvh",
  width: "100vw",
  overflowX: "hidden",
  overflowY: "auto",
  background: "#15121b",
  color: "#ffffff",
  fontFamily: "'Space Grotesk', Inter, Arial, sans-serif",
};

const backgroundStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
};

const backgroundImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const backgroundOverlayStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(21,18,27,0.94), rgba(21,18,27,0.78)), radial-gradient(circle at 76% 12%, rgba(124,58,237,0.24), transparent 28%)",
};

const shellStyle = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: "1280px",
  minHeight: "100dvh",
  margin: "0 auto",
  padding: "48px",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "1fr 0.98fr",
  gap: "48px",
  alignItems: "center",
  animation: "authFadeUp 0.65s ease both",
};

const heroColumnStyle = {
  minHeight: "calc(100dvh - 96px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "42px",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const brandIconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  background: "#7c3aed",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "9px",
  boxShadow: "0 16px 34px rgba(124,58,237,0.30)",
};

const brandTextStyle = {
  color: "#ffffff",
  fontSize: "1.55rem",
  fontWeight: 800,
  letterSpacing: "-0.03em",
};

const brandAccentStyle = {
  color: "#7c3aed",
};

const heroCopyStyle = {
  maxWidth: "640px",
};

const eyebrowStyle = {
  margin: "0 0 14px",
  color: "#a78bfa",
  fontSize: "0.78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
};

const heroTitleStyle = {
  margin: "0 0 24px",
  color: "#ffffff",
  fontSize: "clamp(3.2rem, 5.4vw, 5.4rem)",
  lineHeight: 0.98,
  letterSpacing: 0,
  fontWeight: 800,
};

const heroHighlightStyle = {
  color: "#7c3aed",
  textShadow: "0 0 15px rgba(124,58,237,0.62)",
};

const heroTextStyle = {
  margin: 0,
  color: "rgba(229,231,235,0.82)",
  fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
  lineHeight: 1.7,
  maxWidth: "660px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "18px",
};

const featureCardStyle = {
  minHeight: "146px",
  padding: "20px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.36)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "16px",
};

const featureIconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  padding: "9px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const blueIconStyle = {
  color: "#60a5fa",
  background: "rgba(59,130,246,0.18)",
};

const orangeIconStyle = {
  color: "#fb923c",
  background: "rgba(249,115,22,0.18)",
};

const purpleIconStyle = {
  color: "#c084fc",
  background: "rgba(168,85,247,0.18)",
};

const featureTitleStyle = {
  margin: "0 0 4px",
  color: "#ffffff",
  fontSize: "0.95rem",
  fontWeight: 700,
};

const featureTextStyle = {
  margin: 0,
  color: "#9ca3af",
  fontSize: "0.78rem",
  lineHeight: 1.45,
};

const formColumnStyle = {
  minHeight: "calc(100dvh - 96px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

const formCardStyle = {
  width: "100%",
  maxWidth: "520px",
  padding: "38px",
  borderRadius: "40px",
  background: "rgba(15,23,42,0.90)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(124,58,237,0.32)",
  boxShadow: "0 25px 50px rgba(0,0,0,0.50)",
};

const backButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.05)",
  color: "#d1d5db",
  borderRadius: "14px",
  padding: "10px 13px",
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: "24px",
};

const formHeaderStyle = {
  marginBottom: "28px",
};

const formTitleStyle = {
  margin: "0 0 10px",
  color: "#ffffff",
  fontSize: "2rem",
  fontWeight: 800,
  letterSpacing: 0,
};

const formSubtitleStyle = {
  margin: 0,
  color: "#9ca3af",
  lineHeight: 1.5,
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  color: "#d1d5db",
  fontSize: "0.86rem",
  fontWeight: 600,
};

const inputShellStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minHeight: "52px",
  padding: "0 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxSizing: "border-box",
};

const inputIconStyle = {
  width: "20px",
  height: "20px",
  minWidth: "20px",
  color: "#6b7280",
  display: "flex",
};

const inputStyle = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#ffffff",
  fontSize: "0.96rem",
  fontFamily: "inherit",
  padding: "14px 0",
};

const primaryButtonStyle = {
  width: "100%",
  minHeight: "56px",
  border: "none",
  borderRadius: "18px",
  background: "#7c3aed",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 18px 34px rgba(124,58,237,0.25)",
  marginTop: "6px",
};

const infoBoxStyle = {
  marginTop: "18px",
  padding: "14px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#cbd5e1",
  fontSize: "0.9rem",
  lineHeight: 1.55,
};

export default RegistroClientePage;
