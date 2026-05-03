import { useEffect, useState } from "react";
import rotacionAsesorService from "../services/rotacionAsesorService";

function RotacionAsesoresPage() {
  const [rueda, setRueda] = useState([]);
  const [asesorActual, setAsesorActual] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [cargando, setCargando] = useState(true);

  const cargarEstadoRotacion = async () => {
    try {
      setCargando(true);

      const [ruedaData, actualData, cantidadData] = await Promise.all([
        rotacionAsesorService.obtenerRueda(),
        rotacionAsesorService.obtenerActual(),
        rotacionAsesorService.cantidad(),
      ]);

      setRueda(ruedaData);
      setAsesorActual(actualData);
      setCantidad(cantidadData);
    } catch (error) {
      console.error("Error al cargar rotación de asesores:", error);
      alert("No se pudo cargar la rotación de asesores");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstadoRotacion();
  }, []);

  const obtenerSiguiente = async () => {
    try {
      const data = await rotacionAsesorService.obtenerSiguiente();
      setAsesorActual(data);
      const cantidadData = await rotacionAsesorService.cantidad();
      setCantidad(cantidadData);
    } catch (error) {
      console.error("Error al obtener siguiente asesor:", error);
      alert("No se pudo obtener el siguiente asesor");
    }
  };

  const reiniciarRotacion = async () => {
    try {
      await rotacionAsesorService.reiniciar();
      alert("Rotación reiniciada correctamente");
      cargarEstadoRotacion();
    } catch (error) {
      console.error("Error al reiniciar rotación:", error);
      alert("No se pudo reiniciar la rotación");
    }
  };

  const recargarRueda = async () => {
    try {
      await rotacionAsesorService.recargar();
      alert("Rueda recargada correctamente");
      cargarEstadoRotacion();
    } catch (error) {
      console.error("Error al recargar rueda:", error);
      alert("No se pudo recargar la rueda de asesores");
    }
  };

  return (
    <div>
      <h1>Rotación de Asesores</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={obtenerSiguiente}>Siguiente asesor</button>
        <button onClick={reiniciarRotacion}>Reiniciar rotación</button>
        <button onClick={recargarRueda}>Recargar rueda</button>
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
        <h2>Estado de la rotación</h2>
        <p>
          <strong>Cantidad de asesores:</strong> {cantidad}
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
        <h2>Asesor actual</h2>

        {cargando ? (
          <p>Cargando asesor actual...</p>
        ) : !asesorActual ? (
          <p>No hay asesores cargados en la rueda.</p>
        ) : (
          <div>
            <p><strong>ID:</strong> {asesorActual.id}</p>
            <p><strong>Nombre:</strong> {asesorActual.nombre}</p>
            <p><strong>Contacto:</strong> {asesorActual.contacto}</p>
            <p><strong>Especialidad:</strong> {asesorActual.especialidadZona}</p>
            <p><strong>Cantidad de cierres:</strong> {asesorActual.cantidadCierres}</p>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Rueda de asesores</h2>

        {cargando ? (
          <p>Cargando rueda...</p>
        ) : rueda.length === 0 ? (
          <p>No hay asesores para mostrar.</p>
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
              </tr>
            </thead>
            <tbody>
              {rueda.map((asesor) => (
                <tr key={asesor.id}>
                  <td>{asesor.id}</td>
                  <td>{asesor.nombre}</td>
                  <td>{asesor.contacto}</td>
                  <td>{asesor.especialidadZona}</td>
                  <td>{asesor.cantidadCierres}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RotacionAsesoresPage;