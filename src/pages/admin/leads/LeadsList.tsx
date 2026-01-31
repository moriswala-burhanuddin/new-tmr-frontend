import { useEffect, useState } from 'react';
import { Mail, Phone, Building2, Globe, CheckCircle, XCircle, Search, Eye, X, User, Info } from 'lucide-react';
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
    product_details?: Product[];
    brand_details?: Brand[];
}

const LeadsList = () => {
    const [contacts, setContacts] = useState<ContactInquiry[]>([]);
    const [wholesales, setWholesales] = useState<WholesaleInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState<{ type: 'contact' | 'wholesale', data: any } | null>(null);
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
                <div className="bg-[#1A1A1A] border border-[#333] overflow-x-auto">
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
                                    <td className="p-4 flex items-center gap-2">
                                        <button
                                            onClick={() => toggleStatus('wholesale', item.id, item.is_resolved)}
                                            className={`p-1 rounded transition-colors ${item.is_resolved ? 'text-green-500 hover:text-green-400' : 'text-[#666] hover:text-white'}`}
                                            title={item.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                                        >
                                            {item.is_resolved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => setSelectedInquiry({ type: 'wholesale', data: item })}
                                            className="p-1 text-[#AAAAAA] hover:text-white transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
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
                                        {item.brand_details && item.brand_details.length > 0 && (
                                            <div className="mb-2">
                                                <div className="text-[10px] font-bold text-[#666] uppercase mb-1">Brands</div>
                                                {item.brand_details.map(b => (
                                                    <div key={b.id} className="text-white font-medium">{b.name}</div>
                                                ))}
                                            </div>
                                        )}
                                        {item.product_details && item.product_details.length > 0 && (
                                            <div>
                                                <div className="text-[10px] font-bold text-[#666] uppercase mb-1">Products</div>
                                                {item.product_details.map(p => (
                                                    <div key={p.id} className="text-white/80">{p.name}</div>
                                                ))}
                                            </div>
                                        )}
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
                                    <td className="p-4 flex items-center gap-2">
                                        <button
                                            onClick={() => toggleStatus('contact', item.id, item.is_resolved)}
                                            className={`p-1 rounded transition-colors ${item.is_resolved ? 'text-green-500 hover:text-green-400' : 'text-[#666] hover:text-white'}`}
                                            title={item.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                                        >
                                            {item.is_resolved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => setSelectedInquiry({ type: 'contact', data: item })}
                                            className="p-1 text-[#AAAAAA] hover:text-white transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
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

            {/* Inquiry Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1A1A1A] border border-[#333] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#333] p-6 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter font-display flex items-center gap-3">
                                    <Info className="w-6 h-6 text-[#C41E3A]" />
                                    Inquiry Details
                                </h2>
                                <p className="text-[#666] text-xs font-mono mt-1">
                                    #{selectedInquiry.type.toUpperCase()}-{selectedInquiry.data.id} • {new Date(selectedInquiry.data.created_at).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-[#666] hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            {/* Contact Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#111] border border-[#333]">
                                            <User className="w-5 h-5 text-[#C41E3A]" />
                                        </div>
                                        <div>
                                            <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-1">Full Name</label>
                                            <p className="text-white font-bold">{selectedInquiry.data.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#111] border border-[#333]">
                                            <Mail className="w-5 h-5 text-[#C41E3A]" />
                                        </div>
                                        <div>
                                            <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-1">Email Address</label>
                                            <p className="text-white">{selectedInquiry.data.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#111] border border-[#333]">
                                            <Phone className="w-5 h-5 text-[#C41E3A]" />
                                        </div>
                                        <div>
                                            <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-1">Phone Number</label>
                                            <p className="text-white">{selectedInquiry.data.phone || selectedInquiry.data.contact_number}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {selectedInquiry.data.business_name && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-[#111] border border-[#333]">
                                                <Building2 className="w-5 h-5 text-[#C41E3A]" />
                                            </div>
                                            <div>
                                                <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-1">Business Name</label>
                                                <p className="text-white">{selectedInquiry.data.business_name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedInquiry.type === 'contact' && selectedInquiry.data.website && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-[#111] border border-[#333]">
                                                <Globe className="w-5 h-5 text-[#C41E3A]" />
                                            </div>
                                            <div>
                                                <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-1">Website</label>
                                                <a href={selectedInquiry.data.website} target="_blank" rel="noopener noreferrer" className="text-[#C41E3A] hover:underline">{selectedInquiry.data.website}</a>
                                            </div>
                                        </div>
                                    )}

                                    {selectedInquiry.type === 'contact' && selectedInquiry.data.budget && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-[#111] border border-[#333]">
                                                <div className="text-[#C41E3A] font-bold text-xs">$</div>
                                            </div>
                                            <div>
                                                <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-1">Budget Range</label>
                                                <p className="text-white">{selectedInquiry.data.budget}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Wholesale Interests */}
                            {selectedInquiry.type === 'wholesale' && (
                                <div className="space-y-4 border-t border-[#333] pt-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#C41E3A]"></div>
                                        Product & Brand Interest
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {selectedInquiry.data.brand_details && selectedInquiry.data.brand_details.length > 0 && (
                                            <div>
                                                <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-2">Brands</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedInquiry.data.brand_details.map((b: any) => (
                                                        <span key={b.id} className="px-2 py-1 bg-[#222] border border-[#333] text-white text-xs font-bold">{b.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedInquiry.data.product_details && selectedInquiry.data.product_details.length > 0 && (
                                            <div>
                                                <label className="block text-[#666] text-[10px] font-bold uppercase tracking-wider mb-2">Products</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedInquiry.data.product_details.map((p: any) => (
                                                        <span key={p.id} className="px-2 py-1 bg-[#222] border border-[#333] text-white/80 text-xs">{p.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Main Message / Requirement */}
                            <div className="space-y-4 border-t border-[#333] pt-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#C41E3A]"></div>
                                    Inquiry Content
                                </h3>
                                <div className="bg-[#111] border border-[#333] p-6 text-[#AAAAAA] text-sm leading-relaxed whitespace-pre-line">
                                    {selectedInquiry.data.requirement || selectedInquiry.data.details}
                                </div>
                            </div>

                            {/* Status and Action */}
                            <div className="pt-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${selectedInquiry.data.is_resolved ? 'bg-green-500' : 'bg-[#C41E3A] animate-pulse'}`}></div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#666]">
                                        Status: <span className={selectedInquiry.data.is_resolved ? 'text-green-500' : 'text-[#C41E3A]'}>
                                            {selectedInquiry.data.is_resolved ? 'Resolved' : 'Needs Attention'}
                                        </span>
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleStatus(selectedInquiry.type, selectedInquiry.data.id, selectedInquiry.data.is_resolved).then(() => {
                                        // Update local state for modal
                                        setSelectedInquiry(prev => prev ? { ...prev, data: { ...prev.data, is_resolved: !prev.data.is_resolved } } : null);
                                    })}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${selectedInquiry.data.is_resolved
                                        ? 'border-[#333] text-[#666] hover:text-white hover:bg-[#222]'
                                        : 'border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white'}`}
                                >
                                    {selectedInquiry.data.is_resolved ? 'Mark Unresolved' : 'Mark as Resolved'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadsList;
