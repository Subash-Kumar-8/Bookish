import { fetchWithAuth } from "./fetchWithAuth";


export const getWishlist = async () => {
  try {
    const res = await fetchWithAuth("/api/wishlist");
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addWishlist = async (book) => {
  try {
    const res = await fetchWithAuth("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

export const removeWishlist = async (id) => {
  try {
    const res = await fetchWithAuth(`/api/wishlist/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};