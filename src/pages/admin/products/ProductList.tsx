import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import { fixImageUrl } from '../../../lib/utils';
import type { Product, Brand, Category } from '../../../types';

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, brandsRes, categoriesRes] = await Promise.all([
                api.get('products/'),
                api.get('brands/'),
                api.get('categories/')
            ]);
            setProducts(productsRes.data);
            setBrands(brandsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`products/${slug}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setProducts(products.filter(p => p.slug !== slug));
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Failed to delete product", error);
            toast.error("Failed to delete product");
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Handle brands as array
        const brandIds = product.brands.map(b => b.id.toString());
        const matchesBrand = selectedBrand ? brandIds.includes(selectedBrand) : true;

        // Handle category as object or ID
        const categoryId = typeof product.category === 'object' && product.category !== null
            ? (product.category as any).id?.toString()
            : product.category?.toString();

        const matchesCategory = selectedCategory ? categoryId === selectedCategory : true;

        return matchesSearch && matchesBrand && matchesCategory;
    });

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">Products</h1>
                <Link to="/admin/products/new" className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors">
                    <Plus className="w-5 h-5" /> Add Product
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[#1A1A1A] p-4 border border-[#333]">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-[#121212] border border-[#333] text-white p-2 focus:outline-none focus:border-[#C41E3A]"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#121212] border border-[#333] text-white p-2 focus:outline-none focus:border-[#C41E3A]"
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="bg-[#121212] border border-[#333] text-white p-2 focus:outline-none focus:border-[#C41E3A]"
                >
                    <option value="">All Brands</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#111] border-b border-[#333]">
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Image</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Name</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Category</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Brand</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Featured</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                                <td className="p-4">
                                    {product.image ? (
                                        <img src={fixImageUrl(product.image)} alt={product.name} className="h-10 w-10 object-cover border border-[#333]" />
                                    ) : (
                                        <div className="h-10 w-10 bg-[#333] flex items-center justify-center text-[#666] text-xs">No Img</div>
                                    )}
                                </td>
                                <td className="p-4 text-white font-semibold">{product.name}</td>
                                <td className="p-4 text-[#AAAAAA]">
                                    {product.category && typeof product.category === 'object' ? product.category.name : '-'}
                                </td>
                                <td className="p-4 text-[#AAAAAA]">
                                    {product.brands.map(b => b.name).join(', ') || '-'}
                                </td>
                                <td className="p-4">
                                    {product.is_featured ? (
                                        <span className="text-green-500 text-xs font-bold uppercase border border-green-500/20 bg-green-500/10 px-2 py-1 rounded">Yes</span>
                                    ) : (
                                        <span className="text-[#666] text-xs font-bold uppercase">No</span>
                                    )}
                                </td>
                                <td className="p-4 flex gap-3">
                                    <Link to={`/admin/products/${product.slug}`} className="text-[#AAAAAA] hover:text-white transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.slug)}
                                        className="text-[#C41E3A] hover:text-[#ff4d6d] transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-[#666]">No products found matching filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
