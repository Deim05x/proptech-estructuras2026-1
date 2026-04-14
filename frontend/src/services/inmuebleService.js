import api from "./api";

const inmuebleService = {
  listar: async () => {
    const response = await api.get("/inmuebles");
    return response.data;
  },

  obtenerPorCodigo: async (codigo) => {
    const response = await api.get(`/inmuebles/${codigo}`);
    return response.data;
  },

  crear: async (inmueble) => {
    const response = await api.post("/inmuebles", inmueble);
    return response.data;
  },

  actualizar: async (codigo, inmueble) => {
    const response = await api.put(`/inmuebles/${codigo}`, inmueble);
    return response.data;
  },

  eliminar: async (codigo) => {
    const response = await api.delete(`/inmuebles/${codigo}`);
    return response.data;
  },
};

export default inmuebleService;