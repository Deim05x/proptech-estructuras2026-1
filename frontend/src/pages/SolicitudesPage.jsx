import { useEffect, useState } from "react";
import solicitudAtencionService from "../services/solicitudAtencionService";

function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [cantidadCola, setCantidadCola] = useState(0);
  const [cantidadPrioridad, setCantidadPrioridad] = useState(0);

  const [procesamiento, setProcesamiento] = useState({
    idAsesor: "",
    respuesta: "",
  });

  const [formulario, setFormulario] = useState({
    id: "",
    idCliente: "",
    codigoInmueble: "",
    tipoSolicitud: "ATENCION",
    descripcion: "",
    estado: "PENDIENTE",
    prioridad: "MEDIA",
    idAsesorAsignado: "",
    respuesta: "",
  });

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);

      const data = filtroEstado
        ? await solicitudAtencionService.listarPorEstado(filtroEstado)
        : await solicitudAtencionService.listar();

      const cantidadNormal = await solicitudAtencionService.cantidadCola();
      const cantidadPriori = await solicitudAtencionService.cantidadColaPrioridad();

      setSolicitudes(data || []);
      setCantidadCola(cantidadNormal || 0);
      setCantidadPrioridad(cantidadPriori || 0);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      alert("No se pudieron cargar las solicitudes");
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

  const manejarProcesamiento = (e) => {
    const { name, value } = e.target;

    setProcesamiento({
      ...procesamiento,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      id: "",
      idCliente: "",
      codigoInmueble: "",
      tipoSolicitud: "ATENCION",
      descripcion: "",
      estado: "PENDIENTE",
      prioridad: "MEDIA",
      idAsesorAsignado: "",
      respuesta: "",
    });
  };

  const crearSolicitud = async (e) => {
    e.preventDefault();

    try {
      await solicitudAtencionService.crear({
        ...formulario,
        fechaCreacion: null,
        fechaAtencion: null,
      });

      alert("Solicitud registrada correctamente");
      limpiarFormulario();
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      alert(error.response?.data || "No se pudo registrar la solicitud");
    }
  };

  const recargarCola = async () => {
    try {
      await solicitudAtencionService.recargarCola();
      alert("Solicitudes pendientes actualizadas.");
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al recargar pendientes:", error);
      alert("No se pudieron recargar los pendientes");
    }
  };

  const recargarColaPrioridad = async () => {
    try {
      await solicitudAtencionService.recargarColaPrioridad();
      alert("Solicitudes prioritarias actualizadas.");
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al recargar prioridad:", error);
      alert("No se pudieron recargar los casos prioritarios");
    }
  };

  const procesarSiguiente = async () => {
    try {
      const data = await solicitudAtencionService.procesarSiguiente(
        procesamiento.idAsesor,
        procesamiento.respuesta
      );

      alert(`Solicitud procesada: ${data.id}`);
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al procesar solicitud:", error);
      alert(error.response?.data || "No se pudo procesar la solicitud");
    }
  };

  const procesarSiguientePrioritaria = async () => {
    try {
      const data = await solicitudAtencionService.procesarSiguientePrioritaria(
        procesamiento.idAsesor,
        procesamiento.respuesta
      );

      alert(`Solicitud prioritaria procesada: ${data.id}`);
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al procesar solicitud prioritaria:", error);
      alert(error.response?.data || "No se pudo procesar la solicitud prioritaria");
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await solicitudAtencionService.cambiarEstado(id, estado);
      alert("Estado actualizado correctamente");
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado");
    }
  };

  const eliminarSolicitud = async (id) => {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar la solicitud ${id}?`);

    if (!confirmar) return;

    try {
      await solicitudAtencionService.eliminar(id);
      alert("Solicitud eliminada correctamente");
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      alert("No se pudo eliminar la solicitud");
    }
  };

  const contarPorEstado = (estado) => {
    return solicitudes.filter(
      (solicitud) => (solicitud.estado || "").toUpperCase() === estado
    ).length;
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

    if (valor === "EN_ATENCION") {
      return {
        background: "#10294f",
        color: "#93c5fd",
        border: "1px solid #1d4ed8",
      };
    }

    if (valor === "ATENDIDA") {
      return {
        background: "#12351f",
        color: "#86efac",
        border: "1px solid #225c37",
      };
    }

    if (valor === "RECHAZADA" || valor === "CANCELADA") {
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

  const obtenerEstiloPrioridad = (prioridad) => {
    const valor = (prioridad || "").toUpperCase();

    if (valor === "ALTA") {
      return {
        background: "#3a1218",
        color: "#ffb4ab",
        border: "1px solid #7a2c35",
      };
    }

    if (valor === "MEDIA") {
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

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>ATENCIÓN COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Gestión de <span style={titleAccentStyle}>solicitudes</span>
          </h1>

          <p style={descriptionStyle}>
            Administra solicitudes de atención, visitas, compra, arriendo e
            información, priorizando los casos que requieren respuesta urgente.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{solicitudes.length} solicitudes</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="📩"
          titulo="Total"
          valor={solicitudes.length}
          texto="Solicitudes registradas"
        />

        <SummaryCard
          icono="⏳"
          titulo="Pendientes"
          valor={contarPorEstado("PENDIENTE")}
          texto="En espera de atención"
        />

        <SummaryCard
          icono="📥"
          titulo="Pendientes generales"
          valor={cantidadCola}
          texto="Solicitudes por atender"
        />

        <SummaryCard
          icono="⚡"
          titulo="Prioridad"
          valor={cantidadPrioridad}
          texto="Casos urgentes"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>NUEVA SOLICITUD</p>
            <h2 style={titleStyle}>Registrar solicitud manual</h2>
          </div>
        </div>

        <form onSubmit={crearSolicitud}>
          <div style={formGridStyle}>
            <input
              name="id"
              placeholder="ID solicitud, ejemplo: SOL-001"
              value={formulario.id}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              name="idCliente"
              placeholder="ID cliente, ejemplo: CLI-001"
              value={formulario.idCliente}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              name="codigoInmueble"
              placeholder="Código inmueble, ejemplo: INM-001"
              value={formulario.codigoInmueble}
              onChange={manejarCambio}
              style={inputStyle}
            />

            <select
              name="tipoSolicitud"
              value={formulario.tipoSolicitud}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="ATENCION">ATENCIÓN</option>
              <option value="VISITA">VISITA</option>
              <option value="COMPRA">COMPRA</option>
              <option value="ARRIENDO">ARRIENDO</option>
              <option value="INFORMACION">INFORMACIÓN</option>
            </select>

            <select
              name="prioridad"
              value={formulario.prioridad}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="BAJA">BAJA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
            </select>

            <select
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN_ATENCION">EN ATENCIÓN</option>
              <option value="ATENDIDA">ATENDIDA</option>
              <option value="RECHAZADA">RECHAZADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>

            <textarea
              name="descripcion"
              placeholder="Descripción de la solicitud"
              value={formulario.descripcion}
              onChange={manejarCambio}
              required
              style={textareaStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              Registrar solicitud
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
            <p style={eyebrowStyle}>PROCESAMIENTO</p>
            <h2 style={titleStyle}>Atención de solicitudes</h2>

            <p style={mutedTextStyle}>
              Procesa la siguiente solicitud pendiente o atiende primero una de
              alta prioridad.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {filtroEstado || "Todas"}
          </span>
        </div>

        <div style={formGridStyle}>
          <input
            name="idAsesor"
            placeholder="ID asesor asignado, ejemplo: ASE-001"
            value={procesamiento.idAsesor}
            onChange={manejarProcesamiento}
            style={inputStyle}
          />

          <input
            name="respuesta"
            placeholder="Respuesta o nota de atención"
            value={procesamiento.respuesta}
            onChange={manejarProcesamiento}
            style={inputStyle}
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_ATENCION">En atención</option>
            <option value="ATENDIDA">Atendidas</option>
            <option value="RECHAZADA">Rechazadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>

        <div style={buttonRowStyle}>
          <button onClick={cargarSolicitudes} style={primaryButton}>
            Aplicar filtro
          </button>

          <button onClick={recargarCola} style={secondaryButton}>
            Recargar pendientes
          </button>

          <button onClick={procesarSiguiente} style={secondaryButton}>
            Procesar siguiente
          </button>

          <button onClick={recargarColaPrioridad} style={priorityButton}>
            Recargar prioridad
          </button>

          <button onClick={procesarSiguientePrioritaria} style={priorityButton}>
            Procesar prioridad
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>REGISTROS</p>
            <h2 style={titleStyle}>Listado de solicitudes</h2>
          </div>

          <button onClick={cargarSolicitudes} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando solicitudes..." />
        ) : solicitudes.length === 0 ? (
          <EmptyState texto="No hay solicitudes registradas." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Inmueble</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Prioridad</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Asesor</th>
                  <th style={thStyle}>Descripción</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td style={tdStrongStyle}>{solicitud.id}</td>
                    <td style={tdStyle}>{solicitud.idCliente}</td>
                    <td style={tdStyle}>{solicitud.codigoInmueble || "—"}</td>
                    <td style={tdStyle}>{solicitud.tipoSolicitud}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloPrioridad(solicitud.prioridad),
                        }}
                      >
                        {solicitud.prioridad}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloEstado(solicitud.estado),
                        }}
                      >
                        {solicitud.estado}
                      </span>
                    </td>

                    <td style={tdStyle}>{solicitud.idAsesorAsignado || "—"}</td>
                    <td style={tdDescriptionStyle}>{solicitud.descripcion}</td>

                    <td style={tdStyle}>
                      <div style={actionRowStyle}>
                        <button
                          onClick={() => cambiarEstado(solicitud.id, "ATENDIDA")}
                          style={miniSuccessButton}
                        >
                          Atendida
                        </button>

                        <button
                          onClick={() => cambiarEstado(solicitud.id, "RECHAZADA")}
                          style={miniDangerButton}
                        >
                          Rechazar
                        </button>

                        <button
                          onClick={() => eliminarSolicitud(solicitud.id)}
                          style={miniDangerButton}
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
      <span style={{ fontSize: "2rem" }}>📩</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpSolicitudes {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseSolicitudes {
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
  animation: "fadeUpSolicitudes 0.55s ease both",
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
  animation: "pulseSolicitudes 1.8s ease-in-out infinite",
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
  resize: "vertical",
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

const priorityButton = {
  padding: "11px 16px",
  border: "1px solid #7a2c35",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #7f1d1d, #3a1218)",
  color: "#ffb4ab",
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
  minWidth: "240px",
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

export default SolicitudesPage;
