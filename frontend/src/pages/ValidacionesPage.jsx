import { useState } from "react";
import validacionNegocioService from "../services/validacionNegocioService";

function ValidacionesPage() {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    tipoValidacion: "AGENDAR_VISITA",
    idCliente: "",
    codigoInmueble: "",
    idAsesor: "",
    idVisita: "",
    idOperacion: "",
    idContrato: "",
    idSolicitud: "",
    valorOperacion: "",
    estadoObjetivo: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const prepararDatos = () => {
    return {
      ...formulario,
      valorOperacion: Number(formulario.valorOperacion || 0),
    };
  };

  const ejecutarValidacion = async (e) => {
    e.preventDefault();

    try {
      setCargando(true);

      const datos = prepararDatos();
      let data;

      if (formulario.tipoValidacion === "AGENDAR_VISITA") {
        data = await validacionNegocioService.validarAgendarVisita(datos);
      } else if (formulario.tipoValidacion === "CREAR_OPERACION") {
        data = await validacionNegocioService.validarCrearOperacion(datos);
      } else if (formulario.tipoValidacion === "CREAR_CONTRATO") {
        data = await validacionNegocioService.validarCrearContrato(datos);
      } else if (formulario.tipoValidacion === "INTENCION_COMERCIAL") {
        data = await validacionNegocioService.validarIntencionComercial(datos);
      } else {
        data = await validacionNegocioService.validar(datos);
      }

      setResultado(data);
    } catch (error) {
      console.error("Error al ejecutar validación:", error);
      alert(error.response?.data || "No se pudo ejecutar la validación");
    } finally {
      setCargando(false);
    }
  };

  const validarConsistenciaGeneral = async () => {
    try {
      setCargando(true);

      const data = await validacionNegocioService.validarConsistenciaGeneral();
      setResultado(data);
    } catch (error) {
      console.error("Error al validar consistencia general:", error);
      alert("No se pudo validar la consistencia general");
    } finally {
      setCargando(false);
    }
  };

  const limpiar = () => {
    setFormulario({
      tipoValidacion: "AGENDAR_VISITA",
      idCliente: "",
      codigoInmueble: "",
      idAsesor: "",
      idVisita: "",
      idOperacion: "",
      idContrato: "",
      idSolicitud: "",
      valorOperacion: "",
      estadoObjetivo: "",
    });

    setResultado(null);
  };

  const totalErrores = resultado?.errores?.length || 0;
  const totalAdvertencias = resultado?.advertencias?.length || 0;
  const totalRecomendaciones = resultado?.recomendaciones?.length || 0;

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>MOTOR DE CONSISTENCIA</p>

          <h1 style={mainTitleStyle}>
            Validaciones <span style={titleAccentStyle}>finales</span>
          </h1>

          <p style={descriptionStyle}>
            Verifica reglas de negocio antes de agendar visitas, crear
            operaciones, registrar contratos o aceptar intenciones comerciales.
            Esta fase ayuda a evitar inconsistencias entre clientes, inmuebles,
            asesores y procesos comerciales.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{resultado ? "Validación ejecutada" : "Pendiente"}</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="✅"
          titulo="Estado"
          valor={resultado ? (resultado.valido ? "Válido" : "Con errores") : "—"}
          texto="Resultado actual"
        />

        <SummaryCard
          icono="⛔"
          titulo="Errores"
          valor={totalErrores}
          texto="Bloquean el proceso"
        />

        <SummaryCard
          icono="⚠️"
          titulo="Advertencias"
          valor={totalAdvertencias}
          texto="Requieren revisión"
        />

        <SummaryCard
          icono="💡"
          titulo="Recomendaciones"
          valor={totalRecomendaciones}
          texto="Sugerencias del sistema"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>VALIDACIÓN ESPECÍFICA</p>
            <h2 style={titleStyle}>Ejecutar regla de negocio</h2>

            <p style={mutedTextStyle}>
              Selecciona el tipo de validación e ingresa los datos necesarios
              para revisar la consistencia del proceso.
            </p>
          </div>

          <span style={modeBadgeStyle}>{formulario.tipoValidacion}</span>
        </div>

        <form onSubmit={ejecutarValidacion}>
          <div style={formGridStyle}>
            <select
              name="tipoValidacion"
              value={formulario.tipoValidacion}
              onChange={manejarCambio}
              style={inputStyle}
            >
              <option value="AGENDAR_VISITA">Agendar visita</option>
              <option value="CREAR_OPERACION">Crear operación</option>
              <option value="CREAR_CONTRATO">Crear contrato</option>
              <option value="INTENCION_COMERCIAL">Intención comercial</option>
            </select>

            <input
              name="idCliente"
              placeholder="ID cliente, ejemplo: CLI-001"
              value={formulario.idCliente}
              onChange={manejarCambio}
              style={inputStyle}
            />

            <input
              name="codigoInmueble"
              placeholder="Código inmueble, ejemplo: INM-001"
              value={formulario.codigoInmueble}
              onChange={manejarCambio}
              style={inputStyle}
            />

            <input
              name="idAsesor"
              placeholder="ID asesor, ejemplo: ASE-001"
              value={formulario.idAsesor}
              onChange={manejarCambio}
              style={inputStyle}
            />

            <input
              name="idContrato"
              placeholder="ID contrato, ejemplo: CON-001"
              value={formulario.idContrato}
              onChange={manejarCambio}
              style={inputStyle}
            />

            <input
              type="number"
              name="valorOperacion"
              placeholder="Valor operación"
              value={formulario.valorOperacion}
              onChange={manejarCambio}
              style={inputStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton} disabled={cargando}>
              {cargando ? "Ejecutando..." : "Ejecutar validación"}
            </button>

            <button
              type="button"
              onClick={validarConsistenciaGeneral}
              style={secondaryButton}
              disabled={cargando}
            >
              Consistencia general
            </button>

            <button
              type="button"
              onClick={limpiar}
              style={secondaryButton}
              disabled={cargando}
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      {resultado && (
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>RESULTADO</p>
              <h2 style={titleStyle}>{resultado.mensajeGeneral}</h2>

              <p style={mutedTextStyle}>
                Tipo de validación: {resultado.tipoValidacion}
              </p>
            </div>

            <span
              style={{
                ...stateBadgeStyle,
                ...(resultado.valido ? successBadgeStyle : dangerBadgeStyle),
              }}
            >
              {resultado.valido ? "Válido" : "Con errores"}
            </span>
          </div>

          <div style={resultGridStyle}>
            <ResultList
              titulo="Errores"
              icono="⛔"
              items={resultado.errores}
              emptyText="No se encontraron errores críticos."
              type="error"
            />

            <ResultList
              titulo="Advertencias"
              icono="⚠️"
              items={resultado.advertencias}
              emptyText="No se encontraron advertencias."
              type="warning"
            />

            <ResultList
              titulo="Recomendaciones"
              icono="💡"
              items={resultado.recomendaciones}
              emptyText="No hay recomendaciones adicionales."
              type="success"
            />
          </div>
        </section>
      )}

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

function ResultList({ titulo, icono, items, emptyText, type }) {
  const safeItems = items || [];

  return (
    <article style={resultCardStyle}>
      <div style={resultHeaderStyle}>
        <span>{icono}</span>
        <h3>{titulo}</h3>
      </div>

      {safeItems.length === 0 ? (
        <p style={emptyTextMiniStyle}>{emptyText}</p>
      ) : (
        <ul style={resultListStyle}>
          {safeItems.map((item, index) => (
            <li
              key={`${type}-${index}`}
              style={{
                ...resultItemStyle,
                ...(type === "error"
                  ? resultErrorStyle
                  : type === "warning"
                  ? resultWarningStyle
                  : resultSuccessStyle),
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

const animations = `
  @keyframes fadeUpValidaciones {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseValidaciones {
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
  animation: "fadeUpValidaciones 0.55s ease both",
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
  maxWidth: "820px",
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
  animation: "pulseValidaciones 1.8s ease-in-out infinite",
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
  fontSize: "1.25rem",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "14px",
};

const resultCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "22px",
  padding: "18px",
};

const resultHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#ffffff",
  marginBottom: "12px",
};

const resultListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "8px",
};

const resultItemStyle = {
  padding: "10px",
  borderRadius: "14px",
  lineHeight: 1.45,
  fontWeight: "700",
};

const resultErrorStyle = {
  background: "#3a1218",
  border: "1px solid #7a2c35",
  color: "#ffb4ab",
};

const resultWarningStyle = {
  background: "#3a2d00",
  border: "1px solid #826300",
  color: "#ffd76a",
};

const resultSuccessStyle = {
  background: "#12351f",
  border: "1px solid #225c37",
  color: "#86efac",
};

const emptyTextMiniStyle = {
  color: "#8f849e",
  margin: 0,
  lineHeight: 1.5,
};

export default ValidacionesPage;
