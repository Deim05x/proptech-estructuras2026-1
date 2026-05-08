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
      setNodos(nodosData);
      setRelaciones(relacionesData);
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
      setResultadoCliente(data);
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
      setResultadoInmueble(data);
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
      setResultadoSimilares(data);
    } catch (error) {
      console.error("Error al buscar inmuebles similares:", error);
      alert("No se pudieron consultar los inmuebles similares");
    }
  };

  const obtenerColorTipoNodo = (tipo) => {
    const valor = (tipo || "").toUpperCase();

    if (valor === "CLIENTE") return "#dcfce7";
    if (valor === "INMUEBLE") return "#fbd7ff";
    if (valor === "ZONA") return "#dbeafe";
    if (valor === "ASESOR") return "#fef3c7";

    return "#f4ecf0";
  };

  const obtenerColorTextoNodo = (tipo) => {
    const valor = (tipo || "").toUpperCase();

    if (valor === "CLIENTE") return "#166534";
    if (valor === "INMUEBLE") return "#43214d";
    if (valor === "ZONA") return "#1d4ed8";
    if (valor === "ASESOR") return "#92400e";

    return "#4c444d";
  };

  return (
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Análisis de relaciones
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Consulta relaciones entre clientes, inmuebles, zonas y asesores usando
        un grafo no dirigido genérico.
      </p>

      {cargando ? (
        <p>Cargando análisis...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <CardResumen
              titulo="Total nodos"
              valor={resumen?.totalNodos || 0}
            />

            <CardResumen
              titulo="Total relaciones"
              valor={resumen?.totalRelaciones || 0}
            />

            <CardResumen
              titulo="Nodo más conectado"
              valor={resumen?.nodoMayorConexion || "Sin datos"}
            />

            <CardResumen
              titulo="Grado mayor"
              valor={resumen?.gradoMayorConexion || 0}
            />
          </div>

          <div style={panelStyle}>
            <h2 style={titleStyle}>Consultas estructurales</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "18px",
              }}
            >
              <div style={consultaCardStyle}>
                <h3 style={{ color: "#43214d", marginTop: 0 }}>
                  Inmuebles visitados por cliente
                </h3>

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
                <h3 style={{ color: "#43214d", marginTop: 0 }}>
                  Clientes relacionados con inmueble
                </h3>

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
                <h3 style={{ color: "#43214d", marginTop: 0 }}>
                  Inmuebles similares
                </h3>

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
          </div>

          <div style={panelStyle}>
            <h2 style={titleStyle}>Nodos del grafo</h2>

            {nodos.length === 0 ? (
              <p>No hay nodos para mostrar.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={theadRowStyle}>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Etiqueta</th>
                    <th>Grado</th>
                  </tr>
                </thead>

                <tbody>
                  {nodos.map((nodo) => (
                    <tr key={nodo.id}>
                      <td style={tdStyle}>{nodo.id}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            backgroundColor: obtenerColorTipoNodo(nodo.tipo),
                            color: obtenerColorTextoNodo(nodo.tipo),
                            padding: "5px 10px",
                            borderRadius: "999px",
                            fontWeight: "800",
                            fontSize: "0.78rem",
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
            )}
          </div>

          <div style={panelStyle}>
            <h2 style={titleStyle}>Relaciones del grafo</h2>

            {relaciones.length === 0 ? (
              <p>No hay relaciones para mostrar.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={theadRowStyle}>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Tipo relación</th>
                    <th>Peso</th>
                  </tr>
                </thead>

                <tbody>
                  {relaciones.map((relacion, index) => (
                    <tr key={`${relacion.origen}-${relacion.destino}-${index}`}>
                      <td style={tdStyle}>{relacion.origen}</td>
                      <td style={tdStyle}>{relacion.destino}</td>
                      <td style={tdStyle}>{relacion.tipoRelacion}</td>
                      <td style={tdStyle}>{relacion.peso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={panelStyle}>
            <h2 style={titleStyle}>Justificación de estructura</h2>

            <p style={{ color: "#4c444d", lineHeight: 1.7 }}>
              Esta vista usa un grafo no dirigido genérico en backend para
              representar relaciones entre clientes, inmuebles, zonas y asesores.
              Las aristas permiten analizar interacciones comerciales, conexiones
              por visitas, operaciones y similitud entre inmuebles.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function CardResumen({ titulo, valor }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ margin: 0, color: "#43214d" }}>{titulo}</h3>

      <p
        style={{
          fontSize: typeof valor === "number" ? "2rem" : "1rem",
          fontWeight: "800",
          margin: "10px 0 0",
          color: "#1e1a1e",
          wordBreak: "break-word",
        }}
      >
        {valor}
      </p>
    </div>
  );
}

function ListadoRelaciones({ datos }) {
  if (!datos || datos.length === 0) {
    return (
      <p style={{ color: "#7e747d", marginTop: "14px" }}>
        Sin resultados todavía.
      </p>
    );
  }

  return (
    <div style={{ marginTop: "14px" }}>
      {datos.map((item, index) => (
        <div
          key={`${item.origen}-${item.destino}-${index}`}
          style={{
            background: "#f4ecf0",
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "8px",
            color: "#43214d",
          }}
        >
          <strong>{item.tipoRelacion}</strong>
          <p style={{ margin: "6px 0 0", fontSize: "0.9rem" }}>
            {item.origen} → {item.destino}
          </p>
          <small>Peso: {item.peso}</small>
        </div>
      ))}
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

const cardStyle = {
  background: "rgba(255,255,255,0.86)",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(67,33,77,0.08)",
  border: "1px solid #e8e0e5",
};

const consultaCardStyle = {
  background: "#fff7fb",
  border: "1px solid #e8e0e5",
  borderRadius: "18px",
  padding: "18px",
};

const titleStyle = {
  color: "#43214d",
  marginTop: 0,
  marginBottom: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: "12px",
  border: "1px solid #cfc3cd",
  outline: "none",
  backgroundColor: "white",
  marginBottom: "10px",
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

export default AnalisisRelacionesPage;