import { useEffect, useState } from "react";
import rotacionAsesorService from "../services/rotacionAsesorService";

function RotacionAsesoresPage() {
  const [rueda, setRueda] = useState([]);
  const [asesorActual, setAsesorActual] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [cargando, setCargando] = useState(true);

  const cargarEstadoRotacion = async () => {
    try {
      setCargando(true);

      const [ruedaData, actualData, cantidadData] = await Promise.all([
        rotacionAsesorService.obtenerRueda(),
        rotacionAsesorService.obtenerActual(),
        rotacionAsesorService.cantidad(),
      ]);

      setRueda(ruedaData);
      setAsesorActual(actualData);
      setCantidad(cantidadData);
    } catch (error) {
      console.error("Error al cargar rotación de asesores:", error);
      alert("No se pudo cargar la rotación de asesores");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstadoRotacion();
  }, []);

  const obtenerSiguiente = async () => {
    try {
      const data = await rotacionAsesorService.obtenerSiguiente();
      setAsesorActual(data);
      const cantidadData = await rotacionAsesorService.cantidad();
      setCantidad(cantidadData);
    } catch (error) {
      console.error("Error al obtener siguiente asesor:", error);
      alert("No se pudo obtener el siguiente asesor");
    }
  };

  const reiniciarRotacion = async () => {
    try {
      await rotacionAsesorService.reiniciar();
      alert("Rotación reiniciada correctamente");
      cargarEstadoRotacion();
    } catch (error) {
      console.error("Error al reiniciar rotación:", error);
      alert("No se pudo reiniciar la rotación");
    }
  };

  const recargarRueda = async () => {
    try {
      await rotacionAsesorService.recargar();
      alert("Rueda recargada correctamente");
      cargarEstadoRotacion();
    } catch (error) {
      console.error("Error al recargar rueda:", error);
      alert("No se pudo recargar la rueda de asesores");
    }
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>ASIGNACIÓN COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Rotación de <span style={titleAccentStyle}>asesores</span>
          </h1>

          <p style={descriptionStyle}>
            Gestiona la rueda de atención comercial, consulta el turno activo y
            mantén equilibrada la asignación de asesores.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{cantidad} asesores</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🔁"
          titulo="Rueda"
          valor={cantidad}
          texto="Asesores en rotación"
        />

        <SummaryCard
          icono="🧑‍💼"
          titulo="Actual"
          valor={asesorActual?.id || "—"}
          texto="Asesor activo"
        />

        <SummaryCard
          icono="🤝"
          titulo="Cierres"
          valor={asesorActual?.cantidadCierres ?? "—"}
          texto="Cierres del asesor actual"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CONTROLES</p>
            <h2 style={titleStyle}>Navegación de la rueda</h2>
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button onClick={obtenerSiguiente} style={primaryButton}>
            Siguiente asesor
          </button>

          <button onClick={reiniciarRotacion} style={secondaryButton}>
            Reiniciar rotación
          </button>

          <button onClick={recargarRueda} style={secondaryButton}>
            Recargar rueda
          </button>
        </div>
      </section>

      <section style={mainGridStyle}>
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>ESTADO</p>
              <h2 style={titleStyle}>Estado de la rotación</h2>
            </div>
          </div>

          <InfoRow label="Cantidad de asesores" value={cantidad} />
          <InfoRow
            label="Estado"
            value={cargando ? "Cargando" : "Sincronizado"}
          />
          <InfoRow
            label="Asignación"
            value="Rotación activa"
          />
        </div>

        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>ASESOR ACTUAL</p>
              <h2 style={titleStyle}>Turno activo</h2>
            </div>
          </div>

          {cargando ? (
            <EmptyState texto="Cargando asesor actual..." />
          ) : !asesorActual ? (
            <EmptyState texto="No hay asesores cargados en la rueda." />
          ) : (
            <article style={asesorCardStyle}>
              <div style={avatarStyle}>
                {(asesorActual.nombre || "A").charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 style={asesorNameStyle}>{asesorActual.nombre}</h3>
                <p style={asesorSubtitleStyle}>{asesorActual.id}</p>
              </div>

              <div style={detailsGridStyle}>
                <InfoChip label="Contacto" value={asesorActual.contacto} />
                <InfoChip
                  label="Especialidad"
                  value={asesorActual.especialidadZona}
                />
                <InfoChip
                  label="Cantidad de cierres"
                  value={asesorActual.cantidadCierres}
                />
              </div>
            </article>
          )}
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>RUEDA COMPLETA</p>
            <h2 style={titleStyle}>Asesores en rotación</h2>
          </div>

          <button type="button" onClick={cargarEstadoRotacion} style={secondaryButton}>
            Recargar estado
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando rueda..." />
        ) : rueda.length === 0 ? (
          <EmptyState texto="No hay asesores para mostrar." />
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
                </tr>
              </thead>

              <tbody>
                {rueda.map((asesor) => (
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

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>🔁</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpRotacion {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseRotacion {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes avatarGlowRotacion {
    0%, 100% {
      box-shadow: 0 0 18px rgba(124,58,237,0.20);
    }

    50% {
      box-shadow: 0 0 34px rgba(124,58,237,0.38);
    }
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  animation: "fadeUpRotacion 0.55s ease both",
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
  animation: "pulseRotacion 1.8s ease-in-out infinite",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
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

const asesorCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.20)",
};

const avatarStyle = {
  width: "76px",
  height: "76px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  fontWeight: "900",
  border: "1px solid #6d5f7a",
  animation: "avatarGlowRotacion 3s ease-in-out infinite",
  marginBottom: "14px",
};

const asesorNameStyle = {
  color: "#ffffff",
  margin: "0 0 4px",
  fontSize: "1.4rem",
};

const asesorSubtitleStyle = {
  color: "#9f92b2",
  margin: "0 0 16px",
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

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default RotacionAsesoresPage;
