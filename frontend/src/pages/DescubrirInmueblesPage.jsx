import { useEffect, useMemo, useState } from "react";
import ordenamientoService from "../services/ordenamientoService";
import solicitudRapidaHelper from "../utils/solicitudRapidaHelper";
import authService from "../services/authService";

function DescubrirInmueblesPage() {
  const [inmueblesOrdenados, setInmueblesOrdenados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [criterio, setCriterio] = useState("precio");
  const [direccion, setDireccion] = useState("desc");

  const [filtros, setFiltros] = useState({
    texto: "",
    ciudad: "",
    tipo: "",
    finalidad: "",
    disponibilidad: "TODOS",
  });

  const rol = authService.getRol();
  const esCliente = rol === "CLIENTE";

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

  const cargarInmuebles = async () => {
    try {
      setCargando(true);

      const data = await ordenamientoService.ordenarInmuebles(
        criterio,
        direccion
      );

      setInmueblesOrdenados(data);
    } catch (error) {
      console.error("Error al cargar inmuebles:", error);
      alert("No se pudieron cargar los inmuebles");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInmuebles();
  }, [criterio, direccion]);

  const manejarFiltro = (e) => {
    const { name, value } = e.target;

    setFiltros({
      ...filtros,
      [name]: value,
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      texto: "",
      ciudad: "",
      tipo: "",
      finalidad: "",
      disponibilidad: "TODOS",
    });
  };

  const inmueblesFiltrados = useMemo(() => {
    return inmueblesOrdenados.filter((item) => {
      const inmueble = item.inmueble;

      if (!inmueble) return false;

      const texto = filtros.texto.toLowerCase().trim();
      const ciudad = filtros.ciudad.toLowerCase().trim();
      const tipo = filtros.tipo.toLowerCase().trim();
      const finalidad = filtros.finalidad.toLowerCase().trim();

      const textoGeneral = `
        ${inmueble.codigo || ""}
        ${inmueble.direccion || ""}
        ${inmueble.ciudad || ""}
        ${inmueble.barrioZona || ""}
        ${inmueble.tipoInmueble || ""}
        ${inmueble.finalidad || ""}
        ${inmueble.estado || ""}
      `.toLowerCase();

      const cumpleTexto = !texto || textoGeneral.includes(texto);

      const cumpleCiudad =
        !ciudad || (inmueble.ciudad || "").toLowerCase().includes(ciudad);

      const cumpleTipo =
        !tipo || (inmueble.tipoInmueble || "").toLowerCase().includes(tipo);

      const cumpleFinalidad =
        !finalidad ||
        (inmueble.finalidad || "").toLowerCase().includes(finalidad);

      const cumpleDisponibilidad =
        filtros.disponibilidad === "TODOS" ||
        (filtros.disponibilidad === "DISPONIBLES" && inmueble.disponible) ||
        (filtros.disponibilidad === "NO_DISPONIBLES" && !inmueble.disponible);

      return (
        cumpleTexto &&
        cumpleCiudad &&
        cumpleTipo &&
        cumpleFinalidad &&
        cumpleDisponibilidad
      );
    });
  }, [inmueblesOrdenados, filtros]);

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
          <p style={eyebrowStyle}>EXPLORACIÓN COMERCIAL</p>

          <h1 style={mainTitleStyle}>
            Descubrir <span style={titleAccentStyle}>inmuebles</span>
          </h1>

          <p style={descriptionStyle}>
            Explora inmuebles con filtros combinados y organiza los resultados
            por precio, área o demanda. Desde cada inmueble puedes registrar una
            solicitud de visita, compra, arriendo o información.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{inmueblesFiltrados.length} resultados</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🔎"
          titulo="Criterio"
          valor={criterio.toUpperCase()}
          texto="Preferencia activa"
        />

        <SummaryCard
          icono="↕️"
          titulo="Dirección"
          valor={direccion.toUpperCase()}
          texto="Vista del listado"
        />

        <SummaryCard
          icono="🏠"
          titulo="Total"
          valor={inmueblesOrdenados.length}
          texto="Inmuebles cargados"
        />

        <SummaryCard
          icono="📩"
          titulo="Solicitudes"
          valor={esCliente ? "Activas" : "Solo cliente"}
          texto="Acciones rápidas"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>ORGANIZAR CATÁLOGO</p>
            <h2 style={titleStyle}>Ordenar resultados</h2>
          </div>

          <span style={treeBadgeStyle}>
            {criterio.toUpperCase()} · {direccion.toUpperCase()}
          </span>
        </div>

        <div style={controlsRowStyle}>
          <select
            value={criterio}
            onChange={(e) => setCriterio(e.target.value)}
            style={inputStyle}
          >
            <option value="precio">Precio</option>
            <option value="area">Área</option>
            <option value="demanda">Demanda</option>
          </select>

          <select
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            style={inputStyle}
          >
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>

          <button onClick={cargarInmuebles} style={primaryButton}>
            Recargar
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>BÚSQUEDA COMBINADA</p>
            <h2 style={titleStyle}>Filtros</h2>
          </div>

          <button type="button" onClick={limpiarFiltros} style={secondaryButton}>
            Limpiar filtros
          </button>
        </div>

        <div style={filterGridStyle}>
          <input
            type="text"
            name="texto"
            placeholder="Buscar por código, zona, dirección..."
            value={filtros.texto}
            onChange={manejarFiltro}
            style={inputStyle}
          />

          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={filtros.ciudad}
            onChange={manejarFiltro}
            style={inputStyle}
          />

          <input
            type="text"
            name="tipo"
            placeholder="Tipo: casa, apartamento..."
            value={filtros.tipo}
            onChange={manejarFiltro}
            style={inputStyle}
          />

          <input
            type="text"
            name="finalidad"
            placeholder="Venta o arriendo"
            value={filtros.finalidad}
            onChange={manejarFiltro}
            style={inputStyle}
          />

          <select
            name="disponibilidad"
            value={filtros.disponibilidad}
            onChange={manejarFiltro}
            style={inputStyle}
          >
            <option value="TODOS">Todos</option>
            <option value="DISPONIBLES">Disponibles</option>
            <option value="NO_DISPONIBLES">No disponibles</option>
          </select>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>RESULTADOS</p>
            <h2 style={titleStyle}>Catálogo filtrado</h2>

            <p style={mutedTextStyle}>
              Mostrando {inmueblesFiltrados.length} de{" "}
              {inmueblesOrdenados.length} inmuebles.
            </p>
          </div>
        </div>

        {cargando ? (
          <div style={emptyStateStyle}>
            <div style={loadingOrbStyle}></div>
            <p>Cargando inmuebles...</p>
          </div>
        ) : inmueblesFiltrados.length === 0 ? (
          <div style={emptyStateStyle}>
            <span style={{ fontSize: "2rem" }}>🔎</span>
            <p>No hay inmuebles que coincidan con los filtros.</p>
          </div>
        ) : (
          <div style={cardsGridStyle}>
            {inmueblesFiltrados.map((item) => {
              const inmueble = item.inmueble;

              return (
                <article key={inmueble.codigo} style={cardStyle}>
                  <div style={imagePlaceholderStyle}>🏡</div>

                  <div style={cardTopStyle}>
                    <div>
                      <h3 style={cardTitleStyle}>
                        {inmueble.tipoInmueble} · {inmueble.codigo}
                      </h3>

                      <p style={cardLocationStyle}>
                        {inmueble.barrioZona}, {inmueble.ciudad}
                      </p>
                    </div>

                    <span
                      style={{
                        ...estadoBadgeStyle,
                        background: inmueble.disponible ? "#12351f" : "#3a1218",
                        color: inmueble.disponible ? "#86efac" : "#ffb4ab",
                        border: inmueble.disponible
                          ? "1px solid #225c37"
                          : "1px solid #7a2c35",
                      }}
                    >
                      {inmueble.disponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>

                  <p style={priceStyle}>{formatearPrecio(inmueble.precio)}</p>

                  <p style={addressStyle}>{inmueble.direccion}</p>

                  <div style={chipGridStyle}>
                    <span style={chipStyle}>{inmueble.finalidad}</span>
                    <span style={chipStyle}>{inmueble.area} m²</span>
                    <span style={chipStyle}>{inmueble.habitaciones} hab.</span>
                    <span style={chipStyle}>{inmueble.banos} baños</span>
                    <span style={chipStyle}>Demanda: {item.demanda}</span>
                  </div>

                  <div style={orderValueStyle}>
                    Valor de referencia: <strong>{item.valorOrden}</strong>
                  </div>

                  {esCliente && (
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

const animations = `
  @keyframes fadeUpDescubrir {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseDescubrir {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes loadingFloatDescubrir {
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
  animation: "fadeUpDescubrir 0.55s ease both",
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
  animation: "pulseDescubrir 1.8s ease-in-out infinite",
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

const mutedTextStyle = {
  color: "#9f92b2",
  margin: "6px 0 0",
};

const controlsRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const filterGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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

const treeBadgeStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  color: "white",
  fontWeight: "900",
  fontSize: "0.8rem",
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

const imagePlaceholderStyle = {
  height: "130px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #3f2a57, #7c3aed)",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "3rem",
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
  fontSize: "1rem",
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
  fontSize: "1.25rem",
};

const addressStyle = {
  margin: "0 0 12px",
  color: "#ccc3d8",
  lineHeight: 1.45,
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

const orderValueStyle = {
  marginTop: "14px",
  padding: "11px",
  borderRadius: "14px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#d2bbff",
  fontWeight: "800",
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
  animation: "loadingFloatDescubrir 1.8s ease-in-out infinite",
  margin: "0 auto 12px",
};

export default DescubrirInmueblesPage;