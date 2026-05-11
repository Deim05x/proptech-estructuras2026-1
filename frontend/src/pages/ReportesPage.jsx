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

      setDatos(data || []);
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

  const obtenerDescripcionReporte = () => {
    if (tipoReporte === "zonas") {
      return "Distribución de inmuebles registrados según zona o ubicación.";
    }

    if (tipoReporte === "precios") {
      return "Agrupación de inmuebles según rangos de precio.";
    }

    if (tipoReporte === "visitas-inmueble") {
      return "Cantidad de visitas registradas por cada inmueble.";
    }

    if (tipoReporte === "visitas-zona") {
      return "Zonas con mayor actividad de visitas comerciales.";
    }

    if (tipoReporte === "cierres-asesor") {
      return "Cierres comerciales acumulados por asesor.";
    }

    if (tipoReporte === "operaciones-tipo") {
      return "Operaciones agrupadas según tipo comercial.";
    }

    return "Reporte administrativo del sistema.";
  };

  const totalCantidadReporte = datos.reduce(
    (total, item) => total + Number(item.cantidad || 0),
    0
  );

  const totalValorReporte = datos.reduce(
    (total, item) => total + Number(item.valorTotal || 0),
    0
  );

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>REPORTERÍA COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Reportes <span style={titleAccentStyle}>comerciales</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta reportes por zona, precio, visitas, cierres y operaciones
            para evaluar el desempeño comercial del negocio y apoyar la toma de
            decisiones administrativas.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{datos.length} filas</span>
        </div>
      </section>

      {resumen && (
        <section style={summaryGridStyle}>
          <CardResumen
            icono="🏘️"
            titulo="Total inmuebles"
            valor={resumen.totalInmuebles}
            texto="Registros del catálogo"
          />

          <CardResumen
            icono="✅"
            titulo="Disponibles"
            valor={resumen.inmueblesDisponibles}
            texto="Inmuebles ofertables"
          />

          <CardResumen
            icono="📅"
            titulo="Total visitas"
            valor={resumen.totalVisitas}
            texto="Actividad comercial"
          />

          <CardResumen
            icono="💼"
            titulo="Operaciones"
            valor={resumen.totalOperaciones}
            texto="Procesos registrados"
          />

          <CardResumen
            icono="🤝"
            titulo="Cierres"
            valor={resumen.operacionesCerradas}
            texto="Operaciones finalizadas"
          />

          <CardResumen
            icono="💰"
            titulo="Valor cierres"
            valor={formatearDinero(resumen.valorTotalCierres)}
            texto="Valor comercial cerrado"
            destacado
          />
        </section>
      )}

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>SELECCIÓN DE REPORTE</p>
            <h2 style={titleStyle}>Tipo de reporte</h2>

            <p style={mutedTextStyle}>
              Selecciona el reporte que deseas consultar. El sistema actualiza
              la tabla según el criterio elegido.
            </p>
          </div>

          <span style={modeBadgeStyle}>{obtenerTituloReporte()}</span>
        </div>

        <div style={controlsRowStyle}>
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

          <button
            onClick={() => {
              cargarResumen();
              cargarReporte(tipoReporte);
            }}
            style={secondaryButton}
          >
            Actualizar todo
          </button>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <CardResumen
          icono="📊"
          titulo="Filas del reporte"
          valor={datos.length}
          texto="Registros encontrados"
        />

        <CardResumen
          icono="🔢"
          titulo="Cantidad total"
          valor={totalCantidadReporte}
          texto="Suma de cantidades"
        />

        <CardResumen
          icono="💵"
          titulo="Valor total"
          valor={formatearDinero(totalValorReporte)}
          texto="Suma del valor total"
          destacado
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>RESULTADO</p>
            <h2 style={titleStyle}>{obtenerTituloReporte()}</h2>

            <p style={mutedTextStyle}>{obtenerDescripcionReporte()}</p>
          </div>

          <span style={filterBadgeStyle}>
            {cargando ? "Cargando" : `${datos.length} registros`}
          </span>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando reporte..." />
        ) : datos.length === 0 ? (
          <EmptyState texto="No hay datos para mostrar." />
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Criterio</th>
                  <th style={thStyle}>Cantidad</th>
                  <th style={thStyle}>Valor total</th>
                </tr>
              </thead>

              <tbody>
                {datos.map((item, index) => (
                  <tr key={`${item.criterio}-${index}`}>
                    <td style={tdStrongStyle}>{item.criterio}</td>
                    <td style={tdStyle}>
                      <span style={quantityBadgeStyle}>{item.cantidad}</span>
                    </td>
                    <td style={tdStyle}>{formatearDinero(item.valorTotal)}</td>
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

function CardResumen({ icono, titulo, valor, texto, destacado }) {
  return (
    <article
      style={{
        ...cardStyle,
        ...(destacado ? highlightedCardStyle : {}),
      }}
    >
      <div
        style={{
          ...summaryIconStyle,
          ...(destacado ? highlightedIconStyle : {}),
        }}
      >
        {icono}
      </div>

      <div>
        <p style={destacado ? summaryTitleLightStyle : summaryTitleStyle}>
          {titulo}
        </p>

        <strong
          style={{
            ...summaryValueStyle,
            fontSize:
              typeof valor === "string" && valor.length > 15
                ? "1.05rem"
                : "1.35rem",
          }}
        >
          {valor ?? 0}
        </strong>

        <small style={destacado ? highlightedTextStyle : summaryTextStyle}>
          {texto}
        </small>
      </div>
    </article>
  );
}

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>📈</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpReportes {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseReportes {
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
  animation: "fadeUpReportes 0.55s ease both",
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
  animation: "pulseReportes 1.8s ease-in-out infinite",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
  marginBottom: "22px",
};

const cardStyle = {
  padding: "16px",
  borderRadius: "22px",
  background: "#2c2833",
  border: "1px solid #37333e",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const highlightedCardStyle = {
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  border: "1px solid #6d5f7a",
  boxShadow: "0 18px 38px rgba(124,58,237,0.24)",
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

const highlightedIconStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.24)",
};

const summaryTitleStyle = {
  margin: "0 0 4px",
  color: "#9f92b2",
  fontSize: "0.72rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

const summaryTitleLightStyle = {
  margin: "0 0 4px",
  color: "#ddd6fe",
  fontSize: "0.72rem",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

const summaryValueStyle = {
  display: "block",
  color: "#ffffff",
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const summaryTextStyle = {
  display: "block",
  color: "#8f849e",
  marginTop: "3px",
};

const highlightedTextStyle = {
  display: "block",
  color: "#ddd6fe",
  marginTop: "5px",
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

const controlsRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
};

const inputStyle = {
  width: "280px",
  maxWidth: "100%",
  padding: "12px 13px",
  borderRadius: "14px",
  border: "1px solid #37333e",
  outline: "none",
  background: "#15121b",
  color: "#e8dfee",
  fontWeight: "650",
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

const quantityBadgeStyle = {
  display: "inline-flex",
  minWidth: "36px",
  height: "30px",
  padding: "0 10px",
  borderRadius: "999px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  color: "#d2bbff",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default ReportesPage;