import { useEffect, useState } from "react";
import visitaService from "../services/visitaService";

function VisitasPage() {
  const [visitas, setVisitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [formulario, setFormulario] = useState({
    id: "",
    idCliente: "",
    codigoInmueble: "",
    idAsesor: "",
    fecha: "",
    hora: "",
    estado: "Programada",
    observacion: "",
  });

  const [formularioReprogramar, setFormularioReprogramar] = useState({
    fecha: "",
    hora: "",
    observacion: "",
  });

  const [formularioCancelar, setFormularioCancelar] = useState({
    observacion: "",
  });

  const cargarVisitas = async () => {
    try {
      setCargando(true);
      const data = filtroEstado
        ? await visitaService.listarPorEstado(filtroEstado)
        : await visitaService.listar();

      setVisitas(data);
    } catch (error) {
      console.error("Error al cargar visitas:", error);
      alert("Error al cargar las visitas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVisitas();
  }, [filtroEstado]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const manejarCambioReprogramar = (e) => {
    const { name, value } = e.target;
    setFormularioReprogramar({
      ...formularioReprogramar,
      [name]: value,
    });
  };

  const manejarCambioCancelar = (e) => {
    const { name, value } = e.target;
    setFormularioCancelar({
      ...formularioCancelar,
      [name]: value,
    });
  };

  const limpiarFormularioPrincipal = () => {
    setFormulario({
      id: "",
      idCliente: "",
      codigoInmueble: "",
      idAsesor: "",
      fecha: "",
      hora: "",
      estado: "Programada",
      observacion: "",
    });
    setEditando(false);
    setIdEditando(null);
    setModoFormulario("crear");
  };

  const limpiarFormularioReprogramar = () => {
    setFormularioReprogramar({
      fecha: "",
      hora: "",
      observacion: "",
    });
  };

  const limpiarFormularioCancelar = () => {
    setFormularioCancelar({
      observacion: "",
    });
  };

  const manejarSubmitPrincipal = async (e) => {
    e.preventDefault();

    const visita = {
      ...formulario,
      id: Number(formulario.id),
    };

    try {
      if (editando) {
        await visitaService.actualizar(idEditando, visita);
        alert("Visita actualizada correctamente");
      } else if (modoFormulario === "agendar") {
        await visitaService.agendar(visita);
        alert("Visita agendada correctamente");
      } else {
        await visitaService.crear(visita);
        alert("Visita creada correctamente");
      }

      limpiarFormularioPrincipal();
      cargarVisitas();
    } catch (error) {
      console.error("Error al guardar visita:", error);
      alert("No se pudo guardar la visita");
    }
  };

  const cargarParaEditar = (visita) => {
    setFormulario({
      id: visita.id,
      idCliente: visita.idCliente,
      codigoInmueble: visita.codigoInmueble,
      idAsesor: visita.idAsesor,
      fecha: visita.fecha,
      hora: visita.hora,
      estado: visita.estado,
      observacion: visita.observacion || "",
    });

    setIdEditando(visita.id);
    setEditando(true);
    setModoFormulario("editar");
  };

  const prepararAgendar = () => {
    limpiarFormularioPrincipal();
    setModoFormulario("agendar");
  };

  const prepararCrearNormal = () => {
    limpiarFormularioPrincipal();
    setModoFormulario("crear");
  };

  const reprogramarVisita = async (id) => {
    if (!formularioReprogramar.fecha || !formularioReprogramar.hora) {
      alert("Debes ingresar nueva fecha y nueva hora");
      return;
    }

    try {
      await visitaService.reprogramar(id, formularioReprogramar);
      alert("Visita reprogramada correctamente");
      limpiarFormularioReprogramar();
      cargarVisitas();
    } catch (error) {
      console.error("Error al reprogramar visita:", error);
      alert("No se pudo reprogramar la visita");
    }
  };

  const cancelarVisita = async (id) => {
    try {
      await visitaService.cancelar(id, formularioCancelar);
      alert("Visita cancelada correctamente");
      limpiarFormularioCancelar();
      cargarVisitas();
    } catch (error) {
      console.error("Error al cancelar visita:", error);
      alert("No se pudo cancelar la visita");
    }
  };

  const eliminarVisita = async (id) => {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar la visita ${id}?`);
    if (!confirmar) return;

    try {
      await visitaService.eliminar(id);
      alert("Visita eliminada correctamente");
      cargarVisitas();
    } catch (error) {
      console.error("Error al eliminar visita:", error);
      alert("No se pudo eliminar la visita");
    }
  };

  return (
    <div>
      <h1>Gestión de Visitas</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={prepararCrearNormal}>Modo crear</button>
        <button onClick={prepararAgendar}>Modo agendar</button>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todas las visitas</option>
          <option value="Programada">Programada</option>
          <option value="Reprogramada">Reprogramada</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <button onClick={() => setFiltroEstado("")}>Quitar filtro</button>
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
        <h2>
          {editando
            ? "Editar visita"
            : modoFormulario === "agendar"
            ? "Agendar visita"
            : "Crear visita"}
        </h2>

        <form onSubmit={manejarSubmitPrincipal}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input
              type="number"
              name="id"
              placeholder="ID"
              value={formulario.id}
              onChange={manejarCambio}
              disabled={editando}
              required
            />
            <input
              type="text"
              name="idCliente"
              placeholder="ID cliente"
              value={formulario.idCliente}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="codigoInmueble"
              placeholder="Código inmueble"
              value={formulario.codigoInmueble}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              name="idAsesor"
              placeholder="ID asesor"
              value={formulario.idAsesor}
              onChange={manejarCambio}
              required
            />
            <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={manejarCambio}
              required
            />
            <input
              type="time"
              name="hora"
              value={formulario.hora}
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
              name="observacion"
              placeholder="Observación"
              value={formulario.observacion}
              onChange={manejarCambio}
            />
          </div>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <button type="submit">
              {editando
                ? "Actualizar"
                : modoFormulario === "agendar"
                ? "Agendar"
                : "Guardar"}
            </button>

            <button type="button" onClick={limpiarFormularioPrincipal}>
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
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Reprogramar visita</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "12px" }}>
          <input
            type="date"
            name="fecha"
            value={formularioReprogramar.fecha}
            onChange={manejarCambioReprogramar}
          />
          <input
            type="time"
            name="hora"
            value={formularioReprogramar.hora}
            onChange={manejarCambioReprogramar}
          />
          <input
            type="text"
            name="observacion"
            placeholder="Observación de reprogramación"
            value={formularioReprogramar.observacion}
            onChange={manejarCambioReprogramar}
          />
        </div>

        <p style={{ marginTop: "10px" }}>
          Usa el botón <strong>Reprogramar</strong> de la tabla para aplicar estos datos a una visita.
        </p>
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
        <h2>Cancelar visita</h2>

        <input
          type="text"
          name="observacion"
          placeholder="Motivo de cancelación"
          value={formularioCancelar.observacion}
          onChange={manejarCambioCancelar}
          style={{ width: "100%" }}
        />

        <p style={{ marginTop: "10px" }}>
          Usa el botón <strong>Cancelar</strong> de la tabla para cancelar una visita con esta observación.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Listado de visitas</h2>

        {cargando ? (
          <p>Cargando visitas...</p>
        ) : visitas.length === 0 ? (
          <p>No hay visitas registradas.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Inmueble</th>
                <th>Asesor</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Observación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((visita) => (
                <tr key={visita.id}>
                  <td>{visita.id}</td>
                  <td>{visita.idCliente}</td>
                  <td>{visita.codigoInmueble}</td>
                  <td>{visita.idAsesor}</td>
                  <td>{visita.fecha}</td>
                  <td>{visita.hora}</td>
                  <td>{visita.estado}</td>
                  <td>{visita.observacion}</td>
                  <td>
                    <button onClick={() => cargarParaEditar(visita)}>Editar</button>{" "}
                    <button onClick={() => reprogramarVisita(visita.id)}>
                      Reprogramar
                    </button>{" "}
                    <button onClick={() => cancelarVisita(visita.id)}>
                      Cancelar
                    </button>{" "}
                    <button onClick={() => eliminarVisita(visita.id)}>
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

export default VisitasPage;