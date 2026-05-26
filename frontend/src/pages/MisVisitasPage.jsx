import { useCallback, useEffect, useState } from "react";
import visitaService from "../services/visitaService";
import authService from "../services/authService";

function MisVisitasPage() {
  const [visitas, setVisitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const clienteId = authService.getClienteId();

  const cargarMisVisitas = useCallback(async () => {
    try {
      setCargando(true);

      const data = await visitaService.listar();

      const visitasCliente = data.filter(
        (visita) =>
          visita.idCliente &&
          clienteId &&
          visita.idCliente.toLowerCase() === clienteId.toLowerCase()
      );

      setVisitas(visitasCliente);
    } catch (error) {
      console.error("Error al cargar mis visitas:", error);
      alert("No se pudieron cargar tus visitas");
    } finally {
      setCargando(false);
    }
  }, [clienteId]);

  useEffect(() => {
    cargarMisVisitas();
  }, [cargarMisVisitas]);

  const contarPorEstado = (estado) => {
    return visitas.filter(
      (visita) => (visita.estado || "").toLowerCase() === estado.toLowerCase()
    ).length;
  };

  const obtenerEstiloEstado = (estado) => {
    const valor = (estado || "").toLowerCase();

    if (valor === "programada") {
      return {
        background: "#12351f",
        border: "1px solid #225c37",
        color: "#86efac",
      };
    }

    if (valor === "reprogramada") {
      return {
        background: "#3f2a57",
        border: "1px solid #6d5f7a",
        color: "#d2bbff",
      };
    }

    if (valor === "cancelada") {
      return {
        background: "#3a1218",
        border: "1px solid #7a2c35",
        color: "#ffb4ab",
      };
    }

    return {
      background: "#15121b",
      border: "1px solid #37333e",
      color: "#ccc3d8",
    };
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>AGENDA PERSONAL</p>

          <h1 style={mainTitleStyle}>
            Mis <span style={titleAccentStyle}>visitas</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta las visitas inmobiliarias asociadas a tu cuenta, revisa
            fecha, hora, asesor asignado, inmueble relacionado y estado actual.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{visitas.length} visitas</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="📅"
          titulo="Total"
          valor={visitas.length}
          texto="Visitas registradas"
        />

        <SummaryCard
          icono="✅"
          titulo="Programadas"
          valor={contarPorEstado("Programada")}
          texto="Pendientes por realizar"
        />

        <SummaryCard
          icono="🔁"
          titulo="Reprogramadas"
          valor={contarPorEstado("Reprogramada")}
          texto="Con nueva fecha"
        />

        <SummaryCard
          icono="⛔"
          titulo="Canceladas"
          valor={contarPorEstado("Cancelada")}
          texto="No se realizarán"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CLIENTE ACTUAL</p>
            <h2 style={titleStyle}>Visitas asociadas</h2>

            <p style={mutedTextStyle}>
              El sistema filtra automáticamente las visitas relacionadas con tu
              identificador de cliente.
            </p>
          </div>

          <span style={modeBadgeStyle}>{clienteId || "Sin cliente"}</span>
        </div>

        <div style={buttonRowStyle}>
          <button type="button" onClick={cargarMisVisitas} style={primaryButton}>
            Recargar mis visitas
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>AGENDA</p>
            <h2 style={titleStyle}>Listado de visitas</h2>

            <p style={mutedTextStyle}>
              Aquí puedes consultar las visitas asociadas a tu cuenta.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {cargando ? "Cargando" : `${visitas.length} registros`}
          </span>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando visitas..." />
        ) : visitas.length === 0 ? (
          <EmptyState texto="No tienes visitas registradas." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Inmueble</th>
                  <th style={thStyle}>Asesor</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Hora</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Observaciones</th>
                </tr>
              </thead>

              <tbody>
                {visitas.map((visita) => (
                  <tr key={visita.id}>
                    <td style={tdStrongStyle}>{visita.id}</td>
                    <td style={tdStyle}>{visita.codigoInmueble}</td>
                    <td style={tdStyle}>{visita.idAsesor}</td>
                    <td style={tdStyle}>{visita.fecha}</td>
                    <td style={tdStyle}>{visita.hora}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloEstado(visita.estado),
                        }}
                      >
                        {visita.estado || "Sin estado"}
                      </span>
                    </td>

                    <td style={tdDescriptionStyle}>
                      {visita.observaciones || visita.observacion || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={cardsGridStyle}>
        {visitas.map((visita) => (
          <article key={`card-${visita.id}`} style={visitCardStyle}>
            <div style={visitIconStyle}>📅</div>

            <div style={visitContentStyle}>
              <div style={visitTopStyle}>
                <div>
                  <h3 style={visitTitleStyle}>
                    Visita #{visita.id} · {visita.codigoInmueble}
                  </h3>

                  <p style={visitSubtitleStyle}>
                    Asesor asignado: {visita.idAsesor || "Sin asesor"}
                  </p>
                </div>

                <span
                  style={{
                    ...pillStyle,
                    ...obtenerEstiloEstado(visita.estado),
                  }}
                >
                  {visita.estado || "Sin estado"}
                </span>
              </div>

              <div style={visitDetailsGridStyle}>
                <InfoChip label="Fecha" value={visita.fecha || "—"} />
                <InfoChip label="Hora" value={visita.hora || "—"} />
                <InfoChip
                  label="Observación"
                  value={visita.observaciones || visita.observacion || "—"}
                />
              </div>
            </div>
          </article>
        ))}
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
      <span style={{ fontSize: "2rem" }}>📅</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpMisVisitas {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseMisVisitas {
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
  animation: "fadeUpMisVisitas 0.55s ease both",
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
  animation: "pulseMisVisitas 1.8s ease-in-out infinite",
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

const filterBadgeStyle = {
  ...modeBadgeStyle,
  background: "#15121b",
  border: "1px solid #37333e",
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

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "18px",
};

const visitCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.20)",
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
};

const visitIconStyle = {
  width: "52px",
  height: "52px",
  minWidth: "52px",
  borderRadius: "18px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
};

const visitContentStyle = {
  flex: 1,
};

const visitTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "14px",
};

const visitTitleStyle = {
  margin: "0 0 5px",
  color: "#ffffff",
  fontSize: "1rem",
};

const visitSubtitleStyle = {
  margin: 0,
  color: "#9f92b2",
  lineHeight: 1.45,
};

const visitDetailsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "10px",
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
  fontSize: "0.82rem",
};

export default MisVisitasPage;
