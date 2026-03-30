import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage'; 
import CartPage from './pages/CartPage';         
import LoginPage from './pages/LoginPage';       
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-white relative">
        {/* Background layer */}
        <div className="fixed inset-0 bg-zinc-950 -z-20"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.08)_0%,_rgba(0,0,0,0)_50%)] -z-10 pointer-events-none"></div>

        <Navbar />
        
        <main className="relative z-0 pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="*" element={<div className="text-center py-20 text-zinc-500 font-bold">404 - TRANG KHÔNG TỒN TẠI</div>} />
          </Routes>
        </main>
        
        <footer className="border-t border-white/5 mt-20 py-10 text-center text-zinc-500 text-sm">
          <p>&copy; 2026 THE KING Store. Nghệ thuật giao diện với React & Tailwind.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;