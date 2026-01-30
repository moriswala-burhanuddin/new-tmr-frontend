import { Monitor } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <Monitor className="w-8 h-8 text-[#C41E3A]" />
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">System Status</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41E3A]/10 rounded-bl-full -mr-8 -mt-8"></div>
                    <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Total Products</h3>
                    <div className="text-4xl font-bold text-white font-display">1,248</div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41E3A]/10 rounded-bl-full -mr-8 -mt-8"></div>
                    <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Total Brands</h3>
                    <div className="text-4xl font-bold text-white font-display">12</div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41E3A]/10 rounded-bl-full -mr-8 -mt-8"></div>
                    <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">New Inquiries</h3>
                    <div className="text-4xl font-bold text-white font-display">5</div>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41E3A]/10 rounded-bl-full -mr-8 -mt-8"></div>
                    <h3 className="text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">System Health</h3>
                    <div className="text-4xl font-bold text-green-500 font-display">98%</div>
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] p-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter mb-6 font-display border-b border-[#333] pb-2">Recent System Activity</h2>
                <div className="text-[#666] italic text-sm">No recent activity logs available.</div>
            </div>
        </div>
    );
};

export default Dashboard;
