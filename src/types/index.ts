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
    brand: Brand | number;
    category: Category | number | null;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
}

export interface Brand {
    id: number;
    name: string;
    logo: string | null;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface User {
    username: string;
    token: string;
}

export interface AuthResponse {
    token: string;
}
