import api from "./api";

const historialService = {
  listar: async () => {
    const response = await api.get("/historial");
    return response.data;
  },

  listarPorCliente: async (clienteId) => {
    const response = await api.get(`/historial/cliente/${clienteId}`);
    return response.data;
  },

  listarReversoPorCliente: async (clienteId) => {
    const response = await api.get(`/historial/cliente/${clienteId}/reverso`);
    return response.data;
  },

  crear: async (historial) => {
    const response = await api.post("/historial", historial);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/historial/${id}`);
    return response.data;
  },
};

export default historialService;