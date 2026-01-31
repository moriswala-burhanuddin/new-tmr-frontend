
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createWholesaleInquiry, type WholesaleData } from '../../api/leads';
import { getBrands, getProducts, type Brand, type Product } from '../../api/products';
import { Send, User, Building2, Mail, Phone, FileText } from 'lucide-react';

const WholesaleForm = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<WholesaleData>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

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

                {/* Brand Selection Grid */}
                <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-[#333] pb-2">
                        <label className={labelClasses}>Brands of Interest</label>
                        <span className="text-[10px] text-[#C41E3A] font-bold uppercase tracking-widest bg-[#C41E3A]/10 px-2 py-0.5 rounded-full">
                            {selectedBrands.length} Selected
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {brands.map(brand => (
                            <button
                                key={brand.id}
                                type="button"
                                onClick={() => {
                                    setSelectedBrands(prev =>
                                        prev.includes(brand.id)
                                            ? prev.filter(id => id !== brand.id)
                                            : [...prev, brand.id]
                                    );
                                }}
                                className={`flex items-center gap-2 p-2 border transition-all text-left ${selectedBrands.includes(brand.id)
                                    ? "bg-[#C41E3A]/10 border-[#C41E3A] text-white"
                                    : "bg-[#1A1A1A] border-[#333] text-[#888] hover:border-[#444]"
                                    }`}
                            >
                                <div className={`w-3 h-3 border flex items-center justify-center ${selectedBrands.includes(brand.id) ? "bg-[#C41E3A] border-[#C41E3A]" : "border-[#444]"
                                    }`}>
                                    {selectedBrands.includes(brand.id) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <span className="text-[10px] font-bold uppercase truncate">{brand.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Selection Grid */}
                <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-[#333] pb-2">
                        <label className={labelClasses}>Products of Interest</label>
                        <span className="text-[10px] text-[#C41E3A] font-bold uppercase tracking-widest bg-[#C41E3A]/10 px-2 py-0.5 rounded-full">
                            {selectedProducts.length} Selected
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {products.map(product => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => {
                                    setSelectedProducts(prev =>
                                        prev.includes(product.id)
                                            ? prev.filter(id => id !== product.id)
                                            : [...prev, product.id]
                                    );
                                }}
                                className={`flex items-center gap-2 p-2 border transition-all text-left ${selectedProducts.includes(product.id)
                                    ? "bg-[#C41E3A]/10 border-[#C41E3A] text-white"
                                    : "bg-[#1A1A1A] border-[#333] text-[#888] hover:border-[#444]"
                                    }`}
                            >
                                <div className={`w-3 h-3 border flex items-center justify-center ${selectedProducts.includes(product.id) ? "bg-[#C41E3A] border-[#C41E3A]" : "border-[#444]"
                                    }`}>
                                    {selectedProducts.includes(product.id) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-bold uppercase truncate">{product.name}</div>
                                    <div className="text-[8px] text-[#666] uppercase">{product.category_details?.name}</div>
                                </div>
                            </button>
                        ))}
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
