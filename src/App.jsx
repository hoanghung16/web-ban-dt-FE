import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        {/* Background layer */}
        <div className="fixed inset-0 bg-king-bg -z-20"></div>
        
        {/* Mesh gradient artifact */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.05)_0%,_rgba(0,0,0,0)_50%)] -z-10 pointer-events-none"></div>

        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
        
        {/* Simple Footer */}
        <footer className="border-t border-zinc-800/50 mt-20 py-10 text-center text-zinc-500 text-sm glass">
          <p>&copy; 2026 THE KING Store. Nghệ thuật giao diện với React & Tailwind.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;