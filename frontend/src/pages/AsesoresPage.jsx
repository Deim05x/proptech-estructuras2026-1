import { useEffect, useState } from "react";
import asesorService from "../services/asesorService";

function AsesoresPage() {
  const [asesores, setAsesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState("");

  const [formulario, setFormulario] = useState({
    id: "",
    nombre: "",
    contacto: "",
    especialidadZona: "",
    cantidadCierres: "",
  });

  const cargarAsesores = async () => {
    try {
      setCargando(true);
      const data = await asesorService.listar();
      setAsesores(data);
    } catch (error) {
  console.error("Error al cargar asesores:", error);
  console.error("Respuesta del servidor:", error.response);
  alert("Error al cargar los asesores");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAsesores();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      id: "",
      nombre: "",
      contacto: "",
      especialidadZona: "",
      cantidadCierres: "",
    });
    setEditando(false);
    setIdEditando("");
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const asesor = {
      ...formulario,
      cantidadCierres: Number(formulario.cantidadCierres),
    };

    try {
      if (editando) {
        await asesorService.actualizar(idEditando, asesor);
        alert("Asesor actualizado correctamente");
      } else {
        await asesorService.crear(asesor);
        alert("Asesor creado correctamente");
      }

      limpiarFormulario();
      cargarAsesores();
    } catch (error) {
      console.error("Error al guardar asesor:", error);
      alert("No se pudo guardar el asesor");
    }
  };

  const cargarParaEditar = (asesor) => {
    setFormulario({
      id: asesor.id,
      nombre: asesor.nombre,
      contacto: asesor.contacto,
      especialidadZona: asesor.especialidadZona,
      cantidadCierres: asesor.cantidadCierres,
    });

    setIdEditando(asesor.id);
    setEditando(true);
  };

  const eliminarAsesor = async (id) => {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar el asesor ${id}?`);
    if (!confirmar) return;

    try {
      await asesorService.eliminar(id);
      alert("Asesor eliminado correctamente");
      cargarAsesores();
    } catch (error) {
      console.error("Error al eliminar asesor:", error);
      alert("No se pudo eliminar el asesor");
    }
  };

  return (
    <div>
      <h1>Gestión de Asesores</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>{editando ? "Editar asesor" : "Agregar asesor"}</h2>

        <form onSubmit={manejarSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input
              type="text"
              name="id"
              placeholder="ID"
              value={formulario.id}
              onChange={manejarCambio}
              disabled={editando}
              required
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="contacto"
              placeholder="Contacto"
              value={formulario.contacto}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="especialidadZona"
              placeholder="Especialidad de zona"
              value={formulario.especialidadZona}
              onChange={manejarCambio}
              required
            />
            <input
              type="number"
              name="cantidadCierres"
              placeholder="Cantidad de cierres"
              value={formulario.cantidadCierres}
              onChange={manejarCambio}
              required
            />
          </div>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <button type="submit">{editando ? "Actualizar" : "Guardar"}</button>
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
        <h2>Listado de asesores</h2>

        {cargando ? (
          <p>Cargando asesores...</p>
        ) : asesores.length === 0 ? (
          <p>No hay asesores registrados.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Especialidad</th>
                <th>Cierres</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asesores.map((asesor) => (
                <tr key={asesor.id}>
                  <td>{asesor.id}</td>
                  <td>{asesor.nombre}</td>
                  <td>{asesor.contacto}</td>
                  <td>{asesor.especialidadZona}</td>
                  <td>{asesor.cantidadCierres}</td>
                  <td>
                    <button onClick={() => cargarParaEditar(asesor)}>Editar</button>{" "}
                    <button onClick={() => eliminarAsesor(asesor.id)}>Eliminar</button>
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

export default AsesoresPage;