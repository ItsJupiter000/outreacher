const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiEndpoints = {
    search: `${API_URL}/api/search`,
    send: `${API_URL}/api/send`,
    dashboard: `${API_URL}/api/dashboard`,
    status: `${API_URL}/api/status`,
    deleteRecord: (id: string) => `${API_URL}/api/record/${id}`,
};

export default API_URL;
