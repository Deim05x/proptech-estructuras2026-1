import { NavLink, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const baseLinkStyle = {
  display: "block",
  padding: "12px 15px",
  textDecoration: "none",
  borderRadius: "12px",
  marginBottom: "8px",
  fontWeight: 700,
  transition: "0.2s ease",
};

const getLinkStyle = ({ isActive }) => ({
  ...baseLinkStyle,
  backgroundColor: isActive ? "#fbd7ff" : "transparent",
  color: isActive ? "#43214d" : "#4c444d",
  boxShadow: isActive ? "0 8px 18px rgba(67, 33, 77, 0.12)" : "none",
});

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

  return (
    <aside
      style={{
        width: "220px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(18px)",
        padding: "20px",
        position: "fixed",
        top: "70px",
        left: 0,
        bottom: 0,
        borderRight: "1px solid #e8e0e5",
        boxShadow: "10px 0 30px rgba(67,33,77,0.06)",
        overflowY: "auto",
      }}
    >
      <nav>
        {rol === "ADMIN" && (
          <>
            <NavLink to="/dashboard" style={getLinkStyle}>
              Dashboard
            </NavLink>

            <NavLink to="/inmuebles" style={getLinkStyle}>
              Inmuebles
            </NavLink>

            <NavLink to="/descubrir-inmuebles" style={getLinkStyle}>
              Descubrir inmuebles
            </NavLink>

            <NavLink to="/clientes" style={getLinkStyle}>
              Clientes
            </NavLink>

            <NavLink to="/asesores" style={getLinkStyle}>
              Asesores
            </NavLink>

            <NavLink to="/visitas" style={getLinkStyle}>
              Visitas
            </NavLink>

            <NavLink to="/operaciones" style={getLinkStyle}>
              Operaciones
            </NavLink>

            <NavLink to="/alertas" style={getLinkStyle}>
              Alertas
            </NavLink>

            <NavLink to="/reportes" style={getLinkStyle}>
              Reportes
            </NavLink>
          </>
        )}

        {rol === "CLIENTE" && (
          <>
            <NavLink to="/inicio-cliente" style={getLinkStyle}>
              Inicio
            </NavLink>

            <NavLink to="/descubrir-inmuebles" style={getLinkStyle}>
              Descubrir inmuebles
            </NavLink>

            <NavLink to="/recomendaciones" style={getLinkStyle}>
              Recomendaciones
            </NavLink>

            <NavLink to="/mi-actividad" style={getLinkStyle}>
              Mi actividad
            </NavLink>
          </>
        )}

        <button
          onClick={cerrarSesion}
          style={{
            ...baseLinkStyle,
            border: "none",
            backgroundColor: "#ffdad6",
            color: "#93000a",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;