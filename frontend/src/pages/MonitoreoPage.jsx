import { useState } from "react";
import AdminTabs from "../components/AdminTabs";

import AlertasPage from "./AlertasPage";
import EventosInusualesPage from "./EventosInusualesPage";

function MonitoreoPage() {
  const [activeTab, setActiveTab] = useState("alertas");

  const tabs = [
    {
      id: "alertas",
      label: "Alertas",
      icon: "🚨",
    },
    {
      id: "eventos",
      label: "Eventos inusuales",
      icon: "📊",
    },
  ];

  return (
    <div>
      <section style={headerStyle}>
        <p style={eyebrowStyle}>Control y seguimiento</p>

        <h1 style={titleStyle}>Monitoreo</h1>

        <p style={descriptionStyle}>
          Revisa alertas, eventos inusuales y elementos que requieren atención
          administrativa.
        </p>
      </section>

      <AdminTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "alertas" && <AlertasPage />}
      {activeTab === "eventos" && <EventosInusualesPage />}
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

export default MonitoreoPage;