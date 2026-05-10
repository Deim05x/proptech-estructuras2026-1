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
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      valor.includes("CANCELADA") ||
      valor.includes("CANCELADO") ||
      valor.includes("DESCARTADA")
    ) {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
    }

    if (
      valor.includes("PROCESO") ||
      valor.includes("PENDIENTE") ||
      valor.includes("NEGOCIACION") ||
      valor.includes("NEGOCIACIÓN")
    ) {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };
    }

    return {
      backgroundColor: "#f4ecf0",
      color: "#43214d",
    };
  };

  const obtenerColorTipo = (tipo) => {
    const valor = (tipo || "").toUpperCase();

    if (valor.includes("VENTA")) {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (valor.includes("ARRIENDO")) {
      return {
        backgroundColor: "#fbd7ff",
        color: "#43214d",
      };
    }

    if (valor.includes("RENOVACION") || valor.includes("RENOVACIÓN")) {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (valor.includes("CANCELACION") || valor.includes("CANCELACIÓN")) {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      backgroundColor: "#f4ecf0",
      color: "#4c444d",
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
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Gestión de Operaciones
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Registra y administra operaciones comerciales como ventas, arriendos,
        renovaciones y cancelaciones.
      </p>

      <div style={cardsResumenGrid}>
        <CardResumen titulo="Total operaciones" valor={totalOperaciones} />

        <CardResumen titulo="Cerradas" valor={operacionesCerradas} />

        <CardResumen titulo="En proceso" valor={operacionesEnProceso} />

        <div
          style={{
            background: "linear-gradient(135deg, #5b3765, #43214d)",
            borderRadius: "18px",
            padding: "20px",
            color: "white",
            boxShadow: "0 12px 28px rgba(67,33,77,0.18)",
          }}
        >
          <h3 style={{ margin: 0 }}>Valor cerrado</h3>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "1.35rem",
              fontWeight: "900",
            }}
          >
            {formatearDinero(valorTotalCerrado)}
          </p>
        </div>
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>
          {editando ? "Editar operación" : "Registrar operación"}
        </h2>

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
                opacity: editando ? 0.75 : 1,
                cursor: editando ? "not-allowed" : "text",
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

          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            <button type="submit" style={primaryButton}>
              {editando ? "Actualizar operación" : "Registrar operación"}
            </button>

            <button
              type="button"
              onClick={limpiarFormulario}
              style={secondaryButton}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2 style={titleStyle}>Listado de operaciones</h2>

            <p style={{ color: "#7e747d", margin: 0 }}>
              Consulta las operaciones comerciales registradas.
            </p>
          </div>

          <button onClick={cargarOperaciones} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <p>Cargando operaciones...</p>
        ) : operaciones.length === 0 ? (
          <p>No hay operaciones registradas.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={theadRowStyle}>
                  <th>ID</th>
                  <th>Inmueble</th>
                  <th>Cliente</th>
                  <th>Asesor</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Comisión</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {operaciones.map((operacion) => {
                  const estadoStyle = obtenerColorEstado(
                    operacion.estadoProceso
                  );

                  const tipoStyle = obtenerColorTipo(operacion.tipoOperacion);

                  return (
                    <tr key={operacion.id}>
                      <td style={tdStyle}>{operacion.id}</td>
                      <td style={tdStyle}>{operacion.codigoInmueble}</td>
                      <td style={tdStyle}>{operacion.idCliente}</td>
                      <td style={tdStyle}>{operacion.idAsesor}</td>
                      <td style={tdStyle}>{operacion.fecha}</td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            ...pillStyle,
                            backgroundColor: tipoStyle.backgroundColor,
                            color: tipoStyle.color,
                          }}
                        >
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
                        <span
                          style={{
                            ...pillStyle,
                            backgroundColor: estadoStyle.backgroundColor,
                            color: estadoStyle.color,
                          }}
                        >
                          {operacion.estadoProceso}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
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
      </div>
    </div>
  );
}

function CardResumen({ titulo, valor }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ margin: 0, color: "#43214d" }}>{titulo}</h3>

      <p
        style={{
          fontSize: "2rem",
          fontWeight: "900",
          margin: "10px 0 0",
          color: "#1e1a1e",
        }}
      >
        {valor}
      </p>
    </div>
  );
}

const cardsResumenGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const panelStyle = {
  backgroundColor: "rgba(255,255,255,0.88)",
  padding: "22px",
  borderRadius: "18px",
  marginBottom: "24px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const cardStyle = {
  background: "rgba(255,255,255,0.86)",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const titleStyle = {
  color: "#43214d",
  marginTop: 0,
  marginBottom: "14px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: "12px",
  border: "1px solid #cfc3cd",
  outline: "none",
  backgroundColor: "#fff7fb",
};

const primaryButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #5b3765, #43214d)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const secondaryButton = {
  padding: "11px 16px",
  border: "1px solid #cfc3cd",
  borderRadius: "12px",
  backgroundColor: "#fbd7ff",
  color: "#43214d",
  fontWeight: "700",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "white",
  borderRadius: "14px",
  overflow: "hidden",
};

const theadRowStyle = {
  backgroundColor: "#f4ecf0",
  color: "#43214d",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #e8e0e5",
  verticalAlign: "top",
};

const pillStyle = {
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "0.78rem",
  fontWeight: "800",
  whiteSpace: "nowrap",
};

const miniButton = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#fbd7ff",
  color: "#43214d",
  fontWeight: "700",
  cursor: "pointer",
};

const miniSuccessButton = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontWeight: "700",
  cursor: "pointer",
};

const miniWarningButton = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  fontWeight: "700",
  cursor: "pointer",
};

const miniDangerButton = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontWeight: "700",
  cursor: "pointer",
};

export default OperacionesPage;
