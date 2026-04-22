import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Thoughts from './pages/Thoughts';
import BlogPost from './pages/BlogPost';
import EditThought from './pages/EditThought';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

import './App.css';

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <div className="app-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>

          <Navbar />

          <main className="main-content">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/thoughts" element={<Thoughts />} />
                <Route path="/thoughts/:id" element={<BlogPost />} />
                <Route path="/admin/thoughts/new" element={<EditThought />} />
                <Route path="/admin/thoughts/:id" element={<EditThought />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
