import axios from 'axios';

const API_URL = '/api/users/address';

// Add new address
export const addAddress = async (addressData) => {
    const response = await axios.post(API_URL, addressData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

// Delete address
export const deleteAddress = async (addressId) => {
    const response = await axios.delete(`${API_URL}/${addressId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};
