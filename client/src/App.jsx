import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import "./app.css";
import Home from './Home/page.jsx';
import Search from './Search/page.jsx';
import BookDetails from './details/page.jsx';
import Wishlist from './wishlist/page.jsx';
import Header from './Components/header.jsx';
import Footer from './Components/footer.jsx';
import About from './navig/about.jsx';
import Contact from './navig/contact.jsx';
import PrivacyPolicy from './navig/privacyPol.jsx';
import Profile from "./profile/page.jsx";
import SignUp from "./onboarding/signup.jsx";
import SignIn from "./onboarding/signin.jsx";
import ProtectedRoute from './Components/protectedRoute.jsx';
import { fetchWithAuth } from './utils/fetchWithAuth.js';
import { useAuth } from "./context/authContext";
import { setAccessToken } from "./utils/tokenStore";

const App = () => {
  const { setUser } = useAuth();
  const location = useLocation();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch(`${API}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();

        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };

    initAuth();
  }, []);
  
  const hideLayout = ["/signin", "/signup"].includes(location.pathname);

  return (
    <div className="app-container">

      {!hideLayout && <Header />}

      <main className="app-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/book/:id' element={<BookDetails />} />
          <Route
           path='/wishlist' 
           element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
            } 
          />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}

    </div>
  )
}

export default App;