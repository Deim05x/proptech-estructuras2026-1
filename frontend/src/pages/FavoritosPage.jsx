import { useEffect, useState } from "react";
import favoritoService from "../services/favoritoService";
import authService from "../services/authService";

function FavoritosPage() {
  const rol = authService.getRol();
  const clienteAutenticado = authService.getClienteId();

  const [clienteId, setClienteId] = useState(
    rol === "CLIENTE" ? clienteAutenticado || "" : ""
  );

  const [codigoInmueble, setCodigoInmueble] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (rol === "CLIENTE" && clienteId) {
      cargarFavoritos();
    }
  }, []);

  const cargarFavoritos = async () => {
    if (!clienteId || !clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
      setCargando(true);
      const data = await favoritoService.listarPorCliente(clienteId);
      setFavoritos(data || []);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      alert("No se pudieron cargar los favoritos");
    } finally {
      setCargando(false);
    }
  };

  const agregarFavorito = async (e) => {
    e.preventDefault();

    if (!clienteId.trim() || !codigoInmueble.trim()) {
      alert("Debes ingresar cliente e inmueble");
      return;
    }

    try {
      await favoritoService.agregar(clienteId, codigoInmueble);

      alert("Favorito agregado correctamente");
      setCodigoInmueble("");
      await cargarFavoritos();
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      alert("No se pudo agregar el favorito");
    }
  };

  const eliminarFavorito = async (codigo) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el favorito ${codigo}?`
    );

    if (!confirmar) return;

    try {
      await favoritoService.eliminar(clienteId, codigo);

      alert("Favorito eliminado correctamente");
      await cargarFavoritos();
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("No se pudo eliminar el favorito");
    }
  };

  const obtenerCodigoFavorito = (favorito) => {
    if (typeof favorito === "string") return favorito;

    return (
      favorito.codigoInmueble ||
      favorito.inmuebleCodigo ||
      favorito.codigo ||
      favorito.id ||
      "SIN-CODIGO"
    );
  };

  const obtenerTextoUbicacion = (favorito) => {
    if (typeof favorito === "string") return "Información del inmueble no detallada";

    const barrio = favorito.barrioZona || favorito.zona || "";
    const ciudad = favorito.ciudad || "";

    if (barrio && ciudad) return `${barrio}, ${ciudad}`;
    if (ciudad) return ciudad;
    if (barrio) return barrio;

    return "Ubicación no registrada";
  };

  const formatearPrecio = (valor) => {
    if (valor === undefined || valor === null || valor === "") return "Sin precio";

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
          <p style={eyebrowStyle}>LISTA DE INTERÉS</p>

          <h1 style={mainTitleStyle}>
            Mis <span style={titleAccentStyle}>favoritos</span>
          </h1>

          <p style={descriptionStyle}>
            Consulta y administra los inmuebles que guardaste como favoritos.
            Desde aquí puedes cargar tu lista, agregar nuevos inmuebles de
            interés o eliminar aquellos que ya no deseas seguir.
          </p>
        </div>

        <div style={headerBadgeStyle}>
          <span style={statusDotStyle}></span>
          <span>{favoritos.length} favoritos</span>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <SummaryCard
          icono="⭐"
          titulo="Favoritos"
          valor={favoritos.length}
          texto="Inmuebles guardados"
        />

        <SummaryCard
          icono="👤"
          titulo="Cliente"
          valor={clienteId || "—"}
          texto="Perfil consultado"
          textValue
        />

        <SummaryCard
          icono="🏠"
          titulo="Nuevo favorito"
          valor={codigoInmueble || "—"}
          texto="Código pendiente por agregar"
          textValue
        />
      </section>

      <section style={twoColumnsStyle}>
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>CONSULTA</p>
              <h2 style={titleStyle}>Buscar favoritos</h2>

              <p style={mutedTextStyle}>
                {rol === "CLIENTE"
                  ? "Estás consultando los favoritos asociados a tu cuenta."
                  : "Ingresa el ID del cliente para consultar sus favoritos."}
              </p>
            </div>

            <span style={modeBadgeStyle}>
              {rol === "CLIENTE" ? "Cliente autenticado" : "Consulta manual"}
            </span>
          </div>

          <div style={formRowStyle}>
            <input
              type="text"
              placeholder="ID del cliente"
              value={clienteId}
              disabled={rol === "CLIENTE"}
              onChange={(e) => setClienteId(e.target.value)}
              style={{
                ...inputStyle,
                opacity: rol === "CLIENTE" ? 0.75 : 1,
                cursor: rol === "CLIENTE" ? "not-allowed" : "text",
              }}
            />

            <button onClick={cargarFavoritos} style={primaryButton}>
              Cargar favoritos
            </button>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>NUEVO FAVORITO</p>
              <h2 style={titleStyle}>Agregar inmueble</h2>

              <p style={mutedTextStyle}>
                Escribe el código del inmueble que deseas agregar a tu lista de
                favoritos.
              </p>
            </div>
          </div>

          <form onSubmit={agregarFavorito}>
            <div style={formRowStyle}>
              <input
                type="text"
                placeholder="Código del inmueble, ejemplo: INM-001"
                value={codigoInmueble}
                onChange={(e) => setCodigoInmueble(e.target.value)}
                style={inputStyle}
              />

              <button type="submit" style={primaryButton}>
                Agregar favorito
              </button>
            </div>
          </form>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={eyebrowStyle}>REGISTROS</p>
            <h2 style={titleStyle}>Listado de favoritos</h2>

            <p style={mutedTextStyle}>
              Estos son los inmuebles guardados en tu lista de interés.
            </p>
          </div>

          <button type="button" onClick={cargarFavoritos} style={secondaryButton}>
            Recargar
          </button>
        </div>

        {cargando ? (
          <EmptyState texto="Cargando favoritos..." />
        ) : favoritos.length === 0 ? (
          <EmptyState texto="No hay favoritos registrados." />
        ) : (
          <div style={cardsGridStyle}>
            {favoritos.map((favorito, index) => {
              const codigo = obtenerCodigoFavorito(favorito);
              const esObjeto = typeof favorito === "object" && favorito !== null;

              return (
                <article key={`${codigo}-${index}`} style={cardStyle}>
                  <div style={imagePlaceholderStyle}>⭐</div>

                  <div style={cardTopStyle}>
                    <div>
                      <h3 style={cardTitleStyle}>
                        {esObjeto
                          ? `${favorito.tipoInmueble || "Inmueble"} · ${codigo}`
                          : `Inmueble · ${codigo}`}
                      </h3>

                      <p style={cardLocationStyle}>
                        {obtenerTextoUbicacion(favorito)}
                      </p>
                    </div>

                    <span style={favoriteBadgeStyle}>Favorito</span>
                  </div>

                  {esObjeto && (
                    <>
                      <p style={priceStyle}>
                        {formatearPrecio(favorito.precio)}
                      </p>

                      <p style={addressStyle}>
                        {favorito.direccion || "Dirección no registrada"}
                      </p>

                      <div style={chipGridStyle}>
                        {favorito.finalidad && (
                          <span style={chipStyle}>{favorito.finalidad}</span>
                        )}

                        {favorito.area !== undefined && (
                          <span style={chipStyle}>{favorito.area} m²</span>
                        )}

                        {favorito.habitaciones !== undefined && (
                          <span style={chipStyle}>
                            {favorito.habitaciones} hab.
                          </span>
                        )}

                        {favorito.banos !== undefined && (
                          <span style={chipStyle}>{favorito.banos} baños</span>
                        )}
                      </div>
                    </>
                  )}

                  {!esObjeto && (
                    <div style={simpleFavoriteBoxStyle}>
                      <span>Código guardado</span>
                      <strong>{codigo}</strong>
                    </div>
                  )}

                  <div style={cardActionsStyle}>
                    <button
                      type="button"
                      onClick={() => eliminarFavorito(codigo)}
                      style={dangerButton}
                    >
                      Eliminar favorito
                    </button>
                  </div>
                </article>
              );
            })}
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

function EmptyState({ texto }) {
  return (
    <div style={emptyStateStyle}>
      <span style={{ fontSize: "2rem" }}>⭐</span>
      <p>{texto}</p>
    </div>
  );
}

const animations = `
  @keyframes fadeUpFavoritos {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseFavoritos {
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
  minHeight: "100vh",
  width: "100%",
  color: "#e8dfee",
  background: "transparent",
  animation: "fadeUpFavoritos 0.55s ease both",
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
  animation: "pulseFavoritos 1.8s ease-in-out infinite",
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

const twoColumnsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
  marginBottom: "22px",
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

const formRowStyle = {
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

const secondaryButton = {
  padding: "11px 16px",
  border: "1px solid #6d5f7a",
  borderRadius: "14px",
  background: "#3f2a57",
  color: "#d2bbff",
  fontWeight: "900",
  cursor: "pointer",
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

const favoriteBadgeStyle = {
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

const simpleFavoriteBoxStyle = {
  marginTop: "14px",
  padding: "12px",
  borderRadius: "16px",
  background: "#15121b",
  border: "1px solid #37333e",
  color: "#d2bbff",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
};

const cardActionsStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
  flexWrap: "wrap",
};

const dangerButton = {
  padding: "9px 13px",
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

export default FavoritosPage;