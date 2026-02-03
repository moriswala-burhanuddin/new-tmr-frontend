import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo';
import { getBrands, type Brand } from '../api/products';
import { getBrandPageContent, type BrandPageContent } from '../api/pages';
import { ArrowRight, Box, ShieldCheck, Zap } from 'lucide-react';
import { fixImageUrl } from '../lib/utils';

const BrandsPage = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [cmsContent, setCmsContent] = useState<BrandPageContent | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [brandsData, pageData] = await Promise.all([
                    getBrands(),
                    getBrandPageContent()
                ]);
                setBrands(brandsData);
                setCmsContent(pageData);
            } catch (error) {
                console.error("Failed to fetch brands page data", error);
            }
        };
        fetchAllData();
    }, []);

    return (
        <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-[#121212]">
            <Seo
                title={cmsContent?.seo_title || "Our Brands"}
                description={cmsContent?.seo_description || "Explore our partner brands and their premium industrial products."}
                keywords={cmsContent?.seo_keywords}
            />

            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative h-[300px] flex items-center justify-center border-b-[5px] border-[#C41E3A] mb-16 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {cmsContent?.hero_image ? (
                            <img src={fixImageUrl(cmsContent.hero_image)} alt="Our Brands" className="w-full h-full object-cover opacity-30" />
                        ) : (
                            <div className="w-full h-full bg-[#1A1A1A]"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                    </div>

                    <div className="relative z-10 text-center px-4">
                        <div className="inline-block border-b-4 border-[#C41E3A] mb-6">
                            <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter font-display">
                                {cmsContent?.hero_title || "Our Brands"}
                            </h1>
                        </div>
                        {cmsContent?.hero_subtitle && (
                            <p className="text-xl text-[#AAAAAA] max-w-3xl mx-auto mt-4 font-sans leading-relaxed">
                                {cmsContent.hero_subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cleaned up layout - removed redundant text and expanded boxes */}
                {(cmsContent?.content || cmsContent?.html_content) && (
                    <div className="mb-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#1A1A1A] p-6 border border-[#333] flex flex-col items-center text-center group hover:border-[#C41E3A] transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-20"><ShieldCheck className="w-4 h-4 text-[#C41E3A]" /></div>
                                <ShieldCheck className="w-10 h-10 text-[#C41E3A] mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-white font-bold uppercase tracking-widest text-xs mb-1">Authentic</div>
                                <div className="text-[#666] text-[10px]">VERIFIED PARTNERS</div>
                            </div>
                            <div className="bg-[#1A1A1A] p-6 border border-[#333] flex flex-col items-center text-center group hover:border-[#C41E3A] transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-20"><Zap className="w-4 h-4 text-[#C41E3A]" /></div>
                                <Zap className="w-10 h-10 text-[#C41E3A] mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-white font-bold uppercase tracking-widest text-xs mb-1">High Power</div>
                                <div className="text-[#666] text-[10px]">INDUSTRIAL GRADE</div>
                            </div>
                            <div className="bg-[#1A1A1A] p-6 border border-[#333] flex flex-col items-center text-center group hover:border-[#C41E3A] transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-20"><Box className="w-4 h-4 text-[#C41E3A]" /></div>
                                <Box className="w-10 h-10 text-[#C41E3A] mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-white font-bold uppercase tracking-widest text-xs mb-1">Full Support</div>
                                <div className="text-[#666] text-[10px]">EXPERT GUIDANCE</div>
                            </div>
                            <div className="bg-[#1A1A1A] p-6 border border-[#333] flex flex-col items-center text-center group hover:border-[#C41E3A] transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-20"><ArrowRight className="w-4 h-4 text-[#C41E3A]" /></div>
                                <ArrowRight className="w-10 h-10 text-[#C41E3A] mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-white font-bold uppercase tracking-widest text-xs mb-1">Direct Sourcing</div>
                                <div className="text-[#666] text-[10px]">BEST MARKET VALUE</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {brands.map((brand) => (
                        <Link key={brand.id} to={`/brands/${brand.id}`} className="group relative block bg-[#1A1A1A] border border-[#333] hover:border-[#C41E3A] transition-colors p-8 h-64 flex flex-col items-center justify-center">
                            {/* Decorative Corner */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#333] group-hover:bg-[#C41E3A] transition-colors rounded-full"></div>

                            {brand.logo ? (
                                <img src={fixImageUrl(brand.logo)} alt={brand.name} className="h-24 object-contain mb-6 transition-all duration-500" />
                            ) : (
                                <div className="h-24 w-24 bg-[#222] rounded-full flex items-center justify-center mb-6 border border-[#333]">
                                    <span className="text-2xl font-bold text-[#666]">{brand.name.charAt(0)}</span>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-display group-hover:text-[#C41E3A] transition-colors mb-2">{brand.name}</h2>

                            <div className="flex items-center gap-2 text-[#666] text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                                <span>View Products</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandsPage;
