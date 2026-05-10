import { useState } from "react";
import AdminTabs from "../components/AdminTabs";

import ReportesPage from "./ReportesPage";
import AnalisisRelacionesPage from "./AnalisisRelacionesPage";

function AnaliticaPage() {
  const [activeTab, setActiveTab] = useState("reportes");

  const tabs = [
    {
      id: "reportes",
      label: "Reportes",
      icon: "📈",
    },
    {
      id: "relaciones",
      label: "Análisis de relaciones",
      icon: "🕸️",
    },
  ];

  return (
    <div>
      <section style={headerStyle}>
        <p style={eyebrowStyle}>Análisis del sistema</p>

        <h1 style={titleStyle}>Analítica y reportes</h1>

        <p style={descriptionStyle}>
          Consulta reportes administrativos, análisis comerciales y relaciones
          entre clientes, inmuebles, asesores y zonas.
        </p>
      </section>

      <AdminTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "reportes" && <ReportesPage />}
      {activeTab === "relaciones" && <AnalisisRelacionesPage />}
    </div>
  );
}

const headerStyle = {
  background: "rgba(255,255,255,0.88)",
  padding: "24px",
  borderRadius: "22px",
  marginBottom: "20px",
  border: "1px solid #e8e0e5",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
};

const eyebrowStyle = {
  margin: 0,
  color: "#7f4d7c",
  fontWeight: "900",
  textTransform: "uppercase",
  fontSize: "0.78rem",
  letterSpacing: "0.08em",
};

const titleStyle = {
  margin: "8px 0",
  color: "#43214d",
};

const descriptionStyle = {
  color: "#7e747d",
  lineHeight: 1.6,
  margin: 0,
};

export default AnaliticaPage;