import { useState } from 'react';
import { MapPin, Plus, Trash2, X, Home, Briefcase, Building, Phone, Pencil } from 'lucide-react';
import { useAddress } from '../../context/AddressContext';

const Addresses = () => {
  const { addresses, removeAddress, addNewAddress, updateAddress } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    let success;
    
    if (editingId) {
        success = await updateAddress(editingId, formData);
    } else {
        success = await addNewAddress(formData);
    }
    
    if (success) {
       setIsModalOpen(false);
       setEditingId(null);
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

  const handleEdit = (addr) => {
      setEditingId(addr.id || addr._id);
      setFormData({
          type: addr.type,
          name: addr.name,
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          pincode: addr.pincode,
          landmark: addr.landmark || ''
      });
      setIsModalOpen(true);
  };

  const getIcon = (type) => {
      switch(type) {
          case 'Home': return <Home size={16} />;
          case 'Work': return <Briefcase size={16} />;
          default: return <Building size={16} />;
      }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Addresses</h1>
          <p className="mt-1 text-gray-500">Manage your saved shipping addresses.</p>
        </div>
        
        <button 
           onClick={() => {
               setEditingId(null);
               setFormData({
                type: 'Home',
                name: '',
                phone: '',
                address: '',
                city: '',
                pincode: '',
                landmark: ''
               });
               setIsModalOpen(true);
           }} 
           className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
           <Plus size={20} /> Add New Address
        </button>
      </div>

      {addresses && addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-500 max-w-sm mb-6">You haven't added any shipping addresses yet. Add one to speed up your checkout.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-bold hover:underline">
                  Add an address now
              </button>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {addresses && addresses.map((addr) => (
                <div key={addr.id} className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 relative">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <span className={`p-2 rounded-lg ${addr.type === 'Home' ? 'bg-blue-50 text-blue-600' : addr.type === 'Work' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                             {getIcon(addr.type)}
                         </span>
                         <div>
                            <span className="block font-bold text-gray-900 leading-tight">{addr.type}</span>
                            {addr.name && <span className="text-xs text-gray-500 font-medium">{addr.name}</span>}
                         </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={() => handleEdit(addr)} 
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                           title="Edit Address"
                        >
                           <Pencil size={18} />
                        </button>
                        <button 
                           onClick={() => removeAddress(addr.id)} 
                           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                           title="Delete Address"
                        >
                           <Trash2 size={18} />
                        </button>
                      </div>
                   </div>
                   
                   <p className="text-gray-700 text-sm leading-relaxed mb-4 h-10 line-clamp-2">{addr.address}</p>
                   
                   <div className="space-y-2 pt-4 border-t border-gray-50">
                       <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Location Details</p>
                       <p className="text-sm font-medium text-gray-900">{addr.landmark ? `${addr.landmark}, ` : ''}{addr.city} - {addr.pincode}</p>
                       
                       <div className="flex items-center gap-2 text-sm text-gray-600 mt-2 bg-gray-50 py-2 px-3 rounded-lg">
                          <Phone size={14} className="text-gray-400" /> 
                          <span className="font-mono text-xs md:text-sm">{addr.phone}</span>
                       </div>
                   </div>
                </div>
             ))}
          </div>
      )}

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                        <p className="text-sm text-gray-500">{editingId ? 'Update your shipping details' : 'Enter your shipping details below'}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shadow-sm"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Address Type</label>
                            <div className="relative">
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none font-medium">
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <Briefcase size={16} />
                                </div>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Contact Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:font-normal" placeholder="Ex. John Doe" required />
                         </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:font-normal" placeholder="+1 234 567 8900" required />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Full Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:font-normal resize-none" placeholder="House No, Building, Street Area" required></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:font-normal" placeholder="City" required />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Pincode</label>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:font-normal" placeholder="Zip Code" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Landmark <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:font-normal" placeholder="Famous spot nearby" />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 mt-4">
                        {editingId ? 'Update Address' : 'Save Address'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
