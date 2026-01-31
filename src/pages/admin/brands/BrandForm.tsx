import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fixImageUrl } from '../../../lib/utils';

const BrandForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logo: null as File | null
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBrand = async () => {
        try {
            const response = await api.get(`brands/${id}/`);
            const b = response.data;
            setFormData(prev => ({
                ...prev,
                name: b.name,
                slug: b.slug || ''
            }));
            if (b.logo) setLogoPreview(fixImageUrl(b.logo) || null);
        } catch (err) {
            console.error("Failed to fetch brand", err);
            setError("Failed to load brand data.");
        }
    };

    useEffect(() => {
        if (isEdit) {
            fetchBrand();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const name = e.target.name;
            if (name === 'logo') {
                setFormData(prev => ({ ...prev, logo: file }));
                setLogoPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('name', formData.name);

        if (formData.logo) {
            data.append('logo', formData.logo);
        }

        try {
            if (isEdit) {
                await api.patch(`brands/${id}/`, data, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await api.post('brands/', data, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            toast.success(`Brand ${isEdit ? 'updated' : 'created'} successfully!`);
            navigate('/admin/brands');
        } catch (err) {
            console.error("Failed to save brand", err);
            toast.error("Failed to save brand.");
            setError("Failed to save brand. Please update the name and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/brands" className="text-[#AAAAAA] hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">
                    {isEdit ? 'Edit Brand' : 'Add New Brand'}
                </h1>
            </div>

            {error && (
                <div className="bg-[#C41E3A]/10 border border-[#C41E3A] text-[#C41E3A] p-4 mb-6 font-bold uppercase text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#333] p-8 space-y-6">
                <div>
                    <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Brand Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A] transition-colors"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Logo Upload</label>
                        <div className="border-2 border-dashed border-[#333] p-4 text-center bg-[#121212] hover:border-[#C41E3A] transition-colors relative min-h-[150px] flex flex-col items-center justify-center">
                            <input
                                type="file"
                                name="logo"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            {logoPreview ? (
                                <div className="flex flex-col items-center">
                                    <img src={logoPreview} alt="Preview" className="h-24 object-contain mb-2" />
                                    <span className="text-[#666] text-[10px] font-bold uppercase">Change Logo</span>
                                </div>
                            ) : (
                                <div className="text-[#666] text-xs">
                                    <span className="text-[#C41E3A] font-bold">Upload Logo</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-[#333]">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-3 px-8 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" /> Save Brand
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BrandForm;
