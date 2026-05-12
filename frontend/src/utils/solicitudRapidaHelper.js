import solicitudAtencionService from "../services/solicitudAtencionService";
import authService from "../services/authService";

const generarIdSolicitud = () => {
  const timestamp = Date.now();
  const aleatorio = Math.floor(Math.random() * 1000);

  return `SOL-${timestamp}-${aleatorio}`;
};

const obtenerPrioridadPorTipo = (tipoSolicitud) => {
  if (tipoSolicitud === "COMPRA" || tipoSolicitud === "ARRIENDO") {
    return "ALTA";
  }

  if (tipoSolicitud === "VISITA") {
    return "MEDIA";
  }

  return "BAJA";
};

const obtenerDescripcionPorTipo = (tipoSolicitud, inmueble) => {
  const codigo = inmueble?.codigo || inmueble?.codigoInmueble || "SIN-CODIGO";
  const tipo = inmueble?.tipoInmueble || "inmueble";
  const ciudad = inmueble?.ciudad || "ciudad no registrada";
  const zona = inmueble?.barrioZona || inmueble?.zona || "zona no registrada";

  if (tipoSolicitud === "COMPRA") {
    return `El cliente manifiesta intención de compra sobre el inmueble ${codigo}, tipo ${tipo}, ubicado en ${zona}, ${ciudad}.`;
  }

  if (tipoSolicitud === "ARRIENDO") {
    return `El cliente manifiesta intención de arriendo sobre el inmueble ${codigo}, tipo ${tipo}, ubicado en ${zona}, ${ciudad}.`;
  }

  if (tipoSolicitud === "VISITA") {
    return `El cliente solicita agendar una visita para conocer el inmueble ${codigo}, tipo ${tipo}, ubicado en ${zona}, ${ciudad}.`;
  }

  return `El cliente solicita más información sobre el inmueble ${codigo}, tipo ${tipo}, ubicado en ${zona}, ${ciudad}.`;
};

const crearSolicitudRapida = async (tipoSolicitud, inmueble) => {
  const clienteId = authService.getClienteId();

  if (!clienteId) {
    throw new Error(
      "No se encontró el ID del cliente autenticado. Inicia sesión como cliente."
    );
  }

  const codigoInmueble =
    inmueble?.codigo || inmueble?.codigoInmueble || inmueble?.id || "";

  if (!codigoInmueble) {
    throw new Error("No se pudo identificar el código del inmueble.");
  }

  const solicitud = {
    id: generarIdSolicitud(),
    idCliente: clienteId,
    codigoInmueble,
    tipoSolicitud,
    descripcion: obtenerDescripcionPorTipo(tipoSolicitud, inmueble),
    estado: "PENDIENTE",
    prioridad: obtenerPrioridadPorTipo(tipoSolicitud),
    fechaCreacion: null,
    fechaAtencion: null,
    idAsesorAsignado: "",
    respuesta: "",
  };

  return await solicitudAtencionService.crear(solicitud);
};

const solicitudRapidaHelper = {
  crearSolicitudRapida,
  generarIdSolicitud,
  obtenerPrioridadPorTipo,
  obtenerDescripcionPorTipo,
};

export default solicitudRapidaHelper;