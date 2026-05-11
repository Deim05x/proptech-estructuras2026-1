import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function InicioClientePage() {
  const navigate = useNavigate();

  const username = authService.getUsername();

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>PORTAL CLIENTE</p>

          <h1 style={mainTitleStyle}>
            Bienvenido a <span style={titleAccentStyle}>PropTech</span>
          </h1>

          <p style={descriptionStyle}>
            Hola, {username || "cliente"}. Desde este panel puedes explorar
            inmuebles, revisar recomendaciones personalizadas, consultar tu
            actividad, favoritos, visitas e historial de interacción.
          </p>
        </div>

        <div style={heroBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>Sesión cliente activa</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🔎"
          titulo="Explorar"
          valor="Catálogo"
          texto="Consulta inmuebles disponibles según tus intereses."
        />

        <SummaryCard
          icono="✨"
          titulo="Recomendaciones"
          valor="Personalizadas"
          texto="Recibe sugerencias basadas en tus preferencias."
        />

        <SummaryCard
          icono="📌"
          titulo="Actividad"
          valor="Historial"
          texto="Revisa favoritos, visitas e interacciones."
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>ACCIONES RÁPIDAS</p>
            <h2 style={titleStyle}>¿Qué quieres hacer hoy?</h2>

            <p style={mutedTextStyle}>
              Accede rápidamente a las funciones principales de tu portal como
              cliente.
            </p>
          </div>
        </div>

        <div style={quickGridStyle}>
          <ActionCard
            icono="🏘️"
            titulo="Descubrir inmuebles"
            texto="Explora el catálogo inmobiliario, revisa precios, zonas, áreas y disponibilidad."
            boton="Ver inmuebles"
            onClick={() => navigate("/descubrir-inmuebles")}
          />

          <ActionCard
            icono="✨"
            titulo="Recomendaciones"
            texto="Consulta inmuebles sugeridos para ti según presupuesto, zona, tipo y preferencias."
            boton="Ver recomendaciones"
            onClick={() => navigate("/recomendaciones")}
            destacado
          />

          <ActionCard
            icono="📌"
            titulo="Mi actividad"
            texto="Revisa tus favoritos, historial, visitas e interacciones dentro de la plataforma."
            boton="Ver actividad"
            onClick={() => navigate("/mi-actividad")}
          />
        </div>
      </section>

      <section style={twoColumnsStyle}>
        <div style={infoPanelStyle}>
          <div style={infoIconStyle}>🧠</div>

          <div>
            <p style={eyebrowStyle}>RECOMENDACIÓN INTELIGENTE</p>
            <h2 style={titleStyle}>Propiedades alineadas a tu perfil</h2>

            <p style={infoTextStyle}>
              El sistema puede sugerirte inmuebles teniendo en cuenta tu
              presupuesto, zonas de interés, tipo de inmueble deseado,
              habitaciones mínimas e historial de interacción.
            </p>

            <button
              type="button"
              onClick={() => navigate("/recomendaciones")}
              style={primaryButton}
            >
              Ir a recomendaciones
            </button>
          </div>
        </div>

        <div style={infoPanelStyle}>
          <div style={infoIconStyle}>📅</div>

          <div>
            <p style={eyebrowStyle}>SEGUIMIENTO</p>
            <h2 style={titleStyle}>Consulta tu actividad</h2>

            <p style={infoTextStyle}>
              Desde tu actividad podrás revisar inmuebles guardados,
              interacciones, visitas agendadas y el seguimiento de tu proceso de
              búsqueda.
            </p>

            <button
              type="button"
              onClick={() => navigate("/mi-actividad")}
              style={secondaryButton}
            >
              Ver mi actividad
            </button>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>GUÍA DEL CLIENTE</p>
            <h2 style={titleStyle}>Flujo recomendado</h2>
          </div>
        </div>

        <div style={stepsGridStyle}>
          <StepCard
            numero="01"
            titulo="Explora inmuebles"
            texto="Revisa propiedades disponibles y compara características."
          />

          <StepCard
            numero="02"
            titulo="Guarda tus intereses"
            texto="Marca inmuebles favoritos o interactúa con los que más te llamen la atención."
          />

          <StepCard
            numero="03"
            titulo="Revisa recomendaciones"
            texto="Consulta sugerencias generadas a partir de tu perfil de búsqueda."
          />

          <StepCard
            numero="04"
            titulo="Agenda seguimiento"
            texto="Da continuidad al proceso revisando tu actividad y visitas."
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

function ActionCard({ icono, titulo, texto, boton, onClick, destacado }) {
  return (
    <article
      style={{
        ...actionCardStyle,
        ...(destacado ? actionCardHighlightedStyle : {}),
      }}
    >
      <div
        style={{
          ...actionIconStyle,
          ...(destacado ? actionIconHighlightedStyle : {}),
        }}
      >
        {icono}
      </div>

      <h3 style={actionTitleStyle}>{titulo}</h3>

      <p style={actionTextStyle}>{texto}</p>

      <button
        type="button"
        onClick={onClick}
        style={destacado ? primaryButton : secondaryButton}
      >
        {boton}
      </button>
    </article>
  );
}

function StepCard({ numero, titulo, texto }) {
  return (
    <article style={stepCardStyle}>
      <span style={stepNumberStyle}>{numero}</span>

      <h3 style={stepTitleStyle}>{titulo}</h3>

      <p style={stepTextStyle}>{texto}</p>
    </article>
  );
}

const animations = `
  @keyframes fadeUpInicioCliente {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseInicioCliente {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes glowInicioCliente {
    0%, 100% {
      box-shadow: 0 0 0 rgba(124, 58, 237, 0);
    }

    50% {
      box-shadow: 0 0 26px rgba(124, 58, 237, 0.28);
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
  animation: "fadeUpInicioCliente 0.55s ease both",
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
  animation: "pulseInicioCliente 1.8s ease-in-out infinite",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
  marginBottom: "22px",
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
  fontSize: "1.05rem",
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

const mutedTextStyle = {
  color: "#9f92b2",
  margin: "6px 0 0",
  lineHeight: 1.55,
};

const quickGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "18px",
};

const actionCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "24px",
  padding: "20px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
  transition: "0.25s ease",
};

const actionCardHighlightedStyle = {
  background: "linear-gradient(135deg, #3f2a57, #221e28)",
  border: "1px solid #6d5f7a",
  boxShadow: "0 0 28px rgba(124,58,237,0.20)",
};

const actionIconStyle = {
  width: "54px",
  height: "54px",
  borderRadius: "18px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.6rem",
  marginBottom: "14px",
  animation: "glowInicioCliente 3.2s ease-in-out infinite",
};

const actionIconHighlightedStyle = {
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  color: "#ffffff",
};

const actionTitleStyle = {
  color: "#ffffff",
  margin: "0 0 8px",
  fontSize: "1.08rem",
};

const actionTextStyle = {
  color: "#9f92b2",
  margin: "0 0 16px",
  lineHeight: 1.55,
  fontSize: "0.88rem",
};

const primaryButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 14px 28px rgba(124,58,237,0.24)",
  transition: "0.25s ease",
};

const secondaryButton = {
  padding: "11px 16px",
  border: "1px solid #6d5f7a",
  borderRadius: "14px",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
  transition: "0.25s ease",
};

const twoColumnsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
  marginBottom: "22px",
};

const infoPanelStyle = {
  background: "#221e28",
  padding: "22px",
  borderRadius: "26px",
  boxShadow: "0 20px 48px rgba(0,0,0,0.22)",
  border: "1px solid #37333e",
  display: "flex",
  gap: "16px",
  alignItems: "flex-start",
};

const infoIconStyle = {
  width: "56px",
  height: "56px",
  minWidth: "56px",
  borderRadius: "20px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.7rem",
};

const infoTextStyle = {
  color: "#9f92b2",
  lineHeight: 1.6,
  margin: "8px 0 16px",
};

const stepsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
};

const stepCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "22px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
};

const stepNumberStyle = {
  display: "inline-flex",
  padding: "7px 10px",
  borderRadius: "999px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  color: "#d2bbff",
  fontWeight: "900",
  fontSize: "0.75rem",
  marginBottom: "12px",
};

const stepTitleStyle = {
  color: "#ffffff",
  margin: "0 0 8px",
  fontSize: "1rem",
};

const stepTextStyle = {
  color: "#9f92b2",
  margin: 0,
  lineHeight: 1.55,
  fontSize: "0.85rem",
};

export default InicioClientePage;