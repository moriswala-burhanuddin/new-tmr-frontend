import { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandShowcase from '../components/home/BrandShowcase';
import CTASection from '../components/home/CTASection';
import SocialProof from '../components/home/SocialProof';
import { getHomePageContent, type HomePageContent } from '../api/pages';
import Seo from '../components/common/Seo';

const Home = () => {
    const [content, setContent] = useState<HomePageContent | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            const data = await getHomePageContent();
            console.log("[Home Page] API Response:", data);
            setContent(data);
        };
        fetchContent();
    }, []);

    const socialLinks = content ? {
        facebook: content.facebook_url,
        instagram: content.instagram_url,
        tiktok: content.tiktok_url,
        linkedin: content.linkedin_url,
        youtube: content.youtube_url
    } : undefined;

    return (
        <div className="bg-transparent text-white">
            <Seo
                title={content?.seo_title || "Home"}
                description={content?.seo_description || "Welcome to TMR International, your source for premium hardware products."}
                keywords={content?.seo_keywords}
            />
            <Hero />
            <CategoryGrid />
            <FeaturedProducts />
            {/* Display static BrandShowcase grid instead of ticker */}
            <BrandShowcase />

            <CTASection />
            <SocialProof links={socialLinks} />
        </div>
    );
};

export default Home;
