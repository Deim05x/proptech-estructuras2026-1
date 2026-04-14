import { useState } from "react";
import favoritoService from "../services/favoritoService";

function HistorialPage() {
  const [clienteId, setClienteId] = useState("");
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modo, setModo] = useState("normal");

  const cargarHistorial = async (tipo = "normal") => {
    if (!clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
      setCargando(true);
      setModo(tipo);

      const data =
        tipo === "reverso"
          ? await favoritoService.obtenerHistorialReverso(clienteId)
          : await favoritoService.obtenerHistorial(clienteId);

      setHistorial(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      alert("No se pudo cargar el historial");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h1>Historial de Interacciones</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Consultar historial</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="ID del cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
          <button onClick={() => cargarHistorial("normal")}>
            Historial normal
          </button>
          <button onClick={() => cargarHistorial("reverso")}>
            Historial reverso
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          Listado de historial {modo === "reverso" ? "(reverso)" : "(normal)"}
        </h2>

        {cargando ? (
          <p>Cargando historial...</p>
        ) : historial.length === 0 ? (
          <p>No hay historial para mostrar.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Inmueble</th>
                <th>Tipo de interacción</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.idCliente}</td>
                  <td>{item.codigoInmueble}</td>
                  <td>{item.tipoInteraccion}</td>
                  <td>{item.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HistorialPage;