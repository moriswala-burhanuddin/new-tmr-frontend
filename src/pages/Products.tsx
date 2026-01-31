import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../lib/axios';
import ProductCard from '../components/products/ProductCard';
import SidebarFilter from '../components/products/SidebarFilter';
import type { Product, Brand, Category } from '../types';

const Products = () => {
    const location = useLocation();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Parse URL params on mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const brandParam = searchParams.get('brand');
        const categoryParam = searchParams.get('category');

        if (brandParam) setSelectedBrand(brandParam.toLowerCase());
        if (categoryParam) setSelectedCategory(categoryParam.toLowerCase());
    }, [location.search]);

    // Initial Data Fetch
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [brandsRes, catsRes] = await Promise.all([
                    api.get('brands/'),
                    api.get('categories/')
                ]);
                setBrands(brandsRes.data);
                setCategories(catsRes.data);
            } catch (error) {
                console.error("Failed to fetch metadata", error);
            }
        };
        fetchMetadata();
    }, []);

    // Fetch Products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (selectedBrand) params.brand = selectedBrand;
                if (selectedCategory) params.category = selectedCategory;

                const response = await api.get('products/', { params });
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch if categories loaded or no category selected
        if (categories.length > 0 || selectedCategory === null) {
            fetchProducts();
        }
    }, [selectedBrand, selectedCategory, categories]);


    // ... imports ...

    return (
        <div className="bg-[#121212] min-h-screen py-20 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="inline-block border-b-4 border-[#C41E3A] pb-4 mb-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter font-display">
                            Industrial Catalog
                        </h1>
                    </div>
                    <p className="text-[#AAAAAA] max-w-2xl mx-auto text-lg">
                        Browse our complete inventory of heavy-duty equipment and professional-grade tools.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 sticky top-24">
                        <SidebarFilter
                            brands={brands}
                            categories={categories}
                            selectedBrand={selectedBrand}
                            selectedCategory={selectedCategory}
                            onSelectBrand={setSelectedBrand}
                            onSelectCategory={setSelectedCategory}
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 w-full">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-80 bg-[#1A1A1A] animate-pulse rounded-md border border-[#333]" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-[#1A1A1A] border-2 border-dashed border-[#333] rounded-lg">
                                <h3 className="text-2xl font-bold text-white uppercase font-display mb-2">No Equipment Found</h3>
                                <p className="text-[#888] mb-6">Adjust your filters to refine your search.</p>
                                <button
                                    onClick={() => { setSelectedBrand(null); setSelectedCategory(null); }}
                                    className="text-[#C41E3A] font-bold uppercase tracking-wider hover:text-white transition-colors border-b border-[#C41E3A] pb-1"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
