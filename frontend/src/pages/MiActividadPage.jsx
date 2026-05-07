import { useState } from "react";
import FavoritosPage from "./FavoritosPage";
import HistorialPage from "./HistorialPage";
import MisVisitasPage from "./MisVisitasPage";

function MiActividadPage() {
  const [tabActiva, setTabActiva] = useState("favoritos");

  return (
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Mi actividad
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Consulta tus favoritos, historial de interacción y visitas agendadas.
      </p>

      <div style={panelStyle}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setTabActiva("favoritos")}
            style={tabActiva === "favoritos" ? tabActivo : tabNormal}
          >
            Mis favoritos
          </button>

          <button
            onClick={() => setTabActiva("historial")}
            style={tabActiva === "historial" ? tabActivo : tabNormal}
          >
            Mi historial
          </button>

          <button
            onClick={() => setTabActiva("visitas")}
            style={tabActiva === "visitas" ? tabActivo : tabNormal}
          >
            Mis visitas
          </button>
        </div>
      </div>

      <div>
        {tabActiva === "favoritos" && <FavoritosPage />}
        {tabActiva === "historial" && <HistorialPage />}
        {tabActiva === "visitas" && <MisVisitasPage />}
      </div>
    </div>
  );
}

const panelStyle = {
  backgroundColor: "rgba(255,255,255,0.88)",
  padding: "18px",
  borderRadius: "18px",
  marginBottom: "24px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const tabActivo = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #5b3765, #43214d)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const tabNormal = {
  padding: "11px 16px",
  border: "1px solid #cfc3cd",
  borderRadius: "12px",
  backgroundColor: "#fbd7ff",
  color: "#43214d",
  fontWeight: "700",
  cursor: "pointer",
};

export default MiActividadPage;