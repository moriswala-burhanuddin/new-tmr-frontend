import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fixImageUrl } from '../../../lib/utils';
import type { Brand, Category } from '../../../types';

const ProductForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const isEdit = !!slug;

    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        brand: '',
        specifications: '',
        is_featured: false,
        image: null as File | null,
        meta_title: '',
        meta_description: '',
        og_image: null as File | null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    api.get('/brands/'),
                    api.get('/categories/')
                ]);
                setBrands(brandsRes.data);
                setCategories(categoriesRes.data);

                if (isEdit) {
                    const productRes = await api.get(`/products/${slug}/`);
                    const p = productRes.data;
                    setFormData({
                        name: p.name,
                        category: p.category?.id?.toString() || '',
                        brand: p.brand?.id?.toString() || '',
                        specifications: p.specifications || '',
                        is_featured: p.is_featured,
                        image: null,
                        meta_title: p.meta_title || '',
                        meta_description: p.meta_description || '',
                        og_image: null
                    });
                    if (p.image) setImagePreview(fixImageUrl(p.image) || null);
                }
            } catch (err) {
                console.error("Failed to load data", err);
                setError("Failed to load required data.");
            } finally {
                setInitialLoading(false);
            }
        };
        init();
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, is_featured: e.target.checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const name = e.target.name;
            if (name === 'image') {
                setFormData(prev => ({ ...prev, image: file }));
                setImagePreview(URL.createObjectURL(file));
            } else if (name === 'og_image') {
                setFormData(prev => ({ ...prev, og_image: file }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('name', formData.name);

        // Backend expects primary keys for writing
        if (formData.category) data.append('category_id', formData.category);
        if (formData.brand) data.append('brand_id', formData.brand);

        data.append('specifications', formData.specifications);
        data.append('is_featured', formData.is_featured ? 'true' : 'false');
        data.append('meta_title', formData.meta_title);
        data.append('meta_description', formData.meta_description);

        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.og_image) {
            data.append('og_image', formData.og_image);
        }

        try {
            if (isEdit) {
                await api.patch(`/products/${slug}/`, data, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await api.post('/products/', data, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            navigate('/admin/products');
        } catch (err: any) {
            console.error("Failed to save product", err);
            const msg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to save product.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/products" className="text-[#AAAAAA] hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            {error && (
                <div className="bg-[#C41E3A]/10 border border-[#C41E3A] text-[#C41E3A] p-4 mb-6 font-bold uppercase text-sm break-words">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#333] p-8 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Brand</label>
                                <select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                    required
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        </div>


                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleCheckboxChange}
                                id="is_featured"
                                className="w-5 h-5 accent-[#C41E3A] bg-[#121212] border-[#333]"
                            />
                            <label htmlFor="is_featured" className="text-white font-bold uppercase text-sm select-none cursor-pointer">Mark as Featured</label>
                        </div>
                    </div>

                    {/* Right Column: Image & Specs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Product Image</label>
                            <div className="border-2 border-dashed border-[#333] p-4 text-center bg-[#121212] hover:border-[#C41E3A] transition-colors relative min-h-[200px] flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                />
                                {imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img src={imagePreview} alt="Preview" className="max-h-[180px] mx-auto object-contain" />
                                        <div className="absolute top-0 right-0 bg-black/50 p-1 rounded-full text-white cursor-pointer z-20 hover:bg-[#C41E3A]" onClick={(e) => {
                                            e.preventDefault();
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, image: null }));
                                        }}>
                                            <X className="w-4 h-4" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-[#666] flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8" />
                                        <span className="text-sm"><span className="text-[#C41E3A] font-bold">Click to Upload</span></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Specifications / Details</label>
                            <textarea
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleChange}
                                rows={6}
                                className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors resize-none"
                            />
                        </div>

                        {/* SEO Section */}
                        <div className="pt-6 border-t border-[#333]">
                            <h3 className="text-white font-bold uppercase mb-4">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        name="meta_title"
                                        value={formData.meta_title}
                                        onChange={handleChange}
                                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Meta Description</label>
                                    <textarea
                                        name="meta_description"
                                        value={formData.meta_description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Social Media Share Image (OG Image)</label>
                                    <input
                                        type="file"
                                        name="og_image"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                    />
                                    {/* Ideally show preview if exists, but simplified for now */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-[#333] flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-4 px-12 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" /> Save Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
