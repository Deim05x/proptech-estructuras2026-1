import { NavLink, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const groupedAdminLinks = [
  {
    label: "Panel principal",
    path: "/dashboard",
    icon: "📊",
    descripcion: "Resumen ejecutivo",
  },
  {
    label: "Inmuebles",
    path: "/inmuebles-admin",
    icon: "🏘️",
    descripcion: "Inventario y precios",
  },
  {
    label: "Personas",
    path: "/personas",
    icon: "👥",
    descripcion: "Clientes y asesores",
  },
  {
    label: "Comercial",
    path: "/comercial",
    icon: "💼",
    descripcion: "Visitas y contratos",
  },
  {
    label: "Monitoreo",
    path: "/monitoreo",
    icon: "🚨",
    descripcion: "Alertas y controles",
  },
  {
    label: "Analítica",
    path: "/analitica",
    icon: "📈",
    descripcion: "Reportes y búsqueda",
  },
];

const groupedClienteLinks = [
  {
    label: "Inicio",
    path: "/inicio-cliente",
    icon: "🏠",
    descripcion: "Portal cliente",
  },
  {
    label: "Catálogo",
    path: "/catalogo-cliente",
    icon: "🔎",
    descripcion: "Explorar y comparar",
  },
  {
    label: "Mi actividad",
    path: "/mi-actividad",
    icon: "📌",
    descripcion: "Favoritos y visitas",
  },
  {
    label: "Mis solicitudes",
    path: "/mis-solicitudes",
    icon: "📩",
    descripcion: "Seguimiento",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const rol = authService.getRol();

  const cerrarSesion = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      authService.limpiarSesion();
      navigate("/login");
    }
  };

  const links = rol === "ADMIN" ? groupedAdminLinks : groupedClienteLinks;

  return (
    <aside style={sidebarStyle}>
      <style>
        {`
          @keyframes sidebarFadeIn {
            from {
              opacity: 0;
              transform: translateX(-18px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes sidebarGlow {
            0%, 100% {
              box-shadow: 0 0 0 rgba(124, 58, 237, 0);
            }
            50% {
              box-shadow: 0 0 28px rgba(124, 58, 237, 0.25);
            }
          }

          @keyframes softPulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: .65;
              transform: scale(1.2);
            }
          }
        `}
      </style>

      <div style={sidebarHeaderStyle}>
        <div style={logoCircleStyle}>⌂</div>

        <div>
          <h3 style={sidebarTitleStyle}>PropTech</h3>
          <small style={sidebarSubtitleStyle}>
            {rol === "ADMIN" ? "PropTech OS · Admin" : "Portal cliente"}
          </small>
        </div>
      </div>

      <div style={systemStatusStyle}>
        <span style={statusDotStyle}></span>
        <span>Sistema activo</span>
      </div>

      <nav style={navStyle}>
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} style={getLinkStyle}>
            {({ isActive }) => (
              <>
                <div
                  style={{
                    ...linkIconStyle,
                    ...(isActive ? activeIconStyle : {}),
                  }}
                >
                  {link.icon}
                </div>

                <div style={linkTextBlockStyle}>
                  <span
                    style={{
                      ...linkLabelStyle,
                      color: isActive ? "#ffffff" : "#d7cde4",
                    }}
                  >
                    {link.label}
                  </span>

                  <small
                    style={{
                      ...linkDescriptionStyle,
                      color: isActive ? "#d2bbff" : "#8f849e",
                    }}
                  >
                    {link.descripcion}
                  </small>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={bottomPanelStyle}>
        <div style={roleBoxStyle}>
          <span style={roleTagStyle}>{rol === "ADMIN" ? "ADMIN" : "CLIENTE"}</span>
          <small style={roleTextStyle}>
            {rol === "ADMIN"
              ? "Acceso administrativo completo"
              : "Acceso personalizado"}
          </small>
        </div>

        <button onClick={cerrarSesion} style={logoutButtonStyle}>
          <span style={logoutIconStyle}>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

const getLinkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "13px 14px",
  textDecoration: "none",
  borderRadius: "16px",
  marginBottom: "8px",
  transition: "0.25s ease",
  position: "relative",
  overflow: "hidden",
  background: isActive
    ? "linear-gradient(135deg, #3b2459, #261934)"
    : "transparent",
  border: isActive ? "1px solid #4a4455" : "1px solid transparent",
  boxShadow: isActive ? "0 0 26px rgba(124,58,237,0.18)" : "none",
  transform: isActive ? "translateX(3px)" : "translateX(0)",
});

const sidebarStyle = {
  width: "250px",
  background: "linear-gradient(180deg, #15121b, #100d16)",
  padding: "20px 16px",
  position: "fixed",
  top: "76px",
  left: 0,
  bottom: 0,
  borderRight: "1px solid #37333e",
  boxShadow: "14px 0 35px rgba(0,0,0,0.28)",
  overflowY: "auto",
  animation: "sidebarFadeIn 0.55s ease both",
  display: "flex",
  flexDirection: "column",
  zIndex: 999,
};

const sidebarHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 6px 18px",
  marginBottom: "12px",
  borderBottom: "1px solid #37333e",
};

const logoCircleStyle = {
  width: "44px",
  height: "44px",
  minWidth: "44px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #7c3aed, #9f7aea)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  fontSize: "1.25rem",
  border: "1px solid #4a4455",
  animation: "sidebarGlow 3.4s ease-in-out infinite",
};

const sidebarTitleStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "1.08rem",
  fontWeight: "900",
  letterSpacing: "-0.03em",
};

const sidebarSubtitleStyle = {
  color: "#9f92b2",
  fontWeight: "700",
  fontSize: "0.72rem",
};

const systemStatusStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: "2px 4px 18px",
  padding: "10px 12px",
  borderRadius: "14px",
  background: "#221e28",
  border: "1px solid #37333e",
  color: "#ccc3d8",
  fontSize: "0.74rem",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const statusDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#22c55e",
  boxShadow: "0 0 14px rgba(34,197,94,0.8)",
  animation: "softPulse 1.8s ease-in-out infinite",
};

const navStyle = {
  flex: 1,
};

const linkIconStyle = {
  width: "38px",
  height: "38px",
  minWidth: "38px",
  borderRadius: "13px",
  background: "#221e28",
  border: "1px solid #37333e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.1rem",
  transition: "0.25s ease",
};

const activeIconStyle = {
  background: "#3b2459",
  border: "1px solid #5b4b75",
  boxShadow: "0 0 18px rgba(124,58,237,0.22)",
};

const linkTextBlockStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  overflow: "hidden",
};

const linkLabelStyle = {
  fontSize: "0.88rem",
  fontWeight: "900",
  letterSpacing: "-0.01em",
  lineHeight: 1.15,
};

const linkDescriptionStyle = {
  fontSize: "0.68rem",
  fontWeight: "700",
  lineHeight: 1.15,
};

const bottomPanelStyle = {
  marginTop: "18px",
  paddingTop: "14px",
  borderTop: "1px solid #37333e",
};

const roleBoxStyle = {
  padding: "13px",
  borderRadius: "16px",
  background: "#221e28",
  border: "1px solid #4a4455",
  marginBottom: "12px",
};

const roleTagStyle = {
  display: "inline-block",
  color: "#d2bbff",
  fontWeight: "900",
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  marginBottom: "6px",
};

const roleTextStyle = {
  display: "block",
  color: "#92879f",
  fontSize: "0.73rem",
  lineHeight: 1.35,
};

const logoutButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "13px 14px",
  borderRadius: "16px",
  border: "1px solid #5c2329",
  background: "#3b151a",
  color: "#ffb4ab",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: "900",
  transition: "0.25s ease",
};

const logoutIconStyle = {
  width: "32px",
  height: "32px",
  minWidth: "32px",
  borderRadius: "12px",
  background: "#4a1d23",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Sidebar;
