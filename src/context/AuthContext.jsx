import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const decodeToken = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);

      return {
        email: decoded.sub,
        role: decoded.role,
        exp: decoded.exp,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      const decodedUser = decodeToken(savedToken);

      setToken(savedToken);
      setUser(decodedUser);
    }
  }, []);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);

    const decodedUser = decodeToken(jwt);

    setToken(jwt);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,

    role: user?.role || null,
    email: user?.email || null,

    isAuthenticated: !!token,

    login,
    logout,
  }), [token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);