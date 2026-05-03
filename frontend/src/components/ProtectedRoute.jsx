import { Navigate } from "react-router-dom";
import authService from "../services/authService";

function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const autenticado = authService.estaAutenticado();
  const rol = authService.getRol();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;