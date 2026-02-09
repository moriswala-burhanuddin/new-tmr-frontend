import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import { Save, ArrowLeft, Upload, FileImage, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fixImageUrl } from '../../../lib/utils';
import type { Category } from '../../../types';

const HomeCategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        category: '',
        title: '',
        order: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal state for inline category creation
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchHomeCategory();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('categories/');
            setCategories(response.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const fetchHomeCategory = async () => {
        try {
            const response = await api.get(`home-categories/${id}/`);
            const data = response.data;
            setFormData({
                category: data.category.toString(),
                title: data.title || '',
                order: data.order,
            });
            if (data.display_image) {
                setImagePreview(fixImageUrl(data.display_image) || null);
            }
        } catch (err) {
            console.error("Failed to fetch home category", err);
            setError("Failed to load home category data.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
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
            await fetchCategories();
            setFormData(prev => ({ ...prev, category: res.data.id.toString() }));
            setNewCategoryName('');
            setShowCategoryModal(false);
        } catch (err) {
            console.error("Failed to add category", err);
            toast.error("Failed to add category.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.category) {
            setError("Please select a category.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('category', formData.category);
        data.append('title', formData.title);
        data.append('order', formData.order.toString());
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const config = {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (isEdit) {
                await api.patch(`home-categories/${id}/`, data, config);
            } else {
                await api.post('home-categories/', data, config);
            }
            toast.success(`Home category ${isEdit ? 'updated' : 'added'} successfully!`);
            navigate('/admin/home-categories');
        } catch (err: any) {
            console.error("Failed to save home category", err);
            const msg = err.response?.data ? JSON.stringify(err.response.data) : "Check your connection.";
            toast.error("Failed to save.");
            setError(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/home-categories" className="text-[#AAAAAA] hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">
                    {isEdit ? 'Edit Home Category' : 'Add to Home Page'}
                </h1>
            </div>

            {error && (
                <div className="bg-[#C41E3A]/10 border border-[#C41E3A] text-[#C41E3A] p-4 mb-6 font-bold uppercase text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#333] p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider">Select Category *</label>
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(true)}
                                    className="text-[#C41E3A] hover:text-white transition-colors text-[10px] font-bold uppercase flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> New
                                </button>
                            </div>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors appearance-none"
                                required
                            >
                                <option value="">Select a category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Display Title Override</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Leave blank to use original name"
                                className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Display Order</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Right Column: Image Override */}
                    <div>
                        <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Image Override</label>
                        <div className="relative group aspect-[4/5] bg-[#121212] border-2 border-dashed border-[#333] hover:border-[#C41E3A] transition-all flex flex-col items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                        <Upload className="w-8 h-8 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <FileImage className="w-10 h-10 text-[#333] mx-auto mb-2" />
                                    <p className="text-[#555] text-xs uppercase font-bold">Click to Upload Override Image</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <p className="text-[#555] text-[10px] uppercase mt-2">Optional: Use a specific image for the home page grid.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-[#333]">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-4 px-10 uppercase tracking-[0.2em] text-sm transition-all flex items-center gap-3 shadow-[0_4px_20px_rgba(196,30,58,0.2)]"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <Save className="w-5 h-5" /> {isEdit ? 'Update Settings' : 'Add to Home Page'}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Inline Category Creation Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1A1A1A] border border-[#333] p-8 w-full max-w-md relative shadow-2xl">
                        <button onClick={() => setShowCategoryModal(false)} className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-6 font-display border-b border-[#333] pb-4">Add New Category</h2>
                        <form onSubmit={handleAddCategory} className="space-y-6">
                            <div>
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                                    placeholder="Enter category name..."
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={modalLoading}
                                className="w-full bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-3 uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(196,30,58,0.2)]"
                            >
                                {modalLoading ? 'Creating...' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeCategoryForm;
