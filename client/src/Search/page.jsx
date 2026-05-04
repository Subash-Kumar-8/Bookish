import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchBooks } from "../services/api";
import "./search.css";
import { addWishlist, removeWishlist } from "../utils/wishlist";
import NoImage from "../assets/NoImage.png";

const Search = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [wishlistid, setWishlistid] = useState([]);
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");
  const subject = searchParams.get("subject")?.toUpperCase() || null;
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const res = await fetch(`${API}/api/wishlist`, {
          credentials: "include"
        });
        const data = await res.json();
        setWishlistid(data.map((item) => item.bookId));
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    loadWishlist();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let data;

        if (query) {
          data = await searchBooks(query);
        } else if (subject) {
          data = await searchBooks(`subject:${subject}`);
        } else {
          return;
        }

        setBooks(data.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, [query, subject]);

  return (
    <div className="container mt-4">
      <h2>
        {query && `Search Results for "${query}"`}
        {subject && `${subject} Books`}
      </h2>

      <div className="row">
        {books.map((book) => (
          <div
            className="col-md-3 mb-4"
            key={book.id}
            onClick={() => navigate(`/book/${book.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 book-card border-0">

              <div className="image-wrapper">
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail.replace("http://", "https://") || NoImage}
                  className="card-img-top"
                  alt=""
                />
              </div>

              <div className="card-body">
                <h6>{book.volumeInfo.title}</h6>
                <p>{book.volumeInfo.authors?.[0]}</p>

                <button
                  className={`btn mt-2 ${
                    wishlistid.includes(book.id)
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={async (e) => {
                    e.stopPropagation();

                    if (wishlistid.includes(book.id)) {
                      await removeWishlist(book.id);
                      setWishlistid((prev) =>
                        prev.filter((id) => id !== book.id)
                      );
                    } else {
                      await addWishlist(book);
                      setWishlistid((prev) => [...prev, book.id]);
                    }
                    window.dispatchEvent(new Event("wishlistUpdated"));
                  }}
                >
                  {wishlistid.includes(book.id) ? "💔" : "❤️"}
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;