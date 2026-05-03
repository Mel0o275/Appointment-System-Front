import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PublicOnlyRoute({ children }) {
  const { loading } = useAuth();

  if (loading) return null;

  return children;
}