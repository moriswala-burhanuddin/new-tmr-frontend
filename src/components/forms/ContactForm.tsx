
// import React from 'react'; // Removed unused React import
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createContactInquiry, type ContactData } from '../../api/leads';
import { Send, User, Building2, Mail, Phone, Globe, DollarSign, MessageSquare } from 'lucide-react';

const ContactForm = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactData>();

    const onSubmit = async (data: ContactData) => {
        try {
            await createContactInquiry(data);
            toast.success('Message sent successfully! We will get back to you soon.');
            reset();
        } catch (error) {
            toast.error('Failed to send message. Please try again later.');
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
                    <label className={labelClasses}>Full Name</label>
                    <div className="relative group">
                        <User className={iconClasses} />
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className={inputClasses}
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.name && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.name.message}</p>}
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                    <label className={labelClasses}>Business Name</label>
                    <div className="relative group">
                        <Building2 className={iconClasses} />
                        <input
                            {...register('business_name')}
                            className={inputClasses}
                            placeholder="Company Ltd."
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className={labelClasses}>Email Address</label>
                    <div className="relative group">
                        <Mail className={iconClasses} />
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                            })}
                            className={inputClasses}
                            placeholder="john@example.com"
                        />
                    </div>
                    {errors.email && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className={labelClasses}>Phone Number</label>
                    <div className="relative group">
                        <Phone className={iconClasses} />
                        <input
                            {...register('phone', { required: 'Phone is required' })}
                            className={inputClasses}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    {errors.phone && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.phone.message}</p>}
                </div>

                {/* Website */}
                <div className="space-y-2">
                    <label className={labelClasses}>Website URL</label>
                    <div className="relative group">
                        <Globe className={iconClasses} />
                        <input
                            {...register('website')}
                            className={inputClasses}
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                    <label className={labelClasses}>Estimated Budget</label>
                    <div className="relative group">
                        <DollarSign className={iconClasses} />
                        <select
                            {...register('budget')}
                            className={`${inputClasses} appearance-none`}
                        >
                            <option value="" className="bg-[#121212]">Select Range</option>
                            <option value="<1k" className="bg-[#121212]">Under $1,000</option>
                            <option value="1k-5k" className="bg-[#121212]">$1,000 - $5,000</option>
                            <option value="5k-10k" className="bg-[#121212]">$5,000 - $10,000</option>
                            <option value="10k+" className="bg-[#121212]">$10,000+</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Requirement */}
            <div className="space-y-2">
                <label className={labelClasses}>Project Details</label>
                <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#666] group-focus-within:text-[#C41E3A] transition-colors" />
                    <textarea
                        {...register('requirement', { required: 'Please tell us about your project' })}
                        className={`${inputClasses} h-32 resize-none py-4`}
                        placeholder="Tell us what you're looking to build..."
                    />
                </div>
                {errors.requirement && <p className="text-[#C41E3A] text-xs ml-1 font-bold">{errors.requirement.message}</p>}
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
                        <span>Send Message</span>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
};

export default ContactForm;
