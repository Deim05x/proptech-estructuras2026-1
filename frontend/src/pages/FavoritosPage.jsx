import { useState } from "react";
import favoritoService from "../services/favoritoService";

function FavoritosPage() {
  const [clienteId, setClienteId] = useState("");
  const [codigoInmueble, setCodigoInmueble] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarFavoritos = async () => {
    if (!clienteId.trim()) {
      alert("Debes ingresar el ID del cliente");
      return;
    }

    try {
      setCargando(true);
      const data = await favoritoService.obtenerFavoritos(clienteId);
      setFavoritos(data);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      alert("No se pudieron cargar los favoritos");
    } finally {
      setCargando(false);
    }
  };

  const agregarFavorito = async () => {
    if (!clienteId.trim() || !codigoInmueble.trim()) {
      alert("Debes ingresar el ID del cliente y el código del inmueble");
      return;
    }

    try {
      await favoritoService.agregarFavorito(clienteId, codigoInmueble);
      alert("Favorito agregado correctamente");
      setCodigoInmueble("");
      cargarFavoritos();
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      alert("No se pudo agregar el favorito");
    }
  };

  const eliminarFavorito = async (codigo) => {
    try {
      await favoritoService.eliminarFavorito(clienteId, codigo);
      alert("Favorito eliminado correctamente");
      cargarFavoritos();
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("No se pudo eliminar el favorito");
    }
  };

  return (
    <div>
      <h1>Favoritos por Cliente</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Consultar favoritos</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="ID del cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
          <button onClick={cargarFavoritos}>Buscar favoritos</button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Agregar favorito</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Código del inmueble"
            value={codigoInmueble}
            onChange={(e) => setCodigoInmueble(e.target.value)}
          />
          <button onClick={agregarFavorito}>Agregar favorito</button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Listado de favoritos</h2>

        {cargando ? (
          <p>Cargando favoritos...</p>
        ) : favoritos.length === 0 ? (
          <p>No hay favoritos para mostrar.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Código</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Tipo</th>
                <th>Finalidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {favoritos.map((inmueble) => (
                <tr key={inmueble.codigo}>
                  <td>{inmueble.codigo}</td>
                  <td>{inmueble.direccion}</td>
                  <td>{inmueble.ciudad}</td>
                  <td>{inmueble.tipoInmueble}</td>
                  <td>{inmueble.finalidad}</td>
                  <td>{inmueble.precio}</td>
                  <td>
                    <button onClick={() => eliminarFavorito(inmueble.codigo)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FavoritosPage;