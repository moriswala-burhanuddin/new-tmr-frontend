import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/common/Seo';
import { getAboutPageContent, type AboutPageContent } from '../api/pages';

// AboutPageData interface removed as we use AboutPageContent from api/pages

const About = () => {
    const [data, setData] = useState<AboutPageContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const content = await getAboutPageContent();
            // The helper returns the object directly, but checking if it's valid slightly differently
            if (content) {
                setData(content);
            }
            setLoading(false);
        };
        fetchData();
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
                title={data?.seo_title || data?.hero_title || "About Us"}
                description={data?.seo_description || "Learn more about our company and mission."}
            />

            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center border-b-[5px] border-[#C41E3A]">
                {/* Background Image / Overlay */}
                <div className="absolute inset-0 z-0">
                    {data?.hero_image ? (
                        <img src={data.hero_image} alt="About Us" className="w-full h-full object-cover opacity-30 grayscale" />
                    ) : (
                        <div className="w-full h-full bg-[#1A1A1A]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                    <div className="absolute inset-0 bg-[url('/assets/images/mesh-pattern.png')] opcode-10"></div>
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-4 uppercase tracking-tighter font-display drop-shadow-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {data?.hero_title || "Heavy Duty Heritage"}
                    </motion.h1>
                    <motion.div
                        className="flex items-center justify-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-12 h-1 bg-[#C41E3A]"></div>
                        <span className="text-white uppercase tracking-widest font-semibold">Since 2024</span>
                        <div className="w-12 h-1 bg-[#C41E3A]"></div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-4 py-20 relative">
                {/* Decorative Side Borders */}
                <div className="absolute top-0 left-0 w-[1px] h-full bg-[#333] hidden lg:block"></div>
                <div className="absolute top-0 right-0 w-[1px] h-full bg-[#333] hidden lg:block"></div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    {/* Main Content */}
                    <div className="md:col-span-8">
                        {/* Hazard stripe decoration */}
                        <div className="w-32 h-2 bg-[repeating-linear-gradient(45deg,#1A1A1A,#1A1A1A_10px,#C41E3A_10px,#C41E3A_20px)] mb-8"></div>

                        <motion.div
                            className="prose prose-lg prose-invert text-[#AAAAAA]"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            {data?.content ? (
                                <div dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br />') }} />
                            ) : (
                                <div>
                                    <h3 className="text-2xl text-white font-bold uppercase mb-4 font-display">Forged for Performance</h3>
                                    <p>
                                        TMR Project was founded with a single mission: to provide the toughest, most reliable industrial equipment on the market.
                                        We understand that downtime is not an option when you are on the job. That is why every product in our catalog is rigorously tested
                                        to meet the highest standards of durability and performance.
                                    </p>
                                    <p className="mt-4">
                                        From heavy machinery to precision tools, we serve professionals who demand excellence. Our commitment to quality is matched only by
                                        our dedication to customer support, ensuring you have the backing you need to get the job done right.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Stats / Sidebar */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-[#1A1A1A] p-8 border border-[#333] relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                            {/* Screw Accents */}
                            <div className="absolute top-2 left-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444]"></div>
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444]"></div>
                            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444]"></div>
                            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444]"></div>

                            <h3 className="text-4xl font-bold text-[#C41E3A] mb-1 font-display">100+</h3>
                            <p className="text-white uppercase text-sm tracking-wider font-semibold">Clients Served</p>
                        </div>

                        <div className="bg-[#1A1A1A] p-8 border border-[#333] relative overflow-hidden group hover:border-[#C41E3A] transition-colors">
                            <h3 className="text-4xl font-bold text-white mb-1 font-display">24/7</h3>
                            <p className="text-[#AAAAAA] uppercase text-sm tracking-wider font-semibold">Expert Support</p>
                        </div>

                        <div className="bg-[#C41E3A] p-8 text-white text-center">
                            <h4 className="font-bold uppercase tracking-widest text-lg mb-4 font-display">Ready to Work?</h4>
                            <button className="bg-white text-[#C41E3A] px-6 py-2 font-bold uppercase hover:bg-[#121212] hover:text-white transition-colors w-full">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
