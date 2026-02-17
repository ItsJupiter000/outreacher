
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchCompany = async (domain: string) => {
    const response = await api.post('/search', { domain });
    return response.data;
};

export const sendEmail = async (data: any) => {
    const response = await api.post('/send', data);
    return response.data;
};

export const getDashboardData = async () => {
    const response = await api.get('/dashboard');
    return response.data;
};

export const updateStatus = async (id: string, status: string) => {
    const response = await api.put('/status', { id, status });
    return response.data;
};
