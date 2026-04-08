import Logo from '../assets/hero.png'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWishlist } from '../utils/wishlist.js';

const Header = () => {
    const navigate = useNavigate();
    const [query, setquery] = useState("");
    const [wishlistcnt, setWishlistcnt] = useState(0);

    const handleSearch = () => {
        if (!query) return;
        navigate(`/search?q=${query}`);
    };


    const fetchCount = async () => {
        const data = await getWishlist();
        setWishlistcnt(data.length);
    };

    useEffect(() => {
        fetchCount();
    }, []);

    useEffect(() => {
        window.addEventListener("wishlistUpdated", fetchCount);
        return () => window.removeEventListener("wishlistUpdated", fetchCount);
    }, []);

    return (
        <div className="text-bg-primary p-3 d-flex align-items-center gap-3 mb-3">

            <img src={Logo} alt="" style={{ width: "75px" }} />
            <h1 className="text-white m-0">Bookish</h1>
            <div className="input-group w-50">
                <input 
                    type="text"
                    className="form-control bg-transparent border-light text-white"
                    placeholder='Search Books...'
                    value={query}
                    onChange={(e) => setquery(e.target.value)}
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
            <div 
                className="bg-warning text-danger rounded-pill px-3 py-1 ms-auto"
                onClick={() => navigate("/wishlist")}
                style={{cursor: "pointer"}}
            >
                ❤️ {wishlistcnt}
            </div>
            <div 
                className="bg-light rounded-circle"
                style={{ height: "60px", width: "60px", cursor: "pointer" }}
            ></div>

        </div>
    );
};

export default Header;