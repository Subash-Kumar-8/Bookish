import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore";

const API = import.meta.env.VITE_API_URL;

export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = getAccessToken();

  const makeRequest = async () => {
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(options.headers || {}),
      },
    });
  };

  let res = await makeRequest();

  if (res.status === 401) {
    try {
      const refreshRes = await fetch(`${API}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        clearAccessToken();
        return res;
      }

      const data = await refreshRes.json();
      setAccessToken(data.accessToken);

      accessToken = data.accessToken;
      res = await makeRequest();
    } catch (err) {
      console.error("Refresh failed:", err);
      clearAccessToken();
    }
  }

  return res;
};