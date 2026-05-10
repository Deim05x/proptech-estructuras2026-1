function OrdenamientoPage() {
  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>CATALOGO COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Organizacion de <span style={titleAccentStyle}>inmuebles</span>
          </h1>

          <p style={descriptionStyle}>
            Organiza el inventario por precio, area o demanda para revisar las
            propiedades con una lectura mas clara y comercial.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>Módulo activo</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🌳"
          titulo="Vista"
          valor="Catalogo"
          texto="Inventario organizado"
        />

        <SummaryCard
          icono="🏘️"
          titulo="Entidad"
          valor="Inmueble"
          texto="Informacion comercial"
        />

        <SummaryCard
          icono="↕️"
          titulo="Criterios"
          valor="Múltiples"
          texto="Precio, area o demanda"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>USO OPERATIVO</p>
            <h2 style={titleStyle}>Como ayuda al equipo</h2>
          </div>
        </div>

        <p style={textStyle}>
          Esta seccion permite presentar el catalogo de forma mas util para la
          gestion diaria: propiedades mas costosas, opciones mas amplias o
          inmuebles con mayor interes comercial.
        </p>

        <div style={infoGridStyle}>
          <InfoBlock
            icono="💰"
            titulo="Precio"
            texto="Permite ordenar inmuebles de menor a mayor o de mayor a menor valor."
          />

          <InfoBlock
            icono="📐"
            titulo="Área"
            texto="Permite organizar los inmuebles según su tamaño en metros cuadrados."
          />

          <InfoBlock
            icono="🔥"
            titulo="Demanda"
            texto="Permite priorizar inmuebles según interacciones, interés o criterios comerciales."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icono, titulo, valor, texto }) {
  return (
    <article style={summaryCardStyle}>
      <div style={summaryIconStyle}>{icono}</div>

      <div>
        <p style={summaryTitleStyle}>{titulo}</p>
        <strong style={summaryValueStyle}>{valor}</strong>
        <small style={summaryTextStyle}>{texto}</small>
      </div>
    </article>
  );
}

function InfoBlock({ icono, titulo, texto }) {
  return (
    <article style={infoBlockStyle}>
      <div style={infoIconStyle}>{icono}</div>

      <h3 style={infoTitleStyle}>{titulo}</h3>

      <p style={infoTextStyle}>{texto}</p>
    </article>
  );
}

const animations = `
  @keyframes fadeUpOrdenamiento {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseOrdenamiento {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  button:hover,
  article:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  animation: "fadeUpOrdenamiento 0.55s ease both",
};

const headerStyle = {
  marginBottom: "18px",
  padding: "22px",
  borderRadius: "26px",
  background: "#221e28",
  border: "1px solid #37333e",
  boxShadow: "0 20px 48px rgba(0,0,0,0.22)",
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "flex-end",
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
  fontSize: "clamp(1.8rem, 3vw, 2.7rem)",
  lineHeight: 1.1,
  letterSpacing: "-0.04em",
};

const titleAccentStyle = {
  color: "#d2bbff",
};

const descriptionStyle = {
  color: "#ccc3d8",
  maxWidth: "760px",
  lineHeight: 1.65,
  margin: 0,
};

const headerBadgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "10px 13px",
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
  animation: "pulseOrdenamiento 1.8s ease-in-out infinite",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "14px",
  marginBottom: "18px",
};

const summaryCardStyle = {
  padding: "16px",
  borderRadius: "22px",
  background: "#2c2833",
  border: "1px solid #37333e",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
  display: "flex",
  alignItems: "center",
  gap: "13px",
  transition: "0.25s ease",
};

const summaryIconStyle = {
  width: "46px",
  height: "46px",
  minWidth: "46px",
  borderRadius: "16px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.35rem",
};

const summaryTitleStyle = {
  margin: "0 0 4px",
  color: "#9f92b2",
  fontSize: "0.72rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

const summaryValueStyle = {
  display: "block",
  color: "#ffffff",
  fontSize: "1.15rem",
  lineHeight: 1.1,
};

const summaryTextStyle = {
  display: "block",
  color: "#8f849e",
  marginTop: "3px",
};

const panelStyle = {
  background: "#221e28",
  padding: "22px",
  borderRadius: "26px",
  marginBottom: "22px",
  boxShadow: "0 20px 48px rgba(0,0,0,0.22)",
  border: "1px solid #37333e",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "center",
  marginBottom: "16px",
  flexWrap: "wrap",
};

const titleStyle = {
  color: "#ffffff",
  margin: "5px 0 0",
  fontSize: "1.35rem",
  letterSpacing: "-0.03em",
};

const textStyle = {
  color: "#ccc3d8",
  lineHeight: 1.7,
  marginTop: 0,
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const infoBlockStyle = {
  padding: "18px",
  borderRadius: "22px",
  background: "#2c2833",
  border: "1px solid #37333e",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
  transition: "0.25s ease",
};

const infoIconStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "16px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.35rem",
  marginBottom: "12px",
};

const infoTitleStyle = {
  color: "#ffffff",
  margin: "0 0 8px",
};

const infoTextStyle = {
  color: "#9f92b2",
  lineHeight: 1.55,
  margin: 0,
};

export default OrdenamientoPage;
