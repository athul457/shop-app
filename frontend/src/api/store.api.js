import axios from 'axios';

const API_URL = '/api/stores/';

// Create or Update Store Profile
export const saveStoreProfile = async (profileData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.post(API_URL, profileData, config);
    return response.data;
};

// Get Store by Vendor ID (Public)
export const fetchStoreByVendor = async (vendorId) => {
    const response = await axios.get(`${API_URL}vendor/${vendorId}`);
    return response.data;
};

// Get Store by Store ID (Public)
export const fetchStoreById = async (storeId) => {
    const response = await axios.get(API_URL + storeId);
    return response.data;
};

// Follow Store
export const followStore = async (storeId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.put(`${API_URL}${storeId}/follow`, {}, config);
    return response.data;
};

// Unfollow Store
export const unfollowStore = async (storeId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.put(`${API_URL}${storeId}/unfollow`, {}, config);
    return response.data;
};
