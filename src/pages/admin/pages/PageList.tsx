import { Link } from 'react-router-dom';
import { Edit, Home, Phone, Building2, Info, Tag } from 'lucide-react';

const PageList = () => {
    const pages = [
        { name: 'Home Page', slug: 'home', icon: Home, desc: 'Main landing page content and sliders' },
        { name: 'About Us', slug: 'about', icon: Info, desc: 'Company history and details' },
        { name: 'Contact Us', slug: 'contact', icon: Phone, desc: 'Address, map, and contact info' },
        { name: 'Wholesale', slug: 'wholesale', icon: Building2, desc: 'Wholesale information page' },
        { name: 'Brand Content', slug: 'brand', icon: Tag, desc: 'Generic content for brand pages' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter font-display">Content Pages</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map(page => (
                    <div key={page.slug} className="bg-[#1A1A1A] border border-[#333] p-6 hover:border-[#C41E3A] transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-[#111] border border-[#333] group-hover:border-[#C41E3A]/50 transition-colors">
                                <page.icon className="w-8 h-8 text-[#C41E3A]" />
                            </div>
                            <Link
                                to={`/admin/pages/${page.slug}`}
                                className="text-[#AAAAAA] hover:text-white transition-colors"
                            >
                                <Edit className="w-5 h-5" />
                            </Link>
                        </div>
                        <h2 className="text-xl font-bold text-white uppercase mb-2 group-hover:text-[#C41E3A] transition-colors">{page.name}</h2>
                        <p className="text-[#666] text-sm mb-6">{page.desc}</p>

                        <Link
                            to={`/admin/pages/${page.slug}`}
                            className="inline-block w-full text-center bg-[#333] hover:bg-[#C41E3A] text-white font-bold py-3 uppercase text-sm tracking-wider transition-colors"
                        >
                            Edit Content
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageList;
