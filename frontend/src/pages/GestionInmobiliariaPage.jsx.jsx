import { useState } from "react";

import InmueblesPage from "./InmueblesPage";
import DescubrirInmueblesPage from "./DescubrirInmueblesPage";
import CarruselInmueblesPage from "./CarruselInmueblesPage";
import OrdenamientoPage from "./OrdenamientoPage";
import RangoPrecioPage from "./RangoPrecioPage";

function GestionInmobiliariaPage() {
  const [activeTab, setActiveTab] = useState("inmuebles");

  const tabs = [
    {
      id: "inmuebles",
      label: "Gestión de inmuebles",
      shortLabel: "Inmuebles",
      icon: "🏘️",
      descripcion: "Registro, edición, consulta y administración del catálogo.",
    },
    {
      id: "descubrir",
      label: "Descubrir inmuebles",
      shortLabel: "Descubrir",
      icon: "🔎",
      descripcion: "Exploración y consulta visual de inmuebles disponibles.",
    },
    {
      id: "carrusel",
      label: "Carrusel",
      shortLabel: "Carrusel",
      icon: "🎠",
      descripcion: "Vitrina visual de inmuebles destacados.",
    },
    {
      id: "ordenamiento",
      label: "Organizacion",
      shortLabel: "Organizar",
      icon: "🌳",
      descripcion: "Clasificacion y organizacion del catalogo comercial.",
    },
    {
      id: "rangos",
      label: "Rangos de precio",
      shortLabel: "Rangos",
      icon: "💰",
      descripcion: "Consulta de inmuebles por valor de referencia.",
    },
  ];

  const tabActiva = tabs.find((tab) => tab.id === activeTab);

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>MÓDULO ADMINISTRATIVO</p>

          <h1 style={titleStyle}>
            Gestión <span style={titleAccentStyle}>inmobiliaria</span>
          </h1>

          <p style={descriptionStyle}>
            Administra el catalogo de inmuebles, la exploracion visual, el
            carrusel de propiedades y la organizacion comercial del inventario.
          </p>
        </div>

        <div style={heroBadgeStyle}>
          <span style={heroBadgeDotStyle}></span>
          <span>Inventario activo</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <InfoCard
          icono="🏢"
          titulo="Catálogo"
          texto="Control central de inmuebles registrados."
        />

        <InfoCard
          icono="🔎"
          titulo="Descubrimiento"
          texto="Consulta y exploración de propiedades."
        />

        <InfoCard
          icono="🎠"
          titulo="Destacados"
          texto="Carrusel visual de inmuebles destacados."
        />

        <InfoCard
          icono="🌳"
          titulo="Organizacion"
          texto="Organizacion clara del inventario."
        />

        <InfoCard
          icono="💰"
          titulo="Rangos"
          texto="Segmentacion del catalogo por precio."
        />
      </section>

      <section style={tabsContainerStyle}>
        {tabs.map((tab) => {
          const activa = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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
        <div style={activeIconStyle}>{tabActiva?.icon}</div>

        <div>
          <p style={eyebrowStyle}>SECCIÓN ACTIVA</p>

          <h2 style={moduleTitleStyle}>{tabActiva?.label}</h2>

          <p style={moduleDescriptionStyle}>{tabActiva?.descripcion}</p>
        </div>
      </section>

      <section style={contentPanelStyle}>
        {activeTab === "inmuebles" && <InmueblesPage />}
        {activeTab === "descubrir" && <DescubrirInmueblesPage />}
        {activeTab === "carrusel" && <CarruselInmueblesPage />}
        {activeTab === "ordenamiento" && <OrdenamientoPage />}
        {activeTab === "rangos" && <RangoPrecioPage />}
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
  @keyframes fadeUpGestion {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseGestion {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes glowGestion {
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
  animation: "fadeUpGestion 0.55s ease both",
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

const titleStyle = {
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

const heroBadgeDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#22c55e",
  boxShadow: "0 0 16px rgba(34,197,94,0.8)",
  animation: "pulseGestion 1.8s ease-in-out infinite",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
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
  animation: "glowGestion 3.3s ease-in-out infinite",
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

export default GestionInmobiliariaPage;
