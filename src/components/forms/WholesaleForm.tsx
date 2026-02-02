
import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createWholesaleInquiry, type WholesaleData } from '../../api/leads';
import { getBrands, getProducts, type Brand, type Product } from '../../api/products';
import { fixImageUrl } from '../../lib/utils';
import { Send, User, Building2, Mail, Phone, FileText, ChevronDown, X } from 'lucide-react';

const WholesaleForm = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<WholesaleData>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [brandSearch, setBrandSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');

    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const brandRef = useRef<HTMLDivElement>(null);
    const productRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
                setShowBrandDropdown(false);
            }
            if (productRef.current && !productRef.current.contains(event.target as Node)) {
                setShowProductDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsData, productsData] = await Promise.all([getBrands(), getProducts()]);
                setBrands(brandsData);
                setProducts(productsData);
            } catch (error) {
                console.error('Failed to load dropdown data', error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: WholesaleData) => {
        try {
            await createWholesaleInquiry({
                ...data,
                brand_ids: selectedBrands,
                product_ids: selectedProducts
            });
            toast.success('Wholesale inquiry sent! A representative will contact you.');
            reset();
            setSelectedBrands([]);
            setSelectedProducts([]);
        } catch (error) {
            toast.error('Failed to send inquiry. Please try again.');
            console.error(error);
        }
    };

    const inputClasses = "w-full bg-[#121212] border border-[#333] px-12 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#C41E3A] transition-all font-sans";
    const labelClasses = "text-sm font-bold text-[#AAAAAA] ml-1 uppercase tracking-wider font-display";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] group-focus-within:text-[#C41E3A] transition-colors";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                    <label className={labelClasses}>Contact Person</label>
                    <div className="relative group">
                        <User className={iconClasses} />
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className={inputClasses}
                            placeholder="Full Name"
                        />
                    </div>
                    {errors.name && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.name.message}</p>}
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                    <label className={labelClasses}>Company / Business</label>
                    <div className="relative group">
                        <Building2 className={iconClasses} />
                        <input
                            {...register('business_name', { required: 'Business name is required' })}
                            className={inputClasses}
                            placeholder="Company Ltd."
                        />
                    </div>
                    {errors.business_name && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.business_name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className={labelClasses}>Business Email</label>
                    <div className="relative group">
                        <Mail className={iconClasses} />
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                            })}
                            className={inputClasses}
                            placeholder="procurement@company.com"
                        />
                    </div>
                    {errors.email && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className={labelClasses}>Direct Phone</label>
                    <div className="relative group">
                        <Phone className={iconClasses} />
                        <input
                            {...register('contact_number', { required: 'Phone is required' })}
                            className={inputClasses}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    {errors.contact_number && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.contact_number.message}</p>}
                </div>

                {/* Brand Selection - Dropdown & Search */}
                <div className="space-y-4 md:col-span-2" ref={brandRef}>
                    <label className={labelClasses}>Brands of Interest</label>
                    <div className="space-y-3">
                        {/* Selected Chips */}
                        {selectedBrands.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {brands.filter(b => selectedBrands.includes(b.id)).map(brand => (
                                    <div key={brand.id} className="flex items-center gap-2 bg-[#C41E3A]/10 border border-[#C41E3A] text-white px-3 py-1.5 rounded-full">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{brand.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBrands(prev => prev.filter(id => id !== brand.id))}
                                            className="text-[#C41E3A] hover:text-white transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <div
                                onClick={() => setShowBrandDropdown(true)}
                                className={`w-full bg-[#121212] border border-[#333] px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#555] transition-colors ${showBrandDropdown ? 'border-[#C41E3A]' : ''}`}
                            >
                                <input
                                    type="text"
                                    placeholder={selectedBrands.length > 0 ? "Add more brands..." : "Select Brands..."}
                                    value={brandSearch}
                                    onChange={(e) => {
                                        setBrandSearch(e.target.value);
                                        setShowBrandDropdown(true);
                                    }}
                                    className="bg-transparent border-none focus:outline-none text-white text-sm w-full placeholder:text-[#666] font-sans"
                                />
                                <ChevronDown className={`w-4 h-4 text-[#666] transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown */}
                            {showBrandDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#333] shadow-2xl z-50 max-h-[300px] overflow-y-auto custom-scrollbar rounded-lg">
                                    {brands
                                        .filter(b => !selectedBrands.includes(b.id))
                                        .filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
                                        .slice(0, 50)
                                        .map(brand => (
                                            <button
                                                key={brand.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedBrands(prev => [...prev, brand.id]);
                                                    setBrandSearch('');
                                                }}
                                                className="w-full flex items-center gap-4 p-3 border-b border-[#222] hover:bg-[#252525] transition-colors text-left group last:border-0"
                                            >
                                                <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center shrink-0">
                                                    {brand.logo ? (
                                                        <img src={fixImageUrl(brand.logo)} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                                    ) : (
                                                        <span className="text-black font-bold text-[8px] uppercase">{brand.name.substring(0, 2)}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-bold uppercase text-gray-300 group-hover:text-white">{brand.name}</span>
                                            </button>
                                        ))}
                                    {brands.filter(b => !selectedBrands.includes(b.id) && b.name.toLowerCase().includes(brandSearch.toLowerCase())).length === 0 && (
                                        <div className="p-4 text-center text-gray-500 text-xs">No matching brands found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Selection - Dropdown & Search */}
                <div className="space-y-4 md:col-span-2" ref={productRef}>
                    <label className={labelClasses}>Products of Interest</label>
                    <div className="space-y-3">
                        {/* Selected Chips */}
                        {selectedProducts.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {products.filter(p => selectedProducts.includes(p.id)).map(product => (
                                    <div key={product.id} className="flex items-center gap-2 bg-[#C41E3A]/10 border border-[#C41E3A] text-white px-3 py-1.5 rounded-full">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{product.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProducts(prev => prev.filter(id => id !== product.id))}
                                            className="text-[#C41E3A] hover:text-white transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <div
                                onClick={() => setShowProductDropdown(true)}
                                className={`w-full bg-[#121212] border border-[#333] px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#555] transition-colors ${showProductDropdown ? 'border-[#C41E3A]' : ''}`}
                            >
                                <input
                                    type="text"
                                    placeholder={selectedProducts.length > 0 ? "Add more products..." : "Select Products..."}
                                    value={productSearch}
                                    onChange={(e) => {
                                        setProductSearch(e.target.value);
                                        setShowProductDropdown(true);
                                    }}
                                    className="bg-transparent border-none focus:outline-none text-white text-sm w-full placeholder:text-[#666] font-sans"
                                />
                                <ChevronDown className={`w-4 h-4 text-[#666] transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown */}
                            {showProductDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#333] shadow-2xl z-50 max-h-[300px] overflow-y-auto custom-scrollbar rounded-lg">
                                    {products
                                        .filter(p => !selectedProducts.includes(p.id))
                                        .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                                        .slice(0, 50)
                                        .map(product => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedProducts(prev => [...prev, product.id]);
                                                    setProductSearch('');
                                                }}
                                                className="w-full flex items-center gap-4 p-3 border-b border-[#222] hover:bg-[#252525] transition-colors text-left group last:border-0"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold uppercase text-gray-300 group-hover:text-white truncate">{product.name}</div>
                                                    <div className="text-[10px] text-gray-600 group-hover:text-gray-400">SKU: {product.id}</div>
                                                </div>
                                            </button>
                                        ))}
                                    {products.filter(p => !selectedProducts.includes(p.id) && p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                                        <div className="p-4 text-center text-gray-500 text-xs">No matching products found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
                <label className={labelClasses}>Order Details / Quantity</label>
                <div className="relative group">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-[#666] group-focus-within:text-[#C41E3A] transition-colors" />
                    <textarea
                        {...register('details', { required: 'Please provide details about your order requirement' })}
                        className={`${inputClasses} h-32 resize-none py-4`}
                        placeholder="I'm interested in ordering 500 units of..."
                    />
                </div>
                {errors.details && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.details.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-4 shadow-lg border-2 border-[#C41E3A] hover:border-[#fff] transform transition-all flex items-center justify-center gap-2 group uppercase tracking-widest font-display"
            >
                {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>Submit Wholesale Inquiry</span>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
};

export default WholesaleForm;
