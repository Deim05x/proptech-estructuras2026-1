import { useState } from "react";
import busquedaHashService from "../services/busquedaHashService";

function BusquedaHashPage() {
  const [tipoBusqueda, setTipoBusqueda] = useState("INMUEBLE");
  const [clave, setClave] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const buscar = async (e) => {
    e.preventDefault();

    if (!clave.trim()) {
      alert("Debes ingresar una clave de búsqueda");
      return;
    }

    try {
      setCargando(true);

      let data;

      if (tipoBusqueda === "CLIENTE") {
        data = await busquedaHashService.buscarCliente(clave);
      } else if (tipoBusqueda === "ASESOR") {
        data = await busquedaHashService.buscarAsesor(clave);
      } else {
        data = await busquedaHashService.buscarInmueble(clave);
      }

      setResultado(data);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      alert(error.response?.data || "No se pudo realizar la búsqueda");
    } finally {
      setCargando(false);
    }
  };

  const limpiar = () => {
    setClave("");
    setResultado(null);
  };

  const obtenerPlaceholder = () => {
    if (tipoBusqueda === "CLIENTE") return "Ejemplo: CLI-001";
    if (tipoBusqueda === "ASESOR") return "Ejemplo: ASE-001";
    return "Ejemplo: INM-001";
  };

  const formatearValor = (valor) => {
    if (valor === null || valor === undefined || valor === "") return "—";

    if (typeof valor === "boolean") {
      return valor ? "Sí" : "No";
    }

    if (typeof valor === "object") {
      return JSON.stringify(valor, null, 2);
    }

    return valor;
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>CONSULTA RAPIDA</p>

          <h1 style={mainTitleStyle}>
            Búsqueda <span style={titleAccentStyle}>rápida</span>
          </h1>

          <p style={descriptionStyle}>
            Localiza clientes, inmuebles o asesores a partir de una clave de
            consulta y revisa el registro asociado en segundos.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{resultado ? "Resultado cargado" : "Lista para buscar"}</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🔑"
          titulo="Clave"
          valor={clave || "—"}
          texto="Valor buscado"
          textValue
        />

        <SummaryCard
          icono="📦"
          titulo="Tipo"
          valor={tipoBusqueda}
          texto="Entidad consultada"
        />

        <SummaryCard
          icono="🎯"
          titulo="Estado"
          valor={resultado?.encontrado ? "Encontrado" : "Sin búsqueda"}
          texto="Resultado actual"
        />

        <SummaryCard
          icono="⚡"
          titulo="Consulta"
          valor={resultado ? "Procesada" : "Pendiente"}
          texto="Estado de revisión"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CONSULTA</p>
            <h2 style={titleStyle}>Buscar por clave</h2>

            <p style={mutedTextStyle}>
              Selecciona el tipo de entidad, ingresa la clave y consulta el
              registro correspondiente.
            </p>
          </div>

          <span style={modeBadgeStyle}>Consulta directa</span>
        </div>

        <form onSubmit={buscar}>
          <div style={formGridStyle}>
            <select
              value={tipoBusqueda}
              onChange={(e) => {
                setTipoBusqueda(e.target.value);
                setResultado(null);
                setClave("");
              }}
              style={inputStyle}
            >
              <option value="INMUEBLE">Inmueble por código</option>
              <option value="CLIENTE">Cliente por ID</option>
              <option value="ASESOR">Asesor por ID</option>
            </select>

            <input
              type="text"
              placeholder={obtenerPlaceholder()}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              Buscar
            </button>

            <button type="button" onClick={limpiar} style={secondaryButton}>
              Limpiar
            </button>
          </div>
        </form>
      </section>

      {resultado && (
        <>
          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <p style={eyebrowStyle}>RESULTADO</p>
                <h2 style={titleStyle}>
                  {resultado.encontrado
                    ? "Elemento encontrado"
                    : "Elemento no encontrado"}
                </h2>

                <p style={mutedTextStyle}>{resultado.mensaje}</p>
              </div>

              <span
                style={{
                  ...stateBadgeStyle,
                  ...(resultado.encontrado
                    ? successBadgeStyle
                    : dangerBadgeStyle),
                }}
              >
                {resultado.encontrado ? "Encontrado" : "No encontrado"}
              </span>
            </div>

            <div style={resultGridStyle}>
              <InfoBox label="Tipo de consulta" value={resultado.tipoBusqueda} />
              <InfoBox label="Clave buscada" value={resultado.claveBuscada} />
              <InfoBox label="Registros disponibles" value={resultado.totalElementos} />
              <InfoBox label="Estado" value={resultado.encontrado ? "Encontrado" : "No encontrado"} />
            </div>

            <div style={jsonPanelStyle}>
              <div style={jsonHeaderStyle}>
                <strong>Objeto encontrado</strong>
                <span>{resultado.encontrado ? "Datos cargados" : "Sin datos"}</span>
              </div>

              <pre style={preStyle}>{formatearValor(resultado.resultado)}</pre>
            </div>
          </section>
        </>
      )}

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
            fontSize: textValue ? "0.92rem" : "1.35rem",
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

function InfoBox({ label, value }) {
  return (
    <div style={infoBoxStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const animations = `
  @keyframes fadeUpHash {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseHash {
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
  animation: "fadeUpHash 0.55s ease both",
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
  animation: "pulseHash 1.8s ease-in-out infinite",
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

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: "14px",
  border: "1px solid #37333e",
  outline: "none",
  background: "#15121b",
  color: "#e8dfee",
  fontWeight: "650",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
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

const stateBadgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: "900",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const successBadgeStyle = {
  background: "#12351f",
  color: "#86efac",
  border: "1px solid #225c37",
};

const dangerBadgeStyle = {
  background: "#3a1218",
  color: "#ffb4ab",
  border: "1px solid #7a2c35",
};

const resultGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginBottom: "16px",
};

const infoBoxStyle = {
  background: "#15121b",
  border: "1px solid #37333e",
  borderRadius: "16px",
  padding: "13px",
  color: "#d2bbff",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const jsonPanelStyle = {
  background: "#15121b",
  border: "1px solid #37333e",
  borderRadius: "18px",
  overflow: "hidden",
};

const jsonHeaderStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #37333e",
  color: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const preStyle = {
  margin: 0,
  padding: "16px",
  color: "#ccc3d8",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  fontSize: "0.84rem",
};

export default BusquedaHashPage;
