import api from "./api";

const asesorService = {
  listar: async () => {
    const response = await api.get("/asesores");
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/asesores/${id}`);
    return response.data;
  },

  crear: async (asesor) => {
    const response = await api.post("/asesores", asesor);
    return response.data;
  },

  actualizar: async (id, asesor) => {
    const response = await api.put(`/asesores/${id}`, asesor);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/asesores/${id}`);
    return response.data;
  },
};

export default asesorService;