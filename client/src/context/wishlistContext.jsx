import { createContext, useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "./authContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { loading, user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (loading || !user) return;
        const res = await fetchWithAuth("/api/wishlist");

        if (!res.ok) {
          setWishlist([]);
          return;
        }

        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error(err);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [loading]);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};