import { useCallback, useEffect, useMemo, useState } from "react";
import historialService from "../services/historialService";
import authService from "../services/authService";

function HistorialPage() {
  const rol = authService.getRol();
  const clienteAutenticado = authService.getClienteId();

  const [clienteId, setClienteId] = useState(
    rol === "CLIENTE" ? clienteAutenticado || "" : ""
  );
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modoReverso, setModoReverso] = useState(false);

  const cargarHistorial = useCallback(async () => {
    if (!clienteId || !clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
      setCargando(true);
      const data = modoReverso
        ? await historialService.listarReversoPorCliente(clienteId)
        : await historialService.listarPorCliente(clienteId);

      setHistorial(data || []);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      alert("No se pudo cargar el historial");
    } finally {
      setCargando(false);
    }
  }, [clienteId, modoReverso]);

  useEffect(() => {
    if (rol === "CLIENTE" && clienteId) {
      cargarHistorial();
    }
  }, [cargarHistorial, clienteId, rol]);

  const tiposDeInteraccion = useMemo(() => {
    return historial.map((item) => (item.tipoInteraccion || "").toUpperCase());
  }, [historial]);

  const cambiarModo = () => {
    setModoReverso((actual) => !actual);
  };

  const contarPorTexto = (texto) => {
    return tiposDeInteraccion.filter((tipo) => tipo.includes(texto)).length;
  };

  const contarSolicitudes = () => {
    return tiposDeInteraccion.filter((tipo) => tipo.startsWith("SOLICITUD_"))
      .length;
  };

  const obtenerEstiloTipo = (tipo) => {
    const valor = (tipo || "").toUpperCase();

    if (valor.includes("VISITA")) {
      return badgeBlueStyle;
    }

    if (valor.includes("FAVORITO")) {
      return badgePurpleStyle;
    }

    if (valor.includes("COMPRA") || valor.includes("ARRIENDO")) {
      return badgeGreenStyle;
    }

    if (valor.includes("CANCELAR") || valor.includes("ELIMINAR")) {
      return badgeRedStyle;
    }

    if (valor.includes("INFORMACION")) {
      return badgeGoldStyle;
    }

    return badgeNeutralStyle;
  };

  const obtenerDescripcionInteraccion = (item) => {
    const tipo = (item.tipoInteraccion || "").toUpperCase();
    const codigo = item.codigoInmueble || "el inmueble";

    if (tipo === "FAVORITO") {
      return `Agregaste ${codigo} a favoritos desde la card del inmueble.`;
    }

    if (tipo === "ELIMINAR_FAVORITO") {
      return `Eliminaste ${codigo} de tu lista de favoritos.`;
    }

    if (tipo === "SOLICITUD_COMPRA") {
      return `Enviaste una intencion de compra para ${codigo}.`;
    }

    if (tipo === "SOLICITUD_ARRIENDO") {
      return `Enviaste una intencion de arriendo para ${codigo}.`;
    }

    if (tipo === "SOLICITUD_VISITA" || tipo === "AGENDAR_VISITA") {
      return `Solicitaste una visita para ${codigo}.`;
    }

    if (tipo === "SOLICITUD_INFORMACION") {
      return `Pediste mas informacion sobre ${codigo}.`;
    }

    if (tipo === "REPROGRAMAR_VISITA") {
      return `Reprogramaste una visita asociada a ${codigo}.`;
    }

    if (tipo === "CANCELAR_VISITA") {
      return `Cancelaste una visita asociada a ${codigo}.`;
    }

    return `Actividad registrada automaticamente sobre ${codigo}.`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return String(fecha).replace("T", " ").slice(0, 19);
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>REGISTRO AUTOMATICO</p>

          <h1 style={mainTitleStyle}>
            Mi <span style={titleAccentStyle}>historial</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta la actividad generada automaticamente cuando guardas
            favoritos, solicitas visitas o manifiestas interes por comprar,
            arrendar o recibir informacion.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{historial.length} interacciones</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          titulo="Total"
          valor={historial.length}
          texto="Interacciones cargadas"
        />

        <SummaryCard
          titulo="Solicitudes"
          valor={contarSolicitudes()}
          texto="Acciones enviadas"
        />

        <SummaryCard
          titulo="Visitas"
          valor={contarPorTexto("VISITA")}
          texto="Agenda y cambios"
        />

        <SummaryCard
          titulo="Favoritos"
          valor={contarPorTexto("FAVORITO")}
          texto="Interes marcado"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CONSULTA</p>
            <h2 style={titleStyle}>Buscar historial</h2>

            <p style={mutedTextStyle}>
              {rol === "CLIENTE"
                ? "Estas consultando el historial asociado a tu cuenta."
                : "Ingresa el ID del cliente para consultar su historial."}
            </p>
          </div>

          <span style={modeBadgeStyle}>
            {modoReverso ? "Actividad anterior" : "Actividad reciente"}
          </span>
        </div>

        <div style={formRowStyle}>
          <input
            type="text"
            placeholder="ID del cliente"
            value={clienteId}
            disabled={rol === "CLIENTE"}
            onChange={(e) => setClienteId(e.target.value)}
            style={{
              ...inputStyle,
              opacity: rol === "CLIENTE" ? 0.75 : 1,
              cursor: rol === "CLIENTE" ? "not-allowed" : "text",
            }}
          />

          <button onClick={cargarHistorial} style={primaryButton}>
            Cargar historial
          </button>

          <button onClick={cambiarModo} style={secondaryButton}>
            {modoReverso ? "Ver actividad reciente" : "Ver actividad anterior"}
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>AUTOMATIZACION</p>
            <h2 style={titleStyle}>Interacciones automaticas</h2>

            <p style={mutedTextStyle}>
              El historial se actualiza solo cuando realizas acciones reales
              dentro del sistema. Ya no necesitas escribir codigos ni registrar
              interacciones manualmente.
            </p>
          </div>

          <span style={modeBadgeStyle}>Sin captura manual</span>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>ACTIVIDAD</p>
            <h2 style={titleStyle}>Historial de actividad</h2>

            <p style={mutedTextStyle}>
              Lista de interacciones generadas por favoritos, solicitudes y
              visitas del cliente consultado.
            </p>
          </div>

          <button type="button" onClick={cargarHistorial} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando historial..." />
        ) : historial.length === 0 ? (
          <EmptyState texto="No hay historial registrado. Se llenara automaticamente cuando uses el catalogo." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Inmueble</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Detalle</th>
                  <th style={thStyle}>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {historial.map((item, index) => (
                  <tr key={`${item.codigoInmueble}-${item.tipoInteraccion}-${index}`}>
                    <td style={tdStrongStyle}>{item.idCliente || clienteId}</td>
                    <td style={tdStyle}>{item.codigoInmueble}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloTipo(item.tipoInteraccion),
                        }}
                      >
                        {item.tipoInteraccion}
                      </span>
                    </td>

                    <td style={tdDescriptionStyle}>
                      {obtenerDescripcionInteraccion(item)}
                    </td>

                    <td style={tdStyle}>{formatearFecha(item.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ titulo, valor, texto }) {
  return (
    <article style={summaryCardStyle}>
      <div style={summaryIconStyle}>ACT</div>

      <div>
        <p style={summaryTitleStyle}>{titulo}</p>
        <strong style={summaryValueStyle}>{valor}</strong>
        <small style={summaryTextStyle}>{texto}</small>
      </div>
    </article>
  );
}

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <strong>Actividad automatica</strong>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpHistorial {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseHistorial {
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
  minHeight: "100vh",
  width: "100%",
  color: "#e8dfee",
  background: "transparent",
  animation: "fadeUpHistorial 0.55s ease both",
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
  animation: "pulseHistorial 1.8s ease-in-out infinite",
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
  color: "#d2bbff",
  fontSize: "0.74rem",
  fontWeight: "900",
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
  maxWidth: "820px",
};

const formRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
};

const inputStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "12px 13px",
  borderRadius: "14px",
  border: "1px solid #37333e",
  outline: "none",
  background: "#15121b",
  color: "#e8dfee",
  fontWeight: "650",
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

const tableWrapperStyle = {
  overflowX: "auto",
  borderRadius: "18px",
  border: "1px solid #37333e",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#15121b",
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
  verticalAlign: "top",
};

const tdStrongStyle = {
  ...tdStyle,
  color: "#ffffff",
  fontWeight: "900",
};

const tdDescriptionStyle = {
  ...tdStyle,
  minWidth: "220px",
  lineHeight: 1.45,
};

const pillStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const badgeBlueStyle = {
  background: "#10294f",
  color: "#93c5fd",
  border: "1px solid #1d4ed8",
};

const badgePurpleStyle = {
  background: "#3f2a57",
  color: "#d2bbff",
  border: "1px solid #6d5f7a",
};

const badgeGreenStyle = {
  background: "#12351f",
  color: "#86efac",
  border: "1px solid #225c37",
};

const badgeRedStyle = {
  background: "#3a1218",
  color: "#ffb4ab",
  border: "1px solid #7a2c35",
};

const badgeGoldStyle = {
  background: "#3a2d00",
  color: "#ffd76a",
  border: "1px solid #826300",
};

const badgeNeutralStyle = {
  background: "#15121b",
  color: "#ccc3d8",
  border: "1px solid #37333e",
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default HistorialPage;
