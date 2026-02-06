import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { addAddress, deleteAddress, updateAddress as updateAddressApi } from '../api/address.api';
import { useAuth } from './AuthContext';

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  // Initialize with some dummy data
  const { user, updateUser } = useAuth();
  const [addresses, setAddresses] = useState([]);

  // Sync addresses with user profile when it loads
  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses.map(addr => ({ ...addr, id: addr._id }))); 
    }
  }, [user]);

  const addNewAddress = async (newAddress) => {
    try {
      const updatedAddresses = await addAddress(newAddress);
      setAddresses(updatedAddresses.map(addr => ({ ...addr, id: addr._id })));
      // Update global user state with new addresses
      updateUser({ ...user, addresses: updatedAddresses });
      toast.success("Address saved successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
      return false;
    }
  };

  const removeAddress = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      const updatedAddresses = await deleteAddress(id);
      setAddresses(updatedAddresses.map(addr => ({ ...addr, id: addr._id })));
      // Update global user state
      updateUser({ ...user, addresses: updatedAddresses });
      toast.success("Address removed");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const updateAddress = async (id, updatedData) => {
    try {
      const updatedAddresses = await updateAddressApi(id, updatedData);
      setAddresses(updatedAddresses.map(addr => ({ ...addr, id: addr._id })));
      // Update global user state
      updateUser({ ...user, addresses: updatedAddresses });
      toast.success("Address updated successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
      return false;
    }
  };

  return (
    <AddressContext.Provider value={{ addresses, addNewAddress, removeAddress, updateAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
