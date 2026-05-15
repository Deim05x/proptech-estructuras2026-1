import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/login.css";

const backgroundImage =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80";

function LoginPage() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    username: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!authService.estaAutenticado()) return;

    const rutaInicio = authService.getRutaInicioPorRol(authService.getRol());

    if (rutaInicio !== "/login") {
      navigate(rutaInicio, { replace: true });
    }
  }, [navigate]);

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

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (!formulario.username.trim() || !formulario.password.trim()) {
      alert("Debes completar usuario y contraseña.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await authService.login(formulario);
      authService.guardarSesion(respuesta);

      const rutaInicio = authService.getRutaInicioPorRol(respuesta?.rol);

      if (rutaInicio === "/login") {
        authService.limpiarSesion();
        alert("El rol del usuario no es válido para ingresar al sistema.");
        return;
      }

      navigate(rutaInicio, { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "No se pudo iniciar sesión."
      );
    } finally {
      setCargando(false);
    }
  };

  const irARegistro = () => {
    navigate("/registro-cliente");
  };

  const irComoInvitado = () => {
    navigate("/descubrir-inmuebles");
  };

  return (
    <main style={pageStyle}>
      <style>{responsiveStyles}</style>

      <div style={backgroundStyle}>
        <img src={backgroundImage} alt="Casa moderna" style={backgroundImageStyle} />
        <div style={backgroundOverlayStyle}></div>
      </div>

      <div className="auth-shell" style={shellStyle}>
        <section className="auth-hero" style={heroColumnStyle}>
          <header style={brandStyle}>
            <div className="brand-pulse" style={brandIconStyle}>
              <HomeIcon />
            </div>

            <span style={brandTextStyle}>
              Hogar<span style={brandAccentStyle}>Xpress</span>
            </span>
          </header>

          <div style={heroCopyStyle}>
            <h1 className="auth-title" style={heroTitleStyle}>
              Gestión inmobiliaria <br />
              <span style={heroHighlightStyle}>al más alto nivel.</span>
            </h1>

            <p style={heroTextStyle}>
              Accede a tu panel de control y administra inmuebles, clientes,
              visitas y operaciones desde una plataforma moderna.
            </p>
          </div>

          <div className="auth-stats" style={statsGridStyle}>
            <StatCard
              icon={<ChartIcon />}
              iconStyle={blueIconStyle}
              title="Ventas activas"
              text="+28 cierres este mes"
            />
            <StatCard
              icon={<BuildingIcon />}
              iconStyle={orangeIconStyle}
              title="Inmuebles destacados"
              text="84 propiedades publicadas"
            />
            <StatCard
              icon={<UsersIcon />}
              iconStyle={purpleIconStyle}
              title="Clientes activos"
              text="146 perfiles interesados"
            />
          </div>
        </section>

        <section className="auth-form-column" style={formColumnStyle}>
          <div className="auth-form-card" style={formCardStyle}>
            <div style={formHeaderStyle}>
              <h2 style={formTitleStyle}>Bienvenido de nuevo</h2>
              <p style={formSubtitleStyle}>
                Ingresa con tu usuario y contraseña.
              </p>
            </div>

            <form onSubmit={iniciarSesion} style={formStyle}>
              <div style={fieldGroupStyle}>
                <label htmlFor="username" style={labelStyle}>
                  Usuario
                </label>

                <div style={inputShellStyle}>
                  <span style={inputIconStyle}>
                    <UserIcon />
                  </span>

                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formulario.username}
                    onChange={manejarCambio}
                    placeholder="Ingresa tu usuario"
                    autoComplete="username"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={fieldGroupStyle}>
                <div style={passwordLabelRowStyle}>
                  <label htmlFor="password" style={labelStyle}>
                    Contraseña
                  </label>

                  <button type="button" style={forgotButtonStyle}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div style={inputShellStyle}>
                  <span style={inputIconStyle}>
                    <LockIcon />
                  </span>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formulario.password}
                    onChange={manejarCambio}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={actionsStyle}>
                <button type="submit" style={loginButtonStyle} disabled={cargando}>
                  {cargando ? "Ingresando..." : "Ingresar a tu cuenta"}
                </button>

                <div style={dividerStyle}>
                  <span style={dividerLineStyle}></span>
                  <span style={dividerTextStyle}>o</span>
                  <span style={dividerLineStyle}></span>
                </div>

                <button
                  type="button"
                  onClick={irComoInvitado}
                  style={guestButtonStyle}
                >
                  Explorar como invitado
                </button>

                <button
                  type="button"
                  onClick={irARegistro}
                  style={registerButtonStyle}
                >
                  Registrarme como cliente
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, iconStyle, title, text }) {
  return (
    <article className="floating-info-card" style={statCardStyle}>
      <div style={{ ...statIconStyle, ...iconStyle }}>{icon}</div>
      <div>
        <p style={statTitleStyle}>{title}</p>
        <p style={statTextStyle}>{text}</p>
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

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={svgStyle}>
      <path
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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

  @media (max-width: 1080px) {
    .auth-shell {
      grid-template-columns: 1fr !important;
      min-height: auto !important;
      padding-top: 28px !important;
      padding-bottom: 28px !important;
    }

    .auth-hero {
      min-height: auto !important;
      gap: 36px !important;
      padding: 0 !important;
    }

    .auth-form-column {
      justify-content: flex-start !important;
      padding: 0 !important;
    }
  }

  @media (max-width: 720px) {
    .auth-shell {
      padding-left: 18px !important;
      padding-right: 18px !important;
      gap: 28px !important;
    }

    .auth-title {
      font-size: 3rem !important;
    }

    .auth-stats {
      grid-template-columns: 1fr !important;
    }

    .auth-form-card {
      padding: 28px !important;
      border-radius: 30px !important;
    }
  }
`;

const svgStyle = {
  width: "100%",
  height: "100%",
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
    "linear-gradient(90deg, rgba(21,18,27,0.92), rgba(21,18,27,0.76)), radial-gradient(circle at 80% 18%, rgba(124,58,237,0.22), transparent 28%)",
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
  gridTemplateColumns: "1.08fr 0.92fr",
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
  maxWidth: "620px",
};

const heroTitleStyle = {
  margin: "0 0 24px",
  color: "#ffffff",
  fontSize: "clamp(3.4rem, 6vw, 5.9rem)",
  lineHeight: 0.96,
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
  fontSize: "clamp(1rem, 1.5vw, 1.22rem)",
  lineHeight: 1.7,
  maxWidth: "660px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "20px",
};

const statCardStyle = {
  minHeight: "140px",
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

const statIconStyle = {
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

const statTitleStyle = {
  margin: "0 0 4px",
  color: "#ffffff",
  fontSize: "0.95rem",
  fontWeight: 700,
};

const statTextStyle = {
  margin: 0,
  color: "#9ca3af",
  fontSize: "0.78rem",
};

const formColumnStyle = {
  minHeight: "calc(100dvh - 96px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

const formCardStyle = {
  width: "100%",
  maxWidth: "450px",
  padding: "40px",
  borderRadius: "40px",
  background: "rgba(15,23,42,0.90)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(124,58,237,0.32)",
  boxShadow: "0 25px 50px rgba(0,0,0,0.50)",
};

const formHeaderStyle = {
  marginBottom: "36px",
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
  gap: "22px",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  color: "#d1d5db",
  fontSize: "0.88rem",
  fontWeight: 600,
};

const passwordLabelRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const forgotButtonStyle = {
  border: "none",
  background: "transparent",
  color: "#8b5cf6",
  padding: 0,
  fontSize: "0.78rem",
  fontWeight: 700,
  cursor: "pointer",
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

const actionsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  paddingTop: "8px",
};

const loginButtonStyle = {
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
  transition: "0.25s ease",
};

const dividerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "4px 0",
};

const dividerLineStyle = {
  height: "1px",
  flex: 1,
  background: "rgba(255,255,255,0.10)",
};

const dividerTextStyle = {
  color: "#6b7280",
  fontSize: "0.74rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const guestButtonStyle = {
  width: "100%",
  minHeight: "56px",
  border: "1px solid rgba(255,255,255,0.20)",
  borderRadius: "18px",
  background: "transparent",
  color: "#ffffff",
  fontSize: "0.98rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "0.25s ease",
};

const registerButtonStyle = {
  width: "100%",
  minHeight: "56px",
  border: "none",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.06)",
  color: "#a78bfa",
  fontSize: "0.98rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "0.25s ease",
};

export default LoginPage;
