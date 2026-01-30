import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-header-bg text-white pt-16 pb-8 border-t border-border-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/tmr_logo.png" alt="TMR Industrial" className="h-10 w-auto" />
                        </Link>
                        <p className="text-text-gray text-sm leading-relaxed">
                            Premier supplier of heavy-duty industrial hardware and professional-grade tools. Powering your jobsite since 2026.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider font-display">Quick Links</h4>
                        <ul className="space-y-3 text-text-gray">
                            <li><Link to="/" className="hover:text-primary transition-colors hover:pl-2 duration-200 block">Home</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors hover:pl-2 duration-200 block">About Us</Link></li>
                            <li><Link to="/products" className="hover:text-primary transition-colors hover:pl-2 duration-200 block">Products</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors hover:pl-2 duration-200 block">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider font-display">Contact Us</h4>
                        <ul className="space-y-3 text-text-gray text-sm">
                            <li className="flex items-start gap-3">
                                <span className="text-primary font-bold">A:</span>
                                123 Industrial Dr, Sector 4<br />Manufacturing Hub, MH 40001
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary font-bold">E:</span>
                                sales@industrialpro.com
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary font-bold">P:</span>
                                +1 (555) 987-6543
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider font-display">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-sm bg-card-bg text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-sm bg-card-bg text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-sm bg-card-bg text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-sm bg-card-bg text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border-gray mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} TMR Industrial. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
