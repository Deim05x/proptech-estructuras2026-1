import api from "./api";

const eventoInusualService = {
  listar: async () => {
    const response = await api.get("/eventos-inusuales");
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/eventos-inusuales/${id}`);
    return response.data;
  },

  listarPorEstado: async (estado) => {
    const response = await api.get(`/eventos-inusuales/estado/${estado}`);
    return response.data;
  },

  detectarAutomaticamente: async () => {
    const response = await api.post("/eventos-inusuales/detectar");
    return response.data;
  },

  crearManual: async (evento) => {
    const response = await api.post("/eventos-inusuales", evento);
    return response.data;
  },

  cambiarEstado: async (id, estado) => {
    const response = await api.put(
      `/eventos-inusuales/${id}/estado?estado=${estado}`
    );
    return response.data;
  },
};

export default eventoInusualService;