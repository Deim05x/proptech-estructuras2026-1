import api from "./api";

const visitaService = {
  listar: async () => {
    const response = await api.get("/visitas");
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/visitas/${id}`);
    return response.data;
  },

  crear: async (visita) => {
    const response = await api.post("/visitas", visita);
    return response.data;
  },

  agendar: async (visita) => {
    const response = await api.post("/visitas/agendar", visita);
    return response.data;
  },

  actualizar: async (id, visita) => {
    const response = await api.put(`/visitas/${id}`, visita);
    return response.data;
  },

  reprogramar: async (id, datos) => {
    const response = await api.put(`/visitas/${id}/reprogramar`, datos);
    return response.data;
  },

  cancelar: async (id, datos) => {
    const response = await api.put(`/visitas/${id}/cancelar`, datos);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/visitas/${id}`);
    return response.data;
  },

  listarPorEstado: async (estado) => {
    const response = await api.get(`/visitas/estado/${estado}`);
    return response.data;
  },
};

export default visitaService;