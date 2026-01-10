import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Cpu, LogIn, LogOut, User } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
    const { currentUser: user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Dark mode init
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }

        // Scroll handler
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isHome = location.pathname === '/';

    const navLinks = [
        { name: 'About', href: isHome ? '#about' : '/#about' },
        { name: 'Domains', href: isHome ? '#domains' : '/#domains' },
        { name: 'Team', href: isHome ? '#execom' : '/#execom' },
        { name: 'Events', href: '/events', isRoute: true },
        { name: 'Projects', href: '/projects', isRoute: true },
    ];

    return (
        <nav className={clsx(
            "fixed w-full z-50 transition-all duration-300",
            scrolled ? "bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"
        )}>
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img src={logo} alt="IoT Logo" className="w-full h-full object-cover relative z-10" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight dark:text-white group-hover:text-neon-cyan transition-colors">
                        IoT Club
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.isRoute ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
                            >
                                {link.name}
                            </a>
                        )
                    ))}

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neon-purple transition-colors"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {/* Admin Link */}
                            {isAdmin && (
                                <Link to="/admin" className="hidden md:block text-xs font-bold text-neon-cyan border border-neon-cyan/30 px-3 py-1.5 rounded-full hover:bg-neon-cyan/10 transition-colors">
                                    Admin Dashboard
                                </Link>
                            )}

                            <div className="flex items-center gap-2">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-neon-cyan" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-neon-purple text-white flex items-center justify-center font-bold">
                                        {user.displayName ? user.displayName[0] : <User className="w-4 h-4" />}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            Login
                        </Link>
                    )}

                    <a
                        href={import.meta.env.DEV ? "http://localhost:5174" : "/membership/"}
                        className="px-5 py-2 rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 font-semibold text-sm hover:bg-neon-cyan hover:text-black transition-all"
                    >
                        Join Us
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-gray-800 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border overflow-hidden"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                link.isRoute ? (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium text-gray-800 dark:text-gray-200"
                                    >
                                        {link.name}
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium text-gray-800 dark:text-gray-200"
                                    >
                                        {link.name}
                                    </a>
                                )
                            ))}
                            {user ? (
                                <div className="flex flex-col gap-2 border-t border-gray-200 dark:border-dark-border pt-4">
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium text-neon-cyan"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />}
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">{user.displayName}</span>
                                        </div>
                                        <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-2 bg-neon-cyan text-black font-bold rounded-lg mt-2 flex justify-center">
                                    Login with Google
                                </Link>
                            )}

                            <div className="flex items-center justify-between mt-4 border-t border-gray-200 dark:border-dark-border pt-4">
                                <span className="text-gray-500 dark:text-gray-400">Theme</span>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-border"
                                >
                                    {isDark ? (
                                        <><Sun className="w-4 h-4" /> Light</>
                                    ) : (
                                        <><Moon className="w-4 h-4" /> Dark</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
