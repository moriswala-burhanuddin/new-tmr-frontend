import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { fixImageUrl } from '../../lib/utils';

const CTASection = () => {
    const [catalogueUrl, setCatalogueUrl] = useState<string | null>(null);

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

    return (
        <section className="relative py-24 overflow-hidden bg-[#1A1A1A] border-t border-[#333]">
            {/* ... background elements ... */}
            <div className="absolute inset-0 bg-[#121212]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C41E3A]/10 rounded-full blur-3xl mix-blend-screen opacity-30 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A01A2E]/10 rounded-full blur-3xl mix-blend-screen opacity-30 animate-pulse delay-700" />
            </div>

            {/* Hazard stripe at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-3 bg-[repeating-linear-gradient(45deg,#222,#222_10px,#C41E3A_10px,#C41E3A_20px)] border-t border-[#111]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter uppercase font-display border-b-4 border-[#C41E3A] inline-block pb-2">
                        Ready to Upgrade Your Jobsite?
                    </h2>
                    <p className="text-xl text-[#AAAAAA] mb-10 max-w-2xl mx-auto font-sans">
                        Get access to exclusive bulk pricing and heavy-duty industrial solutions depending on your needs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/contact" className="w-full sm:w-auto px-10 py-4 bg-[#C41E3A] hover:bg-white hover:text-[#C41E3A] text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group uppercase tracking-widest border-2 border-[#C41E3A] font-display">
                            Request Quote
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {catalogueUrl ? (
                            <a
                                href={catalogueUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-10 py-4 bg-transparent hover:bg-white/10 text-white font-bold backdrop-blur-sm border-2 border-[#C41E3A] hover:border-white transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest font-display"
                            >
                                <FileDown className="w-5 h-5" />
                                Download Catalogue
                            </a>
                        ) : (
                            <Link to="/contact" className="w-full sm:w-auto px-10 py-4 bg-transparent hover:bg-white/10 text-white font-bold backdrop-blur-sm border-2 border-white/30 hover:border-white transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest font-display">
                                <Mail className="w-5 h-5" />
                                Contact Sales
                            </Link>
                        )}

                        <Link to="/contact" className="w-full sm:w-auto px-10 py-4 bg-transparent hover:bg-[#C41E3A] text-white font-bold border-2 border-[#444] hover:border-[#C41E3A] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest font-display">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Book a Call
                        </Link>
                    </div>

                    <div className="mt-12 flex justify-center gap-8 text-[#666] text-sm font-medium uppercase tracking-wide">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#C41E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Volume Discounts
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#C41E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Fast Delivery
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
