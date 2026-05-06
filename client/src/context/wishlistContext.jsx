import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/wishlist`, {
        credentials: "include",
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
      });
      const data = await res.json();
      setWishlist(data);
    };
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};