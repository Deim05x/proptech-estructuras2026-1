import api from "./api";

const rotacionAsesorService = {
  obtenerRueda: async () => {
    const response = await api.get("/rotacion-asesores");
    return response.data;
  },

  obtenerActual: async () => {
    const response = await api.get("/rotacion-asesores/actual");
    return response.data;
  },

  obtenerSiguiente: async () => {
    const response = await api.get("/rotacion-asesores/siguiente");
    return response.data;
  },

  reiniciar: async () => {
    const response = await api.post("/rotacion-asesores/reiniciar");
    return response.data;
  },

  recargar: async () => {
    const response = await api.post("/rotacion-asesores/recargar");
    return response.data;
  },

  cantidad: async () => {
    const response = await api.get("/rotacion-asesores/cantidad");
    return response.data;
  },
};

export default rotacionAsesorService;