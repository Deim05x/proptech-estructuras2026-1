import { useCallback, useEffect, useState } from "react";
import contratoService from "../services/contratoService";

function ContratosPage() {
  const [contratos, setContratos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");

  const [formulario, setFormulario] = useState({
    id: "",
    codigoInmueble: "",
    idCliente: "",
    idAsesor: "",
    idOperacion: "",
    tipoContrato: "ARRIENDO",
    fechaInicio: "",
    fechaFin: "",
    valor: "",
    estado: "ACTIVO",
    observacion: "",
  });

  const cargarContratos = useCallback(async () => {
    try {
      setCargando(true);

      const data = filtroEstado
        ? await contratoService.listarPorEstado(filtroEstado)
        : await contratoService.listar();

      setContratos(data || []);
    } catch (error) {
      console.error("Error al cargar contratos:", error);
      alert("No se pudieron cargar los contratos");
    } finally {
      setCargando(false);
    }
  }, [filtroEstado]);

  useEffect(() => {
    cargarContratos();
  }, [cargarContratos]);

  const cargarProximosAVencer = async () => {
    try {
      setCargando(true);
      const data = await contratoService.listarProximosAVencer(30);
      setContratos(data || []);
      setFiltroEstado("PROXIMO_A_VENCER");
    } catch (error) {
      console.error("Error al cargar contratos próximos a vencer:", error);
      alert("No se pudieron cargar los contratos próximos a vencer");
    } finally {
      setCargando(false);
    }
  };

  const cargarVencidos = async () => {
    try {
      setCargando(true);
      const data = await contratoService.listarVencidos();
      setContratos(data || []);
      setFiltroEstado("VENCIDO");
    } catch (error) {
      console.error("Error al cargar contratos vencidos:", error);
      alert("No se pudieron cargar los contratos vencidos");
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
      idOperacion: "",
      tipoContrato: "ARRIENDO",
      fechaInicio: "",
      fechaFin: "",
      valor: "",
      estado: "ACTIVO",
      observacion: "",
    });

    setEditando(false);
  };

  const prepararContrato = () => {
    const contrato = {
      ...formulario,
      valor: Number(formulario.valor),
    };

    if (!editando) {
      delete contrato.id;
    }

    return contrato;
  };

  const guardarContrato = async (e) => {
    e.preventDefault();

    try {
      const contrato = prepararContrato();

      if (editando) {
        await contratoService.actualizar(formulario.id, contrato);
        alert("Contrato actualizado correctamente");
      } else {
        await contratoService.crear(contrato);
        alert("Contrato registrado correctamente");
      }

      limpiarFormulario();
      await cargarContratos();
    } catch (error) {
      console.error("Error al guardar contrato:", error);
      alert(
        error.response?.data ||
          "No se pudo guardar el contrato. Verifica los datos."
      );
    }
  };

  const editarContrato = (contrato) => {
    setFormulario({
      id: contrato.id || "",
      codigoInmueble: contrato.codigoInmueble || "",
      idCliente: contrato.idCliente || "",
      idAsesor: contrato.idAsesor || "",
      idOperacion: contrato.idOperacion || "",
      tipoContrato: contrato.tipoContrato || "ARRIENDO",
      fechaInicio: contrato.fechaInicio || "",
      fechaFin: contrato.fechaFin || "",
      valor: contrato.valor || "",
      estado: contrato.estado || "ACTIVO",
      observacion: contrato.observacion || "",
    });

    setEditando(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarContrato = async (id) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el contrato ${id}?`
    );

    if (!confirmar) return;

    try {
      await contratoService.eliminar(id);
      alert("Contrato eliminado correctamente");
      await cargarContratos();
    } catch (error) {
      console.error("Error al eliminar contrato:", error);
      alert("No se pudo eliminar el contrato");
    }
  };

  const cambiarEstadoRapido = async (id, estado) => {
    try {
      await contratoService.cambiarEstado(id, estado);
      alert("Estado del contrato actualizado correctamente");
      await cargarContratos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado del contrato");
    }
  };

  const formatearDinero = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  const contarPorEstado = (estado) => {
    return contratos.filter(
      (contrato) => (contrato.estado || "").toUpperCase() === estado
    ).length;
  };

  const obtenerEstiloEstado = (estado) => {
    const valor = (estado || "").toUpperCase();

    if (valor === "ACTIVO") {
      return {
        background: "#12351f",
        color: "#86efac",
        border: "1px solid #225c37",
      };
    }

    if (valor === "PROXIMO_A_VENCER") {
      return {
        background: "#3a2d00",
        color: "#ffd76a",
        border: "1px solid #826300",
      };
    }

    if (valor === "VENCIDO" || valor === "CANCELADO") {
      return {
        background: "#3a1218",
        color: "#ffb4ab",
        border: "1px solid #7a2c35",
      };
    }

    if (valor === "FINALIZADO") {
      return {
        background: "#10294f",
        color: "#93c5fd",
        border: "1px solid #1d4ed8",
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
          <p style={eyebrowStyle}>GESTIÓN CONTRACTUAL</p>

          <h1 style={mainTitleStyle}>
            Gestión de <span style={titleAccentStyle}>contratos</span>
          </h1>

          <p style={descriptionStyle}>
            Registra contratos de venta, arriendo o renovación, controla fechas,
            estados, valores y vencimientos próximos dentro del sistema
            HogarXpress.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{contratos.length} contratos</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="📄"
          titulo="Total contratos"
          valor={contratos.length}
          texto="Registros cargados"
        />

        <SummaryCard
          icono="✅"
          titulo="Activos"
          valor={contarPorEstado("ACTIVO")}
          texto="Contratos vigentes"
        />

        <SummaryCard
          icono="⏳"
          titulo="Próximos a vencer"
          valor={contarPorEstado("PROXIMO_A_VENCER")}
          texto="Requieren seguimiento"
        />

        <SummaryCard
          icono="⛔"
          titulo="Vencidos"
          valor={contarPorEstado("VENCIDO")}
          texto="Contratos finalizados por fecha"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>
              {editando ? "EDICIÓN DE CONTRATO" : "NUEVO CONTRATO"}
            </p>

            <h2 style={titleStyle}>
              {editando ? "Editar contrato" : "Registrar contrato"}
            </h2>
          </div>

          {editando && <span style={modeBadgeStyle}>Modo edición</span>}
        </div>

        <form onSubmit={guardarContrato}>
          <div style={formGridStyle}>
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

            <select
              name="tipoContrato"
              value={formulario.tipoContrato}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="ARRIENDO">ARRIENDO</option>
              <option value="VENTA">VENTA</option>
              <option value="RENOVACION">RENOVACIÓN</option>
            </select>

            <input
              type="date"
              name="fechaInicio"
              value={formulario.fechaInicio}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="date"
              name="fechaFin"
              value={formulario.fechaFin}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="valor"
              placeholder="Valor del contrato"
              value={formulario.valor}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <select
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="PROXIMO_A_VENCER">PRÓXIMO A VENCER</option>
              <option value="VENCIDO">VENCIDO</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>

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
              {editando ? "Actualizar contrato" : "Registrar contrato"}
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
            <p style={eyebrowStyle}>FILTROS</p>
            <h2 style={titleStyle}>Consulta contractual</h2>

            <p style={mutedTextStyle}>
              Filtra contratos por estado o consulta vencimientos críticos.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {filtroEstado || "Todos los contratos"}
          </span>
        </div>

        <div style={buttonRowStyle}>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="PROXIMO_A_VENCER">Próximos a vencer</option>
            <option value="VENCIDO">Vencidos</option>
            <option value="CANCELADO">Cancelados</option>
            <option value="FINALIZADO">Finalizados</option>
          </select>

          <button type="button" onClick={cargarContratos} style={primaryButton}>
            Aplicar filtro
          </button>

          <button
            type="button"
            onClick={cargarProximosAVencer}
            style={warningButton}
          >
            Ver próximos a vencer
          </button>

          <button type="button" onClick={cargarVencidos} style={dangerButton}>
            Ver vencidos
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>REGISTROS</p>
            <h2 style={titleStyle}>Listado de contratos</h2>
          </div>

          <button type="button" onClick={cargarContratos} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando contratos..." />
        ) : contratos.length === 0 ? (
          <EmptyState texto="No hay contratos registrados." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Inmueble</th>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Asesor</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Inicio</th>
                  <th style={thStyle}>Fin</th>
                  <th style={thStyle}>Valor</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {contratos.map((contrato) => (
                  <tr key={contrato.id}>
                    <td style={tdStrongStyle}>{contrato.id}</td>
                    <td style={tdStyle}>{contrato.codigoInmueble}</td>
                    <td style={tdStyle}>{contrato.idCliente}</td>
                    <td style={tdStyle}>{contrato.idAsesor}</td>
                    <td style={tdStyle}>{contrato.tipoContrato}</td>
                    <td style={tdStyle}>{contrato.fechaInicio}</td>
                    <td style={tdStyle}>{contrato.fechaFin}</td>
                    <td style={tdStyle}>{formatearDinero(contrato.valor)}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...pillStyle,
                          ...obtenerEstiloEstado(contrato.estado),
                        }}
                      >
                        {contrato.estado}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <div style={actionRowStyle}>
                        <button
                          type="button"
                          onClick={() => editarContrato(contrato)}
                          style={miniButton}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            cambiarEstadoRapido(contrato.id, "FINALIZADO")
                          }
                          style={miniSuccessButton}
                        >
                          Finalizar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            cambiarEstadoRapido(contrato.id, "CANCELADO")
                          }
                          style={miniDangerButton}
                        >
                          Cancelar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarContrato(contrato.id)}
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
      <span style={{ fontSize: "2rem" }}>📄</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpContratos {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseContratos {
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
  animation: "fadeUpContratos 0.55s ease both",
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
  animation: "pulseContratos 1.8s ease-in-out infinite",
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

const warningButton = {
  padding: "11px 16px",
  border: "1px solid #826300",
  borderRadius: "14px",
  background: "#3a2d00",
  color: "#ffd76a",
  fontWeight: "900",
  cursor: "pointer",
};

const dangerButton = {
  padding: "11px 16px",
  border: "1px solid #7a2c35",
  borderRadius: "14px",
  background: "#3a1218",
  color: "#ffb4ab",
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

export default ContratosPage;
