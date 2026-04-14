import api from "./api";

const favoritoService = {
  obtenerFavoritos: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/favoritos`);
    return response.data;
  },

  agregarFavorito: async (clienteId, codigoInmueble) => {
    const response = await api.post(
      `/clientes/${clienteId}/favoritos/${codigoInmueble}`
    );
    return response.data;
  },

  eliminarFavorito: async (clienteId, codigoInmueble) => {
    const response = await api.delete(
      `/clientes/${clienteId}/favoritos/${codigoInmueble}`
    );
    return response.data;
  },

  obtenerHistorial: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/historial`);
    return response.data;
  },

  obtenerHistorialReverso: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/historial/reverso`);
    return response.data;
  },
};

export default favoritoService;