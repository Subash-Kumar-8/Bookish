import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [model, setModel] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const res = await fetchWithAuth("/api/auth/delete", {
        method: "DELETE",
        headers : {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(null);
        navigate("/signup");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetchWithAuth("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
    navigate("/signin");
  };

  const toggleVisiblity = () => {
    setVisible((prev) => !prev);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <div 
        className="rounded-top-5 bg-warning d-flex align-items-center justify-content-between px-5"
        style={{height: "170px"}}
      >
        <div className="gap-5 d-flex">
          <div 
            className="rounded-circle bg-light d-flex justify-content-center align-items-center"
            style={{height: "100px", width: "100px"}}
          >
            <h1>{user?.name.charAt(0)}</h1>
          </div>
          <div className="d-flex flex-column">
            <h2>{user?.name}</h2>
            <h3>{user?.email}</h3>
          </div>
        </div>
        
        <div className="text-danger">
          <i 
            className="bi bi-box-arrow-right"
            onClick={handleLogout}
          ></i>
        </div>
        
      </div>
      <div 
        className="rounded-bottom-5 bg-secondary-subtle d-flex justify-content-around align-items-center"
        style={{height: "60px"}}
      >
        <button
          className="btn btn-info"
          onClick={()=>navigate('/wishlist')}
        >
          Go to Wishlist Page
        </button>
        <button
        className="btn btn-danger"
          onClick={()=>setModel(true)}
        >
          Delete
        </button>
      </div>
      {model && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
          }}
          onClick={() => setModel(false)}
        >
          <div
            className="bg-white p-4 rounded-3 shadow"
            style={{ width: "350px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-danger fw-bold">
              This Action Cannot be Undone
            </p>

            <p>Enter Password for Confirmation</p>
            <div className="d-flex justify-content-center">
              <input
                type={!visible ? "password" : "text"}
                className="form-control mb-3"
                placeholder="Enter Your Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i 
                className={!visible ? "bi bi-eye" : "bi bi-eye-slash"}
                onClick={toggleVisiblity}
              ></i>
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setModel(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={handleDeleteAccount}
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