import api from "./api";

const API_URL = "/solicitudes";

const listar = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const buscarPorId = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

const crear = async (solicitud) => {
  const response = await api.post(API_URL, solicitud);
  return response.data;
};

const actualizar = async (id, solicitud) => {
  const response = await api.put(`${API_URL}/${id}`, solicitud);
  return response.data;
};

const eliminar = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

const listarPorCliente = async (idCliente) => {
  const response = await api.get(`${API_URL}/cliente/${idCliente}`);
  return response.data;
};

const listarPorEstado = async (estado) => {
  const response = await api.get(`${API_URL}/estado/${estado}`);
  return response.data;
};

const listarPendientes = async () => {
  const response = await api.get(`${API_URL}/pendientes`);
  return response.data;
};

const listarPrioritarias = async () => {
  const response = await api.get(`${API_URL}/prioritarias`);
  return response.data;
};

const cantidadCola = async () => {
  const response = await api.get(`${API_URL}/cola/cantidad`);
  return response.data;
};

const cantidadColaPrioridad = async () => {
  const response = await api.get(`${API_URL}/cola-prioridad/cantidad`);
  return response.data;
};

const recargarCola = async () => {
  const response = await api.post(`${API_URL}/cola/recargar`, {});
  return response.data;
};

const recargarColaPrioridad = async () => {
  const response = await api.post(`${API_URL}/cola-prioridad/recargar`, {});
  return response.data;
};

const procesarSiguiente = async (idAsesor = "", respuesta = "") => {
  const response = await api.post(`${API_URL}/cola/procesar`, {}, {
    params: { idAsesor, respuesta },
  });
  return response.data;
};

const procesarSiguientePrioritaria = async (idAsesor = "", respuesta = "") => {
  const response = await api.post(`${API_URL}/cola-prioridad/procesar`, {}, {
    params: { idAsesor, respuesta },
  });
  return response.data;
};

const cambiarEstado = async (id, estado) => {
  const response = await api.patch(`${API_URL}/${id}/estado`, {}, {
    params: { estado },
  });
  return response.data;
};

const asignarAsesor = async (id, idAsesor) => {
  const response = await api.patch(`${API_URL}/${id}/asesor`, {}, {
    params: { idAsesor },
  });
  return response.data;
};

const solicitudAtencionService = {
  listar,
  buscarPorId,
  crear,
  actualizar,
  eliminar,
  listarPorCliente,
  listarPorEstado,
  listarPendientes,
  listarPrioritarias,
  cantidadCola,
  cantidadColaPrioridad,
  recargarCola,
  recargarColaPrioridad,
  procesarSiguiente,
  procesarSiguientePrioritaria,
  cambiarEstado,
  asignarAsesor,
};

export default solicitudAtencionService;
