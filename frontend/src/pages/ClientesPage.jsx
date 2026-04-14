import { useEffect, useState } from "react";
import clienteService from "../services/ClienteService";

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState("");

  const [formulario, setFormulario] = useState({
    id: "",
    nombre: "",
    correo: "",
    telefono: "",
    tipoCliente: "",
    presupuesto: "",
    zonasInteres: "",
    tipoInmuebleDeseado: "",
    habitacionesMinimas: "",
    estadoBusqueda: "",
  });

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const data = await clienteService.listar();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      alert("Error al cargar los clientes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
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
      correo: "",
      telefono: "",
      tipoCliente: "",
      presupuesto: "",
      zonasInteres: "",
      tipoInmuebleDeseado: "",
      habitacionesMinimas: "",
      estadoBusqueda: "",
    });
    setEditando(false);
    setIdEditando("");
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const cliente = {
      ...formulario,
      presupuesto: Number(formulario.presupuesto),
      habitacionesMinimas: Number(formulario.habitacionesMinimas),
    };

    try {
      if (editando) {
        await clienteService.actualizar(idEditando, cliente);
        alert("Cliente actualizado correctamente");
      } else {
        await clienteService.crear(cliente);
        alert("Cliente creado correctamente");
      }

      limpiarFormulario();
      cargarClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("No se pudo guardar el cliente");
    }
  };

  const cargarParaEditar = (cliente) => {
    setFormulario({
      id: cliente.id,
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
      tipoCliente: cliente.tipoCliente,
      presupuesto: cliente.presupuesto,
      zonasInteres: cliente.zonasInteres,
      tipoInmuebleDeseado: cliente.tipoInmuebleDeseado,
      habitacionesMinimas: cliente.habitacionesMinimas,
      estadoBusqueda: cliente.estadoBusqueda,
    });

    setIdEditando(cliente.id);
    setEditando(true);
  };

  const eliminarCliente = async (id) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el cliente ${id}?`
    );

    if (!confirmar) return;

    try {
      await clienteService.eliminar(id);
      alert("Cliente eliminado correctamente");
      cargarClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("No se pudo eliminar el cliente");
    }
  };

  return (
    <div>
      <h1>Gestión de Clientes</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>{editando ? "Editar cliente" : "Agregar cliente"}</h2>

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
              type="email"
              name="correo"
              placeholder="Correo"
              value={formulario.correo}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formulario.telefono}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="tipoCliente"
              placeholder="Tipo cliente"
              value={formulario.tipoCliente}
              onChange={manejarCambio}
              required
            />
            <input
              type="number"
              name="presupuesto"
              placeholder="Presupuesto"
              value={formulario.presupuesto}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="zonasInteres"
              placeholder="Zonas de interés"
              value={formulario.zonasInteres}
              onChange={manejarCambio}
            />
            <input
              type="text"
              name="tipoInmuebleDeseado"
              placeholder="Tipo inmueble deseado"
              value={formulario.tipoInmuebleDeseado}
              onChange={manejarCambio}
            />
            <input
              type="number"
              name="habitacionesMinimas"
              placeholder="Habitaciones mínimas"
              value={formulario.habitacionesMinimas}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="estadoBusqueda"
              placeholder="Estado búsqueda"
              value={formulario.estadoBusqueda}
              onChange={manejarCambio}
              required
            />
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
        <h2>Listado de clientes</h2>

        {cargando ? (
          <p>Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <p>No hay clientes registrados.</p>
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
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th>Presupuesto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.tipoCliente}</td>
                  <td>{cliente.presupuesto}</td>
                  <td>{cliente.estadoBusqueda}</td>
                  <td>
                    <button onClick={() => cargarParaEditar(cliente)}>
                      Editar
                    </button>{" "}
                    <button onClick={() => eliminarCliente(cliente.id)}>
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

export default ClientesPage;