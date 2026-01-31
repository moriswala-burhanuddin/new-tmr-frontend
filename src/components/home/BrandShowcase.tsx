import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBrands, getProducts } from '../../api/products';
import type { Brand, Product } from '../../types';
import { ArrowRight } from 'lucide-react';
import { fixImageUrl } from '../../lib/utils';
import ProductCard from '../products/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const BrandShowcase = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsData, productsData] = await Promise.all([
                    getBrands(),
                    getProducts()
                ]);
                setBrands(brandsData as unknown as Brand[]);
                setProducts(productsData as unknown as Product[]);
            } catch (error) {
                console.error("Failed to fetch data for brand showcase", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="py-24 bg-[#121212] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#333] border-t-[#C41E3A] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="py-24 bg-[#121212] relative overflow-hidden">
            {/* Background Text Accent */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-[0.02] select-none">
                <div className="text-[20rem] font-bold text-white uppercase tracking-tighter absolute -top-20 -left-20">BRANDS</div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 bg-[#C41E3A] px-3 py-1 mb-4">
                            <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">Our Partners</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter font-display leading-none">
                            Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#444]">Powerhouses</span>
                        </h2>
                    </div>
                </div>

                <div className="space-y-32">
                    {brands.map((brand) => {
                        const brandProducts = products.filter(p => {
                            return p.brands && p.brands.some(b => b.id === brand.id);
                        });

                        if (brandProducts.length === 0) return null;

                        return (
                            <div key={brand.id} className="group/brand">
                                <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#333] group-hover/brand:border-[#C41E3A] transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-white p-3 rounded-sm shadow-xl transform group-hover/brand:scale-110 transition-transform">
                                            {brand.logo ? (
                                                <img
                                                    src={fixImageUrl(brand.logo)}
                                                    alt={brand.name}
                                                    className="h-10 md:h-12 w-auto object-contain"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 md:h-12 md:w-12 bg-[#121212] flex items-center justify-center text-white font-bold">
                                                    {brand.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl md:text-4xl font-bold text-white uppercase font-display tracking-tight">
                                                {brand.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/products?brand=${brand.id}`}
                                        className="hidden md:flex items-center gap-3 text-[#AAAAAA] hover:text-white font-bold uppercase tracking-widest text-xs transition-all pr-2"
                                    >
                                        Explore Collection <ArrowRight className="w-5 h-5 text-[#C41E3A]" />
                                    </Link>
                                </div>

                                <Swiper
                                    modules={[Autoplay, Navigation]}
                                    spaceBetween={32}
                                    slidesPerView={1}
                                    navigation={{
                                        nextEl: `.swiper-button-next-${brand.id}`,
                                        prevEl: `.swiper-button-prev-${brand.id}`,
                                    }}
                                    autoplay={{
                                        delay: 2000 + Math.random() * 1000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true
                                    }}
                                    breakpoints={{
                                        640: { slidesPerView: 2 },
                                        1024: { slidesPerView: 3 },
                                        1280: { slidesPerView: 4 },
                                    }}
                                    className="!pb-4 overflow-visible"
                                >
                                    {brandProducts.map((product) => (
                                        <SwiperSlide key={product.id}>
                                            <ProductCard product={product} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Custom Navigation Controls for each brand section */}
                                <div className="flex justify-end gap-3 mt-6 md:-mt-12 md:relative md:z-20">
                                    <button className={`swiper-button-prev-${brand.id} w-10 h-10 border border-[#333] flex items-center justify-center text-white hover:bg-[#C41E3A] hover:border-[#C41E3A] transition-all disabled:opacity-20`}>
                                        <ArrowRight className="w-5 h-5 rotate-180" />
                                    </button>
                                    <button className={`swiper-button-next-${brand.id} w-10 h-10 border border-[#333] flex items-center justify-center text-white hover:bg-[#C41E3A] hover:border-[#C41E3A] transition-all disabled:opacity-20`}>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .swiper-button-disabled {
                    opacity: 0.1 !important;
                    cursor: not-allowed;
                }
            `}</style>
        </section>
    );
};

export default BrandShowcase;
