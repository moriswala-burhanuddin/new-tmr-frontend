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
                const brandRes = await api.get(`/brands/${id}/`);
                const productsRes = await api.get(`/products/?brand=${id}`);

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
        <div className="min-h-screen bg-[#121212] pt-20">
            <Seo
                title={`${brand.name} Products`}
                description={`Browse our selection of ${brand.name} products.`}
                image={brand.logo ? fixImageUrl(brand.logo) : undefined}
            />

            {/* Brand Header */}
            <div className="bg-[#1A1A1A] border-b border-[#333] py-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    {brand.logo && (
                        <div className="w-32 h-32 bg-white rounded-full p-4 mb-6 flex items-center justify-center border-4 border-[#C41E3A]">
                            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        </div>
                    )}
                    <h1 className="text-5xl font-bold text-white uppercase tracking-tighter font-display mb-2">{brand.name}</h1>
                    <div className="w-24 h-1 bg-[#C41E3A] rounded-full"></div>
                </div>
            </div>

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
