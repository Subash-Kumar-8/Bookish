import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleDeleteAccount = async () => {
    try {
      const res = await fetchWithAuth("/api/auth/delete", {
        method: "DELETE",
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user?.name}</h2>

      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDeleteAccount}>Delete</button>
    </div>
  );
};

export default Profile;