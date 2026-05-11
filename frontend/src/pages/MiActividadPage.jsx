import { useState } from "react";
import FavoritosPage from "./FavoritosPage";
import HistorialPage from "./HistorialPage";
import MisVisitasPage from "./MisVisitasPage";

function MiActividadPage() {
  const [tabActiva, setTabActiva] = useState("favoritos");

  const tabs = [
    {
      id: "favoritos",
      label: "Mis favoritos",
      shortLabel: "Favoritos",
      icon: "⭐",
      descripcion: "Inmuebles guardados por interés.",
    },
    {
      id: "historial",
      label: "Mi historial",
      shortLabel: "Historial",
      icon: "🕘",
      descripcion: "Interacciones y actividad registrada.",
    },
    {
      id: "visitas",
      label: "Mis visitas",
      shortLabel: "Visitas",
      icon: "📅",
      descripcion: "Agenda y seguimiento de visitas.",
    },
  ];

  const tabActual = tabs.find((tab) => tab.id === tabActiva);

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>PORTAL CLIENTE</p>

          <h1 style={mainTitleStyle}>
            Mi <span style={titleAccentStyle}>actividad</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta tus inmuebles favoritos, historial de interacción y visitas
            agendadas dentro de la plataforma PropTech.
          </p>
        </div>

        <div style={heroBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>Actividad activa</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <InfoCard
          icono="⭐"
          titulo="Favoritos"
          texto="Propiedades que guardaste para revisar después."
        />

        <InfoCard
          icono="🕘"
          titulo="Historial"
          texto="Registro de tus interacciones con inmuebles."
        />

        <InfoCard
          icono="📅"
          titulo="Visitas"
          texto="Agenda y seguimiento de tus visitas comerciales."
        />
      </section>

      <section style={tabsContainerStyle}>
        {tabs.map((tab) => {
          const activa = tabActiva === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTabActiva(tab.id)}
              style={{
                ...tabButtonStyle,
                ...(activa ? activeTabButtonStyle : {}),
              }}
            >
              <span
                style={{
                  ...tabIconStyle,
                  ...(activa ? activeTabIconStyle : {}),
                }}
              >
                {tab.icon}
              </span>

              <div style={tabTextContainerStyle}>
                <strong
                  style={{
                    ...tabLabelStyle,
                    color: activa ? "#ffffff" : "#d7cde4",
                  }}
                >
                  {tab.shortLabel}
                </strong>

                <small
                  style={{
                    ...tabDescriptionStyle,
                    color: activa ? "#d2bbff" : "#8f849e",
                  }}
                >
                  {tab.descripcion}
                </small>
              </div>
            </button>
          );
        })}
      </section>

      <section style={activeModuleHeaderStyle}>
        <div style={activeIconStyle}>{tabActual?.icon}</div>

        <div>
          <p style={eyebrowStyle}>SECCIÓN ACTIVA</p>

          <h2 style={moduleTitleStyle}>{tabActual?.label}</h2>

          <p style={moduleDescriptionStyle}>{tabActual?.descripcion}</p>
        </div>
      </section>

      <section style={contentPanelStyle}>
        {tabActiva === "favoritos" && <FavoritosPage />}
        {tabActiva === "historial" && <HistorialPage />}
        {tabActiva === "visitas" && <MisVisitasPage />}
      </section>
    </div>
  );
}

function InfoCard({ icono, titulo, texto }) {
  return (
    <article style={infoCardStyle}>
      <div style={infoIconStyle}>{icono}</div>

      <div>
        <strong style={infoTitleStyle}>{titulo}</strong>
        <p style={infoTextStyle}>{texto}</p>
      </div>
    </article>
  );
}

const animations = `
  @keyframes fadeUpMiActividad {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseMiActividad {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes glowMiActividad {
    0%, 100% {
      box-shadow: 0 0 0 rgba(124, 58, 237, 0);
    }

    50% {
      box-shadow: 0 0 24px rgba(124, 58, 237, 0.28);
    }
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  color: "#e8dfee",
  background: "transparent",
  animation: "fadeUpMiActividad 0.55s ease both",
};

const heroStyle = {
  marginBottom: "22px",
  padding: "28px",
  borderRadius: "30px",
  background: "#221e28",
  border: "1px solid #37333e",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "24px",
  flexWrap: "wrap",
};

const eyebrowStyle = {
  margin: 0,
  color: "#d2bbff",
  fontWeight: "900",
  textTransform: "uppercase",
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
};

const mainTitleStyle = {
  margin: "8px 0",
  color: "#ffffff",
  fontSize: "clamp(2rem, 4vw, 3.4rem)",
  lineHeight: 1.08,
  letterSpacing: "-0.05em",
};

const titleAccentStyle = {
  color: "#d2bbff",
};

const descriptionStyle = {
  color: "#ccc3d8",
  maxWidth: "820px",
  lineHeight: 1.7,
  margin: 0,
};

const heroBadgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "11px 14px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#ccc3d8",
  fontSize: "0.78rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const statusDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#22c55e",
  boxShadow: "0 0 14px rgba(34,197,94,0.8)",
  animation: "pulseMiActividad 1.8s ease-in-out infinite",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "16px",
  marginBottom: "22px",
};

const infoCardStyle = {
  minHeight: "120px",
  padding: "18px",
  borderRadius: "24px",
  background: "#2c2833",
  border: "1px solid #37333e",
  boxShadow: "0 18px 40px rgba(0,0,0,0.20)",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  transition: "0.28s ease",
};

const infoIconStyle = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "17px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.45rem",
  animation: "glowMiActividad 3.3s ease-in-out infinite",
};

const infoTitleStyle = {
  color: "#ffffff",
  display: "block",
  fontSize: "0.98rem",
  marginBottom: "5px",
};

const infoTextStyle = {
  margin: 0,
  color: "#9f92b2",
  lineHeight: 1.45,
  fontSize: "0.82rem",
};

const tabsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "14px",
  marginBottom: "22px",
};

const tabButtonStyle = {
  border: "1px solid #37333e",
  background: "#221e28",
  color: "#ffffff",
  padding: "14px",
  borderRadius: "22px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textAlign: "left",
  transition: "0.25s ease",
  boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
};

const activeTabButtonStyle = {
  background: "linear-gradient(135deg, #3f2a57, #221e28)",
  border: "1px solid #6d5f7a",
  boxShadow: "0 0 28px rgba(124,58,237,0.22)",
};

const tabIconStyle = {
  width: "44px",
  height: "44px",
  minWidth: "44px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #37333e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.3rem",
};

const activeTabIconStyle = {
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
};

const tabTextContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const tabLabelStyle = {
  fontSize: "0.92rem",
  fontWeight: "900",
};

const tabDescriptionStyle = {
  fontSize: "0.72rem",
  lineHeight: 1.35,
  fontWeight: "700",
};

const activeModuleHeaderStyle = {
  marginBottom: "18px",
  padding: "18px",
  borderRadius: "24px",
  background: "#221e28",
  border: "1px solid #37333e",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const activeIconStyle = {
  width: "58px",
  height: "58px",
  minWidth: "58px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.8rem",
  color: "#ffffff",
  boxShadow: "0 0 24px rgba(124,58,237,0.30)",
};

const moduleTitleStyle = {
  margin: "5px 0",
  color: "#ffffff",
  fontSize: "1.4rem",
  letterSpacing: "-0.03em",
};

const moduleDescriptionStyle = {
  margin: 0,
  color: "#9f92b2",
  lineHeight: 1.5,
};

const contentPanelStyle = {
  borderRadius: "28px",
  background: "#15121b",
  border: "1px solid #37333e",
  boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
  padding: "18px",
  overflow: "hidden",
};

export default MiActividadPage;