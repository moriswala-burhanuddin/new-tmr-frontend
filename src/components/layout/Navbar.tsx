import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/', active: location.pathname === '/' },
        { name: 'About Us', path: '/about', active: location.pathname === '/about' },
        { name: 'Products', path: '/products', active: location.pathname === '/products' },
        { name: 'Wholesale', path: '/wholesale', active: location.pathname === '/wholesale' },
        { name: 'Brands', path: '/brands', active: location.pathname.startsWith('/brands') },
        { name: 'Contact Us', path: '/contact', active: location.pathname === '/contact' },
    ];

    return (
        <nav className="relative bg-[#1A1A1A] text-white shadow-2xl sticky top-0 z-50 border-b border-[#333]">
            {/* Screws/Rivets */}
            <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gray-600 to-black border border-gray-600 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gray-600 to-black border border-gray-600 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gray-600 to-black border border-gray-600 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gray-600 to-black border border-gray-600 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"></div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex justify-between h-24 items-center gap-4">
                    {/* Logo (Left) */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src="/tmr_logo.png" alt="TMR Industrial" className="h-14 w-auto object-contain drop-shadow-md" />
                        </Link>
                    </div>

                    {/* Navigation Capsule (Center) */}
                    <div className="hidden lg:flex flex-1 items-center justify-center max-w-4xl mx-4">
                        <div className="flex items-center w-full bg-[#111] border-2 border-[#333] rounded-lg p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden">

                            {/* Metallic Shine Overlay */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-30"></div>

                            {/* Mega Menu Button */}
                            <button className="flex items-center gap-2 text-white px-5 py-2 rounded-md transition-all font-display uppercase tracking-wider text-sm hover:bg-[#2A2A2A] mr-1">
                                <Menu className="h-4 w-4 text-gray-400" />
                                MEGA MENU
                                <span className="ml-1 text-[10px] opacity-50">▼</span>
                            </button>

                            {/* Divider */}
                            <div className="w-[1px] h-6 bg-[#333] mx-1"></div>

                            {/* Links */}
                            <div className="flex flex-1 justify-around">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={cn(
                                            "flex-1 text-center px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all rounded-sm font-display",
                                            link.active
                                                ? "bg-primary text-white shadow-lg transform scale-105"
                                                : "text-gray-400 hover:text-white hover:bg-[#222]"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Icons (Right) - Removed */}
                    <div className="hidden md:flex items-center gap-6 pl-4">
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-white hover:text-primary focus:outline-none bg-[#222] p-2 rounded border border-[#333]">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="lg:hidden bg-[#151515] border-t border-[#333] p-4 shadow-xl">
                    <div className="space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-4 py-4 rounded-sm text-base font-bold uppercase tracking-wide font-display border-b border-[#222] last:border-0",
                                    link.active ? "text-primary bg-[#1A1A1A]" : "text-gray-300 hover:text-white hover:bg-[#1A1A1A]"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
