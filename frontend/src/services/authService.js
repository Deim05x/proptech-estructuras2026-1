import axios from "axios";
import api from "./api";

const AUTH_BASE_URL = "http://localhost:8080/api/auth";
const RUTAS_INICIO_POR_ROL = {
  ADMIN: "/dashboard",
  CLIENTE: "/inicio-cliente",
};

const normalizarRol = (rol) => (rol || "").replace("ROLE_", "").toUpperCase();

const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  registerCliente: async (payload) => {
    const response = await axios.post(
      `${AUTH_BASE_URL}/register-cliente`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  logout: async () => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${AUTH_BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  me: async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${AUTH_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  guardarSesion: (data) => {
    localStorage.setItem("token", data.token || "");
    localStorage.setItem("rol", normalizarRol(data.rol));
    localStorage.setItem("username", data.username || "");
    localStorage.setItem("clienteId", data.clienteId || "");
  },

  limpiarSesion: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("username");
    localStorage.removeItem("clienteId");
  }, 

  registrarCliente: async (datos) => {
    const response = await api.post("/auth/register-cliente", datos);
    return response.data;
  },


  getToken: () => localStorage.getItem("token"),
  getRol: () => normalizarRol(localStorage.getItem("rol")),
  getUsername: () => localStorage.getItem("username"),
  getClienteId: () => localStorage.getItem("clienteId"),
  estaAutenticado: () => !!localStorage.getItem("token"),
  getRutaInicioPorRol: (rol) => RUTAS_INICIO_POR_ROL[normalizarRol(rol)] || "/login",
};

export default authService;
