import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, LogOut, User, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import Cart from './Cart';
import Background from './ui/Background';
import logo from '../assets/logo.png';

export default function Layout() {
    const { currentUser, logout, isAdmin } = useAuth();
    const { setIsCartOpen, cartItems } = useCart();
    const location = useLocation();

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col relative text-slate-300">
            <Background />
            <header className="sticky top-0 z-40 w-full border-b border-navy-700 bg-navy-900/80 backdrop-blur">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img src={logo} alt="IoT Club" className="w-full h-full object-cover relative z-10" />
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                                IoT Club
                            </span>
                        </Link>
                        <a href={import.meta.env.DEV ? "http://localhost:5173" : "/"} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Back to Home
                        </a>
                    </div>

                    <nav className="flex items-center gap-4">
                        {isAdmin && (
                            <Link to="/admin">
                                <Button variant="ghost" size="sm" className={location.pathname.startsWith('/admin') ? 'text-cyan-400' : ''}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Admin
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-navy-900">
                                    {totalItems}
                                </span>
                            )}
                        </Button>

                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                                    <User className="w-4 h-4" />
                                    <span>{currentUser.email}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => logout()}>
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" size="sm">Login</Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t border-navy-700 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} IoT Club. Built for builders.</p>
                </div>
            </footer>

            <Cart />
        </div>
    );
}
