  import { useState } from 'react';
import { MapPin, Plus, Trash2, X } from 'lucide-react';
import { useAddress } from '../../context/AddressContext';

const Addresses = () => {
  const { addresses, removeAddress, addNewAddress } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Home',
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addNewAddress(formData);
    if (success) {
       setIsModalOpen(false);
       setFormData({
        type: 'Home',
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        landmark: ''
       });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
           <Plus size={18} /> Add Address
        </button>
      </div>

      {addresses && addresses.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No addresses found. Add one now!</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {addresses && addresses.map((addr) => (
                <div key={addr.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative group">
                   <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded uppercase font-bold tracking-wider">{addr.type}</span>
                         {addr.name && <span className="font-bold text-gray-900">{addr.name}</span>}
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => removeAddress(addr.id)} className="p-1 hover:bg-red-50 rounded text-red-600"><Trash2 size={16} /></button>
                      </div>
                   </div>
                   <p className="text-gray-700 mb-1">{addr.address}</p>
                   <p className="text-gray-500 text-sm mb-3">{addr.landmark ? `${addr.landmark}, ` : ''}{addr.city} - {addr.pincode}</p>
                   <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {addr.phone}</span>
                   </div>
                </div>
             ))}
          </div>
      )}

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Add New Address</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded p-2 text-sm">
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 text-sm" required />
                         </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2 text-sm" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Address (House No, Building, Street)</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full border rounded p-2 text-sm" required></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border rounded p-2 text-sm" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border rounded p-2 text-sm" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 mt-2">Save Address</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
