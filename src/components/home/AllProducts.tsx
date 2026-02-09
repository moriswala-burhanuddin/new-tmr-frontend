import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { fixImageUrl } from '../../lib/utils';
import type { Product, Category } from '../../types';

const AllProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(12);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('products/'),
                    api.get('categories/')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(p => {
            const categoryIds = p.categories.map(c => c.id);
            return categoryIds.includes(selectedCategory);
        })
        : products;

    const displayedProducts = filteredProducts.slice(0, displayCount);
    const hasMore = displayedProducts.length < filteredProducts.length;

    if (loading) {
        return (
            <div className="min-h-[400px] flex justify-center items-center bg-dark-bg">
                <div className="text-text-gray text-lg">Loading products...</div>
            </div>
        );
    }


    return (
        <section className="py-20 bg-[#121212] border-t border-[#333]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter */}
                    <div className="lg:w-1/4">
                        <div className="bg-[#1A1A1A] p-6 border border-[#333] sticky top-24">
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 font-display border-b border-[#C41E3A] pb-2">
                                Categories
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`w-full text-left px-4 py-3 font-bold uppercase tracking-wide text-sm transition-all border-l-4 font-display ${selectedCategory === null
                                        ? 'bg-[#222] text-[#C41E3A] border-[#C41E3A]'
                                        : 'bg-transparent text-[#888] border-transparent hover:bg-[#222] hover:text-white'
                                        }`}
                                >
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full text-left px-4 py-3 font-bold uppercase tracking-wide text-sm transition-all border-l-4 font-display ${selectedCategory === category.id
                                            ? 'bg-[#222] text-[#C41E3A] border-[#C41E3A]'
                                            : 'bg-transparent text-[#888] border-transparent hover:bg-[#222] hover:text-white'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {displayedProducts.map((product, index) => (
                                <Link to={`/products/${product.slug}`} key={product.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative h-[400px] flex flex-col pt-4"
                                    >
                                        <div className="flex-1 border border-[#333] bg-[#1A1A1A] relative overflow-hidden group-hover:border-[#C41E3A] transition-colors flex flex-col">
                                            {/* Image Section */}
                                            <div className="relative h-64 bg-black/50 overflow-hidden border-b border-[#333]">
                                                {product.image ? (
                                                    <img
                                                        src={fixImageUrl(product.image)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-text-gray">
                                                        No Image
                                                    </div>
                                                )}

                                                {product.is_featured && (
                                                    <span className="absolute top-2 left-2 bg-[#C41E3A] text-white text-xs font-bold px-2 py-1 uppercase tracking-wide font-display">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="text-xs text-[#C41E3A] mb-2 uppercase tracking-wider font-semibold font-display">
                                                    {(product.categories && product.categories.length > 0 ? product.categories[0].name : null) || 'Uncategorized'}
                                                </div>
                                                <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-[#C41E3A] transition-colors font-display">
                                                    {product.name}
                                                </h3>

                                                <div className="mt-auto pt-4 flex items-center text-sm font-bold text-[#888] uppercase tracking-wider group-hover:text-white transition-colors">
                                                    View Details &rarr;
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => setDisplayCount(prev => prev + 12)}
                                    className="px-8 py-3 bg-transparent border-2 border-[#444] hover:border-[#C41E3A] text-white font-bold uppercase tracking-widest transition-all hover:bg-[#C41E3A]/10 font-display"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllProducts;
