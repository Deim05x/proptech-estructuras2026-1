import api from "./api";

const API_URL = "/validaciones";

const validar = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};

const validarAgendarVisita = async (data) => {
  const response = await api.post(`${API_URL}/agendar-visita`, data);
  return response.data;
};

const validarCrearOperacion = async (data) => {
  const response = await api.post(`${API_URL}/crear-operacion`, data);
  return response.data;
};

const validarCrearContrato = async (data) => {
  const response = await api.post(`${API_URL}/crear-contrato`, data);
  return response.data;
};

const validarIntencionComercial = async (data) => {
  const response = await api.post(`${API_URL}/intencion-comercial`, data);
  return response.data;
};

const validarConsistenciaGeneral = async () => {
  const response = await api.get(`${API_URL}/consistencia-general`);
  return response.data;
};

const validacionNegocioService = {
  validar,
  validarAgendarVisita,
  validarCrearOperacion,
  validarCrearContrato,
  validarIntencionComercial,
  validarConsistenciaGeneral,
};

export default validacionNegocioService;
