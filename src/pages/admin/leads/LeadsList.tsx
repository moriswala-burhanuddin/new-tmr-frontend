import { useEffect, useState } from 'react';
import { Mail, Phone, Building2, Globe, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import type { Brand, Product } from '../../../types';

// We need custom interfaces for Leads since they differ from Products/Brands
interface ContactInquiry {
    id: number;
    name: string;
    business_name?: string;
    email: string;
    phone: string;
    website?: string;
    budget?: string;
    requirement: string;
    created_at: string;
    is_resolved: boolean;
}

interface WholesaleInquiry {
    id: number;
    name: string;
    business_name: string;
    email: string;
    contact_number: string;
    details: string;
    created_at: string;
    is_resolved: boolean;
    product_details?: Product;
    brand_details?: Brand;
}

const LeadsList = () => {
    const [contacts, setContacts] = useState<ContactInquiry[]>([]);
    const [wholesales, setWholesales] = useState<WholesaleInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchLeads();
    }, [token]);

    const fetchLeads = async () => {
        try {
            // Assuming we use the same user for permissions, but separate endpoints
            // We'll verify this works with the backend permissions
            const [contactRes, wholesaleRes] = await Promise.all([
                api.get('leads/contact/', { headers: { Authorization: `Token ${token}` } }),
                api.get('leads/wholesale/', { headers: { Authorization: `Token ${token}` } })
            ]);
            setContacts(contactRes.data);
            setWholesales(wholesaleRes.data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (type: 'contact' | 'wholesale', id: number, currentStatus: boolean) => {
        try {
            await api.patch(`leads/${type}/${id}/`, { is_resolved: !currentStatus }, {
                headers: { Authorization: `Token ${token}` }
            });
            // Optimistic update
            if (type === 'contact') {
                setContacts(prev => prev.map(c => c.id === id ? { ...c, is_resolved: !currentStatus } : c));
            } else {
                setWholesales(prev => prev.map(w => w.id === id ? { ...w, is_resolved: !currentStatus } : w));
            }
            toast.success(`Inquiry marked as ${!currentStatus ? 'resolved' : 'unresolved'}`);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    // Filter functions
    const filterContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filterWholesales = wholesales.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.business_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-12">

            {/* Search */}
            <div className="bg-[#1A1A1A] p-4 border border-[#333] flex items-center gap-2 mb-8">
                <Search className="text-[#666] w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search inquiries by name, email, or business..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none text-white focus:outline-none"
                />
            </div>

            {/* Wholesale Inquiries */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tighter font-display border-l-4 border-[#C41E3A] pl-4">Wholesale Inquiries</h1>
                </div>
                <div className="bg-[#1A1A1A] border border-[#333] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] border-b border-[#333]">
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Status</th>
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Date</th>
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Contact</th>
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Interest</th>
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterWholesales.map(item => (
                                <tr key={item.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleStatus('wholesale', item.id, item.is_resolved)}
                                            className={`p-1 rounded transition-colors ${item.is_resolved ? 'text-green-500 hover:text-green-400' : 'text-[#666] hover:text-white'}`}
                                            title={item.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                                        >
                                            {item.is_resolved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </button>
                                    </td>
                                    <td className="p-4 text-[#666] text-xs font-mono w-32">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-white mb-1">{item.name}</div>
                                        <div className="text-sm text-[#AAAAAA] flex items-center gap-2"><Building2 className="w-3 h-3" /> {item.business_name}</div>
                                        <div className="text-sm text-[#AAAAAA] flex items-center gap-2"><Mail className="w-3 h-3" /> {item.email}</div>
                                        <div className="text-sm text-[#AAAAAA] flex items-center gap-2"><Phone className="w-3 h-3" /> {item.contact_number}</div>
                                    </td>
                                    <td className="p-4 text-sm text-[#AAAAAA]">
                                        {item.brand_details && <div className="font-bold text-white">Brand: {item.brand_details.name}</div>}
                                        {item.product_details && <div>Product: {item.product_details.name}</div>}
                                    </td>
                                    <td className="p-4 text-white text-sm max-w-sm">{item.details}</td>
                                </tr>
                            ))}
                            {filterWholesales.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[#666]">No wholesale inquiries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* General Inquiries */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tighter font-display border-l-4 border-[#C41E3A] pl-4">General Inquiries</h1>
                </div>
                <div className="bg-[#1A1A1A] border border-[#333] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] border-b border-[#333]">
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Status</th>
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Date</th>
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Contact</th>
                                <th className="p-4 text-[#AAAAAA] font-bold uppercase text-xs tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterContacts.map(item => (
                                <tr key={item.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleStatus('contact', item.id, item.is_resolved)}
                                            className={`p-1 rounded transition-colors ${item.is_resolved ? 'text-green-500 hover:text-green-400' : 'text-[#666] hover:text-white'}`}
                                            title={item.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                                        >
                                            {item.is_resolved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </button>
                                    </td>
                                    <td className="p-4 text-[#666] text-xs font-mono w-32">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-white mb-1">{item.name}</div>
                                        {item.business_name && <div className="text-sm text-[#AAAAAA] flex items-center gap-2"><Building2 className="w-3 h-3" /> {item.business_name}</div>}
                                        <div className="text-sm text-[#AAAAAA] flex items-center gap-2"><Mail className="w-3 h-3" /> {item.email}</div>
                                        <div className="text-sm text-[#AAAAAA] flex items-center gap-2"><Phone className="w-3 h-3" /> {item.phone}</div>
                                        {item.website && <div className="text-sm text-[#C41E3A] flex items-center gap-2 mt-1"><Globe className="w-3 h-3" /> <a href={item.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a></div>}
                                    </td>
                                    <td className="p-4 text-white text-sm max-w-sm">
                                        <div className="mb-2">
                                            {item.budget && <span className="inline-block bg-[#333] text-[#ccc] text-xs px-2 py-1 rounded mr-2">Budget: {item.budget}</span>}
                                        </div>
                                        {item.requirement}
                                    </td>
                                </tr>
                            ))}
                            {filterContacts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-[#666]">No general inquiries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default LeadsList;
