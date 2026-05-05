import api from "./api";

const alertaService = {
  listar: async () => {
    const response = await api.get("/alertas");
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/alertas/${id}`);
    return response.data;
  },

  listarPorEstado: async (estado) => {
    const response = await api.get(`/alertas/estado/${estado}`);
    return response.data;
  },

  crear: async (alerta) => {
    const response = await api.post("/alertas", alerta);
    return response.data;
  },

  generarAutomaticas: async () => {
    const response = await api.post("/alertas/generar");
    return response.data;
  },

  recargarCola: async () => {
    const response = await api.post("/alertas/recargar-cola");
    return response.data;
  },

  procesarSiguiente: async () => {
    const response = await api.post("/alertas/procesar-siguiente");
    return response.data;
  },

  cantidadCola: async () => {
    const response = await api.get("/alertas/cola/cantidad");
    return response.data;
  },

  recargarColaPrioridad: async () => {
    const response = await api.post("/alertas/recargar-cola-prioridad");
    return response.data;
  },

  procesarSiguientePrioritaria: async () => {
    const response = await api.post("/alertas/procesar-siguiente-prioritaria");
    return response.data;
  },

  cantidadColaPrioridad: async () => {
    const response = await api.get("/alertas/cola-prioridad/cantidad");
    return response.data;
  },

  cambiarEstado: async (id, estado) => {
    const response = await api.put(`/alertas/${id}/estado?estado=${estado}`);
    return response.data;
  },
};

export default alertaService;