import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import type { Category } from '../../../types';

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('categories/');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`categories/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setCategories(categories.filter(c => c.id !== id));
            toast.success("Category deleted successfully");
        } catch (error) {
            console.error("Failed to delete category", error);
            toast.error("Failed to delete category");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">Categories</h1>
                <Link to="/admin/categories/new" className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors">
                    <Plus className="w-5 h-5" /> Add Category
                </Link>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#111] border-b border-[#333]">
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Name</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Slug</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                                <td className="p-4 text-white font-semibold">{category.name}</td>
                                <td className="p-4 text-[#888] font-mono text-sm">{category.slug}</td>
                                <td className="p-4 flex gap-3">
                                    <button className="text-[#AAAAAA] hover:text-white transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-[#C41E3A] hover:text-[#ff4d6d] transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-[#666]">No categories found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryList;
