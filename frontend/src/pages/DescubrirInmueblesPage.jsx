import { useEffect, useMemo, useState } from "react";
import ordenamientoService from "../services/ordenamientoService";

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

  const cargarInmuebles = async () => {
    try {
      setCargando(true);
      const data = await ordenamientoService.ordenarInmuebles(criterio, direccion);
      setInmueblesOrdenados(data);
    } catch (error) {
      console.error("Error al cargar inmuebles ordenados:", error);
      alert("No se pudieron cargar los inmuebles ordenados");
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
        !finalidad || (inmueble.finalidad || "").toLowerCase().includes(finalidad);

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
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Descubrir Inmuebles
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Explora inmuebles usando filtros combinados y ordenamiento por árbol
        binario de búsqueda.
      </p>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Ordenamiento con árbol</h2>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Filtros combinados</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
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

          <button type="button" onClick={limpiarFiltros} style={secondaryButton}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <div style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2 style={titleStyle}>Resultados</h2>
            <p style={{ margin: 0, color: "#7e747d" }}>
              Mostrando {inmueblesFiltrados.length} de {inmueblesOrdenados.length} inmuebles.
            </p>
          </div>

          <div style={treeBadgeStyle}>
            Árbol: {criterio.toUpperCase()} · {direccion.toUpperCase()}
          </div>
        </div>

        {cargando ? (
          <p>Cargando inmuebles...</p>
        ) : inmueblesFiltrados.length === 0 ? (
          <p>No hay inmuebles que coincidan con los filtros.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {inmueblesFiltrados.map((item) => {
              const inmueble = item.inmueble;

              return (
                <div key={inmueble.codigo} style={cardInmuebleStyle}>
                  <div style={imagePlaceholderStyle}>🏡</div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 6px", color: "#43214d" }}>
                        {inmueble.tipoInmueble} · {inmueble.codigo}
                      </h3>

                      <p style={{ margin: 0, color: "#7e747d" }}>
                        {inmueble.barrioZona}, {inmueble.ciudad}
                      </p>
                    </div>

                    <span
                      style={{
                        ...estadoBadgeStyle,
                        backgroundColor: inmueble.disponible ? "#dcfce7" : "#fee2e2",
                        color: inmueble.disponible ? "#166534" : "#991b1b",
                      }}
                    >
                      {inmueble.disponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "14px 0 8px",
                      color: "#1e1a1e",
                      fontWeight: "800",
                      fontSize: "1.2rem",
                    }}
                  >
                    {formatearPrecio(inmueble.precio)}
                  </p>

                  <p style={{ margin: "0 0 12px", color: "#4c444d" }}>
                    {inmueble.direccion}
                  </p>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={chipStyle}>{inmueble.finalidad}</span>
                    <span style={chipStyle}>{inmueble.area} m²</span>
                    <span style={chipStyle}>{inmueble.habitaciones} hab.</span>
                    <span style={chipStyle}>{inmueble.banos} baños</span>
                    <span style={chipStyle}>Demanda: {item.demanda}</span>
                  </div>

                  <div
                    style={{
                      marginTop: "14px",
                      padding: "10px",
                      borderRadius: "12px",
                      backgroundColor: "#f4ecf0",
                      color: "#43214d",
                      fontWeight: "700",
                    }}
                  >
                    Valor de orden: {item.valorOrden}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Justificación de estructura</h2>
        <p style={{ color: "#4c444d", lineHeight: 1.7 }}>
          Esta vista utiliza un árbol binario de búsqueda genérico en backend para
          ordenar inmuebles por precio, área o demanda. Sobre el resultado ordenado
          se aplican filtros combinados en la vista de exploración para simular una
          experiencia tipo catálogo PropTech.
        </p>
      </div>
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
  backgroundColor: "#fff7fb",
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

const secondaryButton = {
  padding: "11px 16px",
  border: "1px solid #cfc3cd",
  borderRadius: "12px",
  backgroundColor: "#fbd7ff",
  color: "#43214d",
  fontWeight: "700",
  cursor: "pointer",
};

const treeBadgeStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #5b3765, #43214d)",
  color: "white",
  fontWeight: "800",
  fontSize: "0.85rem",
};

const cardInmuebleStyle = {
  background: "#fff7fb",
  border: "1px solid #e8e0e5",
  borderRadius: "20px",
  padding: "18px",
  boxShadow: "0 12px 26px rgba(67,33,77,0.08)",
};

const imagePlaceholderStyle = {
  height: "130px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #5b3765, #fdbef4)",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "3rem",
};

const estadoBadgeStyle = {
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "800",
  whiteSpace: "nowrap",
};

const chipStyle = {
  background: "#f4ecf0",
  color: "#43214d",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "0.8rem",
  fontWeight: "700",
};

export default DescubrirInmueblesPage;