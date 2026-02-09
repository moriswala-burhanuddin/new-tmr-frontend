import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import { Save, ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
        categories: [] as number[],
        brands: [] as number[],
        specifications: '',
        is_featured: false,
        image: null as File | null,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_image: null as File | null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
    const [newBrandLogoPreview, setNewBrandLogoPreview] = useState<string | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [brandSearch, setBrandSearch] = useState('');

    const fetchData = async () => {
        try {
            const [brandsRes, categoriesRes] = await Promise.all([
                api.get('brands/'),
                api.get('categories/')
            ]);
            setBrands(brandsRes.data);
            setCategories(categoriesRes.data);
        } catch (err) {
            console.error("Failed to load data", err);
            setError("Failed to load required data.");
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchData();
            if (isEdit) {
                try {
                    const productRes = await api.get(`products/${slug}/`);
                    const p = productRes.data;
                    setFormData({
                        name: p.name,
                        categories: p.categories ? p.categories.map((c: any) => c.id) : [],
                        brands: p.brands ? p.brands.map((b: any) => b.id) : [],
                        specifications: p.specifications || '',
                        is_featured: p.is_featured,
                        image: null,
                        meta_title: p.meta_title || '',
                        meta_description: p.meta_description || '',
                        meta_keywords: p.meta_keywords || '',
                        og_image: null
                    });
                    if (p.image) setImagePreview(fixImageUrl(p.image) || null);
                    if (p.og_image) setOgImagePreview(fixImageUrl(p.og_image) || null);
                } catch (err) {
                    console.error("Failed to fetch product", err);
                    setError("Failed to load product data.");
                }
            }
            setInitialLoading(false);
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
                setOgImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('name', formData.name);

        // Append each category ID separately
        formData.categories.forEach(id => {
            data.append('category_ids', id.toString());
        });

        // Append each brand ID separately for DRF to parse as a list
        formData.brands.forEach(id => {
            data.append('brand_ids', id.toString());
        });

        data.append('specifications', formData.specifications);
        data.append('is_featured', formData.is_featured ? 'true' : 'false');
        data.append('meta_title', formData.meta_title);
        data.append('meta_description', formData.meta_description);
        data.append('meta_keywords', formData.meta_keywords);

        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.og_image) {
            data.append('og_image', formData.og_image);
        }

        try {
            if (isEdit) {
                await api.patch(`products/${slug}/`, data, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await api.post('products/', data, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
            navigate('/admin/products');
        } catch (err: any) {
            console.error("Failed to save product", err);
            toast.error("Failed to save product.");
            const msg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to save product.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        setModalLoading(true);
        try {
            const res = await api.post('categories/', { name: newCategoryName }, {
                headers: { 'Authorization': `Token ${token}` }
            });
            toast.success('Category created successfully!');
            await fetchData();
            setFormData(prev => ({ ...prev, categories: [...prev.categories, res.data.id] }));
            setNewCategoryName('');
            setShowCategoryModal(false);
        } catch (err) {
            console.error("Failed to add category", err);
            toast.error("Failed to add category.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBrandName.trim()) return;
        setModalLoading(true);
        const data = new FormData();
        data.append('name', newBrandName);
        if (newBrandLogo) data.append('logo', newBrandLogo);

        try {
            const res = await api.post('brands/', data, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Brand created successfully!');
            await fetchData();
            setFormData(prev => ({ ...prev, brands: [...prev.brands, res.data.id] }));
            setNewBrandName('');
            setNewBrandLogo(null);
            setNewBrandLogoPreview(null);
            setShowBrandModal(false);
        } catch (err) {
            console.error("Failed to add brand", err);
            toast.error("Failed to add brand.");
        } finally {
            setModalLoading(false);
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

                        {/* Categories Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#333] pb-2">
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider">Categories</label>
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(true)}
                                    className="text-[#C41E3A] hover:text-white transition-colors text-xs font-bold uppercase flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add New
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                                {categories.map(category => {
                                    const isChecked = formData.categories.includes(category.id);
                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    categories: isChecked
                                                        ? prev.categories.filter(id => id !== category.id)
                                                        : [...prev.categories, category.id]
                                                }));
                                            }}
                                            className={`flex items-center gap-2 p-2 border transition-all text-left truncate rounded ${isChecked
                                                ? 'bg-[#C41E3A]/10 border-[#C41E3A] text-white'
                                                : 'bg-transparent border-[#333] text-[#888]'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#C41E3A] border-[#C41E3A]' : 'border-[#444]'}`}>
                                                {isChecked && <div className="w-1.5 h-1.5 bg-white" />}
                                            </div>
                                            <span className="text-xs font-bold uppercase truncate">{category.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Brands Selection */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-[#333] pb-2 gap-3 sm:gap-0">
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider">Available Brands</label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search brands..."
                                        value={brandSearch}
                                        onChange={(e) => setBrandSearch(e.target.value)}
                                        className="bg-[#121212] border border-[#333] px-3 py-2 sm:py-1 text-xs text-white focus:outline-none focus:border-[#C41E3A] transition-all uppercase font-bold tracking-widest placeholder:text-gray-600 rounded-sm w-full sm:w-[200px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowBrandModal(true)}
                                        className="text-[#C41E3A] hover:text-white transition-colors text-xs font-bold uppercase flex items-center justify-center sm:justify-start gap-1 shrink-0 bg-[#1A1A1A] sm:bg-transparent border border-[#C41E3A]/30 sm:border-none p-2 sm:p-0 rounded sm:rounded-none"
                                    >
                                        <Plus className="w-3 h-3" /> Add New Brand
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 bg-[#121212] border border-[#333] p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase())).map(brand => {
                                    const isChecked = formData.brands.includes(brand.id);
                                    return (
                                        <button
                                            key={brand.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    brands: isChecked
                                                        ? prev.brands.filter(id => id !== brand.id)
                                                        : [...prev.brands, brand.id]
                                                }));
                                            }}
                                            className={`w-full flex items-center gap-3 p-3 border transition-all text-left group rounded hover:border-[#555] ${isChecked
                                                ? 'bg-[#C41E3A]/10 border-[#C41E3A] text-white hover:border-[#C41E3A]'
                                                : 'bg-transparent border-[#333] text-[#888]'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 bg-white rounded p-1 flex items-center justify-center shrink-0 ${isChecked ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                                {brand.logo ? (
                                                    <img src={fixImageUrl(brand.logo)} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <span className="text-black font-bold text-[10px] uppercase">{brand.name.substring(0, 2)}</span>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="text-sm font-bold uppercase truncate">{brand.name}</div>
                                                <div className={`text-[10px] uppercase tracking-wider mt-1 ${isChecked ? 'text-[#C41E3A]' : 'text-gray-600'}`}>
                                                    {isChecked ? 'Selected' : 'Select'}
                                                </div>
                                            </div>

                                            <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#C41E3A] border-[#C41E3A]' : 'border-[#444] group-hover:border-[#666]'}`}>
                                                {isChecked && <div className="w-2 h-2 bg-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
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
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Meta Keywords</label>
                                    <textarea
                                        name="meta_keywords"
                                        value={formData.meta_keywords}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors resize-none"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Social Media Share Image (OG Image)</label>
                                    <div className="border-2 border-dashed border-[#333] p-4 text-center bg-[#121212] hover:border-[#C41E3A] transition-colors relative min-h-[150px] flex flex-col items-center justify-center">
                                        <input
                                            type="file"
                                            name="og_image"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        />
                                        {ogImagePreview ? (
                                            <div className="relative w-full h-full">
                                                <img src={ogImagePreview} alt="OG Preview" className="max-h-[130px] mx-auto object-contain" />
                                                <div className="absolute top-0 right-0 bg-black/50 p-1 rounded-full text-white cursor-pointer z-20 hover:bg-[#C41E3A]" onClick={(e) => {
                                                    e.preventDefault();
                                                    setOgImagePreview(null);
                                                    setFormData(prev => ({ ...prev, og_image: null }));
                                                }}>
                                                    <X className="w-4 h-4" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-[#666] flex flex-col items-center gap-2">
                                                <Upload className="w-6 h-6" />
                                                <span className="text-sm"><span className="text-[#C41E3A] font-bold">Click to Upload</span></span>
                                            </div>
                                        )}
                                    </div>
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
            </form >

            {/* Category Modal */}
            {
                showCategoryModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#1A1A1A] border border-[#333] p-8 w-full max-w-md relative">
                            <button onClick={() => setShowCategoryModal(false)} className="absolute top-4 right-4 text-[#666] hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-6 font-display">Add New Category</h2>
                            <form onSubmit={handleAddCategory} className="space-y-6">
                                <div>
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Category Name</label>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={modalLoading}
                                    className="w-full bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-3 uppercase tracking-widest transition-colors"
                                >
                                    {modalLoading ? 'Creating...' : 'Create Category'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Brand Modal */}
            {
                showBrandModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#1A1A1A] border border-[#333] p-8 w-full max-w-md relative">
                            <button onClick={() => setShowBrandModal(false)} className="absolute top-4 right-4 text-[#666] hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-6 font-display">Add New Brand</h2>
                            <form onSubmit={handleAddBrand} className="space-y-6">
                                <div>
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Brand Name</label>
                                    <input
                                        type="text"
                                        value={newBrandName}
                                        onChange={(e) => setNewBrandName(e.target.value)}
                                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Brand Logo</label>
                                    <div className="border-2 border-dashed border-[#333] p-4 text-center bg-[#121212] hover:border-[#C41E3A] transition-colors relative min-h-[100px] flex flex-col items-center justify-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    setNewBrandLogo(file);
                                                    setNewBrandLogoPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        {newBrandLogoPreview ? (
                                            <img src={newBrandLogoPreview} alt="Logo Preview" className="h-16 object-contain" />
                                        ) : (
                                            <div className="text-[#666] text-xs">
                                                <Upload className="w-5 h-5 mx-auto mb-1 text-[#444]" />
                                                <span className="text-[#C41E3A] font-bold">Upload Logo</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={modalLoading}
                                    className="w-full bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-3 uppercase tracking-widest transition-colors"
                                >
                                    {modalLoading ? 'Creating...' : 'Create Brand'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ProductForm;
