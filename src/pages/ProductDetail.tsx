import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import api from '../lib/axios';
import type { Product } from '../types';
import { fixImageUrl } from '../lib/utils';
import Seo from '../components/common/Seo';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`products/${id}/`);
                setProduct(response.data);
                if (response.data.image) {
                    setMainImage(response.data.image);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleInquire = () => {
        if (!product) return;
        const phone = "256789100442";
        const message = encodeURIComponent(`Hi TMR Industrial, I am interested in: ${product.name} (SKU: ${product.id}). ${window.location.href}`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212]">
                <div className="w-16 h-16 border-4 border-[#333] border-t-[#C41E3A] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
                <h2 className="text-3xl font-bold uppercase tracking-tighter mb-4 font-display">Product Not Found</h2>
                <Link to="/products" className="text-[#C41E3A] hover:text-white transition-colors flex items-center gap-2 uppercase font-bold tracking-widest text-sm">
                    <ArrowLeft className="w-4 h-4" /> Return to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] min-h-screen py-20 relative">
            <Seo
                title={product.meta_title || product.name || "Product Detail"}
                description={product.meta_description || product.specifications || `Buy ${product.name} - High quality industrial product.`}
                keywords={product.meta_keywords}
                image={product.og_image ? fixImageUrl(product.og_image) : undefined}
                url={window.location.href}
            />

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                {/* Back Button */}
                <div className="mb-8">
                    <Link to="/products" className="inline-flex items-center gap-2 text-[#888] hover:text-[#C41E3A] transition-colors uppercase tracking-widest text-xs font-bold font-display">
                        <ArrowLeft className="w-4 h-4" /> Back to Catalog
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Image Section (lg:col-span-7) */}
                    <div className="lg:col-span-7">
                        <div className="relative border-2 border-[#333] bg-[#1A1A1A] p-2 rounded-sm overflow-hidden group">
                            {/* Hazard Stripes Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#C41E3A_10px,#C41E3A_20px)] opacity-10 pointer-events-none"></div>

                            <motion.div
                                className="relative aspect-[4/3] overflow-hidden bg-black/50 border border-[#333]"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {mainImage ? (
                                    <img
                                        src={fixImageUrl(mainImage)}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#444] font-display uppercase tracking-widest">No Preview Available</div>
                                )}
                            </motion.div>
                        </div>

                        {/* Brand Logos Strip */}
                        {product.brands && product.brands.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-4 items-center">
                                {product.brands.map(brand => brand.logo && (
                                    <div key={brand.id} className="bg-white p-2 rounded-sm shadow-lg border border-[#333] hover:border-[#C41E3A] transition-all group/logo">
                                        <img
                                            src={fixImageUrl(brand.logo)}
                                            alt={brand.name}
                                            title={brand.name}
                                            className="h-8 md:h-10 w-auto object-contain transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Section (lg:col-span-5) */}
                    <div className="lg:col-span-5 pt-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="mb-6">
                                <div className="space-y-1 mb-2">
                                    <span className="text-[#C41E3A] font-bold tracking-widest uppercase text-sm font-display block">
                                        {product.brands && product.brands.length > 0
                                            ? product.brands.map(b => b.name).join(' / ')
                                            : 'TMR Industrial'}
                                    </span>
                                    {product.brands && product.brands.length > 0 && (
                                        <p className="text-[#888] text-[10px] uppercase tracking-widest italic">
                                            Available in: {product.brands.map((b, i) => (
                                                <span key={b.id}>
                                                    {b.name}{i < product.brands.length - 2 ? ', ' : i === product.brands.length - 2 ? ' and ' : ''}
                                                </span>
                                            ))}
                                        </p>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter font-display leading-none mb-4">
                                    {product.name}
                                </h1>
                                {product.category && (
                                    <div className="inline-block px-3 py-1 border border-[#444] rounded-full text-xs text-[#888] uppercase tracking-wide">
                                        {typeof product.category === 'object' ? product.category.name : 'Category'}
                                    </div>
                                )}
                            </div>

                            {/* Specifications / Description */}
                            {product.specifications && (
                                <div className="bg-[#1A1A1A] border border-[#333] p-6 mb-8 relative">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#C41E3A]"></div>
                                    <h3 className="text-white font-bold uppercase tracking-wider mb-4 font-display flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-[#C41E3A]" /> Technical Specifications
                                    </h3>
                                    <div className="prose prose-invert prose-sm text-[#AAAAAA]">
                                        <p className="whitespace-pre-line">{product.specifications}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mb-8">
                                <button
                                    onClick={handleInquire}
                                    className="w-full bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-5 px-8 uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 font-display border border-[#C41E3A] hover:border-white"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Request Quote / Inquiry
                                </button>
                                <p className="text-center text-[#666] text-xs">
                                    Our team typically responds within 2 hours during business hours.
                                </p>
                            </div>

                            {/* Guarantees */}
                            <div className="grid grid-cols-2 gap-4 border-t border-[#333] pt-8">
                                <div className="flex gap-3">
                                    <ShieldCheck className="w-8 h-8 text-[#C41E3A] shrink-0" />
                                    <div>
                                        <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-1">Authentic Product</h4>
                                        <p className="text-[#666] text-xs">100% Genuine components direct from manufacturer.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-[#C41E3A] shrink-0" />
                                    <div>
                                        <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-1">Quality Assured</h4>
                                        <p className="text-[#666] text-xs">Rigorously tested for industrial performance.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
