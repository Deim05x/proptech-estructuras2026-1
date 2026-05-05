import { useEffect, useState } from "react";
import alertaService from "../services/alertaService";

function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("TODAS");
  const [cantidadCola, setCantidadCola] = useState(0);
  const [cantidadColaPrioridad, setCantidadColaPrioridad] = useState(0);

  const [formulario, setFormulario] = useState({
    id: "",
    tipo: "",
    descripcion: "",
    nivelAtencion: "MEDIO",
    estado: "PENDIENTE",
  });

  const cargarAlertas = async () => {
    try {
      setCargando(true);

      let data;

      if (estadoFiltro === "TODAS") {
        data = await alertaService.listar();
      } else {
        data = await alertaService.listarPorEstado(estadoFiltro);
      }

      const cantidadNormal = await alertaService.cantidadCola();
      const cantidadPrioridad = await alertaService.cantidadColaPrioridad();

      setAlertas(data);
      setCantidadCola(cantidadNormal);
      setCantidadColaPrioridad(cantidadPrioridad);
    } catch (error) {
      console.error("Error al cargar alertas:", error);
      alert("No se pudieron cargar las alertas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, [estadoFiltro]);

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
      const respuesta = await alertaService.recargarCola();
      alert(respuesta);
      cargarAlertas();
    } catch (error) {
      console.error("Error al recargar cola:", error);
      alert("No se pudo recargar la cola de alertas");
    }
  };

  const procesarSiguiente = async () => {
    try {
      const respuesta = await alertaService.procesarSiguiente();

      if (typeof respuesta === "string") {
        alert(respuesta);
      } else {
        alert(`Alerta procesada por cola normal: ${respuesta.id}`);
      }

      cargarAlertas();
    } catch (error) {
      console.error("Error al procesar alerta:", error);
      alert("No se pudo procesar la siguiente alerta");
    }
  };

  const recargarColaPrioridad = async () => {
    try {
      const respuesta = await alertaService.recargarColaPrioridad();
      alert(respuesta);
      cargarAlertas();
    } catch (error) {
      console.error("Error al recargar cola de prioridad:", error);
      alert("No se pudo recargar la cola de prioridad");
    }
  };

  const procesarSiguientePrioritaria = async () => {
    try {
      const respuesta = await alertaService.procesarSiguientePrioritaria();

      if (typeof respuesta === "string") {
        alert(respuesta);
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
      cargarAlertas();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado de la alerta");
    }
  };

  const obtenerColorNivel = (nivel) => {
    const valor = (nivel || "").toUpperCase();

    if (valor === "CRITICO" || valor === "CRÍTICO") return "#991b1b";
    if (valor === "ALTO") return "#b45309";
    if (valor === "MEDIO") return "#7c3aed";
    return "#166534";
  };

  const obtenerColorEstado = (estado) => {
    const valor = (estado || "").toUpperCase();

    if (valor === "PENDIENTE") return "#b45309";
    if (valor === "REVISADA") return "#166534";
    if (valor === "DESCARTADA") return "#991b1b";
    return "#4b5563";
  };

  return (
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Gestión de Alertas
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Genera, revisa y procesa alertas usando cola normal FIFO y cola de
        prioridad.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <h3 style={cardTitle}>Total alertas</h3>
          <p style={cardNumber}>{alertas.length}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Pendientes FIFO</h3>
          <p style={cardNumber}>{cantidadCola}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Pendientes prioridad</h3>
          <p style={cardNumber}>{cantidadColaPrioridad}</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #5b3765, #43214d)",
            borderRadius: "18px",
            padding: "20px",
            color: "white",
            boxShadow: "0 12px 28px rgba(67,33,77,0.18)",
          }}
        >
          <h3 style={{ margin: 0 }}>Estructuras usadas</h3>
          <p style={{ margin: "10px 0 0" }}>
            Cola FIFO y cola de prioridad para alertas críticas.
          </p>
        </div>
      </div>

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>Crear alerta manual</h2>

        <form onSubmit={crearAlerta}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            <input
              type="text"
              name="id"
              placeholder="ID alerta, ejemplo: AL-001"
              value={formulario.id}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

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
              <option value="CRITICO">CRITICO</option>
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
              style={{
                ...inputStyle,
                gridColumn: "1 / -1",
                height: "90px",
                paddingTop: "12px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button type="submit" style={primaryButton}>
              Guardar alerta
            </button>

            <button type="button" onClick={limpiarFormulario} style={secondaryButton}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>Acciones automáticas</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={generarAlertas} style={primaryButton}>
            Generar alertas automáticas
          </button>

          <button onClick={recargarCola} style={secondaryButton}>
            Recargar cola FIFO
          </button>

          <button onClick={procesarSiguiente} style={secondaryButton}>
            Procesar FIFO
          </button>

          <button onClick={recargarColaPrioridad} style={priorityButton}>
            Recargar cola prioridad
          </button>

          <button onClick={procesarSiguientePrioritaria} style={priorityButton}>
            Procesar prioridad
          </button>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            style={{
              ...inputStyle,
              width: "220px",
            }}
          >
            <option value="TODAS">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="REVISADA">Revisadas</option>
            <option value="DESCARTADA">Descartadas</option>
          </select>
        </div>
      </div>

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>Listado de alertas</h2>

        {cargando ? (
          <p>Cargando alertas...</p>
        ) : alertas.length === 0 ? (
          <p>No hay alertas registradas.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f4ecf0" }}>
                <th>ID</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {alertas.map((alerta) => (
                <tr key={alerta.id}>
                  <td>{alerta.id}</td>
                  <td>{alerta.tipo}</td>
                  <td>{alerta.descripcion}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: obtenerColorNivel(alerta.nivelAtencion),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                      }}
                    >
                      {alerta.nivelAtencion}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor: obtenerColorEstado(alerta.estado),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                      }}
                    >
                      {alerta.estado}
                    </span>
                  </td>
                  <td>{alerta.fechaCreacion}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => cambiarEstado(alerta.id, "REVISADA")}
                        style={miniButton}
                      >
                        Revisar
                      </button>

                      <button
                        onClick={() => cambiarEstado(alerta.id, "DESCARTADA")}
                        style={miniButtonDanger}
                      >
                        Descartar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "rgba(255,255,255,0.86)",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const cardTitle = {
  margin: 0,
  color: "#43214d",
};

const cardNumber = {
  fontSize: "2rem",
  fontWeight: "800",
  margin: "10px 0 0",
  color: "#1e1a1e",
};

const panelStyle = {
  backgroundColor: "rgba(255,255,255,0.88)",
  padding: "22px",
  borderRadius: "18px",
  marginBottom: "24px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
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

const priorityButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #b45309, #991b1b)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const miniButton = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontWeight: "700",
  cursor: "pointer",
};

const miniButtonDanger = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontWeight: "700",
  cursor: "pointer",
};

export default AlertasPage;