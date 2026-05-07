import { useEffect, useState } from "react";
import reporteService from "../services/reporteService";

function ReportesPage() {
  const [resumen, setResumen] = useState(null);
  const [datos, setDatos] = useState([]);
  const [tipoReporte, setTipoReporte] = useState("zonas");
  const [cargando, setCargando] = useState(false);

  const cargarResumen = async () => {
    try {
      const data = await reporteService.resumen();
      setResumen(data);
    } catch (error) {
      console.error("Error al cargar resumen:", error);
    }
  };

  const cargarReporte = async (tipo = tipoReporte) => {
    try {
      setCargando(true);

      let data = [];

      if (tipo === "zonas") {
        data = await reporteService.zonas();
      } else if (tipo === "precios") {
        data = await reporteService.precios();
      } else if (tipo === "visitas-inmueble") {
        data = await reporteService.visitasInmueble();
      } else if (tipo === "visitas-zona") {
        data = await reporteService.visitasZona();
      } else if (tipo === "cierres-asesor") {
        data = await reporteService.cierresAsesor();
      } else if (tipo === "operaciones-tipo") {
        data = await reporteService.operacionesTipo();
      }

      setDatos(data);
    } catch (error) {
      console.error("Error al cargar reporte:", error);
      alert("No se pudo cargar el reporte");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarResumen();
    cargarReporte("zonas");
  }, []);

  const cambiarTipoReporte = (e) => {
    const nuevoTipo = e.target.value;
    setTipoReporte(nuevoTipo);
    cargarReporte(nuevoTipo);
  };

  const formatearDinero = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  const obtenerTituloReporte = () => {
    if (tipoReporte === "zonas") return "Inmuebles por zona";
    if (tipoReporte === "precios") return "Inmuebles por rango de precio";
    if (tipoReporte === "visitas-inmueble") return "Visitas por inmueble";
    if (tipoReporte === "visitas-zona") return "Visitas por zona";
    if (tipoReporte === "cierres-asesor") return "Cierres por asesor";
    if (tipoReporte === "operaciones-tipo") return "Operaciones por tipo";
    return "Reporte";
  };

  return (
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Reportes Comerciales
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Consulta reportes por zona, precio, visitas y cierres usando una tabla
        hash propia para conteos y agrupaciones.
      </p>

      {resumen && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <CardResumen titulo="Total inmuebles" valor={resumen.totalInmuebles} />
          <CardResumen titulo="Disponibles" valor={resumen.inmueblesDisponibles} />
          <CardResumen titulo="Total visitas" valor={resumen.totalVisitas} />
          <CardResumen titulo="Operaciones" valor={resumen.totalOperaciones} />
          <CardResumen titulo="Cierres" valor={resumen.operacionesCerradas} />
          <CardResumen
            titulo="Valor cierres"
            valor={formatearDinero(resumen.valorTotalCierres)}
          />
        </div>
      )}

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>Seleccionar reporte</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={tipoReporte}
            onChange={cambiarTipoReporte}
            style={inputStyle}
          >
            <option value="zonas">Inmuebles por zona</option>
            <option value="precios">Inmuebles por precio</option>
            <option value="visitas-inmueble">Visitas por inmueble</option>
            <option value="visitas-zona">Visitas por zona</option>
            <option value="cierres-asesor">Cierres por asesor</option>
            <option value="operaciones-tipo">Operaciones por tipo</option>
          </select>

          <button onClick={() => cargarReporte()} style={primaryButton}>
            Recargar reporte
          </button>
        </div>
      </div>

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>
          {obtenerTituloReporte()}
        </h2>

        {cargando ? (
          <p>Cargando reporte...</p>
        ) : datos.length === 0 ? (
          <p>No hay datos para mostrar.</p>
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
                <th>Criterio</th>
                <th>Cantidad</th>
                <th>Valor total</th>
              </tr>
            </thead>

            <tbody>
              {datos.map((item) => (
                <tr key={item.criterio}>
                  <td>{item.criterio}</td>
                  <td>{item.cantidad}</td>
                  <td>{formatearDinero(item.valorTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={panelStyle}>
        <h2 style={{ color: "#43214d", marginTop: 0 }}>
          Justificación de estructura
        </h2>

        <p style={{ color: "#4c444d", lineHeight: 1.7 }}>
          En este módulo se utiliza una tabla hash propia para agrupar datos por
          criterio, como zona, rango de precio, inmueble, asesor o tipo de
          operación. Esto permite acumular conteos y valores sin usar colecciones
          nativas de Java.
        </p>
      </div>
    </div>
  );
}

function CardResumen({ titulo, valor }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.86)",
        borderRadius: "18px",
        padding: "20px",
        boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
        border: "1px solid #e8e0e5",
      }}
    >
      <h3 style={{ margin: 0, color: "#43214d" }}>{titulo}</h3>
      <p
        style={{
          fontSize: "1.7rem",
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

const panelStyle = {
  backgroundColor: "rgba(255,255,255,0.88)",
  padding: "22px",
  borderRadius: "18px",
  marginBottom: "24px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const inputStyle = {
  width: "260px",
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

export default ReportesPage;