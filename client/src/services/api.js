export const searchBooks = async (query) => {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`);
    return res.json();
}