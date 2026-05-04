import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NOIMG from "../assets/NoImage.png";
import { getBookById } from "../services/api";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      try {
        const data = await getBookById(id);

        if (isMounted) {
          setBook(data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to load book. Try again later.");
        }
      }
    };

    const timer = setTimeout(loadBook, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [id]);

  if (error) return <h1 className="text-center mt-5">{error}</h1>;
  if (!book || !book.volumeInfo) return <h1 className="text-center mt-5">Loading...</h1>;

  const info = book.volumeInfo;

  const isbn = info?.industryIdentifiers?.find(
    (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
  )?.identifier;

  const AMAZON_TAG = "yourtag-21";

  const amazonLink = isbn
    ? `https://www.amazon.in/dp/${isbn}?tag=${AMAZON_TAG}`
    : `https://www.amazon.in/s?k=${encodeURIComponent(
        info.title + " " + (info.authors?.[0] || "")
      )}&tag=${AMAZON_TAG}`;

  return (
    <div className="container mt-5">

      <button className="btn btn-dark mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row">

        <div className="col-md-4">
          <img
            src={info.imageLinks?.thumbnail.replace("http://", "https://") || NOIMG}
            alt={info.title}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-8">
          <h2>{info.title}</h2>

          <p><b>Author:</b> {info.authors?.join(", ") || "Unknown"}</p>
          <p><b>Publisher:</b> {info.publisher || "Unknown"}</p>
          <p><b>Published:</b> {info.publishedDate || "N/A"}</p>

          <div className="mt-3">
            {info.description
              ? info.description.replace(/<[^>]+>/g, "").slice(0, 500) + "..."
              : "No Description Available"}
          </div>

          <div className="d-flex gap-2 flex-wrap mt-4">
            {info.previewLink && (
              <a
                href={info.previewLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Read via Google Books 📖
              </a>
            )}

            <a
              href={amazonLink}
              target="_blank"
              rel="noreferrer sponsored"
              className="btn btn-dark"
            >
              Buy via Amazon 🛒
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookDetails;