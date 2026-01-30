
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createWholesaleInquiry, type WholesaleData } from '../../api/leads';
import { getBrands, getProducts, type Brand, type Product } from '../../api/products';
import { Send, User, Building2, Mail, Phone, Package, Tag, FileText } from 'lucide-react';

const WholesaleForm = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<WholesaleData>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

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
            await createWholesaleInquiry(data);
            toast.success('Wholesale inquiry sent! A representative will contact you.');
            reset();
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

                {/* Brand Interested */}
                <div className="space-y-2">
                    <label className={labelClasses}>Brand Interest (Optional)</label>
                    <div className="relative group">
                        <Tag className={iconClasses} />
                        <select
                            {...register('brand_interested')}
                            className={`${inputClasses} appearance-none`}
                        >
                            <option value="" className="bg-[#121212]">Select Brand</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id} className="bg-[#121212]">{brand.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Product Interested */}
                <div className="space-y-2">
                    <label className={labelClasses}>Specific Product (Optional)</label>
                    <div className="relative group">
                        <Package className={iconClasses} />
                        <select
                            {...register('product_interested')}
                            className={`${inputClasses} appearance-none`}
                        >
                            <option value="" className="bg-[#121212]">Select Product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id} className="bg-[#121212]">{product.name}</option>
                            ))}
                        </select>
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
