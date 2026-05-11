import { useEffect, useState } from "react";
import grafoService from "../services/grafoService";

function AnalisisRelacionesPage() {
  const [resumen, setResumen] = useState(null);
  const [nodos, setNodos] = useState([]);
  const [relaciones, setRelaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [clienteId, setClienteId] = useState("");
  const [codigoInmueble, setCodigoInmueble] = useState("");

  const [resultadoCliente, setResultadoCliente] = useState([]);
  const [resultadoInmueble, setResultadoInmueble] = useState([]);
  const [resultadoSimilares, setResultadoSimilares] = useState([]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [resumenData, nodosData, relacionesData] = await Promise.all([
        grafoService.resumen(),
        grafoService.nodos(),
        grafoService.relaciones(),
      ]);

      setResumen(resumenData);
      setNodos(nodosData || []);
      setRelaciones(relacionesData || []);
    } catch (error) {
      console.error("Error al cargar análisis de relaciones:", error);
      alert("No se pudo cargar el análisis de relaciones");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const buscarPorCliente = async () => {
    if (!clienteId.trim()) {
      alert("Ingresa el ID del cliente");
      return;
    }

    try {
      const data = await grafoService.inmueblesVisitadosPorCliente(clienteId);
      setResultadoCliente(data || []);
    } catch (error) {
      console.error("Error al buscar relaciones del cliente:", error);
      alert("No se pudieron consultar los inmuebles del cliente");
    }
  };

  const buscarClientesPorInmueble = async () => {
    if (!codigoInmueble.trim()) {
      alert("Ingresa el código del inmueble");
      return;
    }

    try {
      const data = await grafoService.clientesRelacionadosConInmueble(
        codigoInmueble
      );
      setResultadoInmueble(data || []);
    } catch (error) {
      console.error("Error al buscar clientes del inmueble:", error);
      alert("No se pudieron consultar los clientes relacionados");
    }
  };

  const buscarSimilares = async () => {
    if (!codigoInmueble.trim()) {
      alert("Ingresa el código del inmueble");
      return;
    }

    try {
      const data = await grafoService.inmueblesSimilares(codigoInmueble);
      setResultadoSimilares(data || []);
    } catch (error) {
      console.error("Error al buscar inmuebles similares:", error);
      alert("No se pudieron consultar los inmuebles similares");
    }
  };

  const obtenerEstiloTipoNodo = (tipo) => {
    const valor = (tipo || "").toUpperCase();

    if (valor === "CLIENTE") {
      return {
        background: "#12351f",
        color: "#86efac",
        border: "1px solid #225c37",
      };
    }

    if (valor === "INMUEBLE") {
      return {
        background: "#3f2a57",
        color: "#d2bbff",
        border: "1px solid #6d5f7a",
      };
    }

    if (valor === "ZONA") {
      return {
        background: "#10294f",
        color: "#93c5fd",
        border: "1px solid #1d4ed8",
      };
    }

    if (valor === "ASESOR") {
      return {
        background: "#3a2d00",
        color: "#ffd76a",
        border: "1px solid #826300",
      };
    }

    return {
      background: "#15121b",
      color: "#ccc3d8",
      border: "1px solid #37333e",
    };
  };

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>GRAFO DE RELACIONES</p>

          <h1 style={mainTitleStyle}>
            Análisis de <span style={titleAccentStyle}>relaciones</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta conexiones comerciales entre clientes, inmuebles, zonas y
            asesores para identificar oportunidades de seguimiento dentro del
            sistema PropTech.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{relaciones.length} relaciones</span>
        </div>
      </section>

      {cargando ? (
        <EmptyState texto="Cargando análisis de relaciones..." />
      ) : (
        <>
          <section style={summaryGridStyle}>
            <CardResumen
              icono="🧩"
              titulo="Total registros"
              valor={resumen?.totalNodos || 0}
              texto="Nodos del grafo"
            />

            <CardResumen
              icono="🔗"
              titulo="Total relaciones"
              valor={resumen?.totalRelaciones || 0}
              texto="Conexiones detectadas"
            />

            <CardResumen
              icono="⭐"
              titulo="Mayor conexión"
              valor={resumen?.nodoMayorConexion || "Sin datos"}
              texto="Nodo más conectado"
              textValue
            />

            <CardResumen
              icono="📊"
              titulo="Conexiones máximas"
              valor={resumen?.gradoMayorConexion || 0}
              texto="Grado más alto"
            />
          </section>

          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <p style={eyebrowStyle}>CONSULTAS DEL GRAFO</p>
                <h2 style={titleStyle}>Consultas de relaciones</h2>

                <p style={mutedTextStyle}>
                  Explora relaciones por cliente, por inmueble o por similitud
                  entre propiedades.
                </p>
              </div>

              <button type="button" onClick={cargarDatos} style={secondaryButton}>
                Recargar grafo
              </button>
            </div>

            <div style={consultaGridStyle}>
              <div style={consultaCardStyle}>
                <div style={consultaIconStyle}>👤</div>

                <h3 style={consultaTitleStyle}>
                  Inmuebles visitados por cliente
                </h3>

                <p style={consultaTextStyle}>
                  Consulta qué inmuebles se encuentran relacionados con un
                  cliente específico.
                </p>

                <input
                  type="text"
                  placeholder="Ejemplo: CLI-001"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  style={inputStyle}
                />

                <button onClick={buscarPorCliente} style={primaryButton}>
                  Consultar cliente
                </button>

                <ListadoRelaciones datos={resultadoCliente} />
              </div>

              <div style={consultaCardStyle}>
                <div style={consultaIconStyle}>🏠</div>

                <h3 style={consultaTitleStyle}>
                  Clientes relacionados con inmueble
                </h3>

                <p style={consultaTextStyle}>
                  Identifica qué clientes han tenido relación o interés con un
                  inmueble.
                </p>

                <input
                  type="text"
                  placeholder="Ejemplo: INM-001"
                  value={codigoInmueble}
                  onChange={(e) => setCodigoInmueble(e.target.value)}
                  style={inputStyle}
                />

                <button
                  onClick={buscarClientesPorInmueble}
                  style={primaryButton}
                >
                  Consultar inmueble
                </button>

                <ListadoRelaciones datos={resultadoInmueble} />
              </div>

              <div style={consultaCardStyle}>
                <div style={consultaIconStyle}>✨</div>

                <h3 style={consultaTitleStyle}>Inmuebles similares</h3>

                <p style={consultaTextStyle}>
                  Busca inmuebles conectados o parecidos según la estructura de
                  relaciones.
                </p>

                <input
                  type="text"
                  placeholder="Ejemplo: INM-001"
                  value={codigoInmueble}
                  onChange={(e) => setCodigoInmueble(e.target.value)}
                  style={inputStyle}
                />

                <button onClick={buscarSimilares} style={primaryButton}>
                  Buscar similares
                </button>

                <ListadoRelaciones datos={resultadoSimilares} />
              </div>
            </div>
          </section>

          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <p style={eyebrowStyle}>NODOS</p>
                <h2 style={titleStyle}>Elementos relacionados</h2>

                <p style={mutedTextStyle}>
                  Cada elemento representa una entidad dentro del grafo:
                  clientes, inmuebles, asesores o zonas.
                </p>
              </div>
            </div>

            {nodos.length === 0 ? (
              <EmptyState texto="No hay elementos para mostrar." />
            ) : (
              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Tipo</th>
                      <th style={thStyle}>Etiqueta</th>
                      <th style={thStyle}>Conexiones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {nodos.map((nodo) => (
                      <tr key={nodo.id}>
                        <td style={tdStrongStyle}>{nodo.id}</td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              ...pillStyle,
                              ...obtenerEstiloTipoNodo(nodo.tipo),
                            }}
                          >
                            {nodo.tipo}
                          </span>
                        </td>

                        <td style={tdStyle}>{nodo.etiqueta}</td>
                        <td style={tdStyle}>{nodo.grado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <p style={eyebrowStyle}>ARISTAS</p>
                <h2 style={titleStyle}>Relaciones detectadas</h2>

                <p style={mutedTextStyle}>
                  Las relaciones muestran conexiones entre entidades y su peso o
                  relevancia dentro del grafo.
                </p>
              </div>
            </div>

            {relaciones.length === 0 ? (
              <EmptyState texto="No hay relaciones para mostrar." />
            ) : (
              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Origen</th>
                      <th style={thStyle}>Destino</th>
                      <th style={thStyle}>Tipo relación</th>
                      <th style={thStyle}>Relevancia</th>
                    </tr>
                  </thead>

                  <tbody>
                    {relaciones.map((relacion, index) => (
                      <tr key={`${relacion.origen}-${relacion.destino}-${index}`}>
                        <td style={tdStrongStyle}>{relacion.origen}</td>
                        <td style={tdStyle}>{relacion.destino}</td>
                        <td style={tdStyle}>
                          <span style={relationBadgeStyle}>
                            {relacion.tipoRelacion}
                          </span>
                        </td>
                        <td style={tdStyle}>{relacion.peso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function CardResumen({ icono, titulo, valor, texto, textValue }) {
  return (
    <article style={cardStyle}>
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

function ListadoRelaciones({ datos }) {
  if (!datos || datos.length === 0) {
    return <p style={emptyResultStyle}>Sin resultados todavía.</p>;
  }

  return (
    <div style={resultListStyle}>
      {datos.map((item, index) => (
        <div
          key={`${item.origen}-${item.destino}-${index}`}
          style={resultItemStyle}
        >
          <strong style={resultTypeStyle}>{item.tipoRelacion}</strong>

          <p style={resultPathStyle}>
            {item.origen} <span style={arrowStyle}>→</span> {item.destino}
          </p>

          <small style={resultWeightStyle}>Peso: {item.peso}</small>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>🕸️</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpRelaciones {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseRelaciones {
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
  animation: "fadeUpRelaciones 0.55s ease both",
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
  animation: "pulseRelaciones 1.8s ease-in-out infinite",
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

const consultaGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const consultaCardStyle = {
  background: "#2c2833",
  border: "1px solid #37333e",
  borderRadius: "22px",
  padding: "18px",
  boxShadow: "0 18px 38px rgba(0,0,0,0.18)",
};

const consultaIconStyle = {
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
};

const consultaTitleStyle = {
  color: "#ffffff",
  margin: "0 0 8px",
  fontSize: "1rem",
};

const consultaTextStyle = {
  color: "#9f92b2",
  lineHeight: 1.5,
  margin: "0 0 14px",
  fontSize: "0.86rem",
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
  marginBottom: "10px",
};

const primaryButton = {
  width: "100%",
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

const resultListStyle = {
  marginTop: "14px",
};

const resultItemStyle = {
  background: "#15121b",
  border: "1px solid #37333e",
  borderRadius: "14px",
  padding: "11px",
  marginBottom: "8px",
  color: "#ccc3d8",
};

const resultTypeStyle = {
  color: "#d2bbff",
  display: "block",
  marginBottom: "6px",
};

const resultPathStyle = {
  margin: "0 0 5px",
  fontSize: "0.9rem",
  color: "#ffffff",
  wordBreak: "break-word",
};

const arrowStyle = {
  color: "#d2bbff",
  fontWeight: "900",
};

const resultWeightStyle = {
  color: "#9f92b2",
};

const emptyResultStyle = {
  color: "#9f92b2",
  marginTop: "14px",
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

const pillStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const relationBadgeStyle = {
  ...pillStyle,
  background: "#3f2a57",
  border: "1px solid #6d5f7a",
  color: "#d2bbff",
};

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default AnalisisRelacionesPage;