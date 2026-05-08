import api from "./api";

const dashboardService = {
  resumen: async () => {
    const response = await api.get("/reportes/resumen");
    return response.data;
  },

  alertas: async () => {
    const response = await api.get("/alertas");
    return response.data;
  },

  eventosInusuales: async () => {
    const response = await api.get("/eventos-inusuales");
    return response.data;
  },

  operaciones: async () => {
    const response = await api.get("/operaciones");
    return response.data;
  },

  visitas: async () => {
    const response = await api.get("/visitas");
    return response.data;
  },

  zonas: async () => {
    const response = await api.get("/reportes/zonas");
    return response.data;
  },

  cierresAsesor: async () => {
    const response = await api.get("/reportes/cierres-asesor");
    return response.data;
  },
};

export default dashboardService;