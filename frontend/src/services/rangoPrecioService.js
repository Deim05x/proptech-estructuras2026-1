import api from "./api";

const API_URL = "/rangos-precio";

const buscarPorRango = async (minimo, maximo) => {
  const response = await api.get(API_URL, {
    params: { minimo, maximo },
  });

  return response.data;
};

const listarOrdenados = async () => {
  const response = await api.get(`${API_URL}/ordenados`);
  return response.data;
};

const rangoPrecioService = {
  buscarPorRango,
  listarOrdenados,
};

export default rangoPrecioService;
