import axios from 'axios';

const API_URL = '/api/users'; // Proxy handles http://localhost:5000

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const fetchUsers = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        const response = await axios.put(`${API_URL}/${userId}`, { role }, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserStatus = async (userId, isSuspended) => {
    try {
        const response = await axios.put(`${API_URL}/${userId}`, { isSuspended }, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};
