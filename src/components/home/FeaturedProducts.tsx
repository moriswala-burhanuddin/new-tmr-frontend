import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import type { Product } from '../../types';
import ProductCard from '../products/ProductCard';

const FeaturedProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                // Filter for featured products
                const featured = (data as unknown as Product[]).filter(p => p.is_featured);
                setProducts(featured);
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return null;
    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-[#121212] border-t border-[#333]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 bg-[#C41E3A] px-3 py-1 mb-4">
                            <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">Top Selection</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter font-display leading-none">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#444]">Innovations</span>
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="text-[#AAAAAA] hover:text-white font-bold uppercase tracking-widest text-xs transition-colors border-b border-[#333] pb-1"
                    >
                        View All Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 4).map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
