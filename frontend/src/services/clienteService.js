import api from "./api";

const clienteService = {
  listar: async () => {
    const response = await api.get("/clientes");
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  crear: async (cliente) => {
    const response = await api.post("/clientes", cliente);
    return response.data;
  },

  actualizar: async (id, cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },
};

export default clienteService;