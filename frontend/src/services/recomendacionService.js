import api from "./api";

const recomendacionService = {
  recomendarPorCliente: async (clienteId) => {
    const response = await api.get(`/recomendaciones/cliente/${clienteId}`);
    return response.data;
  },
};

export default recomendacionService;