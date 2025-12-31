import React from 'react';
import { motion } from 'framer-motion';
import MembershipForm from '../components/MembershipForm';
import { Cpu } from 'lucide-react';

export default function Register() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Visuals */}
            <div className="md:w-1/2 bg-black relative overflow-hidden p-12 flex flex-col justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10">
                    <h1 className="text-7xl font-display font-bold leading-tight mb-6">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Revolution</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-lg">
                        Unlock access to workshops, hackathons, and our exclusive component library. Build the future with us.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-1/2 bg-dark-bg p-8 md:p-12 lg:p-16 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-2">Member Registration</h2>
                        <p className="text-gray-500">Fill in your details to get started.</p>
                    </motion.div>

                    <MembershipForm />
                </div>
            </div>
        </div>
    );
}
