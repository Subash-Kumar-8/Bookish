import { useEffect } from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './Home/page.jsx';
import Search from './Search/page.jsx';
import BookDetails from './details/page.jsx';
import Wishlist from './wishlist/page.jsx';
import Header from './Components/header.jsx';

const App = () => {
  useEffect(() => {
    fetch("http://localhost:5000/api")
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(err => console.error("Error: ", err));
  }, []);
  return (
    <>
        <Header />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />}/>
          <Route path='/book/:id' element={<BookDetails />}/>
          <Route path='/wishlist' element={<Wishlist />}/>
        </Routes>
    </>
    )
  }

export default App
