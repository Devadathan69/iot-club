import React from 'react';
import SectionWrapper from '../components/SectionWrapper';
import { domains } from '../data/contentData';
import { Lightbulb, Users, Target } from 'lucide-react';
import aboutImg from '../assets/images/about-collage.jpeg';

export default function About() {
    const cards = [
        { icon: Lightbulb, title: 'Innovation', desc: 'Fostering a culture of creativity and problem-solving.' },
        { icon: Users, title: 'Community', desc: 'A network of like-minded tech enthusiasts.' },
        { icon: Target, title: 'Excellence', desc: 'Striving for perfection in every line of code regarding hardware.' },
    ];

    return (
        <>
            <SectionWrapper id="about" className="bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold mb-6">Building the Future,<br /><span className="text-neon-cyan">Bit by Bit.</span></h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            The MACE IoT Club is more than just a technical society; it's an incubator for ideas.
                            We bridge the gap between software and hardware, enabling students to build smart, connected solutions for real-world problems.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                            {cards.map((c, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-dark-border">
                                    <c.icon className="w-8 h-8 text-neon-purple mb-3" />
                                    <h3 className="font-bold mb-1">{c.title}</h3>
                                    <p className="text-xs text-gray-500">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-96 bg-gray-100 dark:bg-dark-bg rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-2xl">
                        <img
                            src={aboutImg}
                            alt="IoT Club Projects"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="font-display font-bold text-xl">Innovation Hub</p>
                                <p className="text-sm opacity-80">Where ideas check into reality</p>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper id="domains">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold mb-4">Our Domains</h2>
                    <div className="w-20 h-1 bg-neon-cyan mx-auto rounded-full" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {domains.map((d) => (
                        <div key={d.id} className="group p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:border-neon-cyan/50 hover:box-glow transition-all duration-300">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-dark-bg rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <d.icon className="w-6 h-6 text-neon-purple group-hover:text-neon-cyan transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{d.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{d.description}</p>
                        </div>
                    ))}
                </div>
            </SectionWrapper>
        </>
    );
}
