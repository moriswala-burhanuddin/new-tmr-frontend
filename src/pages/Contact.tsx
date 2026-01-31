import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { getContactPageContent, type ContactPageContent } from '../api/pages';
import { fixImageUrl } from '../lib/utils';
import ContactForm from '../components/forms/ContactForm';
import Seo from '../components/common/Seo';

const Contact = () => {
    const [data, setData] = useState<ContactPageContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const content = await getContactPageContent();
            setData(content);
            setLoading(false);
        };
        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212]">
                <div className="w-16 h-16 border-4 border-[#333] border-t-[#C41E3A] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-[#AAAAAA]">
            <Seo
                title={data?.seo_title || "Contact Us"}
                description={data?.seo_description || "Get in touch with us for industrial equipment inquiries."}
                keywords={data?.seo_keywords}
            />

            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center border-b-[5px] border-[#C41E3A]">
                {/* Background Image / Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {data?.hero_image ? (
                        <img src={fixImageUrl(data.hero_image)} alt="Contact Us" className="w-full h-full object-cover opacity-30 grayscale" />
                    ) : (
                        <div className="w-full h-full bg-[#1A1A1A]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                    <div className="absolute inset-0 bg-[url('/assets/images/mesh-pattern.png')] opacity-10"></div>
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-4 uppercase tracking-tighter font-display drop-shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {data?.hero_title || "Contact Us"}
                    </motion.h1>
                    <motion.p
                        className="text-white text-xl uppercase tracking-widest font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {data?.hero_subtitle || "Get in Touch"}
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-8 font-display border-l-4 border-[#C41E3A] pl-4">
                            Contact Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                            {/* Namanve Showroom */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-[#333] pb-2">Namanve Showroom</h3>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] rounded-sm text-[#C41E3A]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold uppercase mb-1">Address</p>
                                        <p className="text-xs leading-relaxed">Shop No. 1 Namanve Industrial Park along Kampala-Jinja High Way diagonally opposite DTB Namanve Branch</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] rounded-sm text-[#C41E3A]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold uppercase mb-1">Telephone</p>
                                        <p className="text-xs">+256 758 670926</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] rounded-sm text-[#C41E3A]">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold uppercase mb-1">Email</p>
                                        <p className="text-xs">tmri.namanve@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* 6th Street Shop */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-[#333] pb-2">6th Street Shop</h3>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] rounded-sm text-[#C41E3A]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold uppercase mb-1">Address</p>
                                        <p className="text-xs leading-relaxed">Shop No.: 1, Plot 167-169, 6th Street Industrial Area, Kampala, Uganda. P.O. Box No. 28597 Kampala.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] rounded-sm text-[#C41E3A]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold uppercase mb-1">Telephone</p>
                                        <p className="text-xs">+256 753 683593</p>
                                        <p className="text-xs">+256 706 127 152</p>
                                        <p className="text-xs">+256 765 941 646</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] rounded-sm text-[#C41E3A]">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold uppercase mb-1">Email</p>
                                        <p className="text-xs">tmri.uganda@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-12 bg-[#1A1A1A] p-4 border border-[#333]">
                            <div className="bg-[#121212] p-3 border border-[#333] rounded-sm text-[#C41E3A]">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold uppercase tracking-wider mb-1">Business Hours</h3>
                                <p className="text-sm">Mon - Fri: 8:00 AM - 6:00 PM<br />Sat: 9:00 AM - 2:00 PM</p>
                            </div>
                        </div>

                        {data?.map_embed_url && (
                            <div className="border-2 border-[#333] rounded-sm overflow-hidden h-[300px] relative group hover:border-[#C41E3A] transition-colors">
                                {/* Corner Screws */}
                                <div className="absolute top-2 left-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444] z-10"></div>
                                <div className="absolute top-2 right-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444] z-10"></div>
                                <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444] z-10"></div>
                                <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444] z-10"></div>
                                <iframe
                                    src={data.map_embed_url}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    className="grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100"
                                ></iframe>
                            </div>
                        )}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#1A1A1A] p-8 border border-[#333] relative"
                    >
                        {/* Form Decoration */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-50"></div>

                        <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-8 font-display">
                            Send Message
                        </h2>

                        <ContactForm />
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
