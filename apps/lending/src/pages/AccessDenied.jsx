import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function AccessDenied() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-card border border-dark-border p-8 rounded-2xl max-w-md w-full text-center"
            >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-gray-400 mb-8">
                    This area is restricted to approved IoT Club members only. Please complete your registration and wait for admin approval.
                </p>

                <div className="space-y-4">
                    <a
                        href="http://localhost:5173" // Assuming Membership App Port
                        className="block w-full py-3 bg-neon-cyan text-black font-bold rounded-xl hover:bg-neon-cyan/90 transition-colors"
                    >
                        Join the Club
                    </a>

                    <a
                        href="/"
                        className="block text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        Back to Home
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
