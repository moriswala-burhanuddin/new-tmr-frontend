import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBrands, type Brand } from '../api/products';
import { ArrowRight } from 'lucide-react';
import { fixImageUrl } from '../lib/utils';

const BrandsPage = () => {
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getBrands();
                setBrands(data);
            } catch (error) {
                console.error("Failed to fetch brands", error);
            }
        };
        fetchBrands();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#121212]">
            <Helmet>
                <title>Our Brands | TMR Project</title>
                <meta name="description" content="Explore our partner brands and their premium industrial products." />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block border-b-4 border-[#C41E3A] mb-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter font-display">
                            Our Brands
                        </h1>
                    </div>
                    <p className="text-xl text-[#AAAAAA] max-w-2xl mx-auto mt-4 font-sans">
                        We partner with industry leaders to bring you the best tools and equipment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {brands.map((brand) => (
                        <Link key={brand.id} to={`/brands/${brand.id}`} className="group relative block bg-[#1A1A1A] border border-[#333] hover:border-[#C41E3A] transition-colors p-8 h-64 flex flex-col items-center justify-center">
                            {/* Decorative Corner */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#333] group-hover:bg-[#C41E3A] transition-colors rounded-full"></div>

                            {brand.logo ? (
                                <img src={fixImageUrl(brand.logo)} alt={brand.name} className="h-24 object-contain mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-500" />
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
