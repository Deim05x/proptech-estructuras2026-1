import { NavLink } from "react-router-dom";

const linkStyle = {
    display: "block",
    padding: "12px 15px",
    textDecoration: "none",
    color: "#1f2937",
    borderRadius: "8px",
    marginBottom: "8px",
};

function Sidebar() {
    return (
        <aside
            style={{
                width: "220px",
                backgroundColor: "white",
                padding: "20px",
                position: "fixed",
                top: "70px",
                left: 0,
                bottom: 0,
                boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
                overflowY: "auto",
            }}
        >
            <nav>
                <NavLink
                    to="/dashboard"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/inmuebles"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Inmuebles
                </NavLink>

                <NavLink
                    to="/clientes"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Clientes
                </NavLink>

                <NavLink
                    to="/asesores"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Asesores
                </NavLink>

                <NavLink
                    to="/visitas"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Visitas
                </NavLink>

                <NavLink
                    to="/favoritos"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Favoritos
                </NavLink>

                <NavLink
                    to="/historial"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Historial
                </NavLink>

                <NavLink
                    to="/operaciones"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Operaciones
                </NavLink>

                <NavLink
                    to="/alertas"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Alertas
                </NavLink>

                <NavLink
                    to="/carrusel-inmuebles"
                    style={({ isActive }) => ({
                        ...linkStyle,
                        backgroundColor: isActive ? "#dbeafe" : "transparent",
                        fontWeight: isActive ? "bold" : "normal",
                    })}
                >
                    Carrusel
                </NavLink>

            </nav>
        </aside>
    );
}

export default Sidebar;