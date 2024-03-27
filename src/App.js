import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
