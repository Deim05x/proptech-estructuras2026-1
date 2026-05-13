import api from "./api";

const historialService = {
  listarPorCliente: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/historial`);
    return response.data;
  },

  listarReversoPorCliente: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/historial/reverso`);
    return response.data;
  },
};

export default historialService;
