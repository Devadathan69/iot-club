import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Login() {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-md mx-auto px-4">
                <div className="bg-white dark:bg-navy-900/80 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm relative overflow-hidden group transition-colors duration-300">
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
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />

                        <Button type="submit" className="w-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow bg-neon-cyan text-black hover:bg-neon-cyan/80" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-8 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-black text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full mt-6 border-gray-600 hover:bg-gray-800 hover:text-white transition-colors"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            Google
                        </Button>
                    </div>

                    <div className="mt-6 text-center text-sm text-slate-400 relative z-10">
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
