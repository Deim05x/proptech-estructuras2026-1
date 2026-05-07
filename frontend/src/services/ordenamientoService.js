import api from "./api";

const ordenamientoService = {
  ordenarInmuebles: async (criterio = "precio", direccion = "desc") => {
    const response = await api.get(
      `/ordenamientos/inmuebles?criterio=${criterio}&direccion=${direccion}`
    );
    return response.data;
  },
};

export default ordenamientoService;