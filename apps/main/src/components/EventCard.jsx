import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, MessageCircle, Users, GraduationCap, Trophy } from 'lucide-react';

const EventCard = ({ event, isPast }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`
                group relative bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 
                hover:border-neon-cyan/50 transition-colors duration-300
                ${isPast ? 'opacity-75 grayscale hover:grayscale-0' : ''}
            `}
        >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-full text-xs font-bold mb-2">
                        {event.type}
                    </span>
                    <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                        {event.title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Highlights List */}
                {event.highlights && (
                    <div className="flex flex-col gap-4">
                        {event.highlights.map((item, idx) => {
                            const Icon = {
                                Calendar,
                                Users,
                                GraduationCap,
                                MapPin,
                                Trophy
                            }[item.icon] || Calendar;

                            return (
                                <div key={idx} className="flex items-center gap-3 text-gray-200">
                                    <Icon className="w-5 h-5 text-neon-cyan" />
                                    <div>
                                        <span className="font-semibold mr-2">{item.value}</span>
                                        <span className="text-sm text-gray-500">{item.sub}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Contacts / Separator */}
                {event.contacts && (
                    <>
                        <div className="h-px bg-white/10 my-2" />
                        <div className="space-y-3">
                            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold">Inquiries</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {event.contacts.map((contact, idx) => (
                                    <div key={idx}>
                                        <div className="font-bold text-white text-sm">{contact.name}</div>
                                        <div className="text-xs text-neon-purple">{contact.phone}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {event.highlights ? (
                    null
                ) : (
                    <>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                            {event.description}
                        </p>
                        <div className="flex flex-col gap-2 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-neon-purple" />
                                <span>{event.date}</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Actions */}
                {!isPast && (
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        {event.registrationLink && (
                            <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Register
                            </a>
                        )}
                        {event.communityLink && (
                            <a
                                href={event.communityLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center p-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/30 transition-all"
                                title="Join Community"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default EventCard;
