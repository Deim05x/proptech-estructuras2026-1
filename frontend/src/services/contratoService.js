import api from "./api";

const API_URL = "/contratos";

const listar = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const buscarPorId = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

const crear = async (contrato) => {
  const response = await api.post(API_URL, contrato);
  return response.data;
};

const actualizar = async (id, contrato) => {
  const response = await api.put(`${API_URL}/${id}`, contrato);
  return response.data;
};

const eliminar = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

const listarPorEstado = async (estado) => {
  const response = await api.get(`${API_URL}/estado/${estado}`);
  return response.data;
};

const listarPorCliente = async (idCliente) => {
  const response = await api.get(`${API_URL}/cliente/${idCliente}`);
  return response.data;
};

const listarProximosAVencer = async (dias = 30) => {
  const response = await api.get(`${API_URL}/proximos-vencer`, {
    params: { dias },
  });
  return response.data;
};

const listarVencidos = async () => {
  const response = await api.get(`${API_URL}/vencidos`);
  return response.data;
};

const cambiarEstado = async (id, estado) => {
  const response = await api.patch(`${API_URL}/${id}/estado`, {}, {
    params: { estado },
  });
  return response.data;
};

const contratoService = {
  listar,
  buscarPorId,
  crear,
  actualizar,
  eliminar,
  listarPorEstado,
  listarPorCliente,
  listarProximosAVencer,
  listarVencidos,
  cambiarEstado,
};

export default contratoService;
