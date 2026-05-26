import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

function SimulacionDemandaPage() {
  const [resumen, setResumen] = useState(null);
  const [proyecciones, setProyecciones] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarSimulacion = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const [resumenResponse, proyeccionesResponse] = await Promise.all([
        api.get("/simulacion-demanda/resumen"),
        api.get("/simulacion-demanda/zonas"),
      ]);

      setResumen(resumenResponse.data);
      setProyecciones(proyeccionesResponse.data || []);
    } catch (err) {
      console.error("Error al cargar simulacion de demanda:", err);
      setError("No se pudo cargar la simulacion de demanda.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSimulacion();
  }, [cargarSimulacion]);

  const zonasEnCrecimiento = proyecciones.filter(
    (proyeccion) => Number(proyeccion.tasaCrecimiento || 0) > 0
  ).length;

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>SIMULACION PREDICTIVA</p>

          <h1 style={mainTitleStyle}>
            Demanda por <span style={titleAccentStyle}>sector</span>
          </h1>

          <p style={descriptionStyle}>
            Analiza el crecimiento estimado por zona, la disponibilidad de
            inmuebles y la demanda esperada para apoyar decisiones comerciales.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <span style={headerBadgeStyle}>
            <span style={statusDotStyle}></span>
            <span>{cargando ? "Analizando" : `${proyecciones.length} zonas`}</span>
          </span>

          <button
            type="button"
            onClick={cargarSimulacion}
            disabled={cargando}
            style={{
              ...primaryButton,
              ...(cargando ? disabledButtonStyle : {}),
            }}
          >
            {cargando ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </section>

      {error && (
        <section style={errorPanelStyle}>
          <strong>No fue posible cargar la vista</strong>
          <span>{error}</span>
        </section>
      )}

      {resumen && (
        <section style={summaryGridStyle}>
          <SummaryCard
            icono="Z"
            titulo="Zonas analizadas"
            valor={resumen.totalZonas}
            texto="Sectores incluidos"
          />

          <SummaryCard
            icono="%"
            titulo="Crecimiento global"
            valor={formatearPorcentaje(resumen.tasaGlobalCrecimiento)}
            texto="Promedio del mercado"
            destacado={Number(resumen.tasaGlobalCrecimiento || 0) > 0}
          />

          <SummaryCard
            icono="+"
            titulo="Zonas en crecimiento"
            valor={zonasEnCrecimiento}
            texto="Con tendencia positiva"
          />

          <SummaryCard
            icono="I"
            titulo="Inmuebles disponibles"
            valor={formatearNumero(resumen.inmueblesDisponiblesTotales)}
            texto="Oferta total"
          />

          <SummaryCard
            icono="V"
            titulo="Visitas promedio"
            valor={formatearNumero(resumen.totalVisitasPromedio)}
            texto="Interes comercial"
          />

          <SummaryCard
            icono="F"
            titulo="Fecha del analisis"
            valor={resumen.fechaAnalisis || "--"}
            texto="Ultima simulacion"
          />
        </section>
      )}

      {resumen?.recomendacionGlobal && (
        <section style={recommendationPanelStyle}>
          <div>
            <p style={eyebrowLightStyle}>RECOMENDACION GLOBAL</p>
            <h2 style={recommendationTitleStyle}>
              {resumen.zonaConMayorCrecimiento || "Analisis del mercado"}
            </h2>
          </div>

          <p style={recommendationTextStyle}>{resumen.recomendacionGlobal}</p>
        </section>
      )}

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>PROYECCIONES</p>
            <h2 style={titleStyle}>Sectores evaluados</h2>

            <p style={mutedTextStyle}>
              Selecciona una zona para ver la recomendacion especifica.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {cargando ? "Cargando" : `${proyecciones.length} registros`}
          </span>
        </div>

        {cargando ? (
          <EmptyState texto="Analizando demanda del mercado..." />
        ) : proyecciones.length === 0 ? (
          <EmptyState texto="No hay datos de zonas disponibles." />
        ) : (
          <div style={zonesGridStyle}>
            {proyecciones.map((proyeccion, index) => (
              <ZoneCard
                key={`${proyeccion.zona || "zona"}-${index}`}
                proyeccion={proyeccion}
                seleccionada={zonaSeleccionada?.zona === proyeccion.zona}
                onToggle={() =>
                  setZonaSeleccionada((zonaActual) =>
                    zonaActual?.zona === proyeccion.zona ? null : proyeccion
                  )
                }
              />
            ))}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>LEYENDA</p>
            <h2 style={titleStyle}>Tendencias de demanda</h2>
          </div>

          <span style={filterBadgeStyle}>4 rangos</span>
        </div>

        <div style={legendGridStyle}>
          <LegendItem
            color={trendStyles.acelerado.accent}
            title="Crecimiento acelerado"
            description="Mayor a 15%"
          />
          <LegendItem
            color={trendStyles.crecimiento.accent}
            title="Crecimiento moderado"
            description="Entre 5% y 15%"
          />
          <LegendItem
            color={trendStyles.estable.accent}
            title="Estable"
            description="Entre -5% y 5%"
          />
          <LegendItem
            color={trendStyles.descenso.accent}
            title="En descenso"
            description="Menor a -5%"
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icono, titulo, valor, texto, destacado }) {
  return (
    <article
      style={{
        ...summaryCardStyle,
        ...(destacado ? highlightedCardStyle : {}),
      }}
    >
      <div
        style={{
          ...summaryIconStyle,
          ...(destacado ? highlightedIconStyle : {}),
        }}
      >
        {icono}
      </div>

      <div>
        <p style={destacado ? summaryTitleLightStyle : summaryTitleStyle}>
          {titulo}
        </p>

        <strong
          style={{
            ...summaryValueStyle,
            fontSize:
              typeof valor === "string" && valor.length > 14
                ? "1.02rem"
                : "1.35rem",
          }}
        >
          {valor ?? 0}
        </strong>

        <small style={destacado ? highlightedTextStyle : summaryTextStyle}>
          {texto}
        </small>
      </div>
    </article>
  );
}

function ZoneCard({ proyeccion, seleccionada, onToggle }) {
  const trendStyle = obtenerEstiloTendencia(proyeccion.tendencia);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      style={{
        ...zoneCardStyle,
        borderLeft: `4px solid ${trendStyle.accent}`,
        ...(seleccionada ? selectedZoneCardStyle : {}),
      }}
    >
      <div style={zoneHeaderStyle}>
        <div>
          <p style={eyebrowStyle}>ZONA</p>
          <h3 style={zoneTitleStyle}>{proyeccion.zona || "Sin zona"}</h3>
        </div>

        <span
          style={{
            ...trendBadgeStyle,
            background: trendStyle.background,
            color: trendStyle.color,
            border: trendStyle.border,
          }}
        >
          {proyeccion.tendencia || "Sin tendencia"}
        </span>
      </div>

      <div style={statsGridStyle}>
        <InfoChip
          label="Crecimiento"
          value={formatearPorcentaje(proyeccion.tasaCrecimiento)}
        />
        <InfoChip
          label="Demanda historica"
          value={formatearNumero(proyeccion.demandaHistorica)}
        />
        <InfoChip
          label="Disponibles"
          value={formatearNumero(proyeccion.inmueblesDisponibles)}
        />
        <InfoChip
          label="Precio promedio"
          value={formatearDinero(proyeccion.precioPromedio)}
        />
        <InfoChip
          label="Visitas promedio"
          value={formatearNumero(proyeccion.visitasPromedio)}
        />
      </div>

      <div style={projectionPanelStyle}>
        <div style={projectionHeaderStyle}>
          <span style={projectionLabelStyle}>PROXIMOS 3 MESES</span>
          <span style={miniBadgeStyle}>Simulado</span>
        </div>

        <div style={monthsGridStyle}>
          {(proyeccion.proximosTresMeses || []).map((mes, index) => (
            <div key={`${proyeccion.zona}-mes-${index}`} style={monthItemStyle}>
              <span>Mes {index + 1}</span>
              <strong>{formatearNumero(mes)}</strong>
            </div>
          ))}
        </div>
      </div>

      {seleccionada && (
        <div style={zoneRecommendationStyle}>
          <strong>Recomendacion</strong>
          <p>{proyeccion.recomendacion || "Sin recomendacion registrada."}</p>
        </div>
      )}
    </article>
  );
}

function InfoChip({ label, value }) {
  return (
    <div style={infoChipStyle}>
      <span style={infoChipLabelStyle}>{label}</span>
      <strong style={infoChipValueStyle}>{value}</strong>
    </div>
  );
}

function LegendItem({ color, title, description }) {
  return (
    <div style={legendItemStyle}>
      <span style={{ ...legendColorStyle, background: color }}></span>
      <div>
        <strong style={legendTitleStyle}>{title}</strong>
        <small style={legendDescriptionStyle}>{description}</small>
      </div>
    </div>
  );
}

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <div style={loadingOrbStyle}></div>
      <p>{texto}</p>
    </div>
  );
}

const formatearNumero = (valor) =>
  Number(valor || 0).toLocaleString("es-CO", {
    maximumFractionDigits: 0,
  });

const formatearPorcentaje = (valor) => `${Number(valor || 0).toFixed(2)}%`;

const formatearDinero = (valor) =>
  Number(valor || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const obtenerEstiloTendencia = (tendencia) => {
  const valor = String(tendencia || "").toUpperCase();

  if (valor.includes("ACELERADO") && valor.includes("CRECIMIENTO")) {
    return trendStyles.acelerado;
  }

  if (valor.includes("CRECIMIENTO")) {
    return trendStyles.crecimiento;
  }

  if (valor.includes("ESTABLE")) {
    return trendStyles.estable;
  }

  if (valor.includes("DESCENSO")) {
    return trendStyles.descenso;
  }

  return trendStyles.neutro;
};

const trendStyles = {
  acelerado: {
    accent: "#22c55e",
    background: "#12351f",
    color: "#86efac",
    border: "1px solid #225c37",
  },
  crecimiento: {
    accent: "#38bdf8",
    background: "#082f49",
    color: "#bae6fd",
    border: "1px solid #0e7490",
  },
  estable: {
    accent: "#facc15",
    background: "#3a2d00",
    color: "#ffd76a",
    border: "1px solid #826300",
  },
  descenso: {
    accent: "#fb7185",
    background: "#3a1218",
    color: "#ffb4ab",
    border: "1px solid #7a2c35",
  },
  neutro: {
    accent: "#9f92b2",
    background: "#15121b",
    color: "#ccc3d8",
    border: "1px solid #37333e",
  },
};

const animations = `
  @keyframes fadeUpDemanda {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseDemanda {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes loadingFloatDemanda {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-8px);
    }
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  animation: "fadeUpDemanda 0.55s ease both",
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

const eyebrowLightStyle = {
  ...eyebrowStyle,
  color: "#ddd6fe",
};

const mainTitleStyle = {
  margin: "8px 0",
  color: "#ffffff",
  fontSize: "clamp(1.8rem, 3vw, 2.7rem)",
  lineHeight: 1.1,
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

const headerActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
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
  animation: "pulseDemanda 1.8s ease-in-out infinite",
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

const highlightedCardStyle = {
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  border: "1px solid #6d5f7a",
  boxShadow: "0 18px 38px rgba(124,58,237,0.24)",
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
  color: "#d2bbff",
  fontSize: "1rem",
  fontWeight: "900",
};

const highlightedIconStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.24)",
  color: "#ffffff",
};

const summaryTitleStyle = {
  margin: "0 0 4px",
  color: "#9f92b2",
  fontSize: "0.72rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

const summaryTitleLightStyle = {
  ...summaryTitleStyle,
  color: "#ddd6fe",
};

const summaryValueStyle = {
  display: "block",
  color: "#ffffff",
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const summaryTextStyle = {
  display: "block",
  color: "#8f849e",
  marginTop: "3px",
};

const highlightedTextStyle = {
  ...summaryTextStyle,
  color: "#ddd6fe",
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
};

const mutedTextStyle = {
  color: "#9f92b2",
  margin: "6px 0 0",
  lineHeight: 1.55,
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
  transition: "0.2s ease",
};

const disabledButtonStyle = {
  opacity: 0.68,
  cursor: "not-allowed",
};

const filterBadgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#ccc3d8",
  fontWeight: "900",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const recommendationPanelStyle = {
  ...panelStyle,
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  border: "1px solid #6d5f7a",
  display: "grid",
  gridTemplateColumns: "minmax(180px, 280px) 1fr",
  gap: "18px",
};

const recommendationTitleStyle = {
  color: "#ffffff",
  margin: "6px 0 0",
  fontSize: "1.25rem",
};

const recommendationTextStyle = {
  margin: 0,
  color: "#f2ecff",
  lineHeight: 1.65,
};

const zonesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
};

const zoneCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "22px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
  cursor: "pointer",
  outline: "none",
  transition: "0.2s ease",
};

const selectedZoneCardStyle = {
  background: "#302a3a",
  boxShadow: "0 20px 42px rgba(124,58,237,0.2)",
};

const zoneHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "14px",
};

const zoneTitleStyle = {
  margin: "5px 0 0",
  color: "#ffffff",
  fontSize: "1.2rem",
};

const trendBadgeStyle = {
  padding: "8px 10px",
  borderRadius: "999px",
  fontSize: "0.7rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  textAlign: "center",
  maxWidth: "170px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "10px",
  marginBottom: "14px",
};

const infoChipStyle = {
  background: "#15121b",
  border: "1px solid #37333e",
  borderRadius: "16px",
  padding: "11px",
};

const infoChipLabelStyle = {
  display: "block",
  color: "#9f92b2",
  fontSize: "0.72rem",
  fontWeight: "900",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "5px",
};

const infoChipValueStyle = {
  display: "block",
  color: "#ffffff",
  fontSize: "0.95rem",
  lineHeight: 1.2,
  overflowWrap: "anywhere",
};

const projectionPanelStyle = {
  background: "#15121b",
  border: "1px solid #37333e",
  borderRadius: "18px",
  padding: "12px",
};

const projectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const projectionLabelStyle = {
  color: "#d2bbff",
  fontSize: "0.72rem",
  fontWeight: "900",
  letterSpacing: "0.08em",
};

const miniBadgeStyle = {
  padding: "5px 8px",
  borderRadius: "999px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  color: "#d2bbff",
  fontSize: "0.68rem",
  fontWeight: "900",
};

const monthsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "8px",
};

const monthItemStyle = {
  borderRadius: "14px",
  background: "#221e28",
  border: "1px solid #37333e",
  padding: "10px",
  textAlign: "center",
};

const zoneRecommendationStyle = {
  marginTop: "14px",
  padding: "13px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #6d5f7a",
  color: "#ccc3d8",
  lineHeight: 1.55,
};

const legendGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "12px",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "13px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#ffffff",
};

const legendColorStyle = {
  width: "14px",
  height: "42px",
  borderRadius: "999px",
  boxShadow: "0 0 18px rgba(255,255,255,0.12)",
};

const legendTitleStyle = {
  display: "block",
  color: "#ffffff",
  lineHeight: 1.2,
  marginBottom: "4px",
};

const legendDescriptionStyle = {
  display: "block",
  color: "#9f92b2",
  lineHeight: 1.25,
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

const loadingOrbStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7c3aed, #d2bbff)",
  boxShadow: "0 0 28px rgba(124,58,237,0.34)",
  animation: "loadingFloatDemanda 1.8s ease-in-out infinite",
  margin: "0 auto 12px",
};

const errorPanelStyle = {
  ...panelStyle,
  background: "#3a1218",
  border: "1px solid #7a2c35",
  color: "#ffb4ab",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

export default SimulacionDemandaPage;
