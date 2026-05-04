import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser, loading } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const API = import.meta.env.VITE_API_URL;

    const handleDeleteAccount = async () => {
        try {
            const res = await fetch(`${API}/api/auth/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ password: confirmPassword })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Account Deleted Successfully 🗑️");
                setUser(null);
                navigate("/signup");
            } else {
                alert(data.message || "Delete Failed ❌");
            }
        } catch (err) {
            console.log(err);
            alert("Something Went Wrong...");
        }
    };

    const handleLogout = async () => {
        await fetch(`${API}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
        navigate("/signin");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container p-3" style={{ minHeight: "100%" }}>
            <div 
                className="text-bg-warning d-flex rounded-top-5 p-3 align-items-center justify-content-between" 
                style={{height: "200px"}}
            >
                <div className="d-flex flex-row align-items-center">
                    <div 
                        className="text-bg-light rounded-circle d-flex justify-content-center align-items-center"
                        style={{height: "150px", width: "150px"}}
                    >
                        <h1>{user?.name?.charAt(0) || "N"}</h1>
                    </div>
                    <div className="flex-column mx-2">
                        <h2 className="mx-2">{user?.name || "No-Name"}</h2>
                        <p className="mx-2">{user?.email || "No-Email"}</p>
                    </div>
                </div>

                <button 
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    Logout <i className="bi bi-box-arrow-right"></i>
                </button>
            </div>

            <div className="bg-secondary-subtle rounded-bottom-5 p-3" style={{height: "200px"}}>
                <div 
                    className="border border-2 border-secondary d-flex p-1 px-5 justify-content-between" 
                    style={{height: "50px"}}
                >
                    <button 
                        className="btn btn-info"
                        onClick={() => navigate("/wishlist")}
                    >
                        Go To Wishlist Page <i className="bi bi-heart-fill"></i>
                    </button>

                    <button 
                        className="btn btn-danger"
                        onClick={() => setShowModal(true)}
                    >
                        Delete Account <i className="bi bi-trash"></i>
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
                    <div className="bg-white p-4 rounded-4" style={{ width: "300px" }}>
                        <h5>Confirm Delete</h5>
                        <p className="text-danger">This action cannot be undone ⚠️</p>

                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="d-flex justify-content-between">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowModal(false);
                                    setConfirmPassword("");
                                }}
                            >
                                Cancel
                            </button>

                            <button 
                                className="btn btn-danger"
                                onClick={handleDeleteAccount}
                                disabled={!confirmPassword}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;