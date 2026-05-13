import { useCallback, useEffect, useState } from "react";
import visitaService from "../services/visitaService";

function VisitasPage() {
  const [visitas, setVisitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [formulario, setFormulario] = useState({
    id: "",
    idCliente: "",
    codigoInmueble: "",
    idAsesor: "",
    fecha: "",
    hora: "",
    estado: "Programada",
    observacion: "",
  });

  const [formularioReprogramar, setFormularioReprogramar] = useState({
    fecha: "",
    hora: "",
    observacion: "",
  });

  const [formularioCancelar, setFormularioCancelar] = useState({
    observacion: "",
  });

  const cargarVisitas = useCallback(async () => {
    try {
      setCargando(true);

      const data = filtroEstado
        ? await visitaService.listarPorEstado(filtroEstado)
        : await visitaService.listar();

      setVisitas(data);
    } catch (error) {
      console.error("Error al cargar visitas:", error);
      alert("Error al cargar las visitas");
    } finally {
      setCargando(false);
    }
  }, [filtroEstado]);

  useEffect(() => {
    cargarVisitas();
  }, [cargarVisitas]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const manejarCambioReprogramar = (e) => {
    const { name, value } = e.target;

    setFormularioReprogramar({
      ...formularioReprogramar,
      [name]: value,
    });
  };

  const manejarCambioCancelar = (e) => {
    const { name, value } = e.target;

    setFormularioCancelar({
      ...formularioCancelar,
      [name]: value,
    });
  };

  const limpiarFormularioPrincipal = () => {
    setFormulario({
      id: "",
      idCliente: "",
      codigoInmueble: "",
      idAsesor: "",
      fecha: "",
      hora: "",
      estado: "Programada",
      observacion: "",
    });

    setEditando(false);
    setIdEditando(null);
    setModoFormulario("crear");
  };

  const limpiarFormularioReprogramar = () => {
    setFormularioReprogramar({
      fecha: "",
      hora: "",
      observacion: "",
    });
  };

  const limpiarFormularioCancelar = () => {
    setFormularioCancelar({
      observacion: "",
    });
  };

  const manejarSubmitPrincipal = async (e) => {
    e.preventDefault();

    const visita = {
      ...formulario,
    };

    if (editando) {
      visita.id = Number(formulario.id);
    } else {
      delete visita.id;
    }

    try {
      if (editando) {
        await visitaService.actualizar(idEditando, visita);
        alert("Visita actualizada correctamente");
      } else if (modoFormulario === "agendar") {
        await visitaService.agendar(visita);
        alert("Visita agendada correctamente");
      } else {
        await visitaService.crear(visita);
        alert("Visita creada correctamente");
      }

      limpiarFormularioPrincipal();
      cargarVisitas();
    } catch (error) {
      console.error("Error al guardar visita:", error);
      alert("No se pudo guardar la visita");
    }
  };

  const cargarParaEditar = (visita) => {
    setFormulario({
      id: visita.id,
      idCliente: visita.idCliente,
      codigoInmueble: visita.codigoInmueble,
      idAsesor: visita.idAsesor,
      fecha: visita.fecha,
      hora: visita.hora,
      estado: visita.estado,
      observacion: visita.observacion || "",
    });

    setIdEditando(visita.id);
    setEditando(true);
    setModoFormulario("editar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prepararAgendar = () => {
    limpiarFormularioPrincipal();
    setModoFormulario("agendar");
  };

  const prepararCrearNormal = () => {
    limpiarFormularioPrincipal();
    setModoFormulario("crear");
  };

  const reprogramarVisita = async (id) => {
    if (!formularioReprogramar.fecha || !formularioReprogramar.hora) {
      alert("Debes ingresar nueva fecha y nueva hora");
      return;
    }

    try {
      await visitaService.reprogramar(id, formularioReprogramar);
      alert("Visita reprogramada correctamente");
      limpiarFormularioReprogramar();
      cargarVisitas();
    } catch (error) {
      console.error("Error al reprogramar visita:", error);
      alert("No se pudo reprogramar la visita");
    }
  };

  const cancelarVisita = async (id) => {
    try {
      await visitaService.cancelar(id, formularioCancelar);
      alert("Visita cancelada correctamente");
      limpiarFormularioCancelar();
      cargarVisitas();
    } catch (error) {
      console.error("Error al cancelar visita:", error);
      alert("No se pudo cancelar la visita");
    }
  };

  const eliminarVisita = async (id) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la visita ${id}?`
    );

    if (!confirmar) return;

    try {
      await visitaService.eliminar(id);
      alert("Visita eliminada correctamente");
      cargarVisitas();
    } catch (error) {
      console.error("Error al eliminar visita:", error);
      alert("No se pudo eliminar la visita");
    }
  };

  const visitasProgramadas = visitas.filter(
    (visita) => (visita.estado || "").toLowerCase() === "programada"
  ).length;

  const visitasReprogramadas = visitas.filter(
    (visita) => (visita.estado || "").toLowerCase() === "reprogramada"
  ).length;

  const visitasCanceladas = visitas.filter(
    (visita) => (visita.estado || "").toLowerCase() === "cancelada"
  ).length;

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>AGENDA COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Gestión de <span style={titleAccentStyle}>visitas</span>
          </h1>

          <p style={descriptionStyle}>
            Administra las visitas entre clientes, inmuebles y asesores. Puedes
            crear, agendar, editar, reprogramar, cancelar, eliminar y filtrar por
            estado.
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
          texto="Visitas cargadas"
        />

        <SummaryCard
          icono="✅"
          titulo="Programadas"
          valor={visitasProgramadas}
          texto="Pendientes de atención"
        />

        <SummaryCard
          icono="🔁"
          titulo="Reprogramadas"
          valor={visitasReprogramadas}
          texto="Con nueva fecha"
        />

        <SummaryCard
          icono="⛔"
          titulo="Canceladas"
          valor={visitasCanceladas}
          texto="No se realizarán"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CONTROL DE VISTA</p>
            <h2 style={titleStyle}>Acciones rápidas y filtros</h2>
          </div>

          <span style={filterBadgeStyle}>
            {filtroEstado ? `Filtro: ${filtroEstado}` : "Todas las visitas"}
          </span>
        </div>

        <div style={buttonRowStyle}>
          <button onClick={prepararCrearNormal} style={secondaryButton}>
            Modo crear
          </button>

          <button onClick={prepararAgendar} style={primaryButton}>
            Modo agendar
          </button>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todas las visitas</option>
            <option value="Programada">Programada</option>
            <option value="Reprogramada">Reprogramada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <button onClick={() => setFiltroEstado("")} style={secondaryButton}>
            Quitar filtro
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>
              {editando
                ? "EDICIÓN DE VISITA"
                : modoFormulario === "agendar"
                ? "AGENDAR VISITA"
                : "NUEVA VISITA"}
            </p>

            <h2 style={titleStyle}>
              {editando
                ? "Editar visita"
                : modoFormulario === "agendar"
                ? "Agendar visita"
                : "Crear visita"}
            </h2>
          </div>

          <span style={modeBadgeStyle}>
            {editando
              ? "Modo edición"
              : modoFormulario === "agendar"
              ? "Modo agendar"
              : "Modo crear"}
          </span>
        </div>

        <form onSubmit={manejarSubmitPrincipal}>
          <div style={formGridStyle}>
            <input
              type="text"
              name="idCliente"
              placeholder="ID cliente"
              value={formulario.idCliente}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="codigoInmueble"
              placeholder="Código inmueble"
              value={formulario.codigoInmueble}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="idAsesor"
              placeholder="ID asesor"
              value={formulario.idAsesor}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="time"
              name="hora"
              value={formulario.hora}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="estado"
              placeholder="Estado"
              value={formulario.estado}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="observacion"
              placeholder="Observación"
              value={formulario.observacion}
              onChange={manejarCambio}
              style={inputStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              {editando
                ? "Actualizar visita"
                : modoFormulario === "agendar"
                ? "Agendar visita"
                : "Guardar visita"}
            </button>

            <button
              type="button"
              onClick={limpiarFormularioPrincipal}
              style={secondaryButton}
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section style={twoColumnsStyle}>
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>REPROGRAMACIÓN</p>
              <h2 style={titleStyle}>Datos para reprogramar</h2>
            </div>
          </div>

          <div style={compactFormGridStyle}>
            <input
              type="date"
              name="fecha"
              value={formularioReprogramar.fecha}
              onChange={manejarCambioReprogramar}
              style={inputStyle}
            />

            <input
              type="time"
              name="hora"
              value={formularioReprogramar.hora}
              onChange={manejarCambioReprogramar}
              style={inputStyle}
            />

            <input
              type="text"
              name="observacion"
              placeholder="Observación de reprogramación"
              value={formularioReprogramar.observacion}
              onChange={manejarCambioReprogramar}
              style={inputStyle}
            />
          </div>

          <p style={helperTextStyle}>
            Usa el botón <strong>Reprogramar</strong> de la tabla para aplicar
            estos datos a una visita específica.
          </p>
        </div>

        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>CANCELACIÓN</p>
              <h2 style={titleStyle}>Motivo de cancelación</h2>
            </div>
          </div>

          <input
            type="text"
            name="observacion"
            placeholder="Motivo de cancelación"
            value={formularioCancelar.observacion}
            onChange={manejarCambioCancelar}
            style={inputStyle}
          />

          <p style={helperTextStyle}>
            Usa el botón <strong>Cancelar</strong> de la tabla para cancelar una
            visita con esta observación.
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>AGENDA</p>
            <h2 style={titleStyle}>Listado de visitas</h2>
          </div>

          <button type="button" onClick={cargarVisitas} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando visitas..." />
        ) : visitas.length === 0 ? (
          <EmptyState texto="No hay visitas registradas." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Inmueble</th>
                  <th style={thStyle}>Asesor</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Hora</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Observación</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {visitas.map((visita) => (
                  <tr key={visita.id}>
                    <td style={tdStrongStyle}>{visita.id}</td>
                    <td style={tdStyle}>{visita.idCliente}</td>
                    <td style={tdStyle}>{visita.codigoInmueble}</td>
                    <td style={tdStyle}>{visita.idAsesor}</td>
                    <td style={tdStyle}>{visita.fecha}</td>
                    <td style={tdStyle}>{visita.hora}</td>
                    <td style={tdStyle}>
                      <span style={getEstadoStyle(visita.estado)}>
                        {visita.estado}
                      </span>
                    </td>
                    <td style={tdStyle}>{visita.observacion || "—"}</td>
                    <td style={tdStyle}>
                      <div style={actionRowStyle}>
                        <button
                          type="button"
                          onClick={() => cargarParaEditar(visita)}
                          style={smallButton}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => reprogramarVisita(visita.id)}
                          style={smallPurpleButton}
                        >
                          Reprogramar
                        </button>

                        <button
                          type="button"
                          onClick={() => cancelarVisita(visita.id)}
                          style={smallWarningButton}
                        >
                          Cancelar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarVisita(visita.id)}
                          style={smallDangerButton}
                        >
                          Eliminar
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

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>📅</span>
      <p>{texto}</p>
    </div>
  );
}

const getEstadoStyle = (estado) => {
  const estadoNormalizado = (estado || "").toLowerCase();

  if (estadoNormalizado === "programada") {
    return {
      ...statusBadgeStyle,
      background: "#12351f",
      border: "1px solid #225c37",
      color: "#86efac",
    };
  }

  if (estadoNormalizado === "reprogramada") {
    return {
      ...statusBadgeStyle,
      background: "#3f2a57",
      border: "1px solid #6d5f7a",
      color: "#d2bbff",
    };
  }

  if (estadoNormalizado === "cancelada") {
    return {
      ...statusBadgeStyle,
      background: "#3a1218",
      border: "1px solid #7a2c35",
      color: "#ffb4ab",
    };
  }

  return statusBadgeStyle;
};

const animations = `
  @keyframes fadeUpVisitas {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseVisitas {
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
  animation: "fadeUpVisitas 0.55s ease both",
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
  animation: "pulseVisitas 1.8s ease-in-out infinite",
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

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "4px",
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

const filterBadgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#d2bbff",
  fontWeight: "900",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const modeBadgeStyle = {
  ...filterBadgeStyle,
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const compactFormGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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

const twoColumnsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
};

const helperTextStyle = {
  color: "#9f92b2",
  lineHeight: 1.55,
  margin: "14px 0 0",
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

const statusBadgeStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  color: "#d2bbff",
  fontSize: "0.75rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const actionRowStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const smallButton = {
  padding: "8px 12px",
  border: "1px solid #225c37",
  borderRadius: "12px",
  background: "#12351f",
  color: "#86efac",
  fontWeight: "900",
  cursor: "pointer",
};

const smallPurpleButton = {
  padding: "8px 12px",
  border: "1px solid #6d5f7a",
  borderRadius: "12px",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
};

const smallWarningButton = {
  padding: "8px 12px",
  border: "1px solid #826300",
  borderRadius: "12px",
  background: "#3a2d00",
  color: "#ffd76a",
  fontWeight: "900",
  cursor: "pointer",
};

const smallDangerButton = {
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

export default VisitasPage;
