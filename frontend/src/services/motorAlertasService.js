import api from "./api";

const API_URL = "/motor-alertas";

const generarTodas = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const contratosProximos = async () => {
  const response = await api.get(`${API_URL}/contratos-proximos`);
  return response.data;
};

const contratosVencidos = async () => {
  const response = await api.get(`${API_URL}/contratos-vencidos`);
  return response.data;
};

const solicitudesPrioritarias = async () => {
  const response = await api.get(`${API_URL}/solicitudes-prioritarias`);
  return response.data;
};

const clientesAltaIntencion = async () => {
  const response = await api.get(`${API_URL}/clientes-alta-intencion`);
  return response.data;
};

const inmueblesAltaDemanda = async () => {
  const response = await api.get(`${API_URL}/inmuebles-alta-demanda`);
  return response.data;
};

const motorAlertasService = {
  generarTodas,
  contratosProximos,
  contratosVencidos,
  solicitudesPrioritarias,
  clientesAltaIntencion,
  inmueblesAltaDemanda,
};

export default motorAlertasService;
