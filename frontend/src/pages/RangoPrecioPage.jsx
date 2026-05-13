import { useEffect, useState } from "react";
import rangoPrecioService from "../services/rangoPrecioService";
import InmuebleCover from "../components/InmuebleCover";

function RangoPrecioPage() {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    minimo: "",
    maximo: "",
  });

  useEffect(() => {
    listarOrdenados();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const buscarPorRango = async (e) => {
    e.preventDefault();

    if (formulario.minimo === "" || formulario.maximo === "") {
      alert("Debes ingresar precio mínimo y precio máximo");
      return;
    }

    try {
      setCargando(true);

      const data = await rangoPrecioService.buscarPorRango(
        Number(formulario.minimo),
        Number(formulario.maximo)
      );

      setResultado(data);
    } catch (error) {
      console.error("Error al buscar por rango:", error);
      alert(error.response?.data || "No se pudo consultar el rango de precio");
    } finally {
      setCargando(false);
    }
  };

  const listarOrdenados = async () => {
    try {
      setCargando(true);

      const data = await rangoPrecioService.listarOrdenados();
      setResultado(data);
    } catch (error) {
      console.error("Error al listar inmuebles ordenados:", error);
      alert("No se pudieron cargar los inmuebles ordenados");
    } finally {
      setCargando(false);
    }
  };

  const limpiar = () => {
    setFormulario({
      minimo: "",
      maximo: "",
    });

    listarOrdenados();
  };

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  const inmuebles = resultado?.inmuebles || [];

  return (
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>CATALOGO INMOBILIARIO</p>

          <h1 style={mainTitleStyle}>
            Consulta por <span style={titleAccentStyle}>rango de precio</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta inmuebles entre un precio minimo y maximo para comparar
            opciones segun presupuesto, disponibilidad y caracteristicas clave.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{inmuebles.length} resultados</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🌳"
          titulo="Inmuebles analizados"
          valor={resultado?.totalNodosArbol || 0}
          texto="Base consultada"
        />

        <SummaryCard
          icono="📏"
          titulo="Cobertura"
          valor={resultado?.alturaArbol || 0}
          texto="Nivel de exploracion"
        />

        <SummaryCard
          icono="🔎"
          titulo="Resultados"
          valor={resultado?.cantidadResultados || 0}
          texto="Inmuebles encontrados"
        />

        <SummaryCard
          icono="💰"
          titulo="Rango"
          valor={
            resultado?.precioMaximo
              ? `${formatearPrecio(resultado.precioMinimo)} - ${formatearPrecio(
                  resultado.precioMaximo
                )}`
              : "Ordenado"
          }
          texto="Criterio de consulta"
          textValue
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CONSULTA</p>
            <h2 style={titleStyle}>Buscar por rango</h2>

            <p style={mutedTextStyle}>
              Ingresa un valor minimo y maximo para ver solo los inmuebles que
              coinciden con el intervalo definido.
            </p>
          </div>

          <span style={modeBadgeStyle}>Filtro por precio</span>
        </div>

        <form onSubmit={buscarPorRango}>
          <div style={formGridStyle}>
            <input
              type="number"
              name="minimo"
              placeholder="Precio mínimo"
              value={formulario.minimo}
              onChange={manejarCambio}
              style={inputStyle}
            />

            <input
              type="number"
              name="maximo"
              placeholder="Precio máximo"
              value={formulario.maximo}
              onChange={manejarCambio}
              style={inputStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              Buscar por rango
            </button>

            <button type="button" onClick={listarOrdenados} style={secondaryButton}>
              Ver ordenados
            </button>

            <button type="button" onClick={limpiar} style={secondaryButton}>
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>RESULTADOS</p>
            <h2 style={titleStyle}>Inmuebles encontrados</h2>

            <p style={mutedTextStyle}>
              Revisa las propiedades que coinciden con el rango seleccionado.
            </p>
          </div>

          <span style={filterBadgeStyle}>
            {cargando ? "Cargando" : `${inmuebles.length} inmuebles`}
          </span>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando inmuebles..." />
        ) : inmuebles.length === 0 ? (
          <EmptyState texto="No hay inmuebles dentro del rango seleccionado." />
        ) : (
          <div style={cardsGridStyle}>
            {inmuebles.map((inmueble) => (
              <article key={inmueble.codigo} style={cardStyle}>
                <InmuebleCover inmueble={inmueble} height={130} />

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
                      ...statusBadgeStyle,
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
                </div>
              </article>
            ))}
          </div>
        )}
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
            fontSize: textValue ? "0.9rem" : "1.35rem",
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

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>🌳</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpRangoPrecio {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseRangoPrecio {
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
  animation: "fadeUpRangoPrecio 0.55s ease both",
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
  animation: "pulseRangoPrecio 1.8s ease-in-out infinite",
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

const statusBadgeStyle = {
  padding: "6px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
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

const emptyStateStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#9f92b2",
  textAlign: "center",
};

export default RangoPrecioPage;
