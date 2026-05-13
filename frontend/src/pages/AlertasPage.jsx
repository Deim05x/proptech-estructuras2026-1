import { useCallback, useEffect, useState } from "react";
import alertaService from "../services/alertaService";

function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("PENDIENTE");
  const [cantidadCola, setCantidadCola] = useState(0);
  const [cantidadColaPrioridad, setCantidadColaPrioridad] = useState(0);

  const [formulario, setFormulario] = useState({
    tipo: "",
    descripcion: "",
    nivelAtencion: "MEDIO",
    estado: "PENDIENTE",
  });

  const cargarAlertas = useCallback(async () => {
    try {
      setCargando(true);

      const data = await alertaService.listarPorEstado(estadoFiltro);

      const cantidadNormal = await alertaService.cantidadCola();
      const cantidadPrioridad = await alertaService.cantidadColaPrioridad();

      setAlertas(data || []);
      setCantidadCola(cantidadNormal || 0);
      setCantidadColaPrioridad(cantidadPrioridad || 0);
    } catch (error) {
      console.error("Error al cargar alertas:", error);
      alert("No se pudieron cargar las alertas");
    } finally {
      setCargando(false);
    }
  }, [estadoFiltro]);

  useEffect(() => {
    cargarAlertas();
  }, [cargarAlertas]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      tipo: "",
      descripcion: "",
      nivelAtencion: "MEDIO",
      estado: "PENDIENTE",
    });
  };

  const crearAlerta = async (e) => {
    e.preventDefault();

    try {
      await alertaService.crear({
        ...formulario,
        fechaCreacion: null,
      });

      alert("Alerta registrada correctamente");
      limpiarFormulario();
      cargarAlertas();
    } catch (error) {
      console.error("Error al crear alerta:", error);
      alert("No se pudo crear la alerta");
    }
  };

  const generarAlertas = async () => {
    try {
      const respuesta = await alertaService.generarAutomaticas();
      alert(respuesta);
      cargarAlertas();
    } catch (error) {
      console.error("Error al generar alertas automáticas:", error);
      alert("No se pudieron generar las alertas automáticas");
    }
  };

  const recargarCola = async () => {
    try {
      await alertaService.recargarCola();
      alert("Alertas pendientes actualizadas.");
      cargarAlertas();
    } catch (error) {
      console.error("Error al recargar pendientes:", error);
      alert("No se pudieron recargar las alertas pendientes");
    }
  };

  const procesarSiguiente = async () => {
    try {
      const respuesta = await alertaService.procesarSiguiente();

      if (typeof respuesta === "string") {
        alert("No hay alertas pendientes para procesar.");
      } else {
        alert(`Alerta procesada: ${respuesta.id}`);
      }

      cargarAlertas();
    } catch (error) {
      console.error("Error al procesar alerta:", error);
      alert("No se pudo procesar la siguiente alerta");
    }
  };

  const recargarColaPrioridad = async () => {
    try {
      await alertaService.recargarColaPrioridad();
      alert("Alertas prioritarias actualizadas.");
      cargarAlertas();
    } catch (error) {
      console.error("Error al recargar prioridad:", error);
      alert("No se pudieron recargar las alertas prioritarias");
    }
  };

  const procesarSiguientePrioritaria = async () => {
    try {
      const respuesta = await alertaService.procesarSiguientePrioritaria();

      if (typeof respuesta === "string") {
        alert("No hay alertas prioritarias para procesar.");
      } else {
        alert(
          `Alerta prioritaria procesada: ${respuesta.id} - Nivel: ${respuesta.nivelAtencion}`
        );
      }

      cargarAlertas();
    } catch (error) {
      console.error("Error al procesar alerta prioritaria:", error);
      alert("No se pudo procesar la siguiente alerta prioritaria");
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await alertaService.cambiarEstado(id, estado);
      alert("Estado actualizado correctamente");
      setAlertas((actuales) => actuales.filter((alerta) => alerta.id !== id));
      await cargarAlertas();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado de la alerta");
    }
  };

  const contarPorEstado = (estado) => {
    return alertas.filter(
      (alerta) => (alerta.estado || "").toUpperCase() === estado
    ).length;
  };

  const contarCriticas = () => {
    return alertas.filter((alerta) => {
      const nivel = (alerta.nivelAtencion || "").toUpperCase();
      return nivel === "CRITICO" || nivel === "CRÍTICO";
    }).length;
  };

  const obtenerEstiloNivel = (nivel) => {
    const valor = (nivel || "").toUpperCase();

    if (valor === "CRITICO" || valor === "CRÍTICO") {
      return {
        background: "#3a1218",
        color: "#ffb4ab",
        border: "1px solid #7a2c35",
      };
    }

    if (valor === "ALTO") {
      return {
        background: "#3a2d00",
        color: "#ffd76a",
        border: "1px solid #826300",
      };
    }

    if (valor === "MEDIO") {
      return {
        background: "#3f2a57",
        color: "#d2bbff",
        border: "1px solid #6d5f7a",
      };
    }

    return {
      background: "#12351f",
      color: "#86efac",
      border: "1px solid #225c37",
    };
  };

  const obtenerEstiloEstado = (estado) => {
    const valor = (estado || "").toUpperCase();

    if (valor === "PENDIENTE") {
      return {
        background: "#3a2d00",
        color: "#ffd76a",
        border: "1px solid #826300",
      };
    }

    if (valor === "REVISADA") {
      return {
        background: "#12351f",
        color: "#86efac",
        border: "1px solid #225c37",
      };
    }

    if (valor === "DESCARTADA") {
      return {
        background: "#3a1218",
        color: "#ffb4ab",
        border: "1px solid #7a2c35",
      };
    }

    return {
      background: "#15121b",
      color: "#ccc3d8",
      border: "1px solid #37333e",
    };
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>ATENCIÓN OPERATIVA</p>

          <h1 style={mainTitleStyle}>
            Gestión de <span style={titleAccentStyle}>alertas</span>
          </h1>

          <p style={descriptionStyle}>
            Genera, revisa y atiende alertas operativas según su nivel de
            urgencia y prioridad.
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
          titulo="Total alertas"
          valor={alertas.length}
          texto="Registros cargados"
        />

        <SummaryCard
          icono="⏳"
          titulo="Pendientes"
          valor={contarPorEstado("PENDIENTE")}
          texto="Sin revisar"
        />

        <SummaryCard
          icono="📥"
          titulo="Pendientes generales"
          valor={cantidadCola}
          texto="Pendientes generales"
        />

        <SummaryCard
          icono="⚡"
          titulo="Prioridad"
          valor={cantidadColaPrioridad}
          texto={`${contarCriticas()} críticas`}
          danger
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>NUEVA ALERTA</p>
            <h2 style={titleStyle}>Crear alerta manual</h2>
          </div>

          <span style={modeBadgeStyle}>Registro manual</span>
        </div>

        <form onSubmit={crearAlerta}>
          <div style={formGridStyle}>
            <input
              type="text"
              name="tipo"
              placeholder="Tipo, ejemplo: VISITA_PENDIENTE"
              value={formulario.tipo}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <select
              name="nivelAtencion"
              value={formulario.nivelAtencion}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="BAJO">BAJO</option>
              <option value="MEDIO">MEDIO</option>
              <option value="ALTO">ALTO</option>
              <option value="CRITICO">CRÍTICO</option>
            </select>

            <select
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="REVISADA">REVISADA</option>
              <option value="DESCARTADA">DESCARTADA</option>
            </select>

            <textarea
              name="descripcion"
              placeholder="Descripción de la alerta"
              value={formulario.descripcion}
              onChange={manejarCambio}
              required
              style={textareaStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              Guardar alerta
            </button>

            <button type="button" onClick={limpiarFormulario} style={secondaryButton}>
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>AUTOMATIZACIÓN</p>
            <h2 style={titleStyle}>Acciones automáticas</h2>

            <p style={mutedTextStyle}>
              Procesa alertas pendientes y prioriza los casos más urgentes.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {estadoFiltro}
          </span>
        </div>

        <div style={actionsGridStyle}>
          <button onClick={generarAlertas} style={primaryButton}>
            Generar alertas automáticas
          </button>

          <button onClick={recargarCola} style={secondaryButton}>
            Recargar pendientes
          </button>

          <button onClick={procesarSiguiente} style={secondaryButton}>
            Procesar siguiente
          </button>

          <button onClick={recargarColaPrioridad} style={priorityButton}>
            Recargar alta prioridad
          </button>

          <button onClick={procesarSiguientePrioritaria} style={priorityButton}>
            Procesar alta prioridad
          </button>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            style={inputStyle}
          >
            <option value="PENDIENTE">Pendientes</option>
            <option value="REVISADA">Revisadas</option>
            <option value="DESCARTADA">Descartadas</option>
          </select>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>REGISTROS</p>
            <h2 style={titleStyle}>Listado de alertas</h2>
          </div>

          <button type="button" onClick={cargarAlertas} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando alertas..." />
        ) : alertas.length === 0 ? (
          <EmptyState texto="No hay alertas registradas." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Descripción</th>
                  <th style={thStyle}>Nivel</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {alertas.map((alerta) => (
                  <tr key={alerta.id}>
                    <td style={tdStrongStyle}>{alerta.id}</td>
                    <td style={tdStyle}>{alerta.tipo}</td>
                    <td style={tdDescriptionStyle}>{alerta.descripcion}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloNivel(alerta.nivelAtencion),
                        }}
                      >
                        {alerta.nivelAtencion}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloEstado(alerta.estado),
                        }}
                      >
                        {alerta.estado}
                      </span>
                    </td>

                    <td style={tdStyle}>{alerta.fechaCreacion || "—"}</td>

                    <td style={tdStyle}>
                      {(alerta.estado || "").toUpperCase() === "PENDIENTE" ? (
                        <div style={actionRowStyle}>
                          <button
                            onClick={() => cambiarEstado(alerta.id, "REVISADA")}
                            style={miniSuccessButton}
                          >
                            Revisar
                          </button>

                          <button
                            onClick={() => cambiarEstado(alerta.id, "DESCARTADA")}
                            style={miniDangerButton}
                          >
                            Descartar
                          </button>
                        </div>
                      ) : (
                        <span style={mutedMiniTextStyle}>Sin acciones</span>
                      )}
                    </td>
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

function SummaryCard({ icono, titulo, valor, texto, danger }) {
  return (
    <article
      style={{
        ...summaryCardStyle,
        border: danger ? "1px solid #7a2c35" : "1px solid #37333e",
      }}
    >
      <div
        style={{
          ...summaryIconStyle,
          background: danger ? "#3a1218" : "#3f2a57",
          border: danger ? "1px solid #7a2c35" : "1px solid #6d5f7a",
        }}
      >
        {icono}
      </div>

      <div>
        <p style={summaryTitleStyle}>{titulo}</p>
        <strong style={summaryValueStyle}>{valor}</strong>
        <small style={danger ? dangerTextStyle : summaryTextStyle}>{texto}</small>
      </div>
    </article>
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
  @keyframes fadeUpAlertas {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseAlertas {
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
  animation: "fadeUpAlertas 0.55s ease both",
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
  animation: "pulseAlertas 1.8s ease-in-out infinite",
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

const dangerTextStyle = {
  display: "block",
  color: "#ffb4ab",
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
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: "14px",
  border: "1px solid #37333e",
  outline: "none",
  background: "#15121b",
  color: "#e8dfee",
  fontWeight: "650",
};

const textareaStyle = {
  ...inputStyle,
  gridColumn: "1 / -1",
  minHeight: "90px",
  paddingTop: "12px",
  resize: "vertical",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
};

const actionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "10px",
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
  background: "linear-gradient(135deg, #7f1d1d, #3a1218)",
  color: "#ffb4ab",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 14px 28px rgba(127,29,29,0.22)",
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
  minWidth: "260px",
  lineHeight: 1.45,
};

const pillStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const actionRowStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const mutedMiniTextStyle = {
  color: "#8f849e",
  fontSize: "0.78rem",
  fontWeight: "800",
};

const miniSuccessButton = {
  padding: "8px 12px",
  border: "1px solid #225c37",
  borderRadius: "12px",
  background: "#12351f",
  color: "#86efac",
  fontWeight: "900",
  cursor: "pointer",
};

const miniDangerButton = {
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

export default AlertasPage;
