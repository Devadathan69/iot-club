
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

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

    // ... handleGoogleLogin ...
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
        <div className="max-w-md mx-auto mt-12 px-4">
            <div className="bg-navy-900/80 p-8 rounded-2xl border border-navy-700 shadow-[0_0_50px_rgba(15,23,42,0.6)] backdrop-blur-sm relative overflow-hidden group">
                {/* ... header ... */}
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-8 tracking-tight">
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
                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <Button type="submit" className="w-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-8 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-navy-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-navy-900/80 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full mt-6 border-navy-600 hover:bg-navy-800 hover:text-fuchsia-400 transition-colors"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        Google
                    </Button>
                </div>

                <div className="mt-6 text-center text-sm text-slate-400 relative z-10">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
