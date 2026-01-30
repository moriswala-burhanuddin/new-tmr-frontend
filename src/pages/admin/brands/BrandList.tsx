import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import { fixImageUrl } from '../../../lib/utils';
import type { Brand } from '../../../types';

const BrandList = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await api.get('/brands/');
            setBrands(response.data);
        } catch (error) {
            console.error("Failed to fetch brands", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) return;
        try {
            await api.delete(`/brands/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setBrands(brands.filter(b => b.id !== id));
        } catch (error) {
            console.error("Failed to delete brand", error);
            alert("Failed to delete brand");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">Brands</h1>
                <Link to="/admin/brands/new" className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors">
                    <Plus className="w-5 h-5" /> Add Brand
                </Link>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#111] border-b border-[#333]">
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Logo</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Name</th>
                            <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map(brand => (
                            <tr key={brand.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                                <td className="p-4">
                                    {brand.logo ? (
                                        <img src={fixImageUrl(brand.logo)} alt={brand.name} className="h-10 w-10 object-contain text-white" />
                                    ) : (
                                        <div className="h-10 w-10 bg-[#333] flex items-center justify-center text-[#666] font-bold">
                                            {brand.name.charAt(0)}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-white font-semibold">{brand.name}</td>
                                <td className="p-4 flex gap-3">
                                    <button className="text-[#AAAAAA] hover:text-white transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brand.id)}
                                        className="text-[#C41E3A] hover:text-[#ff4d6d] transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {brands.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-[#666]">No brands found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrandList;
