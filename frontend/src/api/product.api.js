import axios from 'axios';

const API_URL = '/api/products';

// Helper to get token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const fetchProducts = async (vendorId) => {
    const token = localStorage.getItem('token');
    const config = token ? getAuthHeaders() : {};
    
    let url = API_URL;
    if (vendorId) {
        url += `?vendorId=${vendorId}`;
    }

    const response = await axios.get(url, config);
    return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
    const config = getAuthHeaders();
    const response = await axios.post(API_URL, productData, config);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const config = getAuthHeaders();
    const response = await axios.put(`${API_URL}/${id}`, productData, config);
    return response.data;
};

export const deleteProduct = async (id) => {
    const config = getAuthHeaders();
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};
