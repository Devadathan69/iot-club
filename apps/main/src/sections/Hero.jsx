import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background handled by global component */}

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-sm font-mono mb-6"
                >
                    <Cpu className="w-4 h-4" />
                    <span>INNOVATE • BUILD • DEPLOY</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight"
                >
                    MACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan text-glow">IoT Club</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    The premier student community for Electronics, Robotics, and Embedded Systems at Mar Athanasius College of Engineering.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <a
                        href={import.meta.env.DEV ? "http://localhost:5175" : "/lending/"}
                        className="group relative px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                    >
                        <span className="flex items-center gap-2">
                            Borrow Components <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </a>
                    <a
                        href={import.meta.env.DEV ? "http://localhost:5174" : "/membership/"}
                        className="px-8 py-3 bg-transparent border border-gray-300 dark:border-gray-700 hover:border-neon-purple text-gray-900 dark:text-white rounded-full font-medium transition-colors"
                    >
                        Get Membership
                    </a>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium"
                >
                    IoT Club membership is valid for one academic year and must be renewed annually by existing members.
                </motion.p>
            </div>
        </section >
    );
}
