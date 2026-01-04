import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Login() {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const from = location.state?.from?.pathname || '/';

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate(from, { replace: true });
        } catch (err) {
            setError('Failed to sign in with Google.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center p-4 bg-black text-white">
            <div className="max-w-md w-full mx-auto px-4">
                {/* ... card content ... */}
                <div className="bg-gray-900/80 p-8 rounded-2xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan mb-8 tracking-tight">
                        Welcome Back
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="student@example.com"
                            className="bg-black/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-neon-cyan"
                        />
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="bg-black/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-neon-cyan pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <Button type="submit" className="w-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-8 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full mt-6 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            Google
                        </Button>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-400 relative z-10">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-neon-cyan hover:text-neon-cyan/80 font-medium hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
