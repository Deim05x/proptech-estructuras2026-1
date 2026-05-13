import { useCallback, useEffect, useState } from "react";
import solicitudAtencionService from "../services/solicitudAtencionService";
import authService from "../services/authService";

function MisSolicitudesPage() {
  const clienteId = authService.getClienteId();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [generandoSolicitud, setGenerandoSolicitud] = useState(false);

  const cargarMisSolicitudes = useCallback(async () => {
    if (!clienteId) return;

    try {
      setCargando(true);
      const data = await solicitudAtencionService.listarPorCliente(clienteId);
      setSolicitudes(data || []);
    } catch (error) {
      console.error("Error al cargar mis solicitudes:", error);
      alert("No se pudieron cargar tus solicitudes");
    } finally {
      setCargando(false);
    }
  }, [clienteId]);

  useEffect(() => {
    cargarMisSolicitudes();
  }, [cargarMisSolicitudes]);

  const generarSolicitud = async () => {
    if (!clienteId) {
      alert("No se encontro el cliente autenticado.");
      return;
    }

    try {
      setGenerandoSolicitud(true);

      await solicitudAtencionService.crear({
        idCliente: clienteId,
        tipoSolicitud: "ATENCION",
        estado: "PENDIENTE",
        prioridad: "MEDIA",
        fechaCreacion: null,
        fechaAtencion: null,
        idAsesorAsignado: "",
        respuesta: "",
      });

      alert("Solicitud generada correctamente.");
      await cargarMisSolicitudes();
    } catch (error) {
      console.error("Error al generar solicitud:", error);
      alert(error.response?.data || "No se pudo generar la solicitud");
    } finally {
      setGenerandoSolicitud(false);
    }
  };

  const cancelarSolicitud = async (id) => {
    const confirmar = window.confirm("Seguro que deseas cancelar esta solicitud?");

    if (!confirmar) return;

    try {
      await solicitudAtencionService.cambiarEstado(id, "CANCELADA");
      alert("Solicitud cancelada correctamente");
      await cargarMisSolicitudes();
    } catch (error) {
      console.error("Error al cancelar solicitud:", error);
      alert("No se pudo cancelar la solicitud");
    }
  };

  const contarPorEstado = (estado) => {
    return solicitudes.filter(
      (solicitud) => (solicitud.estado || "").toUpperCase() === estado
    ).length;
  };

  const obtenerEstiloEstado = (estado) => {
    const valor = (estado || "").toUpperCase();

    if (valor === "PENDIENTE") return badgePendingStyle;
    if (valor === "EN_ATENCION") return badgeActiveStyle;
    if (valor === "ATENDIDA") return badgeDoneStyle;
    if (valor === "CANCELADA" || valor === "RECHAZADA") return badgeDangerStyle;

    return badgeNeutralStyle;
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
          <p style={eyebrowStyle}>PORTAL CLIENTE</p>

          <h1 style={mainTitleStyle}>
            Mis <span style={titleAccentStyle}>solicitudes</span>
          </h1>

          <p style={descriptionStyle}>
            Genera solicitudes de atencion para que el equipo admin las revise,
            te asigne un asesor y haga seguimiento.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{solicitudes.length} solicitudes</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard titulo="Total" valor={solicitudes.length} texto="Enviadas" />
        <SummaryCard titulo="Pendientes" valor={contarPorEstado("PENDIENTE")} texto="En espera" />
        <SummaryCard titulo="En atencion" valor={contarPorEstado("EN_ATENCION")} texto="Con asesor" />
        <SummaryCard titulo="Atendidas" valor={contarPorEstado("ATENDIDA")} texto="Finalizadas" />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>NUEVA SOLICITUD</p>
            <h2 style={titleStyle}>Generar solicitud</h2>

            <p style={mutedTextStyle}>
              El codigo se crea automaticamente y la solicitud queda pendiente
              para que un administrador asigne el asesor.
            </p>
          </div>

          <span style={modeBadgeStyle}>{clienteId || "Sin cliente"}</span>
        </div>

        <div style={requestBoxStyle}>
          <div>
            <strong style={requestTitleStyle}>Solicitud general de asesoria</strong>
            <p style={mutedTextStyle}>
              No necesitas escribir codigos ni descripciones. El sistema registra
              la solicitud con tus datos de cliente.
            </p>
          </div>

          <button
            type="button"
            onClick={generarSolicitud}
            disabled={generandoSolicitud}
            style={{
              ...primaryButton,
              ...(generandoSolicitud ? disabledButtonStyle : {}),
            }}
          >
            {generandoSolicitud ? "Generando..." : "Generar solicitud"}
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>SEGUIMIENTO</p>
            <h2 style={titleStyle}>Mis solicitudes registradas</h2>
          </div>

          <button type="button" onClick={cargarMisSolicitudes} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando solicitudes..." />
        ) : solicitudes.length === 0 ? (
          <EmptyState texto="No tienes solicitudes registradas." />
        ) : (
          <div style={cardsGridStyle}>
            {solicitudes.map((solicitud) => (
              <article key={solicitud.id} style={cardStyle}>
                <div style={cardTopStyle}>
                  <div>
                    <h3 style={cardTitleStyle}>
                      {solicitud.tipoSolicitud} - {solicitud.id}
                    </h3>

                    <p style={cardSubtitleStyle}>
                      Inmueble: {solicitud.codigoInmueble || "No especificado"}
                    </p>
                  </div>

                  <span style={{ ...pillStyle, ...obtenerEstiloEstado(solicitud.estado) }}>
                    {solicitud.estado}
                  </span>
                </div>

                <div style={chipGridStyle}>
                  <span style={chipStyle}>
                    Prioridad: {solicitud.prioridad || "MEDIA"}
                  </span>
                  <span style={chipStyle}>
                    Asesor: {solicitud.idAsesorAsignado || "Sin asignar"}
                  </span>
                </div>

                <p style={descriptionBoxStyle}>{solicitud.descripcion}</p>

                {solicitud.respuesta && (
                  <div style={responseBoxStyle}>
                    <strong>Respuesta:</strong>
                    <p>{solicitud.respuesta}</p>
                  </div>
                )}

                <div style={cardFooterStyle}>
                  <small style={dateTextStyle}>
                    Creada: {formatearFecha(solicitud.fechaCreacion)}
                  </small>

                  {solicitud.estado === "PENDIENTE" && (
                    <button
                      type="button"
                      onClick={() => cancelarSolicitud(solicitud.id)}
                      style={dangerButton}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ titulo, valor, texto }) {
  return (
    <article style={summaryCardStyle}>
      <div style={summaryIconStyle}>SOL</div>

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
      <strong>Solicitudes</strong>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpMisSolicitudes {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseMisSolicitudes {
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
  animation: "fadeUpMisSolicitudes 0.55s ease both",
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
  animation: "pulseMisSolicitudes 1.8s ease-in-out infinite",
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

const requestBoxStyle = {
  padding: "18px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "center",
  flexWrap: "wrap",
};

const requestTitleStyle = {
  display: "block",
  color: "#ffffff",
  fontSize: "1rem",
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

const disabledButtonStyle = {
  opacity: 0.72,
  cursor: "not-allowed",
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

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
  margin: "0 0 6px",
  color: "#ffffff",
  fontSize: "1rem",
};

const cardSubtitleStyle = {
  margin: 0,
  color: "#9f92b2",
  lineHeight: 1.45,
};

const pillStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const badgePendingStyle = {
  background: "#3a2d00",
  color: "#ffd76a",
  border: "1px solid #826300",
};

const badgeActiveStyle = {
  background: "#10294f",
  color: "#93c5fd",
  border: "1px solid #1d4ed8",
};

const badgeDoneStyle = {
  background: "#12351f",
  color: "#86efac",
  border: "1px solid #225c37",
};

const badgeDangerStyle = {
  background: "#3a1218",
  color: "#ffb4ab",
  border: "1px solid #7a2c35",
};

const badgeNeutralStyle = {
  background: "#15121b",
  color: "#ccc3d8",
  border: "1px solid #37333e",
};

const chipGridStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const chipStyle = {
  background: "#15121b",
  color: "#d2bbff",
  border: "1px solid #37333e",
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.78rem",
  fontWeight: "800",
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

const responseBoxStyle = {
  marginTop: "12px",
  padding: "12px",
  borderRadius: "16px",
  background: "#221e28",
  border: "1px solid #37333e",
  color: "#d2bbff",
};

const cardFooterStyle = {
  marginTop: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const dateTextStyle = {
  color: "#8f849e",
};

const dangerButton = {
  padding: "8px 12px",
  border: "1px solid #7a2c35",
  borderRadius: "12px",
  background: "#3a1218",
  color: "#ffb4ab",
  fontWeight: "900",
  cursor: "pointer",
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default MisSolicitudesPage;
