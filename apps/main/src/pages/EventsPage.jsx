import React, { useState } from 'react';
import SectionWrapper from '../components/SectionWrapper';
import EventCard from '../components/EventCard';
import { motion } from 'framer-motion';

const EventsPage = () => {
    const [activeTab, setActiveTab] = useState('current');

    const events = {
        current: [
            {
                id: 1,
                title: "HACKFIESTA 1.0",
                type: "Hackathon",
                date: "January 17th - 18th, 2026",
                description: "A Freshers Hackathon for 1st & 2nd Year Students. This isn’t just another event. It’s where beginners turn into builders, ideas turn into action, and teamwork turns into innovation. No pressure. No experience required. Just ideas, creativity, and pure hackathon vibes.",
                image: "/images/events/hackfiesta-poster.png",
                registrationLink: "https://hackfiesta-1-0.vercel.app/",
                communityLink: "https://chat.whatsapp.com/E7zyw5oASxcAnrCwh5JhcR",
                contacts: [
                    { name: "Alex", phone: "+91 99018 25689" },
                    { name: "Devadathan", phone: "+91 62384 63653" }
                ],
                highlights: [
                    { label: "When", value: "Jan 17-18", sub: "12 Hours (Sat-Sun)", icon: "Calendar" },
                    { label: "Squad", value: "3 Members", sub: "Form your triad", icon: "Users" },
                    { label: "Who?", value: "1st & 2nd Year", sub: "Exclusive for freshers", icon: "GraduationCap" },
                    { label: "Venue", value: "Seminar Hall 4", sub: "MACE Campus", icon: "MapPin" },
                    { label: "Prize Pool", value: "₹10,000", sub: "Worth of Prizes", icon: "Trophy" }
                ]
            }
        ],
        upcoming: [],
        past: []
    };

    return (
        <div className="pt-24 min-h-screen">
            <SectionWrapper id="events" className="relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-6"
                    >
                        Events
                    </motion.h1>
                    <div className="w-24 h-1 bg-neon-cyan mx-auto rounded-full mb-8" />

                    {/* Tabs */}
                    <div className="flex justify-center gap-4 mb-12">
                        {['past', 'current', 'upcoming'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-6 py-2 rounded-full font-medium transition-all capitalize
                                    ${activeTab === tab
                                        ? 'bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,243,255,0.4)]'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events[activeTab].length > 0 ? (
                            events[activeTab].map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    isPast={activeTab === 'past'}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p>No {activeTab} events found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default EventsPage;
