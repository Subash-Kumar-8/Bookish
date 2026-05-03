export const getWishlist = async () => {
  const res = await fetch("/api/wishlist", {
    credentials: "include"
  });

  if (!res.ok) return [];
  return res.json();
};

export const addWishlist = async (book) => {
  await fetch("/api/wishlist", {
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
};

export const removeWishlist = async (id) => {
  await fetch(`/api/wishlist/${id}`, {
    method: "DELETE",
  });
};