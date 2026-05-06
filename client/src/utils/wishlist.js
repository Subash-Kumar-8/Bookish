const API = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` })
};

export const getWishlist = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/api/wishlist`, {
    credentials: "include",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  });

  if (!res.ok) return [];
  return res.json();
};

export const addWishlist = async (book) => {
  const token = localStorage.getItem("token");
  await fetch(`${API}/api/wishlist`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({
      bookId: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0],
      thumbnail: book.volumeInfo.imageLinks?.thumbnail,
    }),
  });
};

export const removeWishlist = async (id) => {
  const token = localStorage.getItem("token");
  await fetch(`${API}/api/wishlist/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  });
};