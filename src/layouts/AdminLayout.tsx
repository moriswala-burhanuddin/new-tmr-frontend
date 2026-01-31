import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Tags,
    FolderOpen,
    Package,
    Mail,
    FileText
} from 'lucide-react';
import { useEffect } from 'react';

const AdminLayout = () => {
    const { logout, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>;
    if (!isAuthenticated) return null;

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    return (
        <div className="flex h-screen bg-[#121212] text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-[260px] bg-[#2A2A2A] border-r border-[#333] flex flex-col shrink-0">
                <div className="h-[70px] flex items-center px-6 border-b border-[#333] bg-[#1A1A1A]">
                    <div className="text-2xl font-extrabold tracking-tighter">
                        TMR <span className="text-[#C41E3A]">Admin</span>
                    </div>
                </div>
                <nav className="flex-1 py-6 overflow-y-auto">
                    <Link to="/admin/dashboard" className={`px-6 py-3 flex items-center transition-all border-l-4 ${isActive('/admin/dashboard') ? 'bg-[#C41E3A]/10 text-[#C41E3A] border-[#C41E3A]' : 'text-[#AAAAAA] border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </Link>
                    <Link to="/admin/brands" className={`px-6 py-3 flex items-center transition-all border-l-4 ${isActive('/admin/brands') ? 'bg-[#C41E3A]/10 text-[#C41E3A] border-[#C41E3A]' : 'text-[#AAAAAA] border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <Tags className="w-5 h-5 mr-3" /> Brands
                    </Link>
                    <Link to="/admin/categories" className={`px-6 py-3 flex items-center transition-all border-l-4 ${isActive('/admin/categories') ? 'bg-[#C41E3A]/10 text-[#C41E3A] border-[#C41E3A]' : 'text-[#AAAAAA] border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <FolderOpen className="w-5 h-5 mr-3" /> Categories
                    </Link>
                    <Link to="/admin/products" className={`px-6 py-3 flex items-center transition-all border-l-4 ${isActive('/admin/products') ? 'bg-[#C41E3A]/10 text-[#C41E3A] border-[#C41E3A]' : 'text-[#AAAAAA] border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <Package className="w-5 h-5 mr-3" /> Products
                    </Link>
                    <Link to="/admin/leads" className={`px-6 py-3 flex items-center transition-all border-l-4 ${isActive('/admin/leads') ? 'bg-[#C41E3A]/10 text-[#C41E3A] border-[#C41E3A]' : 'text-[#AAAAAA] border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <Mail className="w-5 h-5 mr-3" /> Inquiries
                    </Link>
                    <Link to="/admin/pages" className={`px-6 py-3 flex items-center transition-all border-l-4 ${isActive('/admin/pages') ? 'bg-[#C41E3A]/10 text-[#C41E3A] border-[#C41E3A]' : 'text-[#AAAAAA] border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <FileText className="w-5 h-5 mr-3" /> Content Pages
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <div className="h-[70px] bg-[#1A1A1A] border-b border-[#333] flex items-center justify-between px-8 shrink-0">
                    <div className="text-xl font-semibold text-white">
                        {/* Dynamic Title Implementation can go here */}
                        Admin Panel
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[#AAAAAA]">Administrator</span>
                        <button
                            onClick={logout}
                            className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white px-4 py-2 rounded font-bold text-sm uppercase transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-auto p-8 bg-[#121212]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
