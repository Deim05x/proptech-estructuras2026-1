import { useEffect, useState } from "react";
import motorAlertasService from "../services/motorAlertasService";

function MotorAlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("TODAS");

  useEffect(() => {
    cargarTodas();
  }, []);

  const cargarTodas = async () => {
    try {
      setCargando(true);
      const data = await motorAlertasService.generarTodas();
      setAlertas(data || []);
      setFiltroActivo("TODAS");
    } catch (error) {
      console.error("Error al generar alertas:", error);
      alert("No se pudieron generar las alertas comerciales");
    } finally {
      setCargando(false);
    }
  };

  const cargarPorFiltro = async (tipo) => {
    try {
      setCargando(true);

      let data = [];

      if (tipo === "CONTRATOS_PROXIMOS") {
        data = await motorAlertasService.contratosProximos();
      } else if (tipo === "CONTRATOS_VENCIDOS") {
        data = await motorAlertasService.contratosVencidos();
      } else if (tipo === "SOLICITUDES_PRIORITARIAS") {
        data = await motorAlertasService.solicitudesPrioritarias();
      } else if (tipo === "CLIENTES_ALTA_INTENCION") {
        data = await motorAlertasService.clientesAltaIntencion();
      } else if (tipo === "INMUEBLES_ALTA_DEMANDA") {
        data = await motorAlertasService.inmueblesAltaDemanda();
      }

      setAlertas(data || []);
      setFiltroActivo(tipo);
    } catch (error) {
      console.error("Error al cargar filtro:", error);
      alert("No se pudo cargar el filtro seleccionado");
    } finally {
      setCargando(false);
    }
  };

  const contarPorPrioridad = (prioridad) => {
    return alertas.filter(
      (alerta) => (alerta.prioridad || "").toUpperCase() === prioridad
    ).length;
  };

  const obtenerEstiloPrioridad = (prioridad) => {
    const valor = (prioridad || "").toUpperCase();

    if (valor === "CRITICA") {
      return {
        background: "#4a0711",
        color: "#ffb4ab",
        border: "1px solid #ff6b6b",
      };
    }

    if (valor === "ALTA") {
      return {
        background: "#3a1218",
        color: "#ffb4ab",
        border: "1px solid #7a2c35",
      };
    }

    if (valor === "MEDIA") {
      return {
        background: "#3a2d00",
        color: "#ffd76a",
        border: "1px solid #826300",
      };
    }

    return {
      background: "#12351f",
      color: "#86efac",
      border: "1px solid #225c37",
    };
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>MOTOR DE DETECCIÓN</p>

          <h1 style={mainTitleStyle}>
            Alertas <span style={titleAccentStyle}>comerciales</span>
          </h1>

          <p style={descriptionStyle}>
            Detecta situaciones críticas del negocio inmobiliario: contratos
            próximos a vencer, contratos vencidos, solicitudes prioritarias,
            clientes con alta intención de cierre e inmuebles con alta demanda.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{alertas.length} alertas</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🚨"
          titulo="Total"
          valor={alertas.length}
          texto="Alertas detectadas"
        />

        <SummaryCard
          icono="🔥"
          titulo="Críticas"
          valor={contarPorPrioridad("CRITICA")}
          texto="Requieren revisión inmediata"
        />

        <SummaryCard
          icono="⚡"
          titulo="Altas"
          valor={contarPorPrioridad("ALTA")}
          texto="Atención prioritaria"
        />

        <SummaryCard
          icono="🟡"
          titulo="Medias"
          valor={contarPorPrioridad("MEDIA")}
          texto="Seguimiento comercial"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>FILTROS</p>
            <h2 style={titleStyle}>Tipo de alerta</h2>

            <p style={mutedTextStyle}>
              Selecciona el tipo de situación que deseas analizar.
            </p>
          </div>

          <span style={modeBadgeStyle}>{filtroActivo}</span>
        </div>

        <div style={buttonRowStyle}>
          <button type="button" onClick={cargarTodas} style={primaryButton}>
            Todas
          </button>

          <button
            type="button"
            onClick={() => cargarPorFiltro("CONTRATOS_PROXIMOS")}
            style={secondaryButton}
          >
            Contratos próximos
          </button>

          <button
            type="button"
            onClick={() => cargarPorFiltro("CONTRATOS_VENCIDOS")}
            style={dangerButton}
          >
            Contratos vencidos
          </button>

          <button
            type="button"
            onClick={() => cargarPorFiltro("SOLICITUDES_PRIORITARIAS")}
            style={priorityButton}
          >
            Solicitudes prioritarias
          </button>

          <button
            type="button"
            onClick={() => cargarPorFiltro("CLIENTES_ALTA_INTENCION")}
            style={secondaryButton}
          >
            Clientes con intención
          </button>

          <button
            type="button"
            onClick={() => cargarPorFiltro("INMUEBLES_ALTA_DEMANDA")}
            style={secondaryButton}
          >
            Inmuebles alta demanda
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>RESULTADOS</p>
            <h2 style={titleStyle}>Alertas detectadas</h2>
          </div>

          <span style={filterBadgeStyle}>
            {cargando ? "Cargando" : `${alertas.length} registros`}
          </span>
        </div>

        {cargando ? (
          <EmptyState texto="Generando alertas comerciales..." />
        ) : alertas.length === 0 ? (
          <EmptyState texto="No se detectaron alertas para el filtro seleccionado." />
        ) : (
          <div style={cardsGridStyle}>
            {alertas.map((alerta) => (
              <article key={alerta.id} style={cardStyle}>
                <div style={cardTopStyle}>
                  <div>
                    <p style={eyebrowStyle}>{alerta.tipo}</p>
                    <h3 style={cardTitleStyle}>{alerta.titulo}</h3>
                  </div>

                  <span
                    style={{
                      ...pillStyle,
                      ...obtenerEstiloPrioridad(alerta.prioridad),
                    }}
                  >
                    {alerta.prioridad}
                  </span>
                </div>

                <p style={descriptionBoxStyle}>{alerta.descripcion}</p>

                <div style={infoGridStyle}>
                  <InfoChip label="ID" value={alerta.id} />
                  <InfoChip label="Entidad" value={alerta.entidadReferencia} />
                  <InfoChip label="Estado" value={alerta.estado} />
                  <InfoChip label="Fecha" value={alerta.fechaDeteccion || "—"} />
                </div>
              </article>
            ))}
          </div>
        )}
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

function InfoChip({ label, value }) {
  return (
    <div style={infoChipStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>🚨</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpMotorAlertas {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseMotorAlertas {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  animation: "fadeUpMotorAlertas 0.55s ease both",
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
  animation: "pulseMotorAlertas 1.8s ease-in-out infinite",
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
  fontSize: "1.35rem",
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

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
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
};

const secondaryButton = {
  padding: "11px 16px",
  border: "1px solid #6d5f7a",
  borderRadius: "14px",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
};

const priorityButton = {
  padding: "11px 16px",
  border: "1px solid #7a2c35",
  borderRadius: "14px",
  background: "#3a1218",
  color: "#ffb4ab",
  fontWeight: "900",
  cursor: "pointer",
};

const dangerButton = {
  padding: "11px 16px",
  border: "1px solid #ff6b6b",
  borderRadius: "14px",
  background: "#4a0711",
  color: "#ffb4ab",
  fontWeight: "900",
  cursor: "pointer",
};

const modeBadgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  color: "#d2bbff",
  fontWeight: "900",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const filterBadgeStyle = {
  ...modeBadgeStyle,
  background: "#15121b",
  border: "1px solid #37333e",
};

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "18px",
};

const cardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.20)",
};

const cardTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
};

const cardTitleStyle = {
  margin: "6px 0 0",
  color: "#ffffff",
  fontSize: "1rem",
};

const pillStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const descriptionBoxStyle = {
  marginTop: "14px",
  padding: "12px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#ccc3d8",
  lineHeight: 1.55,
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "10px",
  marginTop: "14px",
};

const infoChipStyle = {
  padding: "10px",
  borderRadius: "14px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#d2bbff",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "0.8rem",
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default MotorAlertasPage;
