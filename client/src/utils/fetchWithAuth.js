import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore";

const refreshAccessToken = async () => {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    setAccessToken(data.accessToken);

    return data.accessToken;
  } catch (err) {
    clearAccessToken();
    return null;
  }
};

export const fetchWithAuth = async (url, options = {}, retry = true) => {
  let token = getAccessToken();

  // Attach access token
  const config = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  let res = await fetch(url, config);

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      return res; 
    }

    const retryConfig = {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    };

    res = await fetch(url, retryConfig);
  }

  return res;
};