import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fixImageUrl } from '../../../lib/utils';

const PageForm = () => {
    const { type } = useParams(); // 'home', 'about', etc.
    // const navigate = useNavigate();
    const { token } = useAuth();

    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});

    const pageNames: { [key: string]: string } = {
        'home': 'Home Page',
        'about': 'About Us',
        'contact': 'Contact Us',
        'wholesale': 'Wholesale',
        'brand': 'Brand Content'
    };

    useEffect(() => {
        fetchPageData();
    }, [type]);

    const fetchPageData = async () => {
        try {
            const response = await api.get(`pages/${type}/`);
            setFormData(response.data || {});

            // Set previews for existing images
            const newPreviews: any = {};
            const imageFields = ['hero_image', 'hero_image_1', 'hero_image_2', 'hero_image_3', 'hero_image_4', 'hero_image_5'];
            imageFields.forEach(field => {
                if (response.data[field]) {
                    newPreviews[field] = fixImageUrl(response.data[field]);
                }
            });
            setPreviews(newPreviews);

        } catch (err) {
            console.error("Failed to load page data", err);
            // It might be 404 if not exists yet, which is fine, we just default to empty
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const name = e.target.name;
            setFormData((prev: any) => ({ ...prev, [name]: file }));
            setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        const imageFields = ['hero_image', 'hero_image_1', 'hero_image_2', 'hero_image_3', 'hero_image_4', 'hero_image_5', 'og_image'];

        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (value !== null && value !== undefined) {
                // Check if it's an image field
                if (imageFields.includes(key)) {
                    // Only append if it's a File object (new upload)
                    if (value instanceof File) {
                        data.append(key, value);
                    }
                    // If it's a string, it's an existing URL, so we skip it to avoid "Not a file" error
                } else {
                    // For non-image fields (text, etc), append directly
                    data.append(key, value);
                }
            }
        });

        try {
            await api.patch(`pages/${type}/`, data, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Page saved successfully!");
            // navigate('/admin/pages'); // Optional: stay on page to verify
        } catch (err) {
            console.error("Failed to save page", err);
            setError("Failed to save page changes.");
        } finally {
            setLoading(false);
        }
    };

    const renderImageInput = (label: string, fieldName: string) => (
        <div>
            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">{label}</label>
            <div className="border-2 border-dashed border-[#333] p-4 text-center bg-[#121212] hover:border-[#C41E3A] transition-colors relative min-h-[150px] flex flex-col items-center justify-center">
                <input
                    type="file"
                    name={fieldName}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                {previews[fieldName] ? (
                    <div className="relative w-full h-full">
                        <img src={previews[fieldName]} alt="Preview" className="max-h-[130px] mx-auto object-contain" />
                        <div className="absolute top-0 right-0 bg-black/50 p-1 rounded-full text-white cursor-pointer z-20 hover:bg-[#C41E3A]" onClick={(e) => {
                            e.preventDefault();
                            setPreviews(prev => {
                                const n = { ...prev };
                                delete n[fieldName];
                                return n;
                            });
                            // We don't actually delete from formData here easily because backend structure
                            // Ideally backend needs a delete flag or we just overwrite. 
                            // For now, UI preview clear only.
                        }}>
                        </div>
                    </div>
                ) : (
                    <div className="text-[#666] flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs">Click to Upload</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (initialLoading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/pages" className="text-[#AAAAAA] hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">
                    {pageNames[type || ''] || 'Edit Page'}
                </h1>
            </div>

            {error && (
                <div className="bg-[#C41E3A]/10 border border-[#C41E3A] text-[#C41E3A] p-4 mb-6 font-bold uppercase text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#333] p-8 space-y-8">

                {/* SEO Section */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase border-b border-[#333] pb-2">SEO Settings</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Meta Title</label>
                            <input type="text" name="seo_title" value={formData.seo_title || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" />
                        </div>
                        <div>
                            <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Meta Description</label>
                            <textarea name="seo_description" rows={3} value={formData.seo_description || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" />
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase border-b border-[#333] pb-2">Hero Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Hero Title</label>
                                <input type="text" name="hero_title" value={formData.hero_title || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" />
                            </div>
                            <div>
                                <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Hero Subtitle</label>
                                <textarea name="hero_subtitle" rows={3} value={formData.hero_subtitle || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" />
                            </div>
                        </div>
                        <div>
                            {renderImageInput("Main Hero Image", "hero_image")}
                        </div>
                    </div>
                </div>

                {/* Content Section (Generic) */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase border-b border-[#333] pb-2">Main Content</h3>
                    <div>
                        <label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">HTML Content / Detail Text</label>
                        <textarea name="content" rows={10} value={formData.content || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" />
                    </div>
                </div>

                {/* Home Page Specifics */}
                {type === 'home' && (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold uppercase border-b border-[#333] pb-2">Home Page Sliders</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {renderImageInput("Slider 1", "hero_image_1")}
                            {renderImageInput("Slider 2", "hero_image_2")}
                            {renderImageInput("Slider 3", "hero_image_3")}
                            {renderImageInput("Slider 4", "hero_image_4")}
                            {renderImageInput("Slider 5", "hero_image_5")}
                        </div>

                        <h3 className="text-white font-bold uppercase border-b border-[#333] pb-2 mt-8">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Facebook URL</label><input type="text" name="facebook_url" value={formData.facebook_url || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                            <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Instagram URL</label><input type="text" name="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                            <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">LinkedIn URL</label><input type="text" name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                            <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">YouTube URL</label><input type="text" name="youtube_url" value={formData.youtube_url || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                        </div>
                    </div>
                )}

                {/* Contact Page Specifics */}
                {type === 'contact' && (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold uppercase border-b border-[#333] pb-2">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Phone</label><input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                            <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Email</label><input type="text" name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                        </div>
                        <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Address</label><textarea name="address" rows={3} value={formData.address || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                        <div><label className="block text-[#AAAAAA] text-xs font-bold uppercase tracking-wider mb-2">Google Maps Embed URL</label><textarea name="map_embed_url" rows={3} value={formData.map_embed_url || ''} onChange={handleChange} className="w-full bg-[#121212] border border-[#333] text-white p-3 focus:outline-none focus:border-[#C41E3A]" /></div>
                    </div>
                )}

                <div className="pt-6 border-t border-[#333] flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-4 px-12 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PageForm;
