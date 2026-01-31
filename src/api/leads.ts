import api from '../lib/axios';

export interface ContactData {
    name: string;
    business_name?: string;
    email: string;
    phone: string;
    website?: string;
    budget?: string;
    requirement: string;
}

export interface WholesaleData {
    name: string;
    business_name: string;
    email: string;
    contact_number: string;
    product_ids?: number[];
    brand_ids?: number[];
    details: string;
}

export const createContactInquiry = async (data: ContactData) => {
    const response = await api.post('/leads/contact/', data);
    return response.data;
};

export const createWholesaleInquiry = async (data: WholesaleData) => {
    const response = await api.post('/leads/wholesale/', data);
    return response.data;
};
