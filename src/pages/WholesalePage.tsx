import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Factory, Scale, Truck, Users } from 'lucide-react';
import { getWholesalePageContent, type WholesalePageContent } from '../api/pages';
import { fixImageUrl } from '../lib/utils';
import WholesaleForm from '../components/forms/WholesaleForm';
import Seo from '../components/common/Seo';

const WholesalePage = () => {
    const [data, setData] = useState<WholesalePageContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const content = await getWholesalePageContent();
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

    const benefits = [
        { icon: <Scale className="w-8 h-8" />, title: "Volume Discounts", text: "Competitive pricing for bulk orders tailored to your project scale." },
        { icon: <Truck className="w-8 h-8" />, title: "Priority Logistics", text: "Expedited shipping and handling for large-scale industrial shipments." },
        { icon: <Factory className="w-8 h-8" />, title: "Direct Sourcing", text: "Genuine products sourced directly from manufacturers." },
        { icon: <Users className="w-8 h-8" />, title: "Dedicated Support", text: "Account manager assigned to handle your B2B requirements." },
    ];

    return (
        <div className="min-h-screen bg-[#121212] text-[#AAAAAA]">
            <Seo
                title={data?.seo_title || "Wholesale & Bulk Orders"}
                description={data?.seo_description || "B2B solutions and wholesale pricing for industrial equipment."}
            />

            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center border-b-[5px] border-[#C41E3A]">
                {/* Background Image / Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {data?.hero_image ? (
                        <img src={fixImageUrl(data.hero_image)} alt="Wholesale" className="w-full h-full object-cover opacity-30 grayscale" />
                    ) : (
                        <div className="w-full h-full bg-[#1A1A1A]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                    <div className="absolute inset-0 bg-[url('/assets/images/mesh-pattern.png')] opacity-10"></div>
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-4 uppercase tracking-tighter font-display drop-shadow-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {data?.hero_title || "Industrial Wholesale"}
                    </motion.h1>
                    <motion.p
                        className="text-white text-xl uppercase tracking-widest font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {data?.hero_subtitle || "Partner with Power"}
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-8 font-display border-l-4 border-[#C41E3A] pl-4">
                            Why Partner With Us?
                        </h2>

                        <div className="prose prose-lg prose-invert text-[#AAAAAA] mb-12">
                            {data?.content ? (
                                <div dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br />') }} />
                            ) : (
                                <p>
                                    At TMR Project, we understand the demands of large-scale operations. Our wholesale program is designed
                                    to support contractors, resellers, and industrial facilities with reliable supply chains and preferential pricing.
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="bg-[#1A1A1A] p-6 border border-[#333] group hover:border-[#C41E3A] transition-colors relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity text-[#C41E3A]">
                                        {benefit.icon}
                                    </div>
                                    <div className="text-[#C41E3A] mb-3 group-hover:scale-110 transition-transform origin-left">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-white font-bold uppercase tracking-wider mb-2 font-display">{benefit.title}</h3>
                                    <p className="text-sm">{benefit.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#1A1A1A] p-8 border border-[#333] relative"
                    >
                        {/* Form Decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#333_5px,#333_10px)] opacity-20"></div>

                        <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-8 font-display">
                            Vendor Application
                        </h2>

                        <WholesaleForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default WholesalePage;
