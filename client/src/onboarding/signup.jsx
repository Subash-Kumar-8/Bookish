import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import background from "../assets/Onboarding.jpg"
import LOGO from "../assets/Logo.svg"

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [reenter, setReenter] = useState("");
    const [visiblePass, setvisiblePass] = useState(false);
    const [visibleRe, setVisibleRe] = useState(false);
    const handleSignUp = async () => {
        if (!name || !email || !password || !reenter){
            alert("Please Input All Fields");
            return;
        }
        if (password !== reenter){
            alert("Please Re-Enter the same Password");
            return;
        }
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email, 
                    password
                })
            });

            const data = await res.json();

            if (!res.ok){
                alert(data.message || "Signup Failed ❌");
                return;
            }

            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({email, password})
            });
            if(loginRes.ok){
                alert("Account Created Successfully ✅");
                navigate("/");
            } else {
                alert("Problem with Auto-Sigin. Please Signin!");
                navigate("/signin");
            }
        }catch(err){
            console.log(err);
            alert("Something Went Wrong...");
        }
    }
    const togglePass = () => {
        setvisiblePass(prev => !prev);
    }
    const toggleRe = () => {
        setVisibleRe(prev => !prev);
    }
    return(
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
                    WebkitBackdropFilter: "blur(10px)",
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
                    WebkitBackdropFilter: "blur(10px)", 
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                }}
            >
                <label htmlFor="Name" className="form-label mt-5">Name</label>
                <input 
                    type="text" 
                    className="form-control mt-2" 
                    style={{width: "300px"}} 
                    placeholder="Enter Your Name"
                    onChange={(e)=>setName(e.target.value)}
                />
                <label htmlFor="Mail" className="form-label mt-2">Email</label>
                <input 
                    type="text" 
                    className="form-control mt-2" 
                    style={{width: "300px"}} 
                    placeholder="Enter Your E-Mail ID"
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <label htmlFor="password" className="form-label mt-2">Password</label>
                <div className="d-flex">
                    <input 
                        type={visiblePass ? "text" : "password"} 
                        className="form-control mt-2" 
                        style={{width: "300px"}} 
                        placeholder="Enter Password"
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <i 
                        className={visiblePass ? "bi bi-eye-slash" : "bi bi-eye"} 
                        size={22}
                        onClick={()=>togglePass()}
                    ></i>
                </div>
                <label htmlFor="reenter" className="form-label mt-2">Re-Enter Password</label>
                <div className="d-flex">
                    <input 
                        type={visibleRe ? "text" : "password"}
                        className="form-control mt-2" 
                        style={{width: "300px"}} 
                        placeholder="Re-Enter the same Password"
                        onChange={(e)=>setReenter(e.target.value)}
                    />
                    <i 
                        className={visibleRe ? "bi bi-eye-slash" : "bi bi-eye"} 
                        size={22}
                        onClick={()=>toggleRe()}
                    ></i>
                </div>
                <p className="mt-2">Already Have an Account? <Link to ="/signin" className="link-success">Sign In</Link></p>
                <button className="btn btn-success" onClick={()=>handleSignUp()}>Create Account</button>
            </div>
        </div>
    );
}

export default SignUp;