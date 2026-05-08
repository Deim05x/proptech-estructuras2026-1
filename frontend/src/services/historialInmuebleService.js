import api from "./api";

const historialInmuebleService = {
  capturarEstado: async (codigo, descripcion = "Cambio manual sobre inmueble") => {
    const response = await api.post(
      `/historial-inmuebles/capturar/${codigo}?descripcion=${encodeURIComponent(
        descripcion
      )}`
    );
    return response.data;
  },

  deshacerUltimoCambio: async () => {
    const response = await api.post("/historial-inmuebles/deshacer");
    return response.data;
  },

  ultimaAccion: async () => {
    const response = await api.get("/historial-inmuebles/ultima-accion");
    return response.data;
  },

  cantidad: async () => {
    const response = await api.get("/historial-inmuebles/cantidad");
    return response.data;
  },

  limpiar: async () => {
    const response = await api.delete("/historial-inmuebles/limpiar");
    return response.data;
  },
};

export default historialInmuebleService;