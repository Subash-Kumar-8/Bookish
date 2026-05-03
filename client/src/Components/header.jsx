import Logo from '../assets/Logo.svg';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWishlist } from '../utils/wishlist.js';
import { useAuth } from '../context/authContext.jsx';

const Header = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [wishlistCnt, setWishlistCnt] = useState(0);

    const { user, loading } = useAuth();

    const handleSearch = () => {
        if (!query.trim()) return;
        navigate(`/search?q=${query}`);
    };

    const fetchCount = async () => {
        try {
            const data = await getWishlist();
            setWishlistCnt(data.length);
        } catch (err) {
            console.error("Wishlist fetch error:", err);
        }
    };

    useEffect(() => {
        fetchCount();
    }, []);

    useEffect(() => {
        window.addEventListener("wishlistUpdated", fetchCount);
        return () => window.removeEventListener("wishlistUpdated", fetchCount);
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="text-bg-success p-3 d-flex align-items-center gap-3 mb-3">
            <img
                src={Logo}
                alt="Logo"
                style={{ width: "75px", cursor: 'pointer' }}
                onClick={() => navigate('/')}
            />
            {user ? (
                <h3 className="text-white m-0">
                    Welcome, {user.name}
                </h3>
            ) : (
                <h1 className="text-white m-0">
                    Not Logged In
                </h1>
            )}
            <div className="input-group" style={{ width: "600px" }}>
                <input
                    type="text"
                    className="form-control bg-transparent border-light text-white"
                    placeholder='Search Books...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <span
                    className="input-group-text bg-transparent border-light text-white"
                    onClick={handleSearch}
                    style={{ cursor: "pointer" }}
                >
                    <i className="bi bi-search"></i>
                </span>
            </div>
            <div>
                <ul className="nav">
                    <li className="nav-item">
                        <Link to="/about" className="nav-link">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/privacy-policy" className="nav-link">Privacy Policy</Link>
                    </li>
                </ul>
            </div>
            <div
                className="bg-warning text-danger rounded-pill px-3 py-1 ms-auto"
                onClick={() => navigate("/wishlist")}
                style={{ cursor: "pointer" }}
            >
                ❤️ {wishlistCnt || 0}
            </div>
            {user ? (
                <div
                    className="text-dark bg-light rounded-circle d-flex justify-content-center align-items-center"
                    style={{ height: "60px", width: "60px", cursor: "pointer" }}
                    onClick={() => navigate('/profile')}
                >
                    <h1>{user?.name?.charAt(0)?.toUpperCase()}</h1>
                </div>
            ) : (
                <button
                    className="btn btn-light"
                    onClick={() => navigate('/signin')}
                >
                    Sign In
                </button>
            )}

        </div>
    );
};

export default Header;