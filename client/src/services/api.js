const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const cache = new Map();

export const searchBooks = async (query) => {
  const cacheKey = `search-${query}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20&key=${API_KEY}`
    );

    const data = await res.json();

    cache.set(cacheKey, data);

    return data;
  } catch (err) {
    console.error("searchBooks error:", err);
    return { items: [] };
  }
};

export const getBookById = async (id) => {
  const cacheKey = `book-${id}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(
      `${BASE_URL}/${id}?key=${API_KEY}`
    );

    const data = await res.json();

    cache.set(cacheKey, data);

    return data;
  } catch (err) {
    console.error("getBookById error:", err);
    return null;
  }
};

export const getHomeBooks = async () => {
  const cacheKey = "home-books";

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const queries = [
    "subject:fiction",
    "subject:fantasy",
    "subject:romance",
    "subject:thriller"
  ];

  const randomQuery =
    queries[Math.floor(Math.random() * queries.length)];

  try {
    const res = await fetch(
      `${BASE_URL}?q=${randomQuery}&maxResults=12&key=${API_KEY}`
    );

    const data = await res.json();

    cache.set(cacheKey, data);

    return data;
  } catch (err) {
    console.error("getHomeBooks error:", err);
    return { items: [] };
  }
};