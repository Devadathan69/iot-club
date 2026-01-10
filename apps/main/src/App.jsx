import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Execom from './sections/Execom';
import Contact from './sections/Contact';
import { projects } from './data/contentData';

{/* Lending Preview */ }
import SectionWrapper from './components/SectionWrapper';
import Background from './components/Background';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsPage from './pages/EventsPage';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

const StoreLayout = ({ children }) => {
    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-neon-cyan selection:text-black relative">
            <Background />
            <Navbar />
            <main className="relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
};

const HomePage = () => (
    <>
        <Hero />
        <About /> {/* Includes Domains */}

        <SectionWrapper id="projects" className="bg-black/5 dark:bg-white/5">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-display font-bold mb-4">Recent Projects</h2>
                <div className="w-20 h-1 bg-neon-purple mx-auto rounded-full" />
            </div>
            {/* Preview of just 2-3 recent projects or featured ones, linking to full list */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {projects.map(p => (
                    <div key={p.id} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-neon-purple transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">{p.title}</h3>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded">{p.year}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{p.description}</p>
                        <div className="flex gap-2">
                            {p.tech.map(t => (
                                <span key={t} className="text-xs font-medium px-2 py-1 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <a
                    href="/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-neon-cyan text-neon-cyan rounded-full hover:bg-neon-cyan hover:text-black transition-all font-bold"
                >
                    View All Projects
                </a>
            </div>
        </SectionWrapper>

        <Execom />
        <Contact />

        {/* Lending Preview */}
        <section className="py-24 px-4 bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="container mx-auto max-w-4xl text-center relative z-10">
                <h2 className="text-4xl font-display font-bold mb-6">Need Components?</h2>
                <p className="text-xl text-gray-400 mb-10">
                    Access our extensive library of sensors, microcontrollers, and tools.
                    Check availability and book items instantly.
                </p>
                <a href={import.meta.env.DEV ? "http://localhost:5175" : "/lending/"} className="inline-block px-8 py-4 bg-neon-cyan text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all transform hover:-translate-y-1">
                    Goto Component Lending system
                </a>
            </div>
        </section>
    </>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <StoreLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/events" element={<EventsPage />} />
                    </Routes>
                </StoreLayout>
            </Router>
        </AuthProvider>
    );
}

export default App;
