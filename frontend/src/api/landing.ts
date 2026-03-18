import api from './axios';

export const getLandingSection = async <T>(section: string): Promise<T[]> => {
    const res = await api.get(`/landing/${section}`);
    return res.data.data;
};
