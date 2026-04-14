import api from "./api";

const carruselInmuebleService = {
  obtenerCarrusel: async () => {
    const response = await api.get("/carrusel-inmuebles");
    return response.data;
  },

  obtenerActual: async () => {
    const response = await api.get("/carrusel-inmuebles/actual");
    return response.data;
  },

  siguiente: async () => {
    const response = await api.get("/carrusel-inmuebles/siguiente");
    return response.data;
  },

  anterior: async () => {
    const response = await api.get("/carrusel-inmuebles/anterior");
    return response.data;
  },

  reiniciar: async () => {
    const response = await api.post("/carrusel-inmuebles/reiniciar");
    return response.data;
  },

  recargar: async () => {
    const response = await api.post("/carrusel-inmuebles/recargar");
    return response.data;
  },

  cantidad: async () => {
    const response = await api.get("/carrusel-inmuebles/cantidad");
    return response.data;
  },

  indice: async () => {
    const response = await api.get("/carrusel-inmuebles/indice");
    return response.data;
  },
};

export default carruselInmuebleService;