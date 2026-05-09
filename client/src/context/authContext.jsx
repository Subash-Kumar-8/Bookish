import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken, clearAccessToken } from "../utils/tokenStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) throw new Error("Not authenticated");

      const refreshData = await refreshRes.json();

      setAccessToken(refreshData.accessToken);

      const userRes = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
        credentials: "include",
      });

      if (!userRes.ok) throw new Error("Failed to fetch user");

      const userData = await userRes.json();

      setUser(userData.user);

    } catch (err) {
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);