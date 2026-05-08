import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from "../assets/Onboarding.jpg";
import LOGO from "../assets/Logo.svg";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const SignUp = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [reenter, setReenter] = useState("");

    const [visiblePass, setVisiblePass] = useState(false);
    const [visibleRe, setVisibleRe] = useState(false);

    const API = import.meta.env.VITE_API_URL;

    const handleSignUp = async () => {
        if (!name || !email || !password || !reenter) {
            alert("Please Input All Fields");
            return;
        }

        if (password !== reenter) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`${API}/api/auth/signup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Signup Failed ❌");
                return;
            }
            const loginRes = await fetchWithAuth(`${API}/api/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            const loginData = await loginRes.json();

            if (!loginRes.ok) {
                alert("Account created but login failed. Please sign in.");
                navigate("/signin");
                return;
            }

            alert("Account Created Successfully ✅");
            navigate("/");

        } catch (err) {
            console.error(err);
            alert("Something Went Wrong...");
        }
    };

    return (
        <div 
            className="container d-flex align-items-center justify-content-start flex-column"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
            }}
        >
            <div 
                className="rounded-5 d-flex align-items-center mb-5"
                style={{
                    height: "175px",
                    width: "100%",
                    background: "rgba(0, 255, 1, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)"
                }}
            >
                <img src={LOGO} alt="logo" />
                <h1>Bookish</h1>
            </div>

            <div 
                className="rounded-5 d-flex align-items-center flex-column"
                style={{
                    width: "350px",
                    height: "500px",
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                }}
            >
                <label className="form-label mt-5">Name</label>
                <input 
                    type="text"
                    className="form-control mt-2"
                    style={{ width: "300px" }}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className="form-label mt-2">Email</label>
                <input 
                    type="text"
                    className="form-control mt-2"
                    style={{ width: "300px" }}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="form-label mt-2">Password</label>
                <div className="d-flex">
                    <input 
                        type={visiblePass ? "text" : "password"}
                        className="form-control mt-2"
                        style={{ width: "300px" }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <i 
                        className={visiblePass ? "bi bi-eye-slash" : "bi bi-eye"}
                        onClick={() => setVisiblePass(prev => !prev)}
                        style={{ cursor: "pointer" }}
                    ></i>
                </div>

                <label className="form-label mt-2">Re-Enter Password</label>
                <div className="d-flex">
                    <input 
                        type={visibleRe ? "text" : "password"}
                        className="form-control mt-2"
                        style={{ width: "300px" }}
                        onChange={(e) => setReenter(e.target.value)}
                    />
                    <i 
                        className={visibleRe ? "bi bi-eye-slash" : "bi bi-eye"}
                        onClick={() => setVisibleRe(prev => !prev)}
                        style={{ cursor: "pointer" }}
                    ></i>
                </div>

                <p className="mt-2">
                    Already Have an Account?{" "}
                    <Link to="/signin" className="link-success">
                        Sign In
                    </Link>
                </p>

                <button 
                    className="btn btn-success"
                    onClick={handleSignUp}
                >
                    Create Account
                </button>
            </div>
        </div>
    );
};

export default SignUp;