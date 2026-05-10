import authService from "../services/authService";

function Navbar() {
  const username = authService.getUsername();
  const rol = authService.getRol();

  const obtenerNombreRol = () => {
    if (rol === "ADMIN") return "Administrador";
    if (rol === "CLIENTE") return "Cliente";
    return "Sin rol";
  };

  const obtenerInicial = () => {
    return (username || "U").charAt(0).toUpperCase();
  };

  return (
    <header style={navbarStyle}>
      <style>
        {`
          @keyframes navbarFadeDown {
            from {
              opacity: 0;
              transform: translateY(-14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulseStatus {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.55;
              transform: scale(1.25);
            }
          }

          @keyframes avatarGlow {
            0%, 100% {
              box-shadow: 0 0 0 rgba(124, 58, 237, 0);
            }
            50% {
              box-shadow: 0 0 22px rgba(124, 58, 237, 0.45);
            }
          }
        `}
      </style>

      <div style={brandContainerStyle}>
        <div style={logoBoxStyle}>⌂</div>

        <div>
          <h2 style={titleStyle}>
            Prop<span style={titleAccentStyle}>Tech</span>
          </h2>

          <small style={subtitleStyle}>
            Plataforma de gestion inmobiliaria
          </small>
        </div>
      </div>

      <div style={rightSectionStyle}>
        <div style={statusBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>Sesión activa</span>
        </div>

        <div style={userCardStyle}>
          <div style={{ textAlign: "right" }}>
            <strong style={usernameStyle}>{username || "Usuario"}</strong>

            <small style={roleStyle}>{obtenerNombreRol()}</small>
          </div>

          <div style={avatarStyle}>{obtenerInicial()}</div>
        </div>
      </div>
    </header>
  );
}

const navbarStyle = {
  height: "76px",
  background: "linear-gradient(135deg, #15121b, #221e28)",
  color: "#e8dfee",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 28px",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  borderBottom: "1px solid #37333e",
  boxShadow: "0 10px 35px rgba(0,0,0,0.32)",
  animation: "navbarFadeDown 0.55s ease both",
};

const brandContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const logoBoxStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #7c3aed, #9f7aea)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.45rem",
  fontWeight: "900",
  border: "1px solid #4a4455",
  boxShadow: "0 0 24px rgba(124,58,237,0.28)",
};

const titleStyle = {
  margin: 0,
  fontFamily: "Manrope, Inter, Arial, sans-serif",
  fontWeight: 900,
  letterSpacing: "-0.04em",
  color: "#ffffff",
  fontSize: "1.55rem",
  lineHeight: 1,
};

const titleAccentStyle = {
  color: "#d2bbff",
  fontWeight: 500,
};

const subtitleStyle = {
  display: "block",
  color: "#b9aec9",
  fontSize: "0.76rem",
  marginTop: "5px",
  letterSpacing: "0.02em",
};

const rightSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const statusBadgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "9px 13px",
  borderRadius: "999px",
  background: "#221e28",
  border: "1px solid #37333e",
  color: "#ccc3d8",
  fontSize: "0.78rem",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const statusDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#22c55e",
  boxShadow: "0 0 14px rgba(34,197,94,0.8)",
  animation: "pulseStatus 1.8s ease-in-out infinite",
};

const userCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "8px 10px 8px 16px",
  borderRadius: "18px",
  background: "#221e28",
  border: "1px solid #37333e",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04)",
};

const usernameStyle = {
  display: "block",
  color: "#ffffff",
  fontSize: "0.92rem",
  maxWidth: "220px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const roleStyle = {
  color: "#d2bbff",
  fontWeight: "800",
  fontSize: "0.74rem",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const avatarStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7c3aed, #d2bbff)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  border: "1px solid #4a4455",
  animation: "avatarGlow 3.2s ease-in-out infinite",
};

export default Navbar;
