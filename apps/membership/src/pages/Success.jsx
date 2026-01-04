import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Success() {
    const location = useLocation();
    const [member, setMember] = useState(null);

    useEffect(() => {
        if (location.state && location.state.memberData) {
            setMember(location.state.memberData);
        }
    }, [location]);

    if (!member) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <p>No registration details found. <Link to="/" className="text-neon-cyan underline">Go Home</Link></p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 bg-grid-pattern">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-dark-card border border-dark-border p-8 rounded-2xl text-center"
            >
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-yellow-500" />
                </div>

                <h1 className="text-3xl font-display font-bold text-white mb-2">Registration Successful</h1>
                <p className="text-gray-400 mb-6">
                    We have received your payment proof.
                </p>

                <div className="bg-black/40 p-4 rounded-xl text-left space-y-3 mb-8 border border-white/5">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Name</span>
                        <span className="text-white font-medium">{member.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="text-neon-cyan font-mono">{member.transactionId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className="text-green-500 font-medium uppercase text-xs border border-green-500/30 px-2 py-0.5 rounded-full">
                            Processing
                        </span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mb-8">
                    An admin will verify your transaction. Once approved, you will receive your Membership ID via email or check back later.
                </p>

                <a
                    href={import.meta.env.DEV ? "http://localhost:5173" : "/"}
                    className="block w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                    <Home className="w-4 h-4" /> Go to Main Website
                </a>
            </motion.div>
        </div>
    );
}
