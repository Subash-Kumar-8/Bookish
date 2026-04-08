import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // 🔥 Load wishlist initially
  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await fetch("http://localhost:5000/api/wishlist");
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