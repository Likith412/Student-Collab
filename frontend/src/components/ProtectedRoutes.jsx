import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

function ProtectedRoutes() {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
