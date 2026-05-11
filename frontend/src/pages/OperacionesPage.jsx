import { useEffect, useState } from "react";
import operacionService from "../services/operacionService";

function OperacionesPage() {
  const [operaciones, setOperaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState(false);

  const [formulario, setFormulario] = useState({
    id: "",
    codigoInmueble: "",
    idCliente: "",
    idAsesor: "",
    fecha: "",
    tipoOperacion: "VENTA",
    valorAcordado: "",
    comision: "",
    estadoProceso: "EN_PROCESO",
  });

  useEffect(() => {
    cargarOperaciones();
  }, []);

  const cargarOperaciones = async () => {
    try {
      setCargando(true);
      const data = await operacionService.listar();
      setOperaciones(data || []);
    } catch (error) {
      console.error("Error al cargar operaciones:", error);
      alert("No se pudieron cargar las operaciones");
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
      codigoInmueble: "",
      idCliente: "",
      idAsesor: "",
      fecha: "",
      tipoOperacion: "VENTA",
      valorAcordado: "",
      comision: "",
      estadoProceso: "EN_PROCESO",
    });

    setEditando(false);
  };

  const prepararOperacionParaEnviar = () => {
    return {
      ...formulario,
      id: Number(formulario.id),
      valorAcordado: Number(formulario.valorAcordado),
      comision: Number(formulario.comision),
    };
  };

  const guardarOperacion = async (e) => {
    e.preventDefault();

    try {
      const operacion = prepararOperacionParaEnviar();

      if (editando) {
        await operacionService.actualizar(formulario.id, operacion);
        alert("Operación actualizada correctamente");
      } else {
        await operacionService.crear(operacion);
        alert("Operación registrada correctamente");
      }

      limpiarFormulario();
      await cargarOperaciones();
    } catch (error) {
      console.error("Error al guardar operación:", error);
      console.error("Status:", error.response?.status);
      console.error("Respuesta:", error.response?.data);

      alert(
        error.response?.data ||
          "No se pudo guardar la operación. Verifica los datos ingresados."
      );
    }
  };

  const editarOperacion = (operacion) => {
    setFormulario({
      id: operacion.id || "",
      codigoInmueble: operacion.codigoInmueble || "",
      idCliente: operacion.idCliente || "",
      idAsesor: operacion.idAsesor || "",
      fecha: operacion.fecha || "",
      tipoOperacion: operacion.tipoOperacion || "VENTA",
      valorAcordado: operacion.valorAcordado || "",
      comision: operacion.comision || "",
      estadoProceso: operacion.estadoProceso || "EN_PROCESO",
    });

    setEditando(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarOperacion = async (id) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la operación ${id}?`
    );

    if (!confirmar) return;

    try {
      await operacionService.eliminar(id);
      alert("Operación eliminada correctamente");
      await cargarOperaciones();
    } catch (error) {
      console.error("Error al eliminar operación:", error);
      alert("No se pudo eliminar la operación");
    }
  };

  const cambiarEstadoRapido = async (operacion, nuevoEstado) => {
    try {
      const operacionActualizada = {
        ...operacion,
        estadoProceso: nuevoEstado,
      };

      await operacionService.actualizar(operacion.id, operacionActualizada);

      alert("Estado de la operación actualizado correctamente");
      await cargarOperaciones();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo actualizar el estado de la operación");
    }
  };

  const formatearDinero = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  const obtenerColorEstado = (estado) => {
    const valor = (estado || "").toUpperCase();

    if (
      valor.includes("CERRADA") ||
      valor.includes("CERRADO") ||
      valor.includes("FINALIZADA") ||
      valor.includes("COMPLETADA")
    ) {
      return {
        background: "#12351f",
        color: "#86efac",
        border: "1px solid #225c37",
      };
    }

    if (
      valor.includes("CANCELADA") ||
      valor.includes("CANCELADO") ||
      valor.includes("DESCARTADA")
    ) {
      return {
        background: "#3a1218",
        color: "#ffb4ab",
        border: "1px solid #7a2c35",
      };
    }

    if (
      valor.includes("PROCESO") ||
      valor.includes("PENDIENTE") ||
      valor.includes("NEGOCIACION") ||
      valor.includes("NEGOCIACIÓN")
    ) {
      return {
        background: "#3a2d00",
        color: "#ffd76a",
        border: "1px solid #826300",
      };
    }

    return {
      background: "#3f2a57",
      color: "#d2bbff",
      border: "1px solid #6d5f7a",
    };
  };

  const obtenerColorTipo = (tipo) => {
    const valor = (tipo || "").toUpperCase();

    if (valor.includes("VENTA")) {
      return {
        background: "#10294f",
        color: "#93c5fd",
        border: "1px solid #1d4ed8",
      };
    }

    if (valor.includes("ARRIENDO")) {
      return {
        background: "#3f2a57",
        color: "#d2bbff",
        border: "1px solid #6d5f7a",
      };
    }

    if (valor.includes("RENOVACION") || valor.includes("RENOVACIÓN")) {
      return {
        background: "#12351f",
        color: "#86efac",
        border: "1px solid #225c37",
      };
    }

    if (valor.includes("CANCELACION") || valor.includes("CANCELACIÓN")) {
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

  const totalOperaciones = operaciones.length;

  const operacionesCerradas = operaciones.filter((operacion) => {
    const estado = (operacion.estadoProceso || "").toUpperCase();

    return (
      estado.includes("CERRADA") ||
      estado.includes("CERRADO") ||
      estado.includes("FINALIZADA") ||
      estado.includes("COMPLETADA")
    );
  }).length;

  const operacionesEnProceso = operaciones.filter((operacion) => {
    const estado = (operacion.estadoProceso || "").toUpperCase();

    return (
      estado.includes("PROCESO") ||
      estado.includes("PENDIENTE") ||
      estado.includes("NEGOCIACION") ||
      estado.includes("NEGOCIACIÓN")
    );
  }).length;

  const valorTotalCerrado = operaciones.reduce((total, operacion) => {
    const estado = (operacion.estadoProceso || "").toUpperCase();

    const cerrada =
      estado.includes("CERRADA") ||
      estado.includes("CERRADO") ||
      estado.includes("FINALIZADA") ||
      estado.includes("COMPLETADA");

    if (cerrada) {
      return total + Number(operacion.valorAcordado || 0);
    }

    return total;
  }, 0);

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>GESTIÓN COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Gestión de <span style={titleAccentStyle}>operaciones</span>
          </h1>

          <p style={descriptionStyle}>
            Registra y administra operaciones comerciales como ventas,
            arriendos, renovaciones y cancelaciones. Controla estados, valores,
            comisiones y responsables del proceso.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{operaciones.length} operaciones</span>
        </div>
      </section>

      <section style={cardsResumenGrid}>
        <CardResumen
          icono="💼"
          titulo="Total operaciones"
          valor={totalOperaciones}
          texto="Registros comerciales"
        />

        <CardResumen
          icono="✅"
          titulo="Cerradas"
          valor={operacionesCerradas}
          texto="Procesos finalizados"
        />

        <CardResumen
          icono="⏳"
          titulo="En proceso"
          valor={operacionesEnProceso}
          texto="Pendientes o negociación"
        />

        <div style={valorCardStyle}>
          <div style={valorIconStyle}>💰</div>

          <div>
            <p style={summaryTitleStyle}>Valor cerrado</p>

            <strong style={valorTotalStyle}>
              {formatearDinero(valorTotalCerrado)}
            </strong>

            <small style={summaryTextStyle}>Total de operaciones cerradas</small>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>
              {editando ? "EDICIÓN DE OPERACIÓN" : "NUEVA OPERACIÓN"}
            </p>

            <h2 style={titleStyle}>
              {editando ? "Editar operación" : "Registrar operación"}
            </h2>
          </div>

          {editando && <span style={modeBadgeStyle}>Modo edición</span>}
        </div>

        <form onSubmit={guardarOperacion}>
          <div style={formGridStyle}>
            <input
              type="number"
              name="id"
              placeholder="ID operación, ejemplo: 1"
              value={formulario.id}
              onChange={manejarCambio}
              disabled={editando}
              required
              style={{
                ...inputStyle,
                ...(editando ? disabledInputStyle : {}),
              }}
            />

            <input
              type="text"
              name="codigoInmueble"
              placeholder="Código inmueble, ejemplo: INM-001"
              value={formulario.codigoInmueble}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="idCliente"
              placeholder="ID cliente, ejemplo: CLI-001"
              value={formulario.idCliente}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="idAsesor"
              placeholder="ID asesor, ejemplo: ASE-001"
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

            <select
              name="tipoOperacion"
              value={formulario.tipoOperacion}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="VENTA">VENTA</option>
              <option value="ARRIENDO">ARRIENDO</option>
              <option value="RENOVACION">RENOVACIÓN</option>
              <option value="CANCELACION">CANCELACIÓN</option>
            </select>

            <input
              type="number"
              name="valorAcordado"
              placeholder="Valor acordado"
              value={formulario.valorAcordado}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="comision"
              placeholder="Comisión"
              value={formulario.comision}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <select
              name="estadoProceso"
              value={formulario.estadoProceso}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="EN_PROCESO">EN PROCESO</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="NEGOCIACION">NEGOCIACIÓN</option>
              <option value="CERRADA">CERRADA</option>
              <option value="FINALIZADA">FINALIZADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              {editando ? "Actualizar operación" : "Registrar operación"}
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
            <h2 style={titleStyle}>Listado de operaciones</h2>

            <p style={mutedTextStyle}>
              Consulta las operaciones comerciales registradas y cambia su estado
              rápidamente.
            </p>
          </div>

          <button onClick={cargarOperaciones} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando operaciones..." />
        ) : operaciones.length === 0 ? (
          <EmptyState texto="No hay operaciones registradas." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Inmueble</th>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Asesor</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Valor</th>
                  <th style={thStyle}>Comisión</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {operaciones.map((operacion) => {
                  const estadoStyle = obtenerColorEstado(operacion.estadoProceso);
                  const tipoStyle = obtenerColorTipo(operacion.tipoOperacion);

                  return (
                    <tr key={operacion.id}>
                      <td style={tdStrongStyle}>{operacion.id}</td>
                      <td style={tdStyle}>{operacion.codigoInmueble}</td>
                      <td style={tdStyle}>{operacion.idCliente}</td>
                      <td style={tdStyle}>{operacion.idAsesor}</td>
                      <td style={tdStyle}>{operacion.fecha}</td>

                      <td style={tdStyle}>
                        <span style={{ ...pillStyle, ...tipoStyle }}>
                          {operacion.tipoOperacion}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {formatearDinero(operacion.valorAcordado)}
                      </td>

                      <td style={tdStyle}>
                        {formatearDinero(operacion.comision)}
                      </td>

                      <td style={tdStyle}>
                        <span style={{ ...pillStyle, ...estadoStyle }}>
                          {operacion.estadoProceso}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div style={actionRowStyle}>
                          <button
                            type="button"
                            onClick={() => editarOperacion(operacion)}
                            style={miniButton}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              cambiarEstadoRapido(operacion, "CERRADA")
                            }
                            style={miniSuccessButton}
                          >
                            Cerrar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              cambiarEstadoRapido(operacion, "CANCELADA")
                            }
                            style={miniWarningButton}
                          >
                            Cancelar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarOperacion(operacion.id)}
                            style={miniDangerButton}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function CardResumen({ icono, titulo, valor, texto }) {
  return (
    <article style={cardStyle}>
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
      <span style={{ fontSize: "2rem" }}>💼</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpOperaciones {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseOperaciones {
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
  animation: "fadeUpOperaciones 0.55s ease both",
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
  animation: "pulseOperaciones 1.8s ease-in-out infinite",
};

const cardsResumenGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const cardStyle = {
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

const valorCardStyle = {
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

const valorIconStyle = {
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

const valorTotalStyle = {
  display: "block",
  color: "#ffffff",
  fontSize: "1.15rem",
  lineHeight: 1.1,
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

const disabledInputStyle = {
  opacity: 0.65,
  cursor: "not-allowed",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
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

const miniButton = {
  padding: "8px 12px",
  border: "1px solid #6d5f7a",
  borderRadius: "12px",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
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

const miniWarningButton = {
  padding: "8px 12px",
  border: "1px solid #826300",
  borderRadius: "12px",
  background: "#3a2d00",
  color: "#ffd76a",
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

export default OperacionesPage;