const API = import.meta.env.VITE_API_URL;
export const getWishlist = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/wishlist`, {
      method: "GET",
      credentials: "include",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (err) {
    console.error("getWishlist error:", err);
    return [];
  }
};

export const addWishlist = async (book) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/wishlist`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        bookId: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("addWishlist failed:", errData);
    }
  } catch (err) {
    console.error("addWishlist error:", err);
  }
};

export const removeWishlist = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/wishlist/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("removeWishlist failed:", errData);
    }
  } catch (err) {
    console.error("removeWishlist error:", err);
  }
};