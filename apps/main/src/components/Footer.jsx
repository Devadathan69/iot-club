import React from 'react';
import { Github, Instagram, Mail, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-dark-border py-12 mt-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold font-display">MACE <span className="text-neon-cyan">IoT Club</span></h2>
                        <p className="text-gray-500 text-sm mt-2">Mar Athanasius College of Engineering, Kothamangalam</p>
                    </div>

                    <div className="flex gap-6">
                        <a href="https://www.instagram.com/maceiotclub?igsh=MWczdG9leHJqcHJ3OA==" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-dark-card rounded-full hover:bg-neon-cyan hover:text-black transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.linkedin.com/company/maceiotclub/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-dark-card rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="mailto:iotclub@mace.ac.in" className="p-2 bg-gray-100 dark:bg-dark-card rounded-full hover:bg-neon-green hover:text-black transition-colors">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-100 dark:border-dark-border pt-8">
                    © {new Date().getFullYear()} MACE IoT Club. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
