import React from 'react';
import SectionWrapper from '../components/SectionWrapper';
import { execomData } from '../data/execomData';
import { User } from 'lucide-react';
import Card3D from '../components/Card3D';

const MemberCard = ({ member, teamId }) => {
    // Logic to construct image path: /src/assets/execom/{teamId}/{Name}-{Class}.jpg
    // Note: In production build, these dynamic imports might need handling if not using import.meta.glob
    // For basic Vite usage, putting them in public/ might be easier, 
    // BUT user specified src/assets. We will try to rely on URL construction or use a helper.

    // Since Vite static assets with dynamic names are tricky, we will assume the user
    // might configure a copy plugin or simpler: we use a direct path string 
    // and ensure the images are imported if possible, OR we act like they are in public.
    // Given the constraint "Static landing website" and "no backend", 
    // best approach for dynamic images in Vite is `new URL(path, import.meta.url).href` 

    // Images are now in 'public/assets/execom' which serves to '/assets/execom'
    const imagePath = `/assets/execom/${teamId}/${member.name}-${member.class}.jpg`;

    return (
        <div className="group relative">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 dark:bg-dark-border relative">
                <img
                    src={imagePath}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                {/* Fallback Placeholder */}
                <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-500">
                    <User className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs font-mono opacity-50 px-4 text-center">
                        {member.name}-{member.class}.jpg
                    </span>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h4 className="text-white font-bold text-lg leading-tight">{member.name}</h4>
                    <p className="text-neon-cyan text-xs font-mono mt-1">{member.role}</p>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider mt-0.5">{member.class}</p>
                </div>
            </div>
        </div>
    );
};

export default function Execom() {
    return (
        <SectionWrapper id="execom">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-display font-bold mb-4">Meet the Team</h2>
                <p className="text-gray-500 dark:text-gray-400">The minds behind the magic.</p>
            </div>

            <div className="space-y-16">
                {execomData.map((team) => (
                    <div key={team.id}>
                        <h3 className="text-2xl font-bold mb-8 pl-4 border-l-4 border-neon-purple text-gray-800 dark:text-gray-200">
                            {team.title}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {team.members.map((member, idx) => (
                                <MemberCard key={idx} member={member} teamId={team.id} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
}
