import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../lib/axios';
import { type Brand, type Product } from '../api/products';
import { fixImageUrl } from '../lib/utils';
import Seo from '../components/common/Seo';

interface BrandWithProducts extends Brand {
    products: Product[];
}

const BrandPage = () => {
    const { id } = useParams<{ id: string }>();
    const [brand, setBrand] = useState<BrandWithProducts | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                // In a real app, we'd have a specific endpoint or filter.
                // For now, fetching brand details and filtering products.
                // Assuming we have an endpoint /brands/:id/
                const brandRes = await api.get(`brands/${id}/`);
                const productsRes = await api.get(`products/?brand=${id}`);

                setBrand({
                    ...brandRes.data,
                    products: productsRes.data.results || productsRes.data
                });
            } catch (error) {
                console.error("Failed to load brand", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBrand();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212]">
                <div className="w-16 h-16 border-4 border-[#333] border-t-[#C41E3A] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!brand) {
        return <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">Brand not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212]">
            <Seo
                title={brand.hero_title || `${brand.name} | TMR Project`}
                description={brand.hero_subtitle || `Explore high-performance solutions from ${brand.name}.`}
                image={brand.hero_image ? fixImageUrl(brand.hero_image) : (brand.logo ? fixImageUrl(brand.logo) : undefined)}
            />

            {/* Brand Hero - FULL WIDTH AND HEIGHT */}
            <div className="relative overflow-hidden border-b-[5px] border-[#C41E3A] h-screen min-h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    {brand.hero_image ? (
                        <img src={fixImageUrl(brand.hero_image)} alt={brand.name} className="w-full h-full object-cover opacity-60 transition-all duration-700" />
                    ) : (
                        <div className="w-full h-full bg-[#1A1A1A]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    {brand.logo && (
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-6 mb-10 flex items-center justify-center border-4 border-[#C41E3A] shadow-[0_0_50px_rgba(196,30,58,0.3)]">
                            <img src={fixImageUrl(brand.logo)} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        </div>
                    )}
                    <h1 className="text-6xl md:text-9xl font-bold text-white uppercase tracking-tighter font-display mb-6 leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                        {brand.hero_title || brand.name}
                    </h1>
                    {brand.hero_subtitle && (
                        <p className="text-white text-xl md:text-2xl uppercase tracking-[0.3em] font-bold max-w-3xl mb-12 drop-shadow-lg">
                            {brand.hero_subtitle}
                        </p>
                    )}
                    <div className="w-32 h-2 bg-[#C41E3A] shadow-[0_0_20px_rgba(196,30,58,0.5)]"></div>
                </div>
            </div>

            {/* Brand Content Section */}
            {(brand.content || brand.html_content) && (
                <div className="max-w-7xl mx-auto px-6 py-20 border-b border-[#333]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-8">
                            {brand.content && (
                                <div
                                    className="prose prose-xl prose-invert text-[#AAAAAA] max-w-none mb-12"
                                    dangerouslySetInnerHTML={{ __html: brand.content.replace(/\n/g, '<br />') }}
                                />
                            )}
                            {brand.html_content && (
                                <div
                                    className="prose prose-lg prose-invert text-[#888888] max-w-none border-l-4 border-[#C41E3A] pl-8 italic font-sans"
                                    dangerouslySetInnerHTML={{ __html: brand.html_content }}
                                />
                            )}
                        </div>
                        <div className="lg:col-span-4 bg-[#1A1A1A] p-8 border border-[#333] relative">
                            <div className="absolute top-2 left-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444]"></div>
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#121212] rounded-full border border-[#444]"></div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-4 font-display">Authorized Dealer</h3>
                            <p className="text-sm text-[#888] leading-relaxed">
                                We are proud to be an authorized partner for {brand.name}, delivering their legacy of industrial performance directly to our clients.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-[#C41E3A] pl-4 uppercase font-display">
                    Available Products
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {brand.products.length > 0 ? (
                        brand.products.map((product) => (
                            <Link to={`/products/${product.slug}`} key={product.id} className="group relative block h-[400px]">
                                <div className="absolute inset-0 bg-[#1A1A1A] border-2 border-[#333] group-hover:border-[#C41E3A] transition-colors flex flex-col">
                                    {/* Image */}
                                    <div className="h-48 bg-white/5 overflow-hidden border-b border-[#333]">
                                        <img src={fixImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-[#C41E3A] transition-colors font-display">{product.name}</h3>
                                            <p className="text-[#666] text-xs line-clamp-2">{product.specifications ? product.specifications.substring(0, 50) + "..." : ""}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-end border-t border-[#333] pt-4">
                                            <span className="text-xs font-bold text-[#C41E3A] uppercase tracking-wider flex items-center gap-1">
                                                Inspect Specs <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-[#AAAAAA]">No products available for this brand.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandPage;
