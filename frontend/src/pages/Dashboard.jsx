import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";

function Dashboard() {
  const navigate = useNavigate();

  const [resumen, setResumen] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [cierresAsesor, setCierresAsesor] = useState([]);
  const [cargando, setCargando] = useState(true);

  const username = authService.getUsername();

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setCargando(true);

      const [
        resumenData,
        alertasData,
        eventosData,
        operacionesData,
        visitasData,
        zonasData,
        cierresData,
      ] = await Promise.all([
        dashboardService.resumen(),
        dashboardService.alertas(),
        dashboardService.eventosInusuales(),
        dashboardService.operaciones(),
        dashboardService.visitas(),
        dashboardService.zonas(),
        dashboardService.cierresAsesor(),
      ]);

      setResumen(resumenData);
      setAlertas(alertasData || []);
      setEventos(eventosData || []);
      setOperaciones(operacionesData || []);
      setVisitas(visitasData || []);
      setZonas(zonasData || []);
      setCierresAsesor(cierresData || []);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
      alert("No se pudo cargar la información del dashboard");
    } finally {
      setCargando(false);
    }
  };

  const contarAlertasPendientes = () => {
    return alertas.filter(
      (alerta) => (alerta.estado || "").toUpperCase() === "PENDIENTE"
    ).length;
  };

  const contarAlertasCriticas = () => {
    return alertas.filter((alerta) => {
      const nivel = (alerta.nivelAtencion || "").toUpperCase();
      return nivel === "CRITICO" || nivel === "CRÍTICO";
    }).length;
  };

  const contarEventosPendientes = () => {
    return eventos.filter(
      (evento) => (evento.estado || "").toUpperCase() === "PENDIENTE"
    ).length;
  };

  const contarVisitasPendientes = () => {
    return visitas.filter((visita) => {
      const estado = (visita.estado || "").toLowerCase();

      return (
        estado.includes("pendiente") ||
        estado.includes("programada") ||
        estado.includes("confirmada")
      );
    }).length;
  };

  const operacionesRecientes = operaciones.slice(0, 5);
  const alertasRecientes = alertas.slice(0, 5);
  const eventosRecientes = eventos.slice(0, 5);
  const visitasRecientes = visitas.slice(0, 5);
  const zonasTop = zonas.slice(0, 5);
  const asesoresTop = cierresAsesor.slice(0, 5);

  const formatearDinero = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  if (cargando) {
    return (
      <div style={pageStyle}>
        <style>{animations}</style>

        <div style={loadingCardStyle}>
          <div style={loadingOrbStyle}></div>
          <h1 style={loadingTitleStyle}>Cargando panel principal...</h1>
          <p style={mutedTextStyle}>
            Sincronizando resumen, alertas, visitas y operaciones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>ADMINISTRATIVE DASHBOARD</p>

          <h1 style={heroTitleStyle}>
            Operaciones en <span style={heroAccentStyle}>tiempo real</span>
          </h1>

          <p style={heroTextStyle}>
            Bienvenido, {username || "administrador"}. Este centro de mando
            resume inmuebles, visitas, operaciones, alertas, eventos inusuales,
            reportes y análisis comercial del sistema PropTech.
          </p>
        </div>

        <div style={heroActionsStyle}>
          <div style={statusPanelStyle}>
            <span style={statusDotStyle}></span>
            <span>Monitoreo activo</span>
          </div>

          <button onClick={cargarDashboard} style={primaryButton}>
            Actualizar dashboard
          </button>
        </div>
      </section>

      <section style={metricsGridStyle}>
        <MetricCard
          titulo="Total inmuebles"
          valor={resumen?.totalInmuebles || 0}
          detalle="Activos registrados"
          icono="🏢"
        />

        <MetricCard
          titulo="Disponibles"
          valor={resumen?.inmueblesDisponibles || 0}
          detalle="Listos para ofertar"
          icono="✅"
        />

        <MetricCard
          titulo="Visitas pendientes"
          valor={contarVisitasPendientes()}
          detalle={`Total visitas: ${resumen?.totalVisitas || 0}`}
          icono="📅"
        />

        <MetricCard
          titulo="Operaciones cerradas"
          valor={resumen?.operacionesCerradas || 0}
          detalle={formatearDinero(resumen?.valorTotalCierres || 0)}
          icono="🤝"
        />

        <MetricCard
          titulo="Alertas pendientes"
          valor={contarAlertasPendientes()}
          detalle={`${contarAlertasCriticas()} críticas`}
          icono="🚨"
          danger
        />

        <MetricCard
          titulo="Eventos inusuales"
          valor={contarEventosPendientes()}
          detalle="Pendientes de revisión"
          icono="🧠"
        />
      </section>

      <section style={mainGridStyle}>
        <div style={quickColumnStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>MÓDULOS DE GESTIÓN</p>
              <h2 style={sectionTitleStyle}>Accesos rápidos</h2>
            </div>
          </div>

          <div style={quickActionsGrid}>
            <QuickAction
              titulo="Inmobiliaria"
              descripcion="Inventario, catalogo y vitrinas de inmuebles."
              icono="🏘️"
              onClick={() => navigate("/inmuebles-admin")}
            />

            <QuickAction
              titulo="Personas"
              descripcion="Clientes, asesores y rotación de atención."
              icono="👥"
              onClick={() => navigate("/personas")}
            />

            <QuickAction
              titulo="Visitas"
              descripcion="Agenda, seguimiento y control de visitas."
              icono="📅"
              onClick={() => navigate("/visitas")}
            />

            <QuickAction
              titulo="Operaciones"
              descripcion="Ventas, arriendos, renovaciones y cancelaciones."
              icono="💼"
              onClick={() => navigate("/operaciones")}
            />

            <QuickAction
              titulo="Monitoreo"
              descripcion="Alertas y eventos inusuales."
              icono="🚨"
              onClick={() => navigate("/monitoreo")}
            />

            <QuickAction
              titulo="Analítica"
              descripcion="Reportes y analisis comercial."
              icono="📈"
              onClick={() => navigate("/analitica")}
              accent
            />
          </div>
        </div>

        <div style={feedColumnStyle}>
          <FeedPanel
            alertas={alertasRecientes}
            eventos={eventosRecientes}
            navigate={navigate}
          />
        </div>
      </section>

      <section style={twoColumnsStyle}>
        <GlassPanel
          titulo="Visitas recientes"
          action="Ir a visitas"
          onClick={() => navigate("/visitas")}
        >
          {visitasRecientes.length === 0 ? (
            <EmptyState texto="No hay visitas registradas." />
          ) : (
            <Table
              headers={["ID", "Cliente", "Inmueble", "Estado"]}
              rows={visitasRecientes.map((visita) => [
                visita.id,
                visita.idCliente,
                visita.codigoInmueble,
                visita.estado,
              ])}
            />
          )}
        </GlassPanel>

        <GlassPanel
          titulo="Operaciones recientes"
          action="Ir a operaciones"
          onClick={() => navigate("/operaciones")}
        >
          {operacionesRecientes.length === 0 ? (
            <EmptyState texto="No hay operaciones registradas." />
          ) : (
            <Table
              headers={["ID", "Tipo", "Valor", "Estado"]}
              rows={operacionesRecientes.map((operacion) => [
                operacion.id,
                operacion.tipoOperacion,
                formatearDinero(operacion.valorAcordado),
                operacion.estadoProceso,
              ])}
            />
          )}
        </GlassPanel>
      </section>

      <section style={twoColumnsStyle}>
        <GlassPanel
          titulo="Zonas con más inmuebles"
          action="Ir a analítica"
          onClick={() => navigate("/analitica")}
        >
          {zonasTop.length === 0 ? (
            <EmptyState texto="No hay datos de zonas." />
          ) : (
            zonasTop.map((zona) => (
              <RankingItem
                key={zona.criterio}
                titulo={zona.criterio}
                cantidad={zona.cantidad}
                detalle="inmuebles"
              />
            ))
          )}
        </GlassPanel>

        <GlassPanel
          titulo="Cierres por asesor"
          action="Ir a analítica"
          onClick={() => navigate("/analitica")}
        >
          {asesoresTop.length === 0 ? (
            <EmptyState texto="No hay cierres registrados." />
          ) : (
            asesoresTop.map((asesor) => (
              <RankingItem
                key={asesor.criterio}
                titulo={asesor.criterio}
                cantidad={asesor.cantidad}
                detalle={formatearDinero(asesor.valorTotal)}
              />
            ))
          )}
        </GlassPanel>
      </section>

      <section style={glassPanelStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>OPERACION</p>
            <h2 style={sectionTitleStyle}>Capacidades del sistema</h2>
          </div>
        </div>

        <div style={capabilitiesGrid}>
          <CapabilityBadge nombre="Inventario" uso="Catalogo y disponibilidad" />
          <CapabilityBadge nombre="Cambios" uso="Deshacer ajustes recientes" />
          <CapabilityBadge nombre="Alertas" uso="Seguimiento de pendientes" />
          <CapabilityBadge nombre="Priorizacion" uso="Atencion de casos urgentes" />
          <CapabilityBadge nombre="Reportes" uso="Indicadores comerciales" />
          <CapabilityBadge nombre="Catalogo" uso="Orden por precio, area y demanda" />
          <CapabilityBadge nombre="Relaciones" uso="Conexiones cliente-inmueble" />
        </div>
      </section>
    </div>
  );
}

function MetricCard({ titulo, valor, detalle, icono, danger }) {
  return (
    <div
      style={{
        ...metricCardStyle,
        borderColor: danger ? "#5f232a" : "#37333e",
      }}
    >
      <div style={metricGlowStyle}></div>

      <div style={metricIconStyle}>{icono}</div>

      <span style={metricLabelStyle}>{titulo}</span>

      <div style={metricValueRowStyle}>
        <strong style={metricValueStyle}>{valor}</strong>
      </div>

      <small style={danger ? dangerTextStyle : mutedTextStyle}>{detalle}</small>
    </div>
  );
}

function QuickAction({ titulo, descripcion, icono, onClick, accent }) {
  return (
    <button onClick={onClick} style={quickActionStyle}>
      <div style={accent ? quickIconAccentStyle : quickIconStyle}>{icono}</div>

      <strong style={quickTitleStyle}>{titulo}</strong>

      <p style={quickTextStyle}>{descripcion}</p>
    </button>
  );
}

function FeedPanel({ alertas, eventos, navigate }) {
  const alertasFeed = alertas.slice(0, 2);
  const eventosFeed = eventos.slice(0, 2);

  return (
    <div style={feedPanelStyle}>
      <div style={feedHeaderStyle}>
        <span style={feedIconStyle}>📡</span>

        <div>
          <p style={eyebrowStyle}>FEED DE INTELIGENCIA</p>
          <h3 style={feedTitleStyle}>Monitoreo reciente</h3>
        </div>
      </div>

      {alertasFeed.length === 0 && eventosFeed.length === 0 ? (
        <EmptyState texto="No hay alertas ni eventos recientes." />
      ) : (
        <>
          {alertasFeed.map((alerta) => (
            <FeedItem
              key={`alerta-${alerta.id}`}
              tipo="Alerta"
              titulo={`${alerta.id} · ${alerta.tipo}`}
              descripcion={alerta.descripcion}
              color="#ffb4ab"
            />
          ))}

          {eventosFeed.map((evento) => (
            <FeedItem
              key={`evento-${evento.id}`}
              tipo="Evento"
              titulo={`${evento.id} · ${evento.tipo}`}
              descripcion={evento.descripcion}
              color="#d2bbff"
            />
          ))}
        </>
      )}

      <button onClick={() => navigate("/monitoreo")} style={ghostButtonStyle}>
        Ver monitoreo completo
      </button>
    </div>
  );
}

function FeedItem({ tipo, titulo, descripcion, color }) {
  return (
    <div style={{ ...feedItemStyle, borderLeft: `2px solid ${color}` }}>
      <span style={{ ...feedTypeStyle, color }}>{tipo}</span>

      <strong style={feedItemTitleStyle}>{titulo}</strong>

      <p style={feedItemTextStyle}>{descripcion || "Sin descripción registrada."}</p>
    </div>
  );
}

function GlassPanel({ titulo, action, onClick, children }) {
  return (
    <div style={glassPanelStyle}>
      <div style={panelHeaderStyle}>
        <h2 style={panelTitleStyle}>{titulo}</h2>

        {action && (
          <button onClick={onClick} style={smallButtonStyle}>
            {action}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={thStyle}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={tdStyle}>
                  {cell || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RankingItem({ titulo, cantidad, detalle }) {
  return (
    <div style={rankingItemStyle}>
      <div>
        <strong style={rankingTitleStyle}>{titulo}</strong>
        <p style={rankingDetailStyle}>{detalle}</p>
      </div>

      <span style={rankingNumberStyle}>{cantidad}</span>
    </div>
  );
}

function CapabilityBadge({ nombre, uso }) {
  return (
    <div style={capabilityBadgeStyle}>
      <strong>{nombre}</strong>
      <small>{uso}</small>
    </div>
  );
}

function EmptyState({ texto }) {
  return <p style={emptyTextStyle}>{texto}</p>;
}

const animations = `
  @keyframes fadeUpDashboard {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseDashboard {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: .55;
      transform: scale(1.18);
    }
  }

  @keyframes orbDashboard {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-10px) scale(1.05);
    }
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  minHeight: "100vh",
  color: "#e8dfee",
  background:
    "radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.14), transparent 34%), radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.10), transparent 34%), #15121b",
  animation: "fadeUpDashboard 0.65s ease both",
};

const heroStyle = {
  marginBottom: "28px",
  padding: "28px",
  borderRadius: "30px",
  background: "#221e28",
  border: "1px solid #37333e",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
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

const heroTitleStyle = {
  margin: "8px 0",
  color: "#ffffff",
  fontSize: "clamp(2rem, 4vw, 3.7rem)",
  lineHeight: 1.08,
  letterSpacing: "-0.05em",
};

const heroAccentStyle = {
  color: "#d2bbff",
};

const heroTextStyle = {
  color: "#ccc3d8",
  maxWidth: "760px",
  lineHeight: 1.7,
  margin: 0,
};

const heroActionsStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const statusPanelStyle = {
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
  boxShadow: "0 0 16px rgba(34,197,94,0.8)",
  animation: "pulseDashboard 1.8s ease-in-out infinite",
};

const primaryButton = {
  padding: "12px 16px",
  border: "none",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
  transition: "0.25s ease",
  boxShadow: "0 16px 32px rgba(124,58,237,0.28)",
};

const metricsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "16px",
  marginBottom: "28px",
};

const metricCardStyle = {
  position: "relative",
  overflow: "hidden",
  padding: "20px",
  borderRadius: "26px",
  background: "#2c2833",
  border: "1px solid #37333e",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
  transition: "0.3s ease",
};

const metricGlowStyle = {
  position: "absolute",
  top: "-40px",
  right: "-40px",
  width: "110px",
  height: "110px",
  background: "rgba(124,58,237,0.16)",
  filter: "blur(28px)",
};

const metricIconStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "16px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.35rem",
  marginBottom: "16px",
};

const metricLabelStyle = {
  display: "block",
  color: "#9f92b2",
  fontSize: "0.72rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

const metricValueRowStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  marginTop: "10px",
};

const metricValueStyle = {
  color: "#ffffff",
  fontSize: "2.2rem",
  lineHeight: 1,
};

const mutedTextStyle = {
  color: "#9f92b2",
};

const dangerTextStyle = {
  color: "#ffb4ab",
};

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: "22px",
  marginBottom: "28px",
};

const quickColumnStyle = {
  gridColumn: "span 8",
};

const feedColumnStyle = {
  gridColumn: "span 4",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "16px",
  marginBottom: "16px",
};

const sectionTitleStyle = {
  color: "#ffffff",
  margin: "6px 0 0",
  fontSize: "1.35rem",
  letterSpacing: "-0.03em",
};

const quickActionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
};

const quickActionStyle = {
  minHeight: "170px",
  border: "1px solid #37333e",
  background: "#2c2833",
  color: "#ffffff",
  padding: "22px",
  borderRadius: "28px",
  cursor: "pointer",
  boxShadow: "0 18px 38px rgba(0,0,0,0.20)",
  transition: "0.28s ease",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
};

const quickIconStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "20px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.9rem",
};

const quickIconAccentStyle = {
  ...quickIconStyle,
  background: "#283318",
  color: "#bcff00",
  border: "1px solid #557022",
};

const quickTitleStyle = {
  color: "#ffffff",
  fontSize: "1.05rem",
};

const quickTextStyle = {
  margin: 0,
  color: "#9f92b2",
  fontSize: "0.78rem",
  lineHeight: 1.45,
};

const feedPanelStyle = {
  height: "100%",
  minHeight: "420px",
  padding: "24px",
  borderRadius: "32px",
  background: "#221e28",
  border: "1px solid #37333e",
  boxShadow: "0 20px 50px rgba(0,0,0,0.24)",
};

const feedHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "22px",
};

const feedIconStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "16px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const feedTitleStyle = {
  margin: "4px 0 0",
  color: "#ffffff",
};

const feedItemStyle = {
  padding: "0 0 0 16px",
  marginBottom: "22px",
};

const feedTypeStyle = {
  display: "block",
  fontSize: "0.68rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "6px",
};

const feedItemTitleStyle = {
  display: "block",
  color: "#ffffff",
  fontSize: "0.92rem",
};

const feedItemTextStyle = {
  margin: "6px 0 0",
  color: "#9f92b2",
  fontSize: "0.8rem",
  lineHeight: 1.5,
};

const ghostButtonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "16px",
  border: "1px solid #6d5f7a",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
};

const twoColumnsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: "22px",
  marginBottom: "28px",
};

const glassPanelStyle = {
  padding: "22px",
  borderRadius: "28px",
  background: "#221e28",
  border: "1px solid #37333e",
  boxShadow: "0 20px 48px rgba(0,0,0,0.22)",
  marginBottom: "28px",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

const panelTitleStyle = {
  color: "#ffffff",
  margin: 0,
  fontSize: "1.2rem",
};

const smallButtonStyle = {
  padding: "9px 12px",
  border: "1px solid #6d5f7a",
  borderRadius: "14px",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  overflow: "hidden",
};

const thStyle = {
  padding: "12px",
  color: "#d2bbff",
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  textAlign: "left",
  borderBottom: "1px solid #37333e",
};

const tdStyle = {
  padding: "12px",
  color: "#ccc3d8",
  borderBottom: "1px solid #2c2833",
  fontSize: "0.86rem",
};

const rankingItemStyle = {
  background: "#15121b",
  border: "1px solid #37333e",
  borderRadius: "18px",
  padding: "14px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const rankingTitleStyle = {
  color: "#ffffff",
};

const rankingDetailStyle = {
  margin: "4px 0 0",
  color: "#8f849e",
};

const rankingNumberStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  boxShadow: "0 0 18px rgba(124,58,237,0.28)",
};

const capabilitiesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
};

const capabilityBadgeStyle = {
  background: "#15121b",
  border: "1px solid #37333e",
  borderRadius: "18px",
  padding: "14px",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const emptyTextStyle = {
  color: "#9f92b2",
  margin: 0,
  lineHeight: 1.6,
};

const loadingCardStyle = {
  minHeight: "340px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "30px",
  background: "#221e28",
  border: "1px solid #37333e",
  boxShadow: "0 20px 48px rgba(0,0,0,0.22)",
};

const loadingOrbStyle = {
  width: "76px",
  height: "76px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7c3aed, #d2bbff)",
  boxShadow: "0 0 36px rgba(124,58,237,0.42)",
  animation: "orbDashboard 2s ease-in-out infinite",
  marginBottom: "18px",
};

const loadingTitleStyle = {
  color: "#ffffff",
  margin: "0 0 8px",
};

export default Dashboard;
