// AuthContext.tsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(() => {
    // Initialize from localStorage
    return localStorage.getItem("authenticated") === "true";
  });

  const login = () => {
    localStorage.setItem("authenticated", "true");
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authenticated");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
