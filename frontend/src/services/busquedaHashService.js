import api from "./api";

const API_URL = "/busqueda-hash";

const buscarCliente = async (idCliente) => {
  const response = await api.get(`${API_URL}/clientes/${idCliente}`);
  return response.data;
};

const buscarInmueble = async (codigoInmueble) => {
  const response = await api.get(`${API_URL}/inmuebles/${codigoInmueble}`);
  return response.data;
};

const buscarAsesor = async (idAsesor) => {
  const response = await api.get(`${API_URL}/asesores/${idAsesor}`);
  return response.data;
};

const busquedaHashService = {
  buscarCliente,
  buscarInmueble,
  buscarAsesor,
};

export default busquedaHashService;
