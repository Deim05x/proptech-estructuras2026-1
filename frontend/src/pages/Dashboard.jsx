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
      <div>
        <h1 style={{ color: "#43214d" }}>Dashboard</h1>
        <p>Cargando información general del sistema...</p>
      </div>
    );
  }

  return (
    <div>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Panel administrativo</p>

          <h1 style={{ margin: "6px 0", color: "#43214d" }}>
            Bienvenido, {username || "administrador"}
          </h1>

          <p style={{ color: "#7e747d", maxWidth: "720px", lineHeight: 1.7 }}>
            Resumen general de la plataforma PropTech: inmuebles, visitas,
            operaciones, alertas, eventos inusuales, reportes y análisis
            comercial.
          </p>
        </div>

        <button onClick={cargarDashboard} style={primaryButton}>
          Actualizar dashboard
        </button>
      </section>

      <section style={cardsGrid}>
        <CardResumen
          titulo="Total inmuebles"
          valor={resumen?.totalInmuebles || 0}
          detalle="Inmuebles registrados"
          icono="🏠"
        />

        <CardResumen
          titulo="Disponibles"
          valor={resumen?.inmueblesDisponibles || 0}
          detalle="Listos para ofertar"
          icono="✅"
        />

        <CardResumen
          titulo="Visitas pendientes"
          valor={contarVisitasPendientes()}
          detalle={`Total visitas: ${resumen?.totalVisitas || 0}`}
          icono="📅"
        />

        <CardResumen
          titulo="Operaciones cerradas"
          valor={resumen?.operacionesCerradas || 0}
          detalle={`Valor: ${formatearDinero(resumen?.valorTotalCierres || 0)}`}
          icono="💼"
        />

        <CardResumen
          titulo="Alertas pendientes"
          valor={contarAlertasPendientes()}
          detalle={`${contarAlertasCriticas()} críticas`}
          icono="🚨"
        />

        <CardResumen
          titulo="Eventos inusuales"
          valor={contarEventosPendientes()}
          detalle="Pendientes de revisión"
          icono="📊"
        />
      </section>

      <section style={panelStyle}>
        <h2 style={titleStyle}>Accesos rápidos</h2>

        <div style={quickActionsGrid}>
          <QuickAction
            titulo="Gestionar inmuebles"
            descripcion="Crear, editar, eliminar y deshacer cambios."
            icono="🏘️"
            onClick={() => navigate("/inmuebles")}
          />

          <QuickAction
            titulo="Descubrir inmuebles"
            descripcion="Catálogo con filtros y ordenamiento por árbol."
            icono="🔎"
            onClick={() => navigate("/descubrir-inmuebles")}
          />

          <QuickAction
            titulo="Registrar operación"
            descripcion="Ventas, arriendos, renovaciones y cancelaciones."
            icono="🧾"
            onClick={() => navigate("/operaciones")}
          />

          <QuickAction
            titulo="Procesar alertas"
            descripcion="Cola FIFO y cola de prioridad."
            icono="⚠️"
            onClick={() => navigate("/alertas")}
          />

          <QuickAction
            titulo="Ver reportes"
            descripcion="Zonas, precios, visitas, cierres y asesores."
            icono="📈"
            onClick={() => navigate("/reportes")}
          />

          <QuickAction
            titulo="Analizar relaciones"
            descripcion="Grafo cliente-inmueble-zona-asesor."
            icono="🕸️"
            onClick={() => navigate("/analisis-relaciones")}
          />
        </div>
      </section>

      <section style={dashboardGrid}>
        <div style={panelStyle}>
          <h2 style={titleStyle}>Alertas recientes</h2>

          {alertasRecientes.length === 0 ? (
            <p>No hay alertas registradas.</p>
          ) : (
            alertasRecientes.map((alerta) => (
              <MiniItem
                key={alerta.id}
                titulo={`${alerta.id} · ${alerta.tipo}`}
                descripcion={alerta.descripcion}
                etiqueta={alerta.nivelAtencion}
                estado={alerta.estado}
              />
            ))
          )}

          <button onClick={() => navigate("/alertas")} style={secondaryButton}>
            Ir a alertas
          </button>
        </div>

        <div style={panelStyle}>
          <h2 style={titleStyle}>Eventos inusuales recientes</h2>

          {eventosRecientes.length === 0 ? (
            <p>No hay eventos inusuales registrados.</p>
          ) : (
            eventosRecientes.map((evento) => (
              <MiniItem
                key={evento.id}
                titulo={`${evento.id} · ${evento.tipo}`}
                descripcion={evento.descripcion}
                etiqueta={evento.nivelAtencion}
                estado={evento.estado}
              />
            ))
          )}

          <button
            onClick={() => navigate("/eventos-inusuales")}
            style={secondaryButton}
          >
            Ir a eventos
          </button>
        </div>
      </section>

      <section style={dashboardGrid}>
        <div style={panelStyle}>
          <h2 style={titleStyle}>Visitas recientes</h2>

          {visitasRecientes.length === 0 ? (
            <p>No hay visitas registradas.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={theadRowStyle}>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Inmueble</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {visitasRecientes.map((visita) => (
                  <tr key={visita.id}>
                    <td style={tdStyle}>{visita.id}</td>
                    <td style={tdStyle}>{visita.idCliente}</td>
                    <td style={tdStyle}>{visita.codigoInmueble}</td>
                    <td style={tdStyle}>{visita.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button onClick={() => navigate("/visitas")} style={secondaryButton}>
            Ir a visitas
          </button>
        </div>

        <div style={panelStyle}>
          <h2 style={titleStyle}>Operaciones recientes</h2>

          {operacionesRecientes.length === 0 ? (
            <p>No hay operaciones registradas.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={theadRowStyle}>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {operacionesRecientes.map((operacion) => (
                  <tr key={operacion.id}>
                    <td style={tdStyle}>{operacion.id}</td>
                    <td style={tdStyle}>{operacion.tipoOperacion}</td>
                    <td style={tdStyle}>
                      {formatearDinero(operacion.valorAcordado)}
                    </td>
                    <td style={tdStyle}>{operacion.estadoProceso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button onClick={() => navigate("/operaciones")} style={secondaryButton}>
            Ir a operaciones
          </button>
        </div>
      </section>

      <section style={dashboardGrid}>
        <div style={panelStyle}>
          <h2 style={titleStyle}>Zonas con más inmuebles</h2>

          {zonasTop.length === 0 ? (
            <p>No hay datos de zonas.</p>
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
        </div>

        <div style={panelStyle}>
          <h2 style={titleStyle}>Cierres por asesor</h2>

          {asesoresTop.length === 0 ? (
            <p>No hay cierres registrados.</p>
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
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={titleStyle}>Estructuras implementadas</h2>

        <div style={estructuraGrid}>
          <BadgeEstructura nombre="Lista" uso="Favoritos, historial y recorridos" />
          <BadgeEstructura nombre="Pila" uso="Deshacer cambios en inmuebles" />
          <BadgeEstructura nombre="Cola" uso="Alertas pendientes FIFO" />
          <BadgeEstructura nombre="Cola prioridad" uso="Alertas críticas primero" />
          <BadgeEstructura nombre="Tabla hash" uso="Reportes y agrupaciones" />
          <BadgeEstructura nombre="Árbol" uso="Ordenamiento de inmuebles" />
          <BadgeEstructura nombre="Grafo" uso="Relaciones cliente-inmueble" />
        </div>
      </section>
    </div>
  );
}

function CardResumen({ titulo, valor, detalle, icono }) {
  return (
    <div style={cardStyle}>
      <div style={cardIconStyle}>{icono}</div>

      <h3 style={{ margin: "12px 0 6px", color: "#43214d" }}>{titulo}</h3>

      <p style={cardValueStyle}>{valor}</p>

      <small style={{ color: "#7e747d" }}>{detalle}</small>
    </div>
  );
}

function QuickAction({ titulo, descripcion, icono, onClick }) {
  return (
    <button onClick={onClick} style={quickActionStyle}>
      <div style={quickIconStyle}>{icono}</div>

      <div style={{ textAlign: "left" }}>
        <strong style={{ color: "#43214d" }}>{titulo}</strong>
        <p style={{ margin: "6px 0 0", color: "#7e747d", lineHeight: 1.4 }}>
          {descripcion}
        </p>
      </div>
    </button>
  );
}

function MiniItem({ titulo, descripcion, etiqueta, estado }) {
  return (
    <div style={miniItemStyle}>
      <div>
        <strong style={{ color: "#43214d" }}>{titulo}</strong>

        <p style={{ margin: "6px 0 0", color: "#4c444d", lineHeight: 1.5 }}>
          {descripcion}
        </p>
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <span style={pillStyle}>{etiqueta}</span>
        <span style={pillLightStyle}>{estado}</span>
      </div>
    </div>
  );
}

function RankingItem({ titulo, cantidad, detalle }) {
  return (
    <div style={rankingItemStyle}>
      <div>
        <strong style={{ color: "#43214d" }}>{titulo}</strong>
        <p style={{ margin: "4px 0 0", color: "#7e747d" }}>{detalle}</p>
      </div>

      <span style={rankingNumberStyle}>{cantidad}</span>
    </div>
  );
}

function BadgeEstructura({ nombre, uso }) {
  return (
    <div style={estructuraBadgeStyle}>
      <strong>{nombre}</strong>
      <small>{uso}</small>
    </div>
  );
}

const heroStyle = {
  backgroundColor: "rgba(255,255,255,0.88)",
  padding: "26px",
  borderRadius: "22px",
  marginBottom: "24px",
  boxShadow: "0 14px 34px rgba(67,33,77,0.09)",
  border: "1px solid #e8e0e5",
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "center",
  flexWrap: "wrap",
};

const eyebrowStyle = {
  margin: 0,
  color: "#7f4d7c",
  fontWeight: "800",
  textTransform: "uppercase",
  fontSize: "0.78rem",
  letterSpacing: "0.08em",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.86)",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const cardIconStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "16px",
  background: "#fbd7ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.4rem",
};

const cardValueStyle = {
  margin: 0,
  fontSize: "2rem",
  fontWeight: "900",
  color: "#1e1a1e",
};

const panelStyle = {
  backgroundColor: "rgba(255,255,255,0.88)",
  padding: "22px",
  borderRadius: "20px",
  marginBottom: "24px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const titleStyle = {
  color: "#43214d",
  marginTop: 0,
  marginBottom: "16px",
};

const quickActionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "14px",
};

const quickActionStyle = {
  border: "1px solid #e8e0e5",
  backgroundColor: "#fff7fb",
  padding: "16px",
  borderRadius: "18px",
  display: "flex",
  gap: "14px",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(67,33,77,0.05)",
};

const quickIconStyle = {
  width: "44px",
  height: "44px",
  minWidth: "44px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #5b3765, #fdbef4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "1.3rem",
};

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: "18px",
};

const miniItemStyle = {
  backgroundColor: "#fff7fb",
  border: "1px solid #e8e0e5",
  borderRadius: "16px",
  padding: "14px",
  marginBottom: "10px",
};

const pillStyle = {
  backgroundColor: "#fbd7ff",
  color: "#43214d",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "800",
};

const pillLightStyle = {
  backgroundColor: "#f4ecf0",
  color: "#4c444d",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "800",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "white",
  borderRadius: "14px",
  overflow: "hidden",
  marginBottom: "14px",
};

const theadRowStyle = {
  backgroundColor: "#f4ecf0",
  color: "#43214d",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #e8e0e5",
};

const rankingItemStyle = {
  backgroundColor: "#fff7fb",
  border: "1px solid #e8e0e5",
  borderRadius: "16px",
  padding: "14px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const rankingNumberStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #5b3765, #43214d)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const estructuraGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
};

const estructuraBadgeStyle = {
  backgroundColor: "#fff7fb",
  border: "1px solid #e8e0e5",
  borderRadius: "16px",
  padding: "14px",
  color: "#43214d",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const primaryButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #5b3765, #43214d)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const secondaryButton = {
  padding: "9px 13px",
  border: "1px solid #cfc3cd",
  borderRadius: "12px",
  backgroundColor: "#fbd7ff",
  color: "#43214d",
  fontWeight: "800",
  cursor: "pointer",
  marginTop: "10px",
};

export default Dashboard;