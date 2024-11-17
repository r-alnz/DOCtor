import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CreateDocs from './pages/createDocs';
import CreateResig from './pages/createResig';
import CreateBio from './pages/createBio';
import CreateAppl from './pages/createAppl';
import CreateRec from './pages/createRec';
import CreateCV from './pages/createCV';
import CreateMAR from './pages/createMAR';
import CreateAR from './pages/createAR';
import CreateRP from './pages/createRP';
import CreateLOA from './pages/createLOA';

const App = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/createDocs/:docsId' element={isLoggedIn ? <CreateDocs /> : <Navigate to="/login" />} />
          <Route path='/createResig/:docsId' element={isLoggedIn ? <CreateResig /> : <Navigate to="/login" />} />
          <Route path='/createBio/:docsId' element={isLoggedIn ? <CreateBio /> : <Navigate to="/login" />} />
          <Route path='/createAppl/:docsId' element={isLoggedIn ? <CreateAppl /> : <Navigate to="/login" />} />
          <Route path='/createRec/:docsId' element={isLoggedIn ? <CreateRec /> : <Navigate to="/login" />} />
          <Route path='/createCV/:docsId' element={isLoggedIn ? <CreateCV /> : <Navigate to="/login" />} />
          <Route path='/createMAR/:docsId' element={isLoggedIn ? <CreateMAR /> : <Navigate to="/login" />} />
          <Route path='/createAR/:docsId' element={isLoggedIn ? <CreateAR /> : <Navigate to="/login" />} />
          <Route path='/createRP/:docsId' element={isLoggedIn ? <CreateRP /> : <Navigate to="/login" />} />
          <Route path='/createLOA/:docsId' element={isLoggedIn ? <CreateLOA /> : <Navigate to="/login" />} />
          <Route path="*" element={isLoggedIn ? <NoPage /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App