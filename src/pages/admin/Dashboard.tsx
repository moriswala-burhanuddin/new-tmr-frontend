import { useState, useEffect } from 'react';
import { Monitor, Package, Tag, MessageSquare, Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

interface DashStats {
    total_products: number;
    total_brands: number;
    new_inquiries: number;
    system_health: string;
    recent_activity: {
        id: string;
        type: string;
        name: string;
        date: string;
        is_resolved: boolean;
    }[];
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('leads/stats/', {
                    headers: { Authorization: `Token ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) return <div className="text-white">Loading dashboard metrics...</div>;

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <Monitor className="w-8 h-8 text-[#C41E3A]" />
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">System Status</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Product Stats */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41E3A]/5 rounded-bl-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-4 h-4 text-[#C41E3A]" />
                        <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider">Total Products</h3>
                    </div>
                    <div className="text-4xl font-bold text-white font-display">{stats?.total_products || 0}</div>
                </div>

                {/* Brand Stats */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41E3A]/5 rounded-bl-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Tag className="w-4 h-4 text-[#C41E3A]" />
                        <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider">Total Brands</h3>
                    </div>
                    <div className="text-4xl font-bold text-white font-display">{stats?.total_brands || 0}</div>
                </div>

                {/* Inquiry Stats */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41E3A]/5 rounded-bl-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-4 h-4 text-[#C41E3A]" />
                        <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider">Active Inquiries</h3>
                    </div>
                    <div className="text-4xl font-bold text-white font-display">{stats?.new_inquiries || 0}</div>
                </div>

                {/* Health Stats */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-4 h-4 text-green-500" />
                        <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider">System Health</h3>
                    </div>
                    <div className="text-4xl font-bold text-green-500 font-display">{stats?.system_health || '100%'}</div>
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] p-8">
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter mb-8 font-display border-b border-[#333] pb-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#C41E3A]" />
                    Recent System Activity
                </h2>

                <div className="space-y-4">
                    {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                        stats.recent_activity.map(act => (
                            <div key={act.id} className="flex items-center justify-between p-4 bg-[#111] border border-[#222] hover:border-[#333] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-sm ${act.is_resolved ? 'bg-green-500/10 text-green-500' : 'bg-[#C41E3A]/10 text-[#C41E3A]'}`}>
                                        {act.is_resolved ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm uppercase tracking-tight">
                                            {act.type}: <span className="text-[#AAAAAA] font-normal">{act.name}</span>
                                        </div>
                                        <div className="text-[#555] text-[10px] font-mono mt-0.5">
                                            ID: {act.id} • {new Date(act.date).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${act.is_resolved ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#C41E3A]/10 text-[#C41E3A] border border-[#C41E3A]/20'}`}>
                                    {act.is_resolved ? 'Resolved' : 'Attention'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-[#666] italic text-sm py-8 text-center bg-[#111] border border-dashed border-[#222]">
                            No recent system activity recorded.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
