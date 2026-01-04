import React from 'react';
import SectionWrapper from '../components/SectionWrapper';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <SectionWrapper id="contact" className="bg-gray-50 dark:bg-black/40">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-display font-bold mb-4">Contact Us</h2>
                <div className="w-20 h-1 bg-neon-cyan mx-auto rounded-full" />
                <p className="text-gray-500 dark:text-gray-400 mt-4">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-gray-100 dark:border-dark-border text-center hover:border-neon-cyan/50 transition-colors">
                    <div className="w-12 h-12 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Email Us</h3>
                    <p className="text-sm text-gray-500 mb-4">For general inquiries and collaborations</p>
                    <a href="mailto:iotclub@mace.ac.in" className="text-neon-cyan font-medium hover:underline">
                        iotclub@mace.ac.in
                    </a>
                </div>

                <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-gray-100 dark:border-dark-border text-center hover:border-neon-purple/50 transition-colors">
                    <div className="w-12 h-12 bg-neon-purple/10 text-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Visit Us</h3>
                    <p className="text-sm text-gray-500 mb-4">Come say hello at our lab</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        IoT Lab, MPV Block<br />
                        MACE Kothamangalam
                    </p>
                </div>

                <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-gray-100 dark:border-dark-border text-center hover:border-neon-green/50 transition-colors">
                    <div className="w-12 h-12 bg-neon-green/10 text-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Call Us</h3>

                    <div className="flex flex-col gap-4">
                        <a href="tel:+919037820802" className="text-gray-700 dark:text-gray-300 font-medium hover:text-neon-green transition-colors">
                            Shawn Sony<br />
                            +91 90378 20802
                        </a>
                        <div className="w-12 h-[1px] bg-gray-200 dark:bg-gray-800 mx-auto"></div>
                        <a href="tel:+918590606218" className="text-gray-700 dark:text-gray-300 font-medium hover:text-neon-green transition-colors">
                            John Bosco<br />
                            +91 85906 06218
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
