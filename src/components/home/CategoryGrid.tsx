import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { fixImageUrl } from '../../lib/utils';
import type { HomeCategory } from '../../types';

const CategoryGrid = () => {
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeCategories = async () => {
            try {
                const response = await api.get('home-categories/');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch home categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeCategories();
    }, []);

    if (loading) {
        return (
            <div className="py-24 bg-[#0a0a0a] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-[#333] border-t-[#C41E3A] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {categories.map((item) => (
                        <Link
                            key={item.id}
                            to={`/products?category=${item.category_slug}`}
                            className="group relative block pt-10"
                        >
                            {/* Industrial Topper */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-10 z-20">
                                <div className="absolute inset-0 bg-[#222] border-x-2 border-t-2 border-[#444] [clip-path:polygon(10%_0,90%_0,100%_100%,0_100%)] group-hover:border-[#C41E3A] transition-colors duration-300"></div>
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#C41E3A] rounded-full shadow-[0_0_15px_rgba(196,30,58,0.8)]"></div>
                            </div>

                            {/* Main Industrial Container */}
                            <div className="relative aspect-[4/5] bg-[#1a1a1a] border-2 border-[#333] group-hover:border-[#C41E3A] transition-all duration-300 overflow-hidden flex flex-col p-1">
                                {/* Inner Metallic Frame */}
                                <div className="relative flex-1 bg-black overflow-hidden border border-[#222]">

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col p-8 bg-transparent transition-colors duration-500">
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-auto font-display drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] group-hover:text-[#C41E3A] transition-colors duration-300 leading-none">
                                            {item.display_title}
                                        </h3>

                                        <div className="mt-auto">
                                            <div className="inline-block bg-[#C41E3A] hover:bg-white text-white hover:text-[#C41E3A] font-bold py-3 px-6 uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-transparent hover:border-[#C41E3A]">
                                                Explore Now
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    {item.display_image ? (
                                        <img
                                            src={fixImageUrl(item.display_image)}
                                            alt={item.display_title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-110 transition-all duration-1000"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#333] uppercase font-bold tracking-widest bg-[#111]">
                                            No Image
                                        </div>
                                    )}

                                    {/* Corner Accents */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white"></div>
                                        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-white"></div>
                                        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-white"></div>
                                        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-white"></div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
