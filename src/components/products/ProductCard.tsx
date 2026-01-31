import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { fixImageUrl } from '../../lib/utils';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link to={`/products/${product.slug}`} className="block h-full group">
            <motion.div
                className="relative flex flex-col pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
            >
                {/* Unique Top Accent Shape */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 z-10">
                    <div className="absolute inset-0 bg-[#1A1A1A] border-x-2 border-t-2 border-[#333] [clip-path:polygon(20%_0,80%_0,100%_100%,0_100%)]"></div>
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#C41E3A]"></div>
                </div>

                {/* Industrial Frame */}
                <div className="flex-1 border-2 border-[#333] bg-[#121212] relative overflow-hidden group-hover:border-[#C41E3A] transition-colors flex flex-col">

                    {/* Corners Decoration */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#C41E3A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#C41E3A] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Image Section */}
                    <div className="relative aspect-square bg-black overflow-hidden border-b border-[#333]">
                        {product.image ? (
                            <img
                                src={fixImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 font-display uppercase tracking-widest text-sm">
                                No Image
                            </div>
                        )}

                        {/* Featured Badge - Positioned like image */}
                        {product.is_featured && (
                            <div className="absolute top-4 left-4 bg-[#C41E3A] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-widest font-display z-20">
                                FEATURED
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#C41E3A]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col bg-[#1A1A1A]">
                        {/* Category Tag */}
                        <div className="mb-3 flex flex-col gap-1">
                            {product.brands && product.brands.length > 0 && (
                                <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">
                                    {product.brands.map(b => b.name).join(' / ')}
                                </span>
                            )}
                            <span className="text-[#C41E3A] text-xs font-bold uppercase tracking-[0.2em] font-display">
                                {(product.category && typeof product.category === 'object' ? product.category.name : 'UNCATEGORIZED')}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-white font-bold text-xl leading-tight uppercase font-display group-hover:text-[#C41E3A] transition-colors line-clamp-2">
                            {product.name}
                        </h3>

                        {/* Specifications Preview (Optional/Static for design) */}
                        <div className="mt-4 pt-4 border-t border-[#333] flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#333]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#333]"></span>
                            </div>
                            <span className="text-[#888] text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                                View Specs
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
