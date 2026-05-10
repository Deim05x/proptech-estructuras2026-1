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
        alert("No hay cambios pendientes para deshacer.");
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
    <div style={pageStyle}>
      <style>{animations}</style>

      <section style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>MÓDULO INMOBILIARIO</p>

          <h1 style={mainTitleStyle}>
            Gestión de <span style={titleAccentStyle}>inmuebles</span>
          </h1>

          <p style={mainDescriptionStyle}>
            Administra el inventario de propiedades registradas en la
            plataforma, controla disponibilidad, asesores responsables y cambios
            reversibles del inventario.
          </p>
        </div>

        <div style={headerStatsStyle}>
          <span style={statusDotStyle}></span>
          <span>{inmuebles.length} inmuebles registrados</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="🏘️"
          titulo="Inmuebles"
          valor={inmuebles.length}
          texto="Registros cargados"
        />

        <SummaryCard
          icono="✅"
          titulo="Disponibles"
          valor={inmuebles.filter((item) => item.disponible).length}
          texto="Listos para ofertar"
        />

        <SummaryCard
          icono="🧾"
          titulo="Cambios"
          valor={cantidadCambios}
          texto="Disponibles para deshacer"
        />

        <SummaryCard
          icono="🧑‍💼"
          titulo="Asesores"
          valor={
            new Set(
              inmuebles
                .map((item) => item.idAsesorResponsable)
                .filter((item) => item)
            ).size
          }
          texto="Relacionados al inventario"
        />
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>CONTROL DE CAMBIOS</p>
            <h2 style={titleStyle}>Historial de cambios de inmuebles</h2>
          </div>

          <div style={pillCounterStyle}>
            <span>{cantidadCambios}</span>
            <small>cambios</small>
          </div>
        </div>

        <p style={softTextStyle}>
          Cambios disponibles para deshacer:{" "}
          <strong style={strongLightStyle}>{cantidadCambios}</strong>
        </p>

        {ultimaAccion && (
          <div style={lastActionStyle}>
            <strong>Última acción:</strong> {ultimaAccion.descripcion} sobre el
            inmueble <strong>{ultimaAccion.codigoInmueble}</strong>
          </div>
        )}

        <div style={buttonRowStyle}>
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
            Actualizar estado
          </button>
        </div>

        <p style={helperTextStyle}>
          Antes de actualizar un inmueble, el sistema conserva su estado anterior
          para que puedas restaurarlo si es necesario.
        </p>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>
              {editando ? "EDICIÓN DE REGISTRO" : "NUEVO REGISTRO"}
            </p>

            <h2 style={titleStyle}>
              {editando ? "Editar inmueble" : "Registrar inmueble"}
            </h2>
          </div>

          {editando && <span style={editBadgeStyle}>Modo edición</span>}
        </div>

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
              style={{
                ...inputStyle,
                ...(editando ? disabledInputStyle : {}),
              }}
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

          <label style={checkLabelStyle}>
            <input
              type="checkbox"
              name="disponible"
              checked={formulario.disponible}
              onChange={manejarCambio}
              style={checkboxStyle}
            />
            Inmueble disponible
          </label>

          <div style={buttonRowStyle}>
            <button type="submit" style={primaryButton}>
              {editando ? "Actualizar inmueble" : "Registrar inmueble"}
            </button>

            <button type="button" onClick={limpiarFormulario} style={secondaryButton}>
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>INVENTARIO</p>
            <h2 style={titleStyle}>Listado de inmuebles</h2>
          </div>

          <button type="button" onClick={cargarInmuebles} style={secondaryButton}>
            Recargar listado
          </button>
        </div>

        {cargando ? (
          <div style={emptyStateStyle}>
            <div style={loadingOrbStyle}></div>
            <p>Cargando inmuebles...</p>
          </div>
        ) : inmuebles.length === 0 ? (
          <div style={emptyStateStyle}>
            <span style={{ fontSize: "2rem" }}>🏠</span>
            <p>No hay inmuebles registrados.</p>
          </div>
        ) : (
          <div style={cardsGridStyle}>
            {inmuebles.map((inmueble) => (
              <article key={inmueble.codigo} style={cardStyle}>
                <div style={imagePlaceholderStyle}>
                  <span>🏠</span>
                </div>

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
                  <span style={chipStyle}>
                    Asesor: {inmueble.idAsesorResponsable}
                  </span>
                </div>

                <div style={cardActionsStyle}>
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
              </article>
            ))}
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
  @keyframes fadeUpInmuebles {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseInmueble {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.18);
    }
  }

  @keyframes loadingFloat {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-8px);
    }
  }
`;

const pageStyle = {
  animation: "fadeUpInmuebles 0.55s ease both",
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

const mainDescriptionStyle = {
  color: "#ccc3d8",
  maxWidth: "760px",
  lineHeight: 1.65,
  margin: 0,
};

const headerStatsStyle = {
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
  animation: "pulseInmueble 1.8s ease-in-out infinite",
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

const softTextStyle = {
  color: "#ccc3d8",
  lineHeight: 1.55,
};

const strongLightStyle = {
  color: "#ffffff",
};

const lastActionStyle = {
  margin: "12px 0",
  padding: "13px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#ccc3d8",
  lineHeight: 1.5,
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
};

const helperTextStyle = {
  color: "#9f92b2",
  fontSize: "0.88rem",
  marginTop: "14px",
  lineHeight: 1.55,
};

const pillCounterStyle = {
  minWidth: "78px",
  padding: "10px 12px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #37333e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#d2bbff",
};

const editBadgeStyle = {
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

const disabledInputStyle = {
  opacity: 0.65,
  cursor: "not-allowed",
};

const checkLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "16px",
  color: "#ccc3d8",
  fontWeight: "800",
};

const checkboxStyle = {
  width: "16px",
  height: "16px",
  accentColor: "#7c3aed",
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
  height: "120px",
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

const cardActionsStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
  flexWrap: "wrap",
};

const smallButton = {
  padding: "8px 12px",
  border: "1px solid #225c37",
  borderRadius: "12px",
  background: "#12351f",
  color: "#86efac",
  fontWeight: "900",
  cursor: "pointer",
};

const smallDangerButton = {
  padding: "8px 12px",
  border: "1px solid #7a2c35",
  borderRadius: "12px",
  background: "#3a1218",
  color: "#ffb4ab",
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
  animation: "loadingFloat 1.8s ease-in-out infinite",
  margin: "0 auto 12px",
};

export default InmueblesPage;
