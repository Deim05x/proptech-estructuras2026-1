import { useEffect, useState } from "react";
import carruselInmuebleService from "../services/CarruselInmuebleService";

function CarruselInmueblesPage() {
  const [inmuebleActual, setInmuebleActual] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [indice, setIndice] = useState(0);
  const [cargando, setCargando] = useState(true);

  const cargarEstadoCarrusel = async () => {
    try {
      setCargando(true);

      const [actual, total, indiceActual] = await Promise.all([
        carruselInmuebleService.obtenerActual(),
        carruselInmuebleService.cantidad(),
        carruselInmuebleService.indice(),
      ]);

      setInmuebleActual(actual);
      setCantidad(total);
      setIndice(indiceActual);
    } catch (error) {
      console.error("Error al cargar carrusel:", error);
      alert("No se pudo cargar el carrusel de inmuebles");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstadoCarrusel();
  }, []);

  const irSiguiente = async () => {
    try {
      const data = await carruselInmuebleService.siguiente();
      setInmuebleActual(data);
      await actualizarMetadatos();
    } catch (error) {
      console.error("Error al avanzar en el carrusel:", error);
      alert("No se pudo avanzar al siguiente inmueble");
    }
  };

  const irAnterior = async () => {
    try {
      const data = await carruselInmuebleService.anterior();
      setInmuebleActual(data);
      await actualizarMetadatos();
    } catch (error) {
      console.error("Error al retroceder en el carrusel:", error);
      alert("No se pudo ir al inmueble anterior");
    }
  };

  const reiniciarCarrusel = async () => {
    try {
      await carruselInmuebleService.reiniciar();
      alert("Carrusel reiniciado correctamente");
      await cargarEstadoCarrusel();
    } catch (error) {
      console.error("Error al reiniciar carrusel:", error);
      alert("No se pudo reiniciar el carrusel");
    }
  };

  const recargarCarrusel = async () => {
    try {
      await carruselInmuebleService.recargar();
      alert("Carrusel recargado correctamente");
      await cargarEstadoCarrusel();
    } catch (error) {
      console.error("Error al recargar carrusel:", error);
      alert("No se pudo recargar el carrusel");
    }
  };

  const actualizarMetadatos = async () => {
    try {
      const [total, indiceActual] = await Promise.all([
        carruselInmuebleService.cantidad(),
        carruselInmuebleService.indice(),
      ]);

      setCantidad(total);
      setIndice(indiceActual);
    } catch (error) {
      console.error("Error al actualizar metadatos del carrusel:", error);
    }
  };

  return (
    <div>
      <h1>Carrusel de Inmuebles</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <button onClick={irAnterior}>Anterior</button>
        <button onClick={irSiguiente}>Siguiente</button>
        <button onClick={reiniciarCarrusel}>Reiniciar</button>
        <button onClick={recargarCarrusel}>Recargar</button>
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
        <h2>Estado del carrusel</h2>
        <p><strong>Cantidad de inmuebles:</strong> {cantidad}</p>
        <p><strong>Índice actual:</strong> {indice}</p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Inmueble actual</h2>

        {cargando ? (
          <p>Cargando carrusel...</p>
        ) : !inmuebleActual ? (
          <p>No hay inmuebles cargados en el carrusel.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <p><strong>Código:</strong> {inmuebleActual.codigo}</p>
            <p><strong>Dirección:</strong> {inmuebleActual.direccion}</p>
            <p><strong>Ciudad:</strong> {inmuebleActual.ciudad}</p>
            <p><strong>Barrio/Zona:</strong> {inmuebleActual.barrioZona}</p>
            <p><strong>Tipo:</strong> {inmuebleActual.tipoInmueble}</p>
            <p><strong>Finalidad:</strong> {inmuebleActual.finalidad}</p>
            <p><strong>Precio:</strong> {inmuebleActual.precio}</p>
            <p><strong>Área:</strong> {inmuebleActual.area}</p>
            <p><strong>Habitaciones:</strong> {inmuebleActual.habitaciones}</p>
            <p><strong>Baños:</strong> {inmuebleActual.banos}</p>
            <p><strong>Estado:</strong> {inmuebleActual.estado}</p>
            <p><strong>Disponible:</strong> {inmuebleActual.disponible ? "Sí" : "No"}</p>
            <p><strong>Asesor responsable:</strong> {inmuebleActual.idAsesorResponsable}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarruselInmueblesPage;