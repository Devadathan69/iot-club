import logo from '../assets/logo.png';

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <a href={import.meta.env.DEV ? "http://localhost:5173" : "/"} className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img src={logo} alt="IoT Logo" className="w-full h-full object-cover relative z-10" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-neon-cyan transition-colors">
                        IoT Club
                    </span>
                </a>

                <a href={import.meta.env.DEV ? "http://localhost:5173" : "/"} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Back to Home
                </a>
            </div>
        </nav>
    );
}
