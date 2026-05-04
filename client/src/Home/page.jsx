import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { getHomeBooks } from "../services/api";

const fictGen = [
  { index: 1, name: "Fiction", img: "/Fiction.avif" },
  { index: 2, name: "Romance", img: "/Romance.jpg" },
  { index: 3, name: "Fantasy", img: "/Fantasy.webp" },
  { index: 4, name: "Science Fiction", img: "/SciFi.avif" },
  { index: 5, name: "Thriller", img: "/Thriller.jpg" },
  { index: 6, name: "Horror", img: "/Horror.avif" },
  { index: 7, name: "Historical", img: "/Historical.jpg" },
  { index: 8, name: "Young Adult", img: "/YoungAdult.webp" }
];

const nonFict = [
  { index: 1, name: "Biography", img: "/Biography.webp" },
  { index: 2, name: "Autobiography", img: "/Autoobiography.webp" },
  { index: 3, name: "Self-help", img: "/selfHelp.jpg" },
  { index: 4, name: "History", img: "/Historical.jpg" },
  { index: 5, name: "Science", img: "/Science.jpg" },
  { index: 6, name: "Religion", img: "/Religion.avif" }
];

const Home = () => {
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (gen) => {
    const formatted = gen.toLowerCase().replace(/\s+/g, "+");
    navigate(`/search?subject=${formatted}`);
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadBooks = async () => {
      setLoading(true);

      const data = await getHomeBooks();

      setPopularBooks(data.items || []);
      setLoading(false);
    };

    loadBooks();
  }, []);

  return (
    <div className="container pt-3">

      <div className="box p-3 border border-1 border-secondary rounded">
        <h1>Genres</h1>

        <div className="border border-1 border-secondary-subtle shadow-sm rounded mb-3">
          <h3 className="p-2">Fiction</h3>
          <div className="scroll-container">
            {fictGen.map((genre) => (
              <div
                className="scroll-card"
                key={genre.index}
                onClick={() => handleSearch(genre.name)}
              >
                <div className="card h-100 shadow-sm">
                  <img src={genre.img} className="card-img-top" alt={genre.name} />
                  <div className="card-body text-center">
                    <h6>{genre.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-1 border-secondary-subtle shadow-sm rounded">
          <h3 className="p-2">Non-Fiction</h3>
          <div className="scroll-container">
            {nonFict.map((genre) => (
              <div
                className="scroll-card"
                key={genre.index}
                onClick={() => handleSearch(genre.name)}
              >
                <div className="card h-100 shadow-sm">
                  <img src={genre.img} className="card-img-top" alt={genre.name} />
                  <div className="card-body text-center">
                    <h6>{genre.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="box p-3 border border-1 border-secondary rounded mt-3">
        <h1>Popular Books</h1>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="row mt-3">
            {popularBooks.map((book) => (
              <div
                className="col-md-3 mb-4"
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail.replace("http://", "https://") ||
                      "https://via.placeholder.com/150"
                    }
                    className="card-img-top"
                    alt={book.volumeInfo.title}
                  />

                  <div className="card-body">
                    <h6>{book.volumeInfo.title}</h6>
                    <p>{book.volumeInfo.authors?.[0] || "Unknown"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;