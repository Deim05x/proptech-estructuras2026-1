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

      setEventos(data);
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
    if (valor === "REVISADO" || valor === "REVISADA") return "#166534";
    if (valor === "DESCARTADO" || valor === "DESCARTADA") return "#991b1b";
    return "#4b5563";
  };

  return (
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Eventos inusuales
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Detecta patrones comerciales inusuales como inmuebles con muchas visitas
        sin cierre, clientes sin continuidad, asesores sobrecargados y zonas con
        alta concentración de interés.
      </p>

      <div style={cardsResumenGrid}>
        <CardResumen titulo="Total eventos" valor={eventos.length} />

        <CardResumen
          titulo="Pendientes"
          valor={contarPorEstado("PENDIENTE")}
        />

        <CardResumen titulo="Críticos" valor={contarCriticos()} />

        <div
          style={{
            background: "linear-gradient(135deg, #5b3765, #43214d)",
            borderRadius: "18px",
            padding: "20px",
            color: "white",
            boxShadow: "0 12px 28px rgba(67,33,77,0.18)",
          }}
        >
          <h3 style={{ margin: 0 }}>Análisis automático</h3>
          <p style={{ margin: "10px 0 0" }}>
            El sistema genera eventos y también crea alertas administrativas.
          </p>
        </div>
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Detección automática</h2>

        <p style={{ color: "#4c444d", lineHeight: 1.7 }}>
          Este proceso revisa visitas, inmuebles, asesores y operaciones para
          detectar comportamientos que requieren atención comercial.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Registrar evento manual</h2>

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
              <option value="CRITICO">CRITICO</option>
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
              style={{
                ...inputStyle,
                gridColumn: "1 / -1",
                height: "90px",
                resize: "vertical",
                paddingTop: "12px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button type="submit" style={primaryButton}>
              Guardar evento
            </button>

            <button type="button" onClick={limpiarFormulario} style={secondaryButton}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Listado de eventos inusuales</h2>

        {cargando ? (
          <p>Cargando eventos...</p>
        ) : eventos.length === 0 ? (
          <p>No hay eventos inusuales registrados.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={theadRowStyle}>
                <th>ID</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id}>
                  <td style={tdStyle}>{evento.id}</td>
                  <td style={tdStyle}>{evento.tipo}</td>
                  <td style={tdStyle}>{evento.descripcion}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        backgroundColor: obtenerColorNivel(evento.nivelAtencion),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: "800",
                      }}
                    >
                      {evento.nivelAtencion}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        backgroundColor: obtenerColorEstado(evento.estado),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: "800",
                      }}
                    >
                      {evento.estado}
                    </span>
                  </td>
                  <td style={tdStyle}>{evento.entidadReferencia}</td>
                  <td style={tdStyle}>{evento.fechaDeteccion}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => cambiarEstado(evento.id, "REVISADO")}
                        style={miniButton}
                      >
                        Revisar
                      </button>

                      <button
                        onClick={() => cambiarEstado(evento.id, "DESCARTADO")}
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

      <div style={panelStyle}>
        <h2 style={titleStyle}>Justificación del módulo</h2>

        <p style={{ color: "#4c444d", lineHeight: 1.7 }}>
          Este módulo analiza información de visitas, inmuebles, asesores y
          operaciones para detectar patrones comerciales que requieren
          seguimiento. Cuando se genera un evento inusual automático, también se
          crea una alerta administrativa para que pueda ser procesada en el
          módulo de alertas.
        </p>
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
          fontWeight: "800",
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
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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

export default EventosInusualesPage;