import { useEffect, useState } from "react";
import inmuebleService from "../services/inmuebleService";
import historialInmuebleService from "../services/historialInmuebleService";

function InmueblesPage() {
  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState(false);

  const [cantidadCambios, setCantidadCambios] = useState(0);
  const [ultimaAccion, setUltimaAccion] = useState(null);

  const [formulario, setFormulario] = useState({
    codigo: "",
    direccion: "",
    ciudad: "",
    barrioZona: "",
    tipoInmueble: "",
    finalidad: "",
    precio: "",
    area: "",
    habitaciones: "",
    banos: "",
    estado: "",
    disponible: true,
    idAsesorResponsable: "",
  });

  useEffect(() => {
    cargarInmuebles();
    cargarEstadoPila();
  }, []);

  const cargarInmuebles = async () => {
    try {
      setCargando(true);
      const data = await inmuebleService.listar();
      setInmuebles(data);
    } catch (error) {
      console.error("Error al cargar inmuebles:", error);
      alert("No se pudieron cargar los inmuebles");
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadoPila = async () => {
    try {
      const cantidad = await historialInmuebleService.cantidad();
      setCantidadCambios(cantidad);

      const ultima = await historialInmuebleService.ultimaAccion();

      if (typeof ultima === "string") {
        setUltimaAccion(null);
      } else {
        setUltimaAccion(ultima);
      }
    } catch (error) {
      console.error("Error al cargar estado de la pila:", error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      codigo: "",
      direccion: "",
      ciudad: "",
      barrioZona: "",
      tipoInmueble: "",
      finalidad: "",
      precio: "",
      area: "",
      habitaciones: "",
      banos: "",
      estado: "",
      disponible: true,
      idAsesorResponsable: "",
    });

    setEditando(false);
  };

  const prepararInmuebleParaEnviar = () => {
    return {
      ...formulario,
      precio: Number(formulario.precio),
      area: Number(formulario.area),
      habitaciones: Number(formulario.habitaciones),
      banos: Number(formulario.banos),
      disponible: Boolean(formulario.disponible),
    };
  };

  const guardarInmueble = async (e) => {
    e.preventDefault();

    try {
      const inmueble = prepararInmuebleParaEnviar();

      if (editando) {
        await historialInmuebleService.capturarEstado(
          formulario.codigo,
          "Actualización de datos del inmueble"
        );

        await inmuebleService.actualizar(formulario.codigo, inmueble);

        alert("Inmueble actualizado correctamente");
      } else {
        await inmuebleService.crear(inmueble);

        alert("Inmueble registrado correctamente");
      }

      limpiarFormulario();
      await cargarInmuebles();
      await cargarEstadoPila();
    } catch (error) {
      console.error("Error al guardar inmueble:", error);
      alert("No se pudo guardar el inmueble");
    }
  };

  const editarInmueble = (inmueble) => {
    setFormulario({
      codigo: inmueble.codigo || "",
      direccion: inmueble.direccion || "",
      ciudad: inmueble.ciudad || "",
      barrioZona: inmueble.barrioZona || "",
      tipoInmueble: inmueble.tipoInmueble || "",
      finalidad: inmueble.finalidad || "",
      precio: inmueble.precio || "",
      area: inmueble.area || "",
      habitaciones: inmueble.habitaciones || "",
      banos: inmueble.banos || "",
      estado: inmueble.estado || "",
      disponible: inmueble.disponible ?? true,
      idAsesorResponsable: inmueble.idAsesorResponsable || "",
    });

    setEditando(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarInmueble = async (codigo) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el inmueble ${codigo}?`
    );

    if (!confirmar) return;

    try {
      await inmuebleService.eliminar(codigo);

      alert("Inmueble eliminado correctamente");
      await cargarInmuebles();
      await cargarEstadoPila();
    } catch (error) {
      console.error("Error al eliminar inmueble:", error);
      alert("No se pudo eliminar el inmueble");
    }
  };

  const deshacerUltimoCambio = async () => {
    const confirmar = window.confirm(
      "¿Seguro que deseas deshacer el último cambio realizado sobre un inmueble?"
    );

    if (!confirmar) return;

    try {
      const respuesta = await historialInmuebleService.deshacerUltimoCambio();

      if (typeof respuesta === "string") {
        alert(respuesta);
      } else {
        alert(
          `Cambio deshecho correctamente. Se restauró el inmueble ${respuesta.codigoInmueble}`
        );
      }

      limpiarFormulario();
      await cargarInmuebles();
      await cargarEstadoPila();
    } catch (error) {
      console.error("Error al deshacer cambio:", error);
      alert("No se pudo deshacer el último cambio");
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
    <div>
      <h1 style={{ color: "#43214d", marginBottom: "8px" }}>
        Gestión de Inmuebles
      </h1>

      <p style={{ color: "#7e747d", marginBottom: "24px" }}>
        Administra los inmuebles registrados en la plataforma.
      </p>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Historial de cambios de inmuebles</h2>

        <p style={{ color: "#7e747d" }}>
          Cambios disponibles para deshacer:{" "}
          <strong style={{ color: "#43214d" }}>{cantidadCambios}</strong>
        </p>

        {ultimaAccion && (
          <p style={{ color: "#4c444d" }}>
            Última acción: <strong>{ultimaAccion.descripcion}</strong> sobre el
            inmueble <strong>{ultimaAccion.codigoInmueble}</strong>
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={deshacerUltimoCambio}
            style={primaryButton}
          >
            Deshacer último cambio
          </button>

          <button
            type="button"
            onClick={cargarEstadoPila}
            style={secondaryButton}
          >
            Actualizar estado de pila
          </button>
        </div>

        <p style={{ color: "#7e747d", fontSize: "0.9rem", marginTop: "14px" }}>
          Estructura usada: pila genérica propia. Antes de actualizar un
          inmueble, se guarda su estado anterior para poder restaurarlo.
        </p>
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>
          {editando ? "Editar inmueble" : "Registrar inmueble"}
        </h2>

        <form onSubmit={guardarInmueble}>
          <div style={formGridStyle}>
            <input
              type="text"
              name="codigo"
              placeholder="Código, ejemplo: INM-001"
              value={formulario.codigo}
              onChange={manejarCambio}
              disabled={editando}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={formulario.direccion}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={formulario.ciudad}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="barrioZona"
              placeholder="Barrio o zona"
              value={formulario.barrioZona}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="tipoInmueble"
              placeholder="Tipo: Casa, Apartamento..."
              value={formulario.tipoInmueble}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="finalidad"
              placeholder="Finalidad: Venta, Arriendo..."
              value={formulario.finalidad}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={formulario.precio}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="area"
              placeholder="Área en m²"
              value={formulario.area}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="habitaciones"
              placeholder="Habitaciones"
              value={formulario.habitaciones}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="banos"
              placeholder="Baños"
              value={formulario.banos}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="estado"
              placeholder="Estado: Disponible, Reservado..."
              value={formulario.estado}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="idAsesorResponsable"
              placeholder="ID asesor responsable, ejemplo: ASE-001"
              value={formulario.idAsesorResponsable}
              onChange={manejarCambio}
              required
              style={inputStyle}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "14px",
              color: "#4c444d",
              fontWeight: "700",
            }}
          >
            <input
              type="checkbox"
              name="disponible"
              checked={formulario.disponible}
              onChange={manejarCambio}
            />
            Inmueble disponible
          </label>

          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            <button type="submit" style={primaryButton}>
              {editando ? "Actualizar inmueble" : "Registrar inmueble"}
            </button>

            <button type="button" onClick={limpiarFormulario} style={secondaryButton}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div style={panelStyle}>
        <h2 style={titleStyle}>Listado de inmuebles</h2>

        {cargando ? (
          <p>Cargando inmuebles...</p>
        ) : inmuebles.length === 0 ? (
          <p>No hay inmuebles registrados.</p>
        ) : (
          <div style={cardsGridStyle}>
            {inmuebles.map((inmueble) => (
              <div key={inmueble.codigo} style={cardStyle}>
                <div style={imagePlaceholderStyle}>🏠</div>

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
                      backgroundColor: inmueble.disponible
                        ? "#dcfce7"
                        : "#fee2e2",
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
                  <span style={chipStyle}>Asesor: {inmueble.idAsesorResponsable}</span>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={() => editarInmueble(inmueble)}
                    style={smallButton}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminarInmueble(inmueble.codigo)}
                    style={smallDangerButton}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
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

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "18px",
};

const cardStyle = {
  background: "#fff7fb",
  border: "1px solid #e8e0e5",
  borderRadius: "20px",
  padding: "18px",
  boxShadow: "0 12px 26px rgba(67,33,77,0.08)",
};

const imagePlaceholderStyle = {
  height: "120px",
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

const smallButton = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontWeight: "700",
  cursor: "pointer",
};

const smallDangerButton = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontWeight: "700",
  cursor: "pointer",
};

export default InmueblesPage;