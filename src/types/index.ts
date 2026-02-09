export interface HomePageData {
    id: number;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string | null;
    hero_image_1: string | null;
    hero_image_2: string | null;
    hero_image_3: string | null;
    hero_image_4: string | null;
    hero_image_5: string | null;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    linkedin_url: string;
    youtube_url: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    is_featured: boolean;
    specifications: string;
    brands: Brand[];
    categories: Category[];
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
}

export interface Brand {
    id: number;
    name: string;
    logo: string | null;
    description: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string | null;
    content: string;
    html_content: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface HomeCategory {
    id: number;
    category: number;
    category_slug: string;
    title: string;
    image: string | null;
    order: number;
    display_title: string;
    display_image: string | null;
}

export interface User {
    username: string;
    token: string;
}

export interface AuthResponse {
    token: string;
}
