import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { fixImageUrl } from '../../lib/utils';
import type { HomePageData } from '../../types';

// Import Swiper styles
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';

import { getHomePageContent } from '../../api/pages';

const Hero = () => {
    const [data, setData] = useState<HomePageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const content = await getHomePageContent();
            if (content) {
                // Cast or ensure types match. HomePageContent is compatible with HomePageData for these fields
                setData(content as unknown as HomePageData);
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    if (loading) {
        return <div className="h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">Loading...</div>;
    }

    if (!data) {
        // Fallback for visual testing based on Layout B
        return (
            <div className="relative bg-dark-bg text-white h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
                {/* Placeholder Background if no data */}
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-[url('/assets/images/hero-1.png')] bg-cover bg-center opacity-40"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 relative">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-none uppercase tracking-tighter font-display">
                            Heavy Duty Gear.<br />
                            <span className="text-white">Built Tough For</span><br />
                            <span className="text-white">The Pros.</span> <span className="text-primary">Power</span><br />
                            <span className="text-primary">Up Your Jobsite.</span>
                        </h1>
                        <div className="flex gap-4 mt-8">
                            <Link to="/products" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-sm transition-colors uppercase tracking-wider text-sm shadow-lg font-display">
                                Shop Now
                            </Link>
                            <Link to="/contact" className="bg-transparent border border-gray-400 hover:border-white text-white font-bold py-3 px-8 rounded-sm transition-colors uppercase tracking-wider text-sm font-display">
                                Request Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Using Data with 2-Column "Industrial" Layout
    const images = data
        ? [data.hero_image, data.hero_image_1, data.hero_image_2, data.hero_image_3, data.hero_image_4, data.hero_image_5].filter(Boolean) as string[]
        : [
            '/assets/images/hero-1.png',
            '/assets/images/hero-2.png',
            '/assets/images/hero-3.png',
            '/assets/images/hero-4.png',
            '/assets/images/hero-5.png',
        ];

    // Fallback title/subtitle
    const title = data?.hero_title || "Heavy Duty Gear.\nBuilt Tough For\nThe Pros. Power\nUp Your Jobsite.";
    const subtitle = data?.hero_subtitle || "";

    return (
        <div className="relative bg-[#121212] min-h-[600px] flex items-center border-b-[5px] border-[#C41E3A] overflow-hidden">
            {/* Mesh pattern overlay opacity */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full pt-12 pb-12 lg:pt-0 lg:pb-0 z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text */}
                    <div className="max-w-xl z-20">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white leading-[0.9] uppercase tracking-tighter font-display drop-shadow-xl whitespace-pre-line">
                            {/* Render title with highlighting logic */}
                            <div dangerouslySetInnerHTML={{
                                __html: title
                                    .replace(/Power/g, '<span class="text-[#C41E3A]">Power</span>')
                                    .replace(/\n/g, '<br/>')
                            }} />
                        </h1>
                        {subtitle && (
                            <p className="text-xl text-gray-300 mb-8 max-w-xl font-medium uppercase tracking-wide">
                                {subtitle}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-10">
                            <Link to="/products" className="bg-[#C41E3A] hover:bg-[#A01A2E] text-white font-bold py-4 px-10 rounded-sm transition-colors uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-display border border-[#C41E3A] whitespace-nowrap">
                                Shop Now
                            </Link>
                            <Link to="/contact" className="bg-transparent border border-[#444] hover:border-white text-white font-bold py-4 px-10 rounded-sm transition-colors uppercase tracking-widest text-sm hover:bg-white/5 font-display whitespace-nowrap">
                                Request Quote
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Image Slider */}
                    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 border border-[#333] group">
                        {/* Screws for industrial feel */}
                        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#333] border border-[#222] z-20 shadow-inner"></div>
                        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#333] border border-[#222] z-20 shadow-inner"></div>
                        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-[#333] border border-[#222] z-20 shadow-inner"></div>
                        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#333] border border-[#222] z-20 shadow-inner"></div>

                        {/* Background for slider area */}
                        <div className="absolute inset-0 bg-[#1A1A1A]"></div>

                        <Swiper
                            modules={[Autoplay, Pagination]}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            loop={true}
                            allowTouchMove={false} // Disable swiping if strict "visual only" is desired, or keep true
                            className="h-full w-full"
                        >
                            {images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative h-full w-full">
                                        <img
                                            src={fixImageUrl(img)}
                                            alt={`Hero Slide ${index + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        {/* Slight overlay for contrast if needed, or remove for "clean" look */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-20"></div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Industrial Badge/Sticker logic from reference image could go here if static assets existed, 
                            but for now we focus on the structure */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;
