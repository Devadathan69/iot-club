import React from 'react';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';
import ProfileModal from './ProfileModal';
import { useState } from 'react';

export default function Navbar() {
    const { currentUser } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <>
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
            <nav className="fixed w-full z-50 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a href="http://localhost:5173" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                            <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img src={logo} alt="IoT Logo" className="w-full h-full object-cover relative z-10" />
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-neon-cyan transition-colors">
                            IoT Club
                        </span>
                    </a>

                    <div className="flex items-center gap-6">
                        <a href="http://localhost:5173" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Back to Home
                        </a>

                        {currentUser && (
                            <button
                                onClick={() => setShowProfile(true)}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan p-[1px] hover:scale-105 transition-transform"
                            >
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-neon-cyan">
                                            {currentUser.displayName?.[0] || <User className="w-4 h-4" />}
                                        </span>
                                    )}
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </nav >
        </>
    );
}
