import { useState } from "react";
import recomendacionService from "../services/recomendacionService";
import authService from "../services/authService";
import solicitudRapidaHelper from "../utils/solicitudRapidaHelper";
import InmuebleCover from "../components/InmuebleCover";

function RecomendacionesPage() {
  const rol = authService.getRol();
  const clienteAutenticado = authService.getClienteId();

  const [clienteId, setClienteId] = useState(
    rol === "CLIENTE" ? clienteAutenticado || "" : ""
  );

  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarRecomendaciones = async () => {
    if (!clienteId || !clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
      setCargando(true);

      const data = await recomendacionService.recomendarPorCliente(clienteId);
      setRecomendaciones(data || []);
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

  const crearSolicitudRapida = async (tipoSolicitud, inmueble) => {
    try {
      await solicitudRapidaHelper.crearSolicitudRapida(tipoSolicitud, inmueble);

      if (tipoSolicitud === "COMPRA") {
        alert("Intención de compra enviada correctamente.");
      } else if (tipoSolicitud === "ARRIENDO") {
        alert("Intención de arriendo enviada correctamente.");
      } else if (tipoSolicitud === "VISITA") {
        alert("Solicitud de visita enviada correctamente.");
      } else {
        alert("Solicitud de información enviada correctamente.");
      }
    } catch (error) {
      console.error("Error al crear solicitud rápida:", error);
      alert(error.message || "No se pudo enviar la solicitud.");
    }
  };

  const obtenerMejorPuntaje = () => {
    if (recomendaciones.length === 0) return 0;

    return Math.max(
      ...recomendaciones.map((item) => Number(item.puntaje || 0))
    );
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>MOTOR DE SUGERENCIAS</p>

          <h1 style={mainTitleStyle}>
            Recomendaciones de{" "}
            <span style={titleAccentStyle}>inmuebles</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta inmuebles sugeridos según presupuesto, zona, tipo de
            inmueble, habitaciones deseadas y coincidencias con tu perfil de
            búsqueda.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{recomendaciones.length} recomendaciones</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="✨"
          titulo="Sugerencias"
          valor={recomendaciones.length}
          texto="Resultados encontrados"
        />

        <SummaryCard
          icono="👤"
          titulo="Cliente"
          valor={clienteId || "—"}
          texto="Perfil consultado"
          textValue
        />

        <SummaryCard
          icono="⭐"
          titulo="Mejor puntaje"
          valor={obtenerMejorPuntaje()}
          texto="Coincidencia más alta"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>BÚSQUEDA PERSONALIZADA</p>
            <h2 style={titleStyle}>Buscar recomendaciones</h2>

            <p style={mutedTextStyle}>
              {rol === "CLIENTE"
                ? "Estás consultando recomendaciones asociadas a tu cuenta."
                : "Ingresa el ID del cliente para generar recomendaciones según su perfil."}
            </p>
          </div>

          <span style={modeBadgeStyle}>
            {rol === "CLIENTE" ? "Cliente autenticado" : "Consulta manual"}
          </span>
        </div>

        <div style={searchRowStyle}>
          <input
            type="text"
            placeholder="ID del cliente, ejemplo: CLI-001"
            value={clienteId}
            disabled={rol === "CLIENTE"}
            onChange={(e) => setClienteId(e.target.value)}
            style={{
              ...inputStyle,
              opacity: rol === "CLIENTE" ? 0.75 : 1,
              cursor: rol === "CLIENTE" ? "not-allowed" : "text",
            }}
          />

          <button onClick={cargarRecomendaciones} style={primaryButton}>
            Generar recomendaciones
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>RESULTADOS</p>
            <h2 style={titleStyle}>Inmuebles recomendados</h2>

            <p style={mutedTextStyle}>
              Las recomendaciones muestran un puntaje y un motivo para explicar
              por qué el inmueble puede ajustarse al perfil del cliente.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {cargando ? "Cargando" : `${recomendaciones.length} resultados`}
          </span>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando recomendaciones..." />
        ) : recomendaciones.length === 0 ? (
          <EmptyState texto="No hay recomendaciones para mostrar." />
        ) : (
          <div style={cardsGridStyle}>
            {recomendaciones.map((item) => {
              const inmueble = item.inmueble;

              return (
                <article key={inmueble.codigo} style={cardStyle}>
                  <InmuebleCover inmueble={inmueble} height={130} />

                  <div style={cardTopStyle}>
                    <div>
                      <h3 style={cardTitleStyle}>
                        {inmueble.tipoInmueble} · {inmueble.codigo}
                      </h3>

                      <p style={cardLocationStyle}>
                        {inmueble.direccion}, {inmueble.ciudad}
                      </p>
                    </div>

                    <span style={scoreMiniBadgeStyle}>
                      {item.puntaje} pts
                    </span>
                  </div>

                  <p style={priceStyle}>{formatearPrecio(inmueble.precio)}</p>

                  <div style={chipGridStyle}>
                    <span style={chipStyle}>{inmueble.barrioZona}</span>
                    <span style={chipStyle}>{inmueble.habitaciones} hab.</span>
                    <span style={chipStyle}>{inmueble.area} m²</span>

                    {inmueble.banos !== undefined && (
                      <span style={chipStyle}>{inmueble.banos} baños</span>
                    )}

                    {inmueble.finalidad && (
                      <span style={chipStyle}>{inmueble.finalidad}</span>
                    )}
                  </div>

                  <div style={scoreStyle}>
                    <span>Coincidencia recomendada</span>
                    <strong>{item.puntaje}</strong>
                  </div>

                  <div style={reasonBoxStyle}>
                    <strong style={reasonTitleStyle}>Motivo</strong>
                    <p style={reasonTextStyle}>
                      {item.motivo || "Sin motivo registrado."}
                    </p>
                  </div>

                  {rol === "CLIENTE" && (
                    <div style={quickActionsStyle}>
                      <button
                        type="button"
                        onClick={() => crearSolicitudRapida("VISITA", inmueble)}
                        style={quickActionButton}
                      >
                        Solicitar visita
                      </button>

                      <button
                        type="button"
                        onClick={() => crearSolicitudRapida("COMPRA", inmueble)}
                        style={quickBuyButton}
                      >
                        Me interesa comprar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          crearSolicitudRapida("ARRIENDO", inmueble)
                        }
                        style={quickRentButton}
                      >
                        Me interesa arrendar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          crearSolicitudRapida("INFORMACION", inmueble)
                        }
                        style={quickInfoButton}
                      >
                        Más información
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CÓMO FUNCIONA</p>
            <h2 style={titleStyle}>Criterios de recomendación</h2>
          </div>
        </div>

        <div style={criteriaGridStyle}>
          <CriteriaCard
            icono="💰"
            titulo="Presupuesto"
            texto="Compara el valor del inmueble con la capacidad económica del cliente."
          />

          <CriteriaCard
            icono="📍"
            titulo="Zona"
            texto="Evalúa si el inmueble coincide con las zonas de interés registradas."
          />

          <CriteriaCard
            icono="🏘️"
            titulo="Tipo de inmueble"
            texto="Relaciona el tipo deseado con el tipo real del inmueble."
          />

          <CriteriaCard
            icono="🛏️"
            titulo="Habitaciones"
            texto="Considera el mínimo de habitaciones solicitado por el cliente."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icono, titulo, valor, texto, textValue }) {
  return (
    <article style={summaryCardStyle}>
      <div style={summaryIconStyle}>{icono}</div>

      <div>
        <p style={summaryTitleStyle}>{titulo}</p>

        <strong
          style={{
            ...summaryValueStyle,
            fontSize: textValue ? "1rem" : "1.35rem",
            wordBreak: "break-word",
          }}
        >
          {valor}
        </strong>

        <small style={summaryTextStyle}>{texto}</small>
      </div>
    </article>
  );
}

function CriteriaCard({ icono, titulo, texto }) {
  return (
    <article style={criteriaCardStyle}>
      <div style={criteriaIconStyle}>{icono}</div>

      <h3 style={criteriaTitleStyle}>{titulo}</h3>

      <p style={criteriaTextStyle}>{texto}</p>
    </article>
  );
}

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>✨</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpRecomendaciones {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseRecomendaciones {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes glowRecomendaciones {
    0%, 100% {
      box-shadow: 0 0 0 rgba(124, 58, 237, 0);
    }

    50% {
      box-shadow: 0 0 26px rgba(124, 58, 237, 0.28);
    }
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  color: "#e8dfee",
  background: "transparent",
  animation: "fadeUpRecomendaciones 0.55s ease both",
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
  animation: "pulseRecomendaciones 1.8s ease-in-out infinite",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "16px",
  marginBottom: "22px",
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

const mutedTextStyle = {
  color: "#9f92b2",
  margin: "6px 0 0",
  lineHeight: 1.55,
};

const searchRowStyle = {
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
  transition: "0.25s ease",
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

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "18px",
};

const cardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.20)",
  transition: "0.28s ease",
};

const cardTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
};

const cardTitleStyle = {
  margin: "0 0 6px",
  color: "#ffffff",
  fontSize: "1rem",
};

const cardLocationStyle = {
  margin: 0,
  color: "#9f92b2",
  lineHeight: 1.45,
};

const scoreMiniBadgeStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  color: "#d2bbff",
  fontSize: "0.75rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const priceStyle = {
  margin: "14px 0 12px",
  color: "#ffffff",
  fontWeight: "900",
  fontSize: "1.25rem",
};

const chipGridStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const chipStyle = {
  background: "#15121b",
  color: "#d2bbff",
  border: "1px solid #37333e",
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.78rem",
  fontWeight: "800",
};

const scoreStyle = {
  marginTop: "14px",
  padding: "11px",
  borderRadius: "14px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#d2bbff",
  fontWeight: "800",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
};

const reasonBoxStyle = {
  marginTop: "12px",
  padding: "12px",
  borderRadius: "16px",
  background: "#221e28",
  border: "1px solid #37333e",
};

const reasonTitleStyle = {
  color: "#ffffff",
  display: "block",
  marginBottom: "6px",
};

const reasonTextStyle = {
  color: "#9f92b2",
  margin: 0,
  lineHeight: 1.55,
  fontSize: "0.88rem",
};

const quickActionsStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "16px",
  paddingTop: "14px",
  borderTop: "1px solid #37333e",
};

const quickActionButton = {
  padding: "9px 12px",
  border: "1px solid #6d5f7a",
  borderRadius: "12px",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
};

const quickBuyButton = {
  padding: "9px 12px",
  border: "1px solid #225c37",
  borderRadius: "12px",
  background: "#12351f",
  color: "#86efac",
  fontWeight: "900",
  cursor: "pointer",
};

const quickRentButton = {
  padding: "9px 12px",
  border: "1px solid #1d4ed8",
  borderRadius: "12px",
  background: "#10294f",
  color: "#93c5fd",
  fontWeight: "900",
  cursor: "pointer",
};

const quickInfoButton = {
  padding: "9px 12px",
  border: "1px solid #826300",
  borderRadius: "12px",
  background: "#3a2d00",
  color: "#ffd76a",
  fontWeight: "900",
  cursor: "pointer",
};

const criteriaGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
};

const criteriaCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "22px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
};

const criteriaIconStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "16px",
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.35rem",
  marginBottom: "12px",
  animation: "glowRecomendaciones 3.2s ease-in-out infinite",
};

const criteriaTitleStyle = {
  color: "#ffffff",
  margin: "0 0 8px",
  fontSize: "1rem",
};

const criteriaTextStyle = {
  color: "#9f92b2",
  margin: 0,
  lineHeight: 1.55,
  fontSize: "0.86rem",
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default RecomendacionesPage;
