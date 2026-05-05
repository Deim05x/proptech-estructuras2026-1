import { useState } from "react";
import recomendacionService from "../services/recomendacionService";
import authService from "../services/authService";

function RecomendacionesPage() {
  const rol = authService.getRol();
  const clienteAutenticado = authService.getClienteId();

  const [clienteId, setClienteId] = useState(
    rol === "CLIENTE" ? clienteAutenticado : ""
  );

  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarRecomendaciones = async () => {
    if (!clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
      setCargando(true);
      const data = await recomendacionService.recomendarPorCliente(clienteId);
      setRecomendaciones(data);
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
      alert("No se pudieron cargar las recomendaciones");
    } finally {
      setCargando(false);
    }
  };

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Recomendaciones de Inmuebles
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Sugerencias calculadas según presupuesto, zona, tipo de inmueble y
        habitaciones deseadas.
      </p>

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>
          Buscar recomendaciones
        </h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="ID del cliente, ejemplo: CLI-001"
            value={clienteId}
            disabled={rol === "CLIENTE"}
            onChange={(e) => setClienteId(e.target.value)}
            style={{
              ...inputStyle,
              maxWidth: "280px",
            }}
          />

          <button onClick={cargarRecomendaciones} style={primaryButton}>
            Generar recomendaciones
          </button>
        </div>
      </div>

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>
          Resultado de recomendaciones
        </h2>

        {cargando ? (
          <p>Cargando recomendaciones...</p>
        ) : recomendaciones.length === 0 ? (
          <p>No hay recomendaciones para mostrar.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {recomendaciones.map((item) => (
              <div
                key={item.inmueble.codigo}
                style={{
                  background: "#fff7fb",
                  border: "1px solid #e8e0e5",
                  borderRadius: "18px",
                  padding: "18px",
                  boxShadow: "0 10px 24px rgba(67,33,77,0.08)",
                }}
              >
                <div
                  style={{
                    height: "110px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #5b3765, #fdbef4)",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "2.5rem",
                  }}
                >
                  🏠
                </div>

                <h3 style={{ margin: "0 0 6px", color: "#43214d" }}>
                  {item.inmueble.tipoInmueble} - {item.inmueble.codigo}
                </h3>

                <p style={{ margin: "0 0 8px", color: "#7e747d" }}>
                  {item.inmueble.direccion}, {item.inmueble.ciudad}
                </p>

                <p style={{ margin: "0 0 8px", fontWeight: "800" }}>
                  {formatearPrecio(item.inmueble.precio)}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  <span style={chipStyle}>{item.inmueble.barrioZona}</span>
                  <span style={chipStyle}>{item.inmueble.habitaciones} hab.</span>
                  <span style={chipStyle}>{item.inmueble.area} m²</span>
                </div>

                <div
                  style={{
                    background: "#fbd7ff",
                    color: "#43214d",
                    padding: "8px 10px",
                    borderRadius: "12px",
                    fontWeight: "800",
                    marginBottom: "10px",
                  }}
                >
                  Puntaje: {item.puntaje}
                </div>

                <p style={{ color: "#4c444d", fontSize: "0.9rem" }}>
                  {item.motivo}
                </p>
              </div>
            ))}
          </div>
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

const chipStyle = {
  background: "#f4ecf0",
  color: "#43214d",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "0.8rem",
  fontWeight: "700",
};

export default RecomendacionesPage;