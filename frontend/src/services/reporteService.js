import api from "./api";

const reporteService = {
  resumen: async () => {
    const response = await api.get("/reportes/resumen");
    return response.data;
  },

  zonas: async () => {
    const response = await api.get("/reportes/zonas");
    return response.data;
  },

  precios: async () => {
    const response = await api.get("/reportes/precios");
    return response.data;
  },

  visitasInmueble: async () => {
    const response = await api.get("/reportes/visitas-inmueble");
    return response.data;
  },

  visitasZona: async () => {
    const response = await api.get("/reportes/visitas-zona");
    return response.data;
  },

  cierresAsesor: async () => {
    const response = await api.get("/reportes/cierres-asesor");
    return response.data;
  },

  operacionesTipo: async () => {
    const response = await api.get("/reportes/operaciones-tipo");
    return response.data;
  },
};

export default reporteService;