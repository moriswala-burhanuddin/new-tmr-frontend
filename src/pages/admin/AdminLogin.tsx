import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login/', { username, password });
            login(response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login Failed', err);
            setError('Invalid credentials. Access Denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
            <div className="bg-[#1A1A1A] border border-[#333] p-8 w-full max-w-md relative overflow-hidden">
                {/* Top Hazard Stripe */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C41E3A] to-[#A01A2E]"></div>

                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display mb-2 text-center">
                    System <span className="text-[#C41E3A]">Access</span>
                </h1>
                <p className="text-[#666] text-center mb-8 uppercase tracking-widest text-xs font-bold">Authorized Personnel Only</p>

                {error && (
                    <div className="bg-[#C41E3A]/10 border border-[#C41E3A] text-[#C41E3A] p-3 mb-6 text-sm font-bold text-center uppercase tracking-wide">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-4 uppercase tracking-widest transition-colors font-display"
                    >
                        {loading ? 'Authenticating...' : 'Initialize Session'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
