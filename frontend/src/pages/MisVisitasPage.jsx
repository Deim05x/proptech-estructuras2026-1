import { useEffect, useState } from "react";
import visitaService from "../services/visitaService";
import authService from "../services/authService";

function MisVisitasPage() {
  const [visitas, setVisitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const clienteId = authService.getClienteId();

  useEffect(() => {
    cargarMisVisitas();
  }, []);

  const cargarMisVisitas = async () => {
    try {
      setCargando(true);

      const data = await visitaService.listar();

      const visitasCliente = data.filter(
        (visita) =>
          visita.idCliente &&
          clienteId &&
          visita.idCliente.toLowerCase() === clienteId.toLowerCase()
      );

      setVisitas(visitasCliente);
    } catch (error) {
      console.error("Error al cargar mis visitas:", error);
      alert("No se pudieron cargar tus visitas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: "#43214d", marginBottom: "8px" }}>Mis visitas</h2>

      <p style={{ color: "#7e747d", marginBottom: "20px" }}>
        Aquí puedes consultar las visitas asociadas a tu cuenta.
      </p>

      <div style={panelStyle}>
        {cargando ? (
          <p>Cargando visitas...</p>
        ) : visitas.length === 0 ? (
          <p>No tienes visitas registradas.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={theadRowStyle}>
                <th>ID</th>
                <th>Inmueble</th>
                <th>Asesor</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Observaciones</th>
              </tr>
            </thead>

            <tbody>
              {visitas.map((visita) => (
                <tr key={visita.id}>
                  <td style={tdStyle}>{visita.id}</td>
                  <td style={tdStyle}>{visita.codigoInmueble}</td>
                  <td style={tdStyle}>{visita.idAsesor}</td>
                  <td style={tdStyle}>{visita.fecha}</td>
                  <td style={tdStyle}>{visita.hora}</td>
                  <td style={tdStyle}>{visita.estado}</td>
                  <td style={tdStyle}>{visita.observaciones}</td>
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

export default MisVisitasPage;