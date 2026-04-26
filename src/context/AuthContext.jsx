import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);

    return {
      email: decoded.sub,
      role: decoded.role,
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() =>
    localStorage.getItem("token")
      ? decodeToken(localStorage.getItem("token"))
      : null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken && isTokenValid(savedToken)) {
      setToken(savedToken);
      setUser(decodeToken(savedToken));
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(decodeToken(jwt));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role || null,
      email: user?.email || null,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);