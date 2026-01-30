import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
}

const Seo = ({ title, description, url, image }: SeoProps) => {
    const siteTitle = 'TMR Project';
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || "High-quality industrial equipment and hardware products.";

    // Force title and meta description update manually as fallback
    useEffect(() => {
        // Update Title
        if (finalTitle) {
            document.title = finalTitle;
        }

        // Update Description
        if (finalDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', finalDescription);
        }
    }, [finalTitle, finalDescription]);

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            {url && <meta property="og:url" content={url} />}
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            {url && <meta property="twitter:url" content={url} />}
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            {image && <meta property="twitter:image" content={image} />}
        </Helmet>
    );
};

export default Seo;
