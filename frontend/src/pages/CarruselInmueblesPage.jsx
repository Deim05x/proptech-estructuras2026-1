import { useEffect, useState } from "react";
import carruselInmuebleService from "../services/CarruselInmuebleService";

function CarruselInmueblesPage() {
  const [inmuebleActual, setInmuebleActual] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [indice, setIndice] = useState(0);
  const [cargando, setCargando] = useState(true);

  const cargarEstadoCarrusel = async () => {
    try {
      setCargando(true);

      const [actual, total, indiceActual] = await Promise.all([
        carruselInmuebleService.obtenerActual(),
        carruselInmuebleService.cantidad(),
        carruselInmuebleService.indice(),
      ]);

      setInmuebleActual(actual);
      setCantidad(total);
      setIndice(indiceActual);
    } catch (error) {
      console.error("Error al cargar inmuebles destacados:", error);
      alert("No se pudieron cargar los inmuebles destacados");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstadoCarrusel();
  }, []);

  const irSiguiente = async () => {
    try {
      const data = await carruselInmuebleService.siguiente();
      setInmuebleActual(data);
      await actualizarMetadatos();
    } catch (error) {
      console.error("Error al avanzar en destacados:", error);
      alert("No se pudo avanzar al siguiente inmueble");
    }
  };

  const irAnterior = async () => {
    try {
      const data = await carruselInmuebleService.anterior();
      setInmuebleActual(data);
      await actualizarMetadatos();
    } catch (error) {
      console.error("Error al retroceder en destacados:", error);
      alert("No se pudo ir al inmueble anterior");
    }
  };

  const reiniciarCarrusel = async () => {
    try {
      await carruselInmuebleService.reiniciar();
      alert("Vista reiniciada correctamente");
      await cargarEstadoCarrusel();
    } catch (error) {
      console.error("Error al reiniciar destacados:", error);
      alert("No se pudo reiniciar la vista");
    }
  };

  const recargarCarrusel = async () => {
    try {
      await carruselInmuebleService.recargar();
      alert("Inmuebles destacados actualizados");
      await cargarEstadoCarrusel();
    } catch (error) {
      console.error("Error al recargar destacados:", error);
      alert("No se pudieron recargar los inmuebles destacados");
    }
  };

  const actualizarMetadatos = async () => {
    try {
      const [total, indiceActual] = await Promise.all([
        carruselInmuebleService.cantidad(),
        carruselInmuebleService.indice(),
      ]);

      setCantidad(total);
      setIndice(indiceActual);
    } catch (error) {
      console.error("Error al actualizar informacion de destacados:", error);
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
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>VITRINA DESTACADA</p>

          <h1 style={mainTitleStyle}>
            Carrusel de <span style={titleAccentStyle}>inmuebles</span>
          </h1>

          <p style={descriptionStyle}>
            Explora inmuebles destacados y navega entre propiedades relevantes
            para revisar rapidamente sus datos comerciales.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{cantidad} inmuebles</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🎠"
          titulo="Cantidad"
          valor={cantidad}
          texto="Inmuebles destacados"
        />

        <SummaryCard
          icono="📍"
          titulo="Posicion actual"
          valor={indice}
          texto="Posición activa"
        />

        <SummaryCard
          icono="🏠"
          titulo="Actual"
          valor={inmuebleActual?.codigo || "—"}
          texto="Inmueble seleccionado"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CONTROLES</p>
            <h2 style={titleStyle}>Navegacion de destacados</h2>
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button onClick={irAnterior} style={secondaryButton}>
            ← Anterior
          </button>

          <button onClick={irSiguiente} style={primaryButton}>
            Siguiente →
          </button>

          <button onClick={reiniciarCarrusel} style={secondaryButton}>
            Reiniciar
          </button>

          <button onClick={recargarCarrusel} style={secondaryButton}>
            Recargar
          </button>
        </div>
      </section>

      <section style={mainGridStyle}>
        <div style={statusPanelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>ESTADO</p>
              <h2 style={titleStyle}>Estado de la vitrina</h2>
            </div>
          </div>

          <InfoRow label="Cantidad de inmuebles" value={cantidad} />
          <InfoRow label="Posicion actual" value={indice} />
          <InfoRow
            label="Estado"
            value={cargando ? "Cargando" : "Sincronizado"}
          />
        </div>

        <div style={propertyPanelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>INMUEBLE ACTUAL</p>
              <h2 style={titleStyle}>Vista activa</h2>
            </div>
          </div>

          {cargando ? (
            <div style={emptyStateStyle}>
              <div style={loadingOrbStyle}></div>
              <p>Cargando inmuebles destacados...</p>
            </div>
          ) : !inmuebleActual ? (
            <div style={emptyStateStyle}>
              <span style={{ fontSize: "2rem" }}>🏠</span>
              <p>No hay inmuebles destacados cargados.</p>
            </div>
          ) : (
            <article style={propertyCardStyle}>
              <div style={imagePlaceholderStyle}>🏡</div>

              <div style={cardTopStyle}>
                <div>
                  <h3 style={cardTitleStyle}>
                    {inmuebleActual.tipoInmueble} · {inmuebleActual.codigo}
                  </h3>

                  <p style={cardLocationStyle}>
                    {inmuebleActual.barrioZona}, {inmuebleActual.ciudad}
                  </p>
                </div>

                <span
                  style={{
                    ...estadoBadgeStyle,
                    background: inmuebleActual.disponible ? "#12351f" : "#3a1218",
                    color: inmuebleActual.disponible ? "#86efac" : "#ffb4ab",
                    border: inmuebleActual.disponible
                      ? "1px solid #225c37"
                      : "1px solid #7a2c35",
                  }}
                >
                  {inmuebleActual.disponible ? "Disponible" : "No disponible"}
                </span>
              </div>

              <p style={priceStyle}>{formatearPrecio(inmuebleActual.precio)}</p>

              <p style={addressStyle}>{inmuebleActual.direccion}</p>

              <div style={detailsGridStyle}>
                <InfoChip label="Ciudad" value={inmuebleActual.ciudad} />
                <InfoChip label="Zona" value={inmuebleActual.barrioZona} />
                <InfoChip label="Finalidad" value={inmuebleActual.finalidad} />
                <InfoChip label="Área" value={`${inmuebleActual.area} m²`} />
                <InfoChip
                  label="Habitaciones"
                  value={inmuebleActual.habitaciones}
                />
                <InfoChip label="Baños" value={inmuebleActual.banos} />
                <InfoChip label="Estado" value={inmuebleActual.estado} />
                <InfoChip
                  label="Asesor"
                  value={inmuebleActual.idAsesorResponsable}
                />
              </div>
            </article>
          )}
        </div>
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

function InfoRow({ label, value }) {
  return (
    <div style={infoRowStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div style={infoChipStyle}>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

const animations = `
  @keyframes fadeUpCarrusel {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseCarrusel {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes loadingFloatCarrusel {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-8px);
    }
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  animation: "fadeUpCarrusel 0.55s ease both",
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
  animation: "pulseCarrusel 1.8s ease-in-out infinite",
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
  fontSize: "1.15rem",
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

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
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

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(260px, 0.7fr) minmax(320px, 1.3fr)",
  gap: "18px",
};

const statusPanelStyle = {
  ...panelStyle,
  marginBottom: 0,
};

const propertyPanelStyle = {
  ...panelStyle,
  marginBottom: 0,
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  padding: "13px",
  borderRadius: "14px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#ccc3d8",
  marginBottom: "10px",
};

const propertyCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.20)",
};

const imagePlaceholderStyle = {
  height: "180px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #3f2a57, #7c3aed)",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "4rem",
  border: "1px solid #6d5f7a",
  boxShadow: "0 0 22px rgba(124,58,237,0.18)",
};

const cardTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "flex-start",
};

const cardTitleStyle = {
  margin: "0 0 6px",
  color: "#ffffff",
  fontSize: "1.1rem",
};

const cardLocationStyle = {
  margin: 0,
  color: "#9f92b2",
};

const estadoBadgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "0.72rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const priceStyle = {
  margin: "14px 0 8px",
  color: "#ffffff",
  fontWeight: "900",
  fontSize: "1.4rem",
};

const addressStyle = {
  margin: "0 0 16px",
  color: "#ccc3d8",
  lineHeight: 1.45,
};

const detailsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "10px",
};

const infoChipStyle = {
  padding: "12px",
  borderRadius: "14px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#d2bbff",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

const loadingOrbStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7c3aed, #d2bbff)",
  boxShadow: "0 0 28px rgba(124,58,237,0.34)",
  animation: "loadingFloatCarrusel 1.8s ease-in-out infinite",
  margin: "0 auto 12px",
};

export default CarruselInmueblesPage;
