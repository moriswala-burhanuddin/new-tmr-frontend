import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import { fixImageUrl } from '../../../lib/utils';
import type { HomeCategory } from '../../../types';

const HomeCategoryList = () => {
    const [homeCategories, setHomeCategories] = useState<HomeCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchHomeCategories();
    }, []);

    const fetchHomeCategories = async () => {
        try {
            const response = await api.get('home-categories/', {
                headers: { Authorization: `Token ${token}` }
            });
            setHomeCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch home categories", error);
            toast.error("Failed to load home categories");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to remove this category from the home page?")) return;
        try {
            await api.delete(`home-categories/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setHomeCategories(homeCategories.filter(hc => hc.id !== id));
            toast.success("Home category removed successfully");
        } catch (error) {
            console.error("Failed to delete home category", error);
            toast.error("Failed to remove home category");
        }
    };

    if (loading) return <div className="text-white">Loading home categories...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">Home Categories</h1>
                    <p className="text-[#888] text-sm mt-1">Curate categories shown in the home page grid.</p>
                </div>
                <Link to="/admin/home-categories/new" className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors">
                    <Plus className="w-5 h-5" /> Add to Home
                </Link>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#111] border-b border-[#333]">
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider w-20">Image</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Display Title</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Original Category</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Order</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {homeCategories.map(hc => (
                            <tr key={hc.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-[#111] border border-[#333] flex items-center justify-center overflow-hidden">
                                        {hc.display_image ? (
                                            <img src={fixImageUrl(hc.display_image)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] text-[#444] uppercase">No Img</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-white font-semibold">{hc.display_title}</td>
                                <td className="p-4 text-[#888]">{hc.category_slug}</td>
                                <td className="p-4 text-[#C41E3A] font-bold font-mono">{hc.order}</td>
                                <td className="p-4 flex gap-3">
                                    <Link to={`/admin/home-categories/${hc.id}`} className="text-[#AAAAAA] hover:text-white transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(hc.id)}
                                        className="text-[#C41E3A] hover:text-[#ff4d6d] transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {homeCategories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-[#666]">No curated home categories yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HomeCategoryList;
