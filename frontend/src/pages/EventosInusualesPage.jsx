import { useEffect, useState } from "react";
import eventoInusualService from "../services/eventoInusualService";

function EventosInusualesPage() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  const [formulario, setFormulario] = useState({
    id: "",
    tipo: "",
    descripcion: "",
    nivelAtencion: "MEDIO",
    estado: "PENDIENTE",
    entidadReferencia: "",
  });

  useEffect(() => {
    cargarEventos();
  }, [estadoFiltro]);

  const cargarEventos = async () => {
    try {
      setCargando(true);

      let data;

      if (estadoFiltro === "TODOS") {
        data = await eventoInusualService.listar();
      } else {
        data = await eventoInusualService.listarPorEstado(estadoFiltro);
      }

      setEventos(data || []);
    } catch (error) {
      console.error("Error al cargar eventos inusuales:", error);
      alert("No se pudieron cargar los eventos inusuales");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      id: "",
      tipo: "",
      descripcion: "",
      nivelAtencion: "MEDIO",
      estado: "PENDIENTE",
      entidadReferencia: "",
    });
  };

  const detectarEventos = async () => {
    try {
      const respuesta = await eventoInusualService.detectarAutomaticamente();
      alert(respuesta);
      await cargarEventos();
    } catch (error) {
      console.error("Error al detectar eventos inusuales:", error);
      alert("No se pudieron detectar eventos inusuales");
    }
  };

  const crearEventoManual = async (e) => {
    e.preventDefault();

    try {
      await eventoInusualService.crearManual({
        ...formulario,
        fechaDeteccion: null,
      });

      alert("Evento inusual registrado correctamente");
      limpiarFormulario();
      await cargarEventos();
    } catch (error) {
      console.error("Error al crear evento inusual:", error);
      alert("No se pudo registrar el evento inusual");
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await eventoInusualService.cambiarEstado(id, estado);
      alert("Estado actualizado correctamente");
      await cargarEventos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo actualizar el estado del evento");
    }
  };

  const contarPorEstado = (estado) => {
    return eventos.filter(
      (evento) => (evento.estado || "").toUpperCase() === estado
    ).length;
  };

  const contarCriticos = () => {
    return eventos.filter((evento) => {
      const nivel = (evento.nivelAtencion || "").toUpperCase();
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

    if (valor === "REVISADO" || valor === "REVISADA") {
      return {
        background: "#12351f",
        color: "#86efac",
        border: "1px solid #225c37",
      };
    }

    if (valor === "DESCARTADO" || valor === "DESCARTADA") {
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
          <p style={eyebrowStyle}>ANÁLISIS DE COMPORTAMIENTO</p>

          <h1 style={mainTitleStyle}>
            Eventos <span style={titleAccentStyle}>inusuales</span>
          </h1>

          <p style={descriptionStyle}>
            Detecta patrones comerciales inusuales como inmuebles con muchas
            visitas sin cierre, clientes sin continuidad, asesores sobrecargados
            y zonas con alta concentración de interés.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{eventos.length} eventos</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="📊"
          titulo="Total eventos"
          valor={eventos.length}
          texto="Registros cargados"
        />

        <SummaryCard
          icono="⏳"
          titulo="Pendientes"
          valor={contarPorEstado("PENDIENTE")}
          texto="Sin revisar"
        />

        <SummaryCard
          icono="🔥"
          titulo="Críticos"
          valor={contarCriticos()}
          texto="Requieren atención"
          danger
        />

        <div style={analysisCardStyle}>
          <div style={analysisIconStyle}>🧠</div>

          <div>
            <p style={summaryTitleLightStyle}>Análisis automático</p>

            <strong style={analysisTitleStyle}>Detección activa</strong>

            <small style={analysisTextStyle}>
              El sistema genera eventos y alertas administrativas.
            </small>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>DETECCIÓN AUTOMÁTICA</p>
            <h2 style={titleStyle}>Motor de análisis</h2>

            <p style={mutedTextStyle}>
              Este proceso revisa visitas, inmuebles, asesores y operaciones
              para detectar comportamientos que requieren atención comercial.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {estadoFiltro === "TODOS" ? "Todos" : estadoFiltro}
          </span>
        </div>

        <div style={actionsGridStyle}>
          <button onClick={detectarEventos} style={primaryButton}>
            Detectar eventos inusuales
          </button>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            style={inputStyle}
          >
            <option value="TODOS">Todos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="REVISADO">Revisados</option>
            <option value="DESCARTADO">Descartados</option>
          </select>

          <button onClick={cargarEventos} style={secondaryButton}>
            Recargar
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>REGISTRO MANUAL</p>
            <h2 style={titleStyle}>Registrar evento inusual</h2>
          </div>

          <span style={modeBadgeStyle}>Evento manual</span>
        </div>

        <form onSubmit={crearEventoManual}>
          <div style={formGridStyle}>
            <input
              type="text"
              name="id"
              placeholder="ID, ejemplo: EV-MANUAL-001"
              value={formulario.id}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="tipo"
              placeholder="Tipo, ejemplo: ASESOR_SOBRECARGADO"
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
              <option value="REVISADO">REVISADO</option>
              <option value="DESCARTADO">DESCARTADO</option>
            </select>

            <input
              type="text"
              name="entidadReferencia"
              placeholder="Entidad referencia, ejemplo: INM-001 o CLI-001"
              value={formulario.entidadReferencia}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <textarea
              name="descripcion"
              placeholder="Descripción del evento inusual"
              value={formulario.descripcion}
              onChange={manejarCambio}
              required
              style={textareaStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              Guardar evento
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
            <p style={eyebrowStyle}>REGISTROS</p>
            <h2 style={titleStyle}>Listado de eventos inusuales</h2>
          </div>

          <button type="button" onClick={cargarEventos} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando eventos..." />
        ) : eventos.length === 0 ? (
          <EmptyState texto="No hay eventos inusuales registrados." />
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
                  <th style={thStyle}>Referencia</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento.id}>
                    <td style={tdStrongStyle}>{evento.id}</td>
                    <td style={tdStyle}>{evento.tipo}</td>
                    <td style={tdDescriptionStyle}>{evento.descripcion}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloNivel(evento.nivelAtencion),
                        }}
                      >
                        {evento.nivelAtencion}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloEstado(evento.estado),
                        }}
                      >
                        {evento.estado}
                      </span>
                    </td>

                    <td style={tdStyle}>{evento.entidadReferencia || "—"}</td>
                    <td style={tdStyle}>{evento.fechaDeteccion || "—"}</td>

                    <td style={tdStyle}>
                      <div style={actionRowStyle}>
                        <button
                          onClick={() => cambiarEstado(evento.id, "REVISADO")}
                          style={miniSuccessButton}
                        >
                          Revisar
                        </button>

                        <button
                          onClick={() => cambiarEstado(evento.id, "DESCARTADO")}
                          style={miniDangerButton}
                        >
                          Descartar
                        </button>
                      </div>
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
      <span style={{ fontSize: "2rem" }}>📊</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpEventos {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseEventos {
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
  animation: "fadeUpEventos 0.55s ease both",
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
  animation: "pulseEventos 1.8s ease-in-out infinite",
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

const summaryTitleLightStyle = {
  margin: "0 0 4px",
  color: "#ddd6fe",
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

const analysisCardStyle = {
  padding: "16px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  border: "1px solid #6d5f7a",
  boxShadow: "0 18px 38px rgba(124,58,237,0.24)",
  display: "flex",
  alignItems: "center",
  gap: "13px",
  color: "#ffffff",
};

const analysisIconStyle = {
  width: "46px",
  height: "46px",
  minWidth: "46px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.24)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.35rem",
};

const analysisTitleStyle = {
  display: "block",
  color: "#ffffff",
  fontSize: "1.05rem",
  lineHeight: 1.1,
};

const analysisTextStyle = {
  display: "block",
  color: "#ddd6fe",
  marginTop: "5px",
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

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const actionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "10px",
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
  resize: "vertical",
  paddingTop: "12px",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
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

export default EventosInusualesPage;