import { useState } from "react";
import AsesoresPage from "./AsesoresPage";
import RotacionAsesoresPage from "./RotacionAsesoresPage";

function AsesoresModuloPage() {
  const [tabActiva, setTabActiva] = useState("gestion");

  return (
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Módulo de asesores
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Gestiona asesores inmobiliarios y administra su rotación de atención.
      </p>

      <div style={panelStyle}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setTabActiva("gestion")}
            style={tabActiva === "gestion" ? tabActivo : tabNormal}
          >
            Gestión de asesores
          </button>

          <button
            onClick={() => setTabActiva("rotacion")}
            style={tabActiva === "rotacion" ? tabActivo : tabNormal}
          >
            Rotación de asesores
          </button>
        </div>
      </div>

      <div>
        {tabActiva === "gestion" && <AsesoresPage />}
        {tabActiva === "rotacion" && <RotacionAsesoresPage />}
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

export default AsesoresModuloPage;