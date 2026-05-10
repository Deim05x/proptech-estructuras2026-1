import { useEffect, useState } from "react";
import historialService from "../services/historialService";
import authService from "../services/authService";

function HistorialPage() {
  const rol = authService.getRol();
  const clienteAutenticado = authService.getClienteId();

  const [clienteId, setClienteId] = useState(
    rol === "CLIENTE" ? clienteAutenticado || "" : ""
  );

  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modoReverso, setModoReverso] = useState(false);

  const [formulario, setFormulario] = useState({
    codigoInmueble: "",
    tipoInteraccion: "CONSULTADO",
    descripcion: "",
  });

  useEffect(() => {
    if (rol === "CLIENTE" && clienteId) {
      cargarHistorial();
    }
  }, []);

  const cargarHistorial = async () => {
    if (!clienteId || !clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
      setCargando(true);

      const data = modoReverso
        ? await historialService.listarReversoPorCliente(clienteId)
        : await historialService.listarPorCliente(clienteId);

      setHistorial(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      alert("No se pudo cargar el historial");
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
      codigoInmueble: "",
      tipoInteraccion: "CONSULTADO",
      descripcion: "",
    });
  };

  const registrarInteraccion = async (e) => {
    e.preventDefault();

    if (!clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
     await historialService.crear({
  idCliente: clienteId,
  codigoInmueble: formulario.codigoInmueble,
  tipoInteraccion: formulario.tipoInteraccion,
});

      alert("Interacción registrada correctamente");
      limpiarFormulario();
      await cargarHistorial();
    } catch (error) {
      console.error("Error al registrar interacción:", error);
      alert("No se pudo registrar la interacción");
    }
  };

  const cambiarModo = async () => {
    setModoReverso(!modoReverso);
  };

  useEffect(() => {
    if (clienteId) {
      cargarHistorial();
    }
  }, [modoReverso]);

  return (
    <div>
      <h2 style={{ color: "#43214d", marginBottom: "8px" }}>Mi historial</h2>

      <p style={{ color: "#7e747d", marginBottom: "20px" }}>
        Consulta el historial de interacción del cliente con los inmuebles.
      </p>

      <div style={panelStyle}>
        <h3 style={titleStyle}>Buscar historial</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="ID del cliente"
            value={clienteId}
            disabled={rol === "CLIENTE"}
            onChange={(e) => setClienteId(e.target.value)}
            style={{
              ...inputStyle,
              maxWidth: "260px",
              opacity: rol === "CLIENTE" ? 0.75 : 1,
              cursor: rol === "CLIENTE" ? "not-allowed" : "text",
            }}
          />

          <button onClick={cargarHistorial} style={primaryButton}>
            Cargar historial
          </button>

          <button onClick={cambiarModo} style={secondaryButton}>
            {modoReverso ? "Ver actividad reciente" : "Ver actividad anterior"}
          </button>
        </div>
      </div>

      <div style={panelStyle}>
        <h3 style={titleStyle}>Registrar interacción</h3>

        <form onSubmit={registrarInteraccion}>
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

            <select
              name="tipoInteraccion"
              value={formulario.tipoInteraccion}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="CONSULTADO">CONSULTADO</option>
              <option value="VISITADO">VISITADO</option>
              <option value="GUARDADO">GUARDADO</option>
              <option value="DESCARTADO">DESCARTADO</option>
              <option value="NEGOCIADO">NEGOCIADO</option>
            </select>

            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={formulario.descripcion}
              onChange={manejarCambio}
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: "14px" }}>
            <button type="submit" style={primaryButton}>
              Registrar interacción
            </button>
          </div>
        </form>
      </div>

      <div style={panelStyle}>
        <h3 style={titleStyle}>
          Historial de actividad
        </h3>

        {cargando ? (
          <p>Cargando historial...</p>
        ) : historial.length === 0 ? (
          <p>No hay historial registrado.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={theadRowStyle}>
                <th>Cliente</th>
                <th>Inmueble</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {historial.map((item, index) => (
                <tr key={`${item.codigoInmueble}-${index}`}>
                  <td style={tdStyle}>{item.idCliente || clienteId}</td>
                  <td style={tdStyle}>{item.codigoInmueble}</td>
                  <td style={tdStyle}>{item.tipoInteraccion}</td>
                  <td style={tdStyle}>{item.descripcion}</td>
                  <td style={tdStyle}>{item.fecha || item.fechaInteraccion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const panelStyle = {
  backgroundColor: "rgba(255,255,255,0.88)",
  padding: "22px",
  borderRadius: "18px",
  marginBottom: "24px",
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
};

export default HistorialPage;
