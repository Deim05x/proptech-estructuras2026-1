import { useEffect, useState } from "react";
import asesorService from "../services/asesorService";
import { zonasComerciales } from "../utils/formOptions";
import { generarSiguienteCodigo } from "../utils/idGenerator";

function AsesoresPage() {
  const [asesores, setAsesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState("");

  const [formulario, setFormulario] = useState({
    id: "",
    nombre: "",
    contacto: "",
    especialidadZona: "",
    cantidadCierres: "",
  });

  const cargarAsesores = async () => {
    try {
      setCargando(true);
      const data = await asesorService.listar();
      setAsesores(data);
    } catch (error) {
      console.error("Error al cargar asesores:", error);
      console.error("Respuesta del servidor:", error.response);
      alert("Error al cargar los asesores");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAsesores();
  }, []);

  useEffect(() => {
    if (editando) return;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      id: generarSiguienteCodigo(asesores, "ASE", (asesor) => asesor.id),
    }));
  }, [asesores, editando]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      id: generarSiguienteCodigo(asesores, "ASE", (asesor) => asesor.id),
      nombre: "",
      contacto: "",
      especialidadZona: "",
      cantidadCierres: "",
    });
    setEditando(false);
    setIdEditando("");
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const asesor = {
      ...formulario,
      id:
        formulario.id ||
        generarSiguienteCodigo(asesores, "ASE", (item) => item.id),
      cantidadCierres: Number(formulario.cantidadCierres),
    };

    try {
      if (editando) {
        await asesorService.actualizar(idEditando, asesor);
        alert("Asesor actualizado correctamente");
      } else {
        await asesorService.crear(asesor);
        alert("Asesor creado correctamente");
      }

      limpiarFormulario();
      cargarAsesores();
    } catch (error) {
      console.error("Error al guardar asesor:", error);
      alert("No se pudo guardar el asesor");
    }
  };

  const cargarParaEditar = (asesor) => {
    setFormulario({
      id: asesor.id,
      nombre: asesor.nombre,
      contacto: asesor.contacto,
      especialidadZona: asesor.especialidadZona,
      cantidadCierres: asesor.cantidadCierres,
    });

    setIdEditando(asesor.id);
    setEditando(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarAsesor = async (id) => {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar el asesor ${id}?`);
    if (!confirmar) return;

    try {
      await asesorService.eliminar(id);
      alert("Asesor eliminado correctamente");
      cargarAsesores();
    } catch (error) {
      console.error("Error al eliminar asesor:", error);
      alert("No se pudo eliminar el asesor");
    }
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>EQUIPO COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Gestión de <span style={titleAccentStyle}>asesores</span>
          </h1>

          <p style={descriptionStyle}>
            Administra los asesores responsables de la atención comercial,
            sus zonas de especialidad, información de contacto y cantidad de
            cierres realizados.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{asesores.length} asesores</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🧑‍💼"
          titulo="Asesores"
          valor={asesores.length}
          texto="Registros cargados"
        />

        <SummaryCard
          icono="📍"
          titulo="Zonas"
          valor={
            new Set(
              asesores
                .map((asesor) => asesor.especialidadZona)
                .filter((zona) => zona)
            ).size
          }
          texto="Especialidades distintas"
        />

        <SummaryCard
          icono="🤝"
          titulo="Cierres"
          valor={asesores.reduce(
            (total, asesor) => total + Number(asesor.cantidadCierres || 0),
            0
          )}
          texto="Total acumulado"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>
              {editando ? "EDICIÓN DE ASESOR" : "NUEVO ASESOR"}
            </p>

            <h2 style={titleStyle}>
              {editando ? "Editar asesor" : "Agregar asesor"}
            </h2>
          </div>

          {editando && <span style={editBadgeStyle}>Modo edición</span>}
        </div>

        <form onSubmit={manejarSubmit}>
          <div style={formGridStyle}>
            <input
              type="text"
              name="id"
              placeholder="ID generado automaticamente"
              value={formulario.id}
              readOnly
              disabled
              required
              style={{
                ...inputStyle,
                ...disabledInputStyle,
              }}
            />

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="contacto"
              placeholder="Contacto"
              value={formulario.contacto}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <select
              name="especialidadZona"
              value={formulario.especialidadZona}
              onChange={manejarCambio}
              required
              style={inputStyle}
            >
              <option value="">Especialidad de zona</option>
              {zonasComerciales.map((zona) => (
                <option key={zona} value={zona}>
                  {zona}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="cantidadCierres"
              placeholder="Cantidad de cierres"
              value={formulario.cantidadCierres}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              {editando ? "Actualizar asesor" : "Guardar asesor"}
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
            <h2 style={titleStyle}>Listado de asesores</h2>
          </div>

          <button type="button" onClick={cargarAsesores} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando asesores..." />
        ) : asesores.length === 0 ? (
          <EmptyState texto="No hay asesores registrados." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Contacto</th>
                  <th style={thStyle}>Especialidad</th>
                  <th style={thStyle}>Cierres</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {asesores.map((asesor) => (
                  <tr key={asesor.id}>
                    <td style={tdStyle}>{asesor.id}</td>
                    <td style={tdStrongStyle}>{asesor.nombre}</td>
                    <td style={tdStyle}>{asesor.contacto}</td>
                    <td style={tdStyle}>{asesor.especialidadZona}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle}>
                        {asesor.cantidadCierres}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={actionRowStyle}>
                        <button
                          type="button"
                          onClick={() => cargarParaEditar(asesor)}
                          style={smallButton}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarAsesor(asesor.id)}
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
      <span style={{ fontSize: "2rem" }}>🧑‍💼</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpAsesores {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseAsesores {
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
  animation: "fadeUpAsesores 0.55s ease both",
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
  animation: "pulseAsesores 1.8s ease-in-out infinite",
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

const editBadgeStyle = {
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

export default AsesoresPage;
