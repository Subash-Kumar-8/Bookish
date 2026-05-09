import { createContext, useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
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
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};