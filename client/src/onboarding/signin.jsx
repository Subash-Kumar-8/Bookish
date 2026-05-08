import background from "../assets/Onboarding.jpg";
import LOGO from "../assets/Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { setAccessToken } from "../utils/tokenStore";

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please Input All Fields!");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        credentials: "include", // ✅ IMPORTANT for cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store access token in memory
        setAccessToken(data.accessToken);

        // ✅ Set user in context
        setUser(data.user);

        // ❌ DO NOT store token in localStorage anymore

        navigate("/");
      } else {
        alert(data.message || "Login Failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong...");
    }
  };

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-start flex-column"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* HEADER */}
      <div
        className="rounded-5 d-flex align-items-center mb-5"
        style={{
          height: "175px",
          width: "100%",
          background: "rgba(0, 255, 1, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <img src={LOGO} alt="logo" />
        <h1>Bookish</h1>
      </div>

      {/* FORM */}
      <div
        className="rounded-5 d-flex align-items-center flex-column mt-5"
        style={{
          width: "350px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <label className="form-label mt-2">Email</label>
        <input
          type="text"
          className="form-control mt-2"
          style={{ width: "300px" }}
          placeholder="Enter Your E-Mail ID"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="form-label mt-2">Password</label>
        <div className="d-flex">
          <input
            type={visible ? "text" : "password"}
            className="form-control mt-2"
            style={{ width: "300px" }}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={visible ? "bi bi-eye-slash" : "bi bi-eye"}
            onClick={toggleVisibility}
            style={{ cursor: "pointer", marginLeft: "10px", marginTop: "10px" }}
          ></i>
        </div>

        <p className="mt-2">
          Didn't Have an Account?{" "}
          <Link to="/signup" className="link-success">
            Create Account
          </Link>
        </p>

        <button className="btn btn-success" onClick={handleSignIn}>
          Login
        </button>
      </div>
    </div>
  );
};

export default SignIn;