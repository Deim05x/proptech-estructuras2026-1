import api from "./api";

const grafoService = {
  resumen: async () => {
    const response = await api.get("/grafos/resumen");
    return response.data;
  },

  nodos: async () => {
    const response = await api.get("/grafos/nodos");
    return response.data;
  },

  relaciones: async () => {
    const response = await api.get("/grafos/relaciones");
    return response.data;
  },

  inmueblesVisitadosPorCliente: async (clienteId) => {
    const response = await api.get(`/grafos/cliente/${clienteId}/inmuebles`);
    return response.data;
  },

  clientesRelacionadosConInmueble: async (codigo) => {
    const response = await api.get(`/grafos/inmueble/${codigo}/clientes`);
    return response.data;
  },

  inmueblesSimilares: async (codigo) => {
    const response = await api.get(`/grafos/inmueble/${codigo}/similares`);
    return response.data;
  },
};

export default grafoService;