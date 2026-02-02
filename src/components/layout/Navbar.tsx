import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileDown } from 'lucide-react';
import { cn, fixImageUrl } from '../../lib/utils';
import api from '../../lib/axios';

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [catalogueUrl, setCatalogueUrl] = useState<string | null>(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const fetchCatalogue = async () => {
            try {
                const response = await api.get('pages/home/');
                if (response.data.catalogue_file) {
                    setCatalogueUrl(fixImageUrl(response.data.catalogue_file) || null);
                }
            } catch (error) {
                console.error("Failed to fetch catalogue", error);
            }
        };
        fetchCatalogue();
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', active: location.pathname === '/' },
        { name: 'About Us', path: '/about', active: location.pathname === '/about' },
        { name: 'Products', path: '/products', active: location.pathname === '/products' },
        { name: 'Wholesale', path: '/wholesale', active: location.pathname === '/wholesale' },
        { name: 'Brands', path: '/brands', active: location.pathname.startsWith('/brands') },
        { name: 'Contact Us', path: '/contact', active: location.pathname === '/contact' },
    ];

    return (
        <nav className="relative bg-[#0F0F0F] text-white shadow-[0_4px_30px_rgba(0,0,0,0.8)] sticky top-0 z-50 border-b border-[#333] overflow-hidden">
            {/* Industrial Background Texture (Subtle Diagonal Lines) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }}></div>

            {/* Metallic Shine Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            {/* Screws/Rivets - More of them for a 'Bolted Plate' look */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-black border border-gray-600 shadow-lg"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-black border border-gray-600 shadow-lg hidden md:block"></div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-black border border-gray-600 shadow-lg"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-black border border-gray-600 shadow-lg"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-black border border-gray-600 shadow-lg hidden md:block"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-black border border-gray-600 shadow-lg"></div>

            {/* Navbar Content - Increased max-width to allow more space */}
            <div className="w-full max-w-[1800px] mx-auto px-2 md:px-6">
                <div className="flex justify-between h-20 xl:h-32 items-center gap-2 xl:gap-4 transition-all duration-500">
                    {/* Logo (Left) */}
                    <div className="flex-shrink-0 flex items-center py-4">
                        <Link to="/" className="flex items-center gap-4 group relative">
                            {/* Logo Glow Effect */}
                            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <img
                                src="/tmrlogo.png"
                                alt="TMR Industrial"
                                className="h-12 sm:h-16 xl:h-20 w-auto object-contain brightness-110 contrast-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] group-hover:scale-[1.03] transition-all duration-500 relative z-10"
                            />
                        </Link>
                    </div>

                    {/* Navigation Capsule (Center) */}
                    <div className="hidden xl:flex items-center justify-center max-w-5xl mx-2">
                        <div className="flex items-center w-full bg-[#080808] border-[3px] border-[#2A2A2A] rounded-2xl p-1.5 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden group/capsule">

                            {/* Metallic Shine Overlay */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                            {/* Mega Menu Removed */}

                            {/* Vertical Steel Divider */}
                            <div className="w-[2px] h-10 bg-gradient-to-b from-transparent via-[#444] to-transparent mx-1 opacity-50"></div>

                            {/* Links */}
                            <div className="flex flex-1 justify-around px-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={cn(
                                            "relative px-2 xl:px-4 py-2.5 text-[10px] xl:text-[14px] font-black uppercase tracking-wider xl:tracking-[0.2em] transition-all font-display whitespace-nowrap",
                                            link.active
                                                ? "text-white"
                                                : "text-gray-400 hover:text-white hover:scale-105"
                                        )}
                                    >
                                        {link.name}
                                        {link.active && (
                                            <>
                                                {/* Industrial Active Indicator */}
                                                <div className="absolute -bottom-1 left-0 right-0 h-[4px] bg-primary shadow-[0_0_20px_rgba(196,30,58,1)] rounded-full"></div>
                                                <div className="absolute -bottom-1 left-0 right-0 h-[10px] bg-primary/20 blur-md rounded-full"></div>
                                                {/* Flare Effect */}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[4px] bg-white blur-[1px]"></div>
                                            </>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side Icons/Catalogue */}
                    {/* Right Side Icons/Catalogue */}
                    <div className="hidden xl:flex items-center gap-3 pl-2">
                        {catalogueUrl && (
                            <a
                                href={catalogueUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex-shrink-0 flex items-center gap-2 2xl:gap-3 bg-primary hover:bg-white text-white hover:text-primary px-4 py-3 2xl:px-8 2xl:py-4 rounded-xl font-black text-[10px] 2xl:text-xs uppercase transition-all shadow-[0_10px_30px_rgba(196,30,58,0.4)] border-2 border-primary hover:border-primary active:scale-95 overflow-hidden"
                                title="Download Catalogue"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
                                <FileDown className="h-4 w-4 2xl:h-5 2xl:w-5 relative z-10" />
                                <span className="relative z-10 tracking-[0.1em] hidden 2xl:inline">CATALOGUE</span>
                            </a>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="xl:hidden flex items-center pr-2">
                        <button onClick={toggleMenu} className="text-white hover:text-primary focus:outline-none bg-[#111] p-3 rounded-xl border-2 border-[#333] hover:border-primary/50 transition-all shadow-xl">
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="xl:hidden bg-[#0A0A0A] border-t-2 border-primary/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-6 duration-500 relative z-[60]">
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
                    <div className="space-y-3 relative z-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-6 py-5 rounded-xl text-lg font-black uppercase tracking-[0.15em] font-display border-2 border-transparent transition-all",
                                    link.active
                                        ? "text-primary bg-primary/10 border-primary/30 shadow-[inset_0_0_20px_rgba(196,30,58,0.1)]"
                                        : "text-gray-300 hover:text-white hover:bg-[#151515] hover:border-[#333]"
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    {link.name}
                                    {link.active && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(196,30,58,1)]"></div>}
                                </div>
                            </Link>
                        ))}
                        {catalogueUrl && (
                            <a
                                href={catalogueUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-6 rounded-xl text-lg font-black uppercase tracking-widest font-display bg-primary text-white border-2 border-primary shadow-[0_10px_30px_rgba(196,30,58,0.4)] active:scale-95 transition-all mt-8"
                            >
                                <div className="flex items-center gap-4 justify-center">
                                    <FileDown className="h-6 w-6" />
                                    CATALOGUE DOWNLOAD
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
