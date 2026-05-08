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
      setFavoritos(data);
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

  return (
    <div>
      <h2 style={{ color: "#43214d", marginBottom: "8px" }}>Mis favoritos</h2>

      <p style={{ color: "#7e747d", marginBottom: "20px" }}>
        Consulta y administra los inmuebles favoritos del cliente.
      </p>

      <div style={panelStyle}>
        <h3 style={titleStyle}>Buscar favoritos</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="ID del cliente"
            value={clienteId}
            disabled={rol === "CLIENTE"}
            onChange={(e) => setClienteId(e.target.value)}
            style={{
              ...inputStyle,
              maxWidth: "260px",
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
        <h3 style={titleStyle}>Agregar favorito</h3>

        <form onSubmit={agregarFavorito}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Código del inmueble, ejemplo: INM-001"
              value={codigoInmueble}
              onChange={(e) => setCodigoInmueble(e.target.value)}
              style={{ ...inputStyle, maxWidth: "300px" }}
            />

            <button type="submit" style={primaryButton}>
              Agregar favorito
            </button>
          </div>
        </form>
      </div>

      <div style={panelStyle}>
        <h3 style={titleStyle}>Listado de favoritos</h3>

        {cargando ? (
          <p>Cargando favoritos...</p>
        ) : favoritos.length === 0 ? (
          <p>No hay favoritos registrados.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={theadRowStyle}>
                <th>Cliente</th>
                <th>Inmueble</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {favoritos.map((favorito, index) => {
                const codigo =
                  favorito.codigoInmueble ||
                  favorito.inmuebleCodigo ||
                  favorito.codigo ||
                  favorito;

                return (
                  <tr key={`${codigo}-${index}`}>
                    <td style={tdStyle}>{clienteId}</td>
                    <td style={tdStyle}>{codigo}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => eliminarFavorito(codigo)}
                        style={dangerButton}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

const dangerButton = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
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

export default FavoritosPage;