import { useEffect, useState } from "react";
import inmuebleService from "../services/InmuebleService";

function InmueblesPage() {
  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [codigoEditando, setCodigoEditando] = useState("");

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

  const cargarInmuebles = async () => {
    try {
      setCargando(true);
      const data = await inmuebleService.listar();
      setInmuebles(data);
    } catch (error) {
      console.error("Error al cargar inmuebles:", error);
      alert("Error al cargar los inmuebles");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInmuebles();
  }, []);

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
    setCodigoEditando("");
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const inmueble = {
      ...formulario,
      precio: Number(formulario.precio),
      area: Number(formulario.area),
      habitaciones: Number(formulario.habitaciones),
      banos: Number(formulario.banos),
    };

    try {
      if (editando) {
        await inmuebleService.actualizar(codigoEditando, inmueble);
        alert("Inmueble actualizado correctamente");
      } else {
        await inmuebleService.crear(inmueble);
        alert("Inmueble creado correctamente");
      }

      limpiarFormulario();
      cargarInmuebles();
    } catch (error) {
      console.error("Error al guardar inmueble:", error);
      alert("No se pudo guardar el inmueble");
    }
  };

  const cargarParaEditar = (inmueble) => {
    setFormulario({
      codigo: inmueble.codigo,
      direccion: inmueble.direccion,
      ciudad: inmueble.ciudad,
      barrioZona: inmueble.barrioZona,
      tipoInmueble: inmueble.tipoInmueble,
      finalidad: inmueble.finalidad,
      precio: inmueble.precio,
      area: inmueble.area,
      habitaciones: inmueble.habitaciones,
      banos: inmueble.banos,
      estado: inmueble.estado,
      disponible: inmueble.disponible,
      idAsesorResponsable: inmueble.idAsesorResponsable,
    });

    setCodigoEditando(inmueble.codigo);
    setEditando(true);
  };

  const eliminarInmueble = async (codigo) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el inmueble ${codigo}?`
    );

    if (!confirmar) return;

    try {
      await inmuebleService.eliminar(codigo);
      alert("Inmueble eliminado correctamente");
      cargarInmuebles();
    } catch (error) {
      console.error("Error al eliminar inmueble:", error);
      alert("No se pudo eliminar el inmueble");
    }
  };

  return (
    <div>
      <h1>Gestión de Inmuebles</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>{editando ? "Editar inmueble" : "Agregar inmueble"}</h2>

        <form onSubmit={manejarSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input
              type="text"
              name="codigo"
              placeholder="Código"
              value={formulario.codigo}
              onChange={manejarCambio}
              disabled={editando}
              required
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={formulario.direccion}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={formulario.ciudad}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="barrioZona"
              placeholder="Barrio/Zona"
              value={formulario.barrioZona}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="tipoInmueble"
              placeholder="Tipo inmueble"
              value={formulario.tipoInmueble}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="finalidad"
              placeholder="Finalidad"
              value={formulario.finalidad}
              onChange={manejarCambio}
              required
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={formulario.precio}
              onChange={manejarCambio}
              required
            />
            <input
              type="number"
              name="area"
              placeholder="Área"
              value={formulario.area}
              onChange={manejarCambio}
              required
            />
            <input
              type="number"
              name="habitaciones"
              placeholder="Habitaciones"
              value={formulario.habitaciones}
              onChange={manejarCambio}
              required
            />
            <input
              type="number"
              name="banos"
              placeholder="Baños"
              value={formulario.banos}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="estado"
              placeholder="Estado"
              value={formulario.estado}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="idAsesorResponsable"
              placeholder="ID asesor responsable"
              value={formulario.idAsesorResponsable}
              onChange={manejarCambio}
            />
          </div>

          <div style={{ marginTop: "12px" }}>
            <label>
              <input
                type="checkbox"
                name="disponible"
                checked={formulario.disponible}
                onChange={manejarCambio}
              />{" "}
              Disponible
            </label>
          </div>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <button type="submit">
              {editando ? "Actualizar" : "Guardar"}
            </button>

            <button type="button" onClick={limpiarFormulario}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Listado de inmuebles</h2>

        {cargando ? (
          <p>Cargando inmuebles...</p>
        ) : inmuebles.length === 0 ? (
          <p>No hay inmuebles registrados.</p>
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
                <th>Estado</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inmuebles.map((inmueble) => (
                <tr key={inmueble.codigo}>
                  <td>{inmueble.codigo}</td>
                  <td>{inmueble.direccion}</td>
                  <td>{inmueble.ciudad}</td>
                  <td>{inmueble.tipoInmueble}</td>
                  <td>{inmueble.finalidad}</td>
                  <td>{inmueble.precio}</td>
                  <td>{inmueble.estado}</td>
                  <td>{inmueble.disponible ? "Sí" : "No"}</td>
                  <td>
                    <button onClick={() => cargarParaEditar(inmueble)}>
                      Editar
                    </button>{" "}
                    <button onClick={() => eliminarInmueble(inmueble.codigo)}>
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

export default InmueblesPage;