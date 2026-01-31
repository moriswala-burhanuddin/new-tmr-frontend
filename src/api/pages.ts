import api from '../lib/axios';

export interface HomePageContent {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    hero_image_1: string;
    hero_image_2: string;
    hero_image_3: string;
    hero_image_4: string;
    hero_image_5: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    linkedin_url: string;
    youtube_url: string;
    about_section_title: string;
    about_section_content: string;
    content: string;
    html_content: string;
    clients_served_count: string;
    expert_support_text: string;
}

export interface AboutPageContent {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    content: string;
    html_content: string;
    clients_served_count: string;
    expert_support_text: string;
}

export const getHomePageContent = async (): Promise<HomePageContent> => {
    try {
        const response = await api.get('pages/home/');
        return response.data;
    } catch (error) {
        console.error('Error fetching home page content:', error);
        return {} as HomePageContent;
    }
};

export const getAboutPageContent = async (): Promise<AboutPageContent> => {
    try {
        const response = await api.get('pages/about/');
        return response.data;
    } catch (error) {
        console.error('Error fetching about page content:', error);
        return {} as AboutPageContent;
    }
};

export interface ContactPageContent {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    content: string;
    address: string;
    phone: string;
    email: string;
    map_embed_url: string;
}

export interface WholesalePageContent {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    content: string;
    html_content: string;
}

export interface BrandPageContent {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    content: string;
    html_content: string;
}

export const getContactPageContent = async (): Promise<ContactPageContent> => {
    try {
        const response = await api.get('pages/contact/');
        return response.data;
    } catch (error) {
        console.error('Error fetching contact page content:', error);
        return {} as ContactPageContent;
    }
};

export const getWholesalePageContent = async (): Promise<WholesalePageContent> => {
    try {
        const response = await api.get('pages/wholesale/');
        return response.data;
    } catch (error) {
        console.error('Error fetching wholesale page content:', error);
        return {} as WholesalePageContent;
    }
};

export const getBrandPageContent = async (): Promise<BrandPageContent> => {
    try {
        const response = await api.get('pages/brand/');
        return response.data;
    } catch (error) {
        console.error('Error fetching brand page content:', error);
        return {} as BrandPageContent;
    }
};
