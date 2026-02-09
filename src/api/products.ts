import api from '../lib/axios';

export interface Brand {
    id: number;
    name: string;
    logo: string | null;
    slug: string;
    description: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string | null;
    content: string;
    html_content: string;
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    categories: any[];
    brands: Brand[];
    image: string | null;
    is_featured: boolean;
    specifications: string;
    meta_title: string;
    meta_description: string;
    og_image: string | null;
}

export const getBrands = async () => {
    const response = await api.get<Brand[]>('/brands/');
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get<Product[]>('/products/');
    return response.data;
};
