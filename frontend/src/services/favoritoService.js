import api from "./api";

const favoritoService = {
  listarPorCliente: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/favoritos`);
    return response.data;
  },

  agregar: async (clienteId, codigoInmueble) => {
    const response = await api.post(
      `/clientes/${clienteId}/favoritos/${codigoInmueble}`
    );
    return response.data;
  },

  eliminar: async (clienteId, codigoInmueble) => {
    const response = await api.delete(
      `/clientes/${clienteId}/favoritos/${codigoInmueble}`
    );
    return response.data;
  },
};

export default favoritoService;