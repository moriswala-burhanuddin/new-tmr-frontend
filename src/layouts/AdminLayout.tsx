import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Tags,
    FolderOpen,
    Package,
    Mail,
    FileText,
    Menu,
    X,
    LogOut
} from 'lucide-react';

const AdminLayout = () => {
    const { logout, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, loading, navigate]);

    // Close mobile menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>;
    if (!isAuthenticated) return null;

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const NavContent = () => (
        <>
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
        </>
    );

    return (
        <div className="flex h-screen bg-[#121212] text-white overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-[260px] bg-[#2A2A2A] border-r border-[#333] flex-col shrink-0">
                <div className="h-[90px] flex items-center justify-center px-6 border-b border-[#333] bg-[#1A1A1A]">
                    <Link to="/admin/dashboard" className="flex items-center justify-center w-full">
                        <img src="/tmrlogo.png" alt="TMR Logo" className="h-16 w-auto object-contain" />
                    </Link>
                </div>
                <nav className="flex-1 py-6 overflow-y-auto">
                    <NavContent />
                </nav>
            </div>

            {/* Mobile Sidebar (Overlay) */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="relative w-64 h-full bg-[#1A1A1A] border-r border-[#333] flex flex-col">
                    <div className="p-6 border-b border-[#333] flex items-center justify-between">
                        <Link to="/admin/dashboard" className="flex items-center gap-2">
                            <img src="/tmrlogo.png" alt="TMR Logo" className="h-10 w-auto" />
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#666] hover:text-white"><X className="w-6 h-6" /></button>
                    </div>
                    <nav className="flex-1 py-6 overflow-y-auto">
                        <NavContent />
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Top Navbar */}
                <div className="h-[70px] bg-[#1A1A1A] border-b border-[#333] flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 lg:hidden text-[#666] hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="text-lg lg:text-xl font-bold font-display text-white uppercase tracking-tight">
                            Admin Panel
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-xs font-bold text-[#666] uppercase tracking-widest">Administrator</span>
                        <button
                            onClick={logout}
                            className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white p-2 lg:px-4 lg:py-2 rounded font-bold text-xs lg:text-sm uppercase transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden lg:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-auto p-4 lg:p-8 bg-[#121212]">
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
