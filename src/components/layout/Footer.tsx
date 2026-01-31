import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { getHomePageContent, type HomePageContent } from '../../api/pages';

const Footer = () => {
    const [content, setContent] = useState<HomePageContent | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            const data = await getHomePageContent();
            setContent(data);
        };
        fetchContent();
    }, []);

    const socialLinks = [
        { icon: <Facebook className="h-5 w-5" />, href: content?.facebook_url || '#', name: 'Facebook' },
        { icon: <Instagram className="h-5 w-5" />, href: content?.instagram_url || '#', name: 'Instagram' },
        { icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>, href: content?.tiktok_url || '#', name: 'TikTok' },
        { icon: <Linkedin className="h-5 w-5" />, href: content?.linkedin_url || '#', name: 'LinkedIn' },
        { icon: <Youtube className="h-5 w-5" />, href: content?.youtube_url || '#', name: 'YouTube' },
    ];

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
                        <ul className="space-y-4 text-text-gray text-xs">
                            <li className="flex items-start gap-3">
                                <span className="text-primary font-bold">A:</span>
                                Shop No. 1, Plot 167-169<br />6th Street Industrial Area, Kampala
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary font-bold">E:</span>
                                tmri.uganda@gmail.com
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary font-bold">P:</span>
                                +256 753 683593
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider font-display">Follow Us</h4>
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-sm bg-card-bg text-gray-400 hover:bg-primary hover:text-white transition-all"
                                    title={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
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
