import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        slug: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            const response = await api.get(`categories/${id}/`);
            setFormData({ name: response.data.name, slug: response.data.slug });
        } catch (err) {
            console.error("Failed to fetch category", err);
            setError("Failed to load category data.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await api.patch(`categories/${id}/`, formData, {
                    headers: { 'Authorization': `Token ${token}` }
                });
            } else {
                await api.post('categories/', formData, {
                    headers: { 'Authorization': `Token ${token}` }
                });
            }
            toast.success(`Category ${isEdit ? 'updated' : 'created'} successfully!`);
            navigate('/admin/categories');
        } catch (err) {
            console.error("Failed to save category", err);
            toast.error("Failed to save category.");
            setError("Failed to save category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/categories" className="text-[#AAAAAA] hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">
                    {isEdit ? 'Edit Category' : 'Add New Category'}
                </h1>
            </div>

            {error && (
                <div className="bg-[#C41E3A]/10 border border-[#C41E3A] text-[#C41E3A] p-4 mb-6 font-bold uppercase text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#333] p-8 space-y-6">
                <div>
                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                        required
                    />
                </div>

                <div className="pt-4 border-t border-[#333]">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-3 px-8 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" /> Save Category
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
