import axios from 'axios';

const API_URL = '/api/orders';

// Create new order
export const createOrder = async (orderData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.post(API_URL, orderData, config);
    return response.data;
};

// Get logged in user orders
export const getMyOrders = async () => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.get(`${API_URL}/myorders`, config);
    return response.data;
};

// Get order by ID
export const getOrderById = async (id) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

// Get all orders (Admin)
export const getAllOrders = async () => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Mark order as delivered (Admin)
export const deliverOrder = async (id) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    const response = await axios.put(`${API_URL}/${id}/deliver`, {}, config);
    return response.data;
};
