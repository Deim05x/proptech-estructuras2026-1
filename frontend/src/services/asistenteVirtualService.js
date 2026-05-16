import api from "./api";

const asistenteVirtualService = {
  conversar: async ({ mensaje, historial = [] }) => {
    const response = await api.post("/ia/chat", {
      mensaje,
      historial,
    });

    return response.data;
  },
};

export default asistenteVirtualService;
