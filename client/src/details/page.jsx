import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Components/header";

const BookDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [books, setBooks] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
            const data = await res.json();
            setBooks(data);
        };
        fetchBook();
    }, [id]);
    if (!books) return <h1 className="text-center mt-5">Loading</h1>
    const info = books.volumeInfo;
    return(
        <div className="container mt-5">
            <button 
                className="btn btn-dark"
                style={{width: "100px"}}
                onClick={() => navigate(-1)}
            > 
                ← Back 
            </button>
            <div className="row">
                
                <div className="col-md-4">
                    <img src={info.imageLinks?.thumbnail} alt="" className="img-fluid" />
                </div>
                <div className="col-md-8">
                    <h2>{info.title}</h2>
                    <p><strong>Author: </strong>{info.authors?.join(', ')}</p>
                    <p><strong>Publisher: </strong>{info.publisher}</p>
                    <p><strong>Published: </strong>{info.publishedDate}</p>
                </div>
                <div className="mt-3">
                    {info.description?.slice(0, 500) || "No Descriptions Available"}
                </div>
                {info.previewLink && (
                    <a 
                        href={info.previewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                    >
                        PreviewRead / Preview 📖
                    </a>
                )}
            </div>
        </div>
    );
};

export default BookDetails;