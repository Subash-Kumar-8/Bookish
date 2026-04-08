import { useEffect, useState } from "react";
import { getWishlist, removeWishlist } from "../utils/wishlist";
import "../Search/search.css";
import { useNavigate } from "react-router-dom";
import NoImage from "../assets/NoImage.png";

const Wishlist = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWishlist();
      console.log("FRONTEND DATA:", data);
      setBooks(data);
    };

    fetchData();
  }, []);

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    await removeWishlist(id);
    const updated = await getWishlist();
    setBooks(updated);
  };

  return (
    <div className="container mt-4">
      <h2>My Wishlist ❤️</h2>

      <div className="row">
        {books.map((book) => (
          <div
            className="col-md-3 mb-4 book-card"
            key={book._id}
            onClick={() => navigate(`/book/${book.bookId}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card image-wrapper h-100">
              <img
                src={book.thumbnail || NoImage}
                className="card-img-top"
                alt="book"
              />

              <div className="card-body">
                <h6>{book.title}</h6>

                <button
                  className="btn btn-danger mt-2"
                  onClick={(e) => handleRemove(e, book.bookId)}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;