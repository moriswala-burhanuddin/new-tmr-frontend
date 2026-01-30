import api from '../lib/axios';

export interface Brand {
    id: number;
    name: string;
    logo: string | null;
    slug: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    category: number;
    brand: number;
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
