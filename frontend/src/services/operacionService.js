import api from "./api";

const operacionService = {
  listar: async () => {
    const response = await api.get("/operaciones");
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/operaciones/${id}`);
    return response.data;
  },

  crear: async (operacion) => {
    const response = await api.post("/operaciones", operacion);
    return response.data;
  },

  actualizar: async (id, operacion) => {
    const response = await api.put(`/operaciones/${id}`, operacion);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/operaciones/${id}`);
    return response.data;
  },
};

export default operacionService;