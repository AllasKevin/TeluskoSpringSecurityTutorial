import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { JSX } from "react";

const ProtectedRoute = ({
  children,
  protectedPath,
}: {
  children: JSX.Element;
  protectedPath: string;
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={protectedPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
