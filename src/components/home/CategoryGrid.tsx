import { Link } from 'react-router-dom';

const CategoryGrid = () => {
    const categories = [
        {
            id: 1,
            title: 'POWER TOOLS',
            image: '/assets/images/category-power-tools.png',
            link: '/products?category=power-tools'
        },
        {
            id: 2,
            title: 'HAND TOOLS',
            image: '/assets/images/hand-tools.png',
            link: '/products?category=hand-tools'
        },
        {
            id: 3,
            title: 'LIFTING EQUIPMENT',
            image: '/assets/images/lifting-eq.png',
            link: '/products?category=lifting-equipment'
        },
        {
            id: 4,
            title: 'Industrial tools',
            image: '/assets/images/Industrial tools.png',
            link: '/products?category=industrial-tools'
        },
        {
            id: 5,
            title: 'Furniture hardware and fittings',
            image: '/assets/images/Furniture hardware and fittings.png',
            link: '/products?category=furniture-hardware'
        },
        {
            id: 6,
            title: 'oil and lubricants',
            image: '/assets/images/oil.png',
            link: '/products?category=oil-and-lubricants'
        }
    ];

    return (
        <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.link}
                            className="group relative block pt-10"
                        >
                            {/* Industrial Topper */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-10 z-20">
                                <div className="absolute inset-0 bg-[#222] border-x-2 border-t-2 border-[#444] [clip-path:polygon(10%_0,90%_0,100%_100%,0_100%)] group-hover:border-[#C41E3A] transition-colors duration-300"></div>
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#C41E3A] rounded-full shadow-[0_0_15px_rgba(196,30,58,0.8)]"></div>
                            </div>

                            {/* Main Industrial Container */}
                            <div className="relative aspect-[4/5] bg-[#1a1a1a] border-2 border-[#333] group-hover:border-[#C41E3A] transition-all duration-300 overflow-hidden flex flex-col p-1">
                                {/* Inner Metallic Frame */}
                                <div className="relative flex-1 bg-black overflow-hidden border border-[#222]">

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col p-8 bg-transparent transition-colors duration-500">
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-auto font-display drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] group-hover:text-[#C41E3A] transition-colors duration-300 leading-none">
                                            {category.title}
                                        </h3>

                                        <div className="mt-auto">
                                            <div className="inline-block bg-[#C41E3A] hover:bg-white text-white hover:text-[#C41E3A] font-bold py-3 px-6 uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-transparent hover:border-[#C41E3A]">
                                                Explore Now
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-110 transition-all duration-1000"
                                    />

                                    {/* Corner Accents */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white"></div>
                                        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-white"></div>
                                        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-white"></div>
                                        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-white"></div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
