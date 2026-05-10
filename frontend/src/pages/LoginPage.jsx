import { useEffect, useState } from "react";
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
    document.documentElement.style.background = "#2a1433";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#2a1433";
    document.body.style.overflowX = "hidden";

    const root = document.getElementById("root");
    if (root) {
      root.style.margin = "0";
      root.style.padding = "0";
      root.style.minHeight = "100dvh";
      root.style.background = "#2a1433";
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
        alert("El rol del usuario no es valido para ingresar al sistema.");
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

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes floatSoft {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-9px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          @keyframes fadeInLeft {
            0% {
              opacity: 0;
              transform: translateX(-28px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInRight {
            0% {
              opacity: 0;
              transform: translateX(28px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes pulseGlow {
            0% {
              box-shadow: 0 0 0 rgba(255, 210, 255, 0.0);
            }
            50% {
              box-shadow: 0 0 28px rgba(255, 210, 255, 0.18);
            }
            100% {
              box-shadow: 0 0 0 rgba(255, 210, 255, 0.0);
            }
          }

          @media (max-width: 980px) {
            .login-grid-responsive {
              grid-template-columns: 1fr !important;
              padding: 28px 18px !important;
              overflow-y: auto !important;
            }

            .login-left-responsive {
              min-height: auto !important;
              padding: 18px !important;
            }

            .login-bubbles-responsive {
              display: none !important;
            }
          }
        `}
      </style>

      <div style={overlayStyle}></div>

      <div className="login-grid-responsive" style={contentStyle}>
        <section className="login-left-responsive" style={leftPanelStyle}>
          <div style={brandStyle}>
            <div style={brandIconStyle}>⌂</div>

            <span style={brandTextStyle}>
              Prop<span style={{ color: "#f2c7f3" }}>Tech</span>
            </span>
          </div>

          <div style={heroContentStyle}>
            <h1 style={heroTitleStyle}>
              Gestión inmobiliaria <br />
              <span style={heroHighlightStyle}>al más alto nivel.</span>
            </h1>

            <p style={heroTextStyle}>
              Accede a tu panel de control y administra inmuebles, clientes,
              visitas y operaciones desde una plataforma moderna.
            </p>
          </div>

          <div className="login-bubbles-responsive" style={bubbleGroupStyle}>
            <div style={{ ...floatingCardStyle, animationDelay: "0s" }}>
              <div style={bubbleIconStyle}>📈</div>

              <div>
                <div style={bubbleTitleStyle}>Ventas activas</div>
                <div style={bubbleTextStyle}>+28 cierres este mes</div>
              </div>
            </div>

            <div style={{ ...floatingCardStyle, animationDelay: "0.35s" }}>
              <div style={bubbleIconStyle}>🏡</div>

              <div>
                <div style={bubbleTitleStyle}>Inmuebles destacados</div>
                <div style={bubbleTextStyle}>84 propiedades publicadas</div>
              </div>
            </div>

            <div style={{ ...floatingCardStyle, animationDelay: "0.7s" }}>
              <div style={bubbleIconStyle}>👥</div>

              <div>
                <div style={bubbleTitleStyle}>Clientes activos</div>
                <div style={bubbleTextStyle}>146 perfiles interesados</div>
              </div>
            </div>
          </div>
        </section>

        <section style={rightPanelStyle}>
          <div style={loginCardStyle}>
            <h2 style={loginTitleStyle}>Bienvenido de nuevo</h2>

            <p style={loginSubtitleStyle}>
              Ingresa con tu usuario y contraseña.
            </p>

            <form onSubmit={iniciarSesion}>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Usuario</label>

                <div style={inputWrapperStyle}>
                  <span style={inputIconStyle}>👤</span>

                  <input
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
                <label style={labelStyle}>Contraseña</label>

                <div style={inputWrapperStyle}>
                  <span style={inputIconStyle}>🔐</span>

                  <input
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

              <div style={forgotPasswordStyle}>¿Olvidaste tu contraseña?</div>

              <button type="submit" style={loginButtonStyle} disabled={cargando}>
                {cargando ? "Ingresando..." : "Ingresar a tu cuenta"}
              </button>

              <button
                type="button"
                onClick={irARegistro}
                style={registerButtonStyle}
              >
                Registrarme como cliente
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100dvh",
  width: "100vw",
  margin: 0,
  padding: 0,
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#2a1433",
  backgroundImage:
    "linear-gradient(rgba(54, 24, 68, 0.58), rgba(33, 14, 42, 0.72)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  fontFamily: "Arial, sans-serif",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 14% 82%, rgba(255,205,255,0.20), transparent 18%), radial-gradient(circle at 78% 10%, rgba(255,255,255,0.15), transparent 18%), radial-gradient(circle at 50% 30%, rgba(205,140,255,0.10), transparent 22%)",
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
  minHeight: "100dvh",
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1.25fr 0.95fr",
  alignItems: "center",
  gap: "24px",
  padding: "36px 48px",
};

const leftPanelStyle = {
  position: "relative",
  minHeight: "86vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  padding: "24px 24px 24px 34px",
  animation: "fadeInLeft 0.8s ease both",
};

const rightPanelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: "fadeInRight 0.8s ease both",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  marginBottom: "50px",
};

const brandIconStyle = {
  width: "62px",
  height: "62px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.85rem",
  color: "white",
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(8px)",
  animation: "pulseGlow 3s ease-in-out infinite",
};

const brandTextStyle = {
  color: "white",
  fontSize: "3.1rem",
  fontWeight: "800",
};

const heroContentStyle = {
  maxWidth: "720px",
};

const heroTitleStyle = {
  color: "white",
  fontSize: "5rem",
  lineHeight: "0.98",
  margin: "0 0 26px",
  fontWeight: "300",
};

const heroHighlightStyle = {
  color: "#f3cdfd",
  fontWeight: "800",
};

const heroTextStyle = {
  color: "rgba(255,255,255,0.88)",
  fontSize: "1.18rem",
  lineHeight: "1.7",
  maxWidth: "650px",
};

const bubbleGroupStyle = {
  position: "absolute",
  left: "34px",
  bottom: "32px",
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(205px, 235px))",
  gap: "10px",
  maxWidth: "500px",
};

const floatingCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.16)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
  animation: "floatSoft 4s ease-in-out infinite",
};

const bubbleIconStyle = {
  width: "34px",
  minWidth: "34px",
  height: "34px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.16)",
  fontSize: "1rem",
};

const bubbleTitleStyle = {
  color: "white",
  fontSize: "0.82rem",
  fontWeight: "800",
  lineHeight: 1.2,
};

const bubbleTextStyle = {
  color: "rgba(255,255,255,0.82)",
  fontSize: "0.76rem",
  marginTop: "3px",
  lineHeight: 1.25,
};

const loginCardStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "rgba(255,255,255,0.95)",
  borderRadius: "36px",
  padding: "44px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
};

const loginTitleStyle = {
  fontSize: "2.7rem",
  color: "#232027",
  margin: "0 0 12px",
  fontWeight: "800",
};

const loginSubtitleStyle = {
  fontSize: "1.15rem",
  color: "#736a75",
  marginBottom: "30px",
};

const fieldGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "10px",
  color: "#453f47",
  fontWeight: "700",
  fontSize: "1rem",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #dbcfe0",
  borderRadius: "22px",
  padding: "0 16px",
  backgroundColor: "#fff",
};

const inputIconStyle = {
  fontSize: "1.1rem",
  marginRight: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "17px 4px",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "1rem",
  color: "#2a2630",
};

const forgotPasswordStyle = {
  textAlign: "right",
  color: "#7d4d88",
  fontWeight: "700",
  marginBottom: "24px",
  cursor: "pointer",
};

const loginButtonStyle = {
  width: "100%",
  padding: "18px",
  border: "none",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #6b3a78, #4b2358)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(92,46,110,0.22)",
  marginBottom: "14px",
};

const registerButtonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "20px",
  border: "1px solid #d8c5df",
  background: "#f8f1fa",
  color: "#5a2f67",
  fontSize: "1rem",
  fontWeight: "800",
  cursor: "pointer",
};

export default LoginPage;
