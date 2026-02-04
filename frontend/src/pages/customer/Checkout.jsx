import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAddress } from '../../context/AddressContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, User, Home, ArrowRight, Plus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems } = useCart();
  const { addresses, addNewAddress } = useAddress();
  const navigate = useNavigate();

  // Mode: 'saved' or 'new'
  const [mode, setMode] = useState('new'); // Default to new, update effect will switch if saved exists
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Update selection when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
        setMode('saved');
        setSelectedAddressId(addresses[0].id);
    }
  }, [addresses]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    city: '',
    landmark: '',
    pincode: '',
    type: 'Home'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    
    if (mode === 'new') {
        // Validate new address
        if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
            toast.error("Please fill all required fields");
            return;
        }
        const success = await addNewAddress(formData);
        if(success) {
            navigate('/dashboard/payment', { state: { address: formData } }); 
        }
    } else {
        // Validate selected address
        if (!selectedAddressId) {
            toast.error("Please select an address");
            return;
        }
        // Proceed to Payment with existing address
        const selectedAddr = addresses.find(a => a.id === selectedAddressId);
        navigate('/dashboard/payment', { state: { address: selectedAddr } }); 
    }
  };

  // Order Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Address Selection */}
         <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="text-blue-600" /> Shipping Address
               </h2>

               {/* Toggle Tabs */}
               {addresses.length > 0 && (
                   <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
                       <button 
                          onClick={() => setMode('saved')}
                          className={`flex-1 py-2 text-center rounded-lg font-medium transition-colors ${mode === 'saved' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                       >
                          Saved Addresses
                       </button>
                       <button 
                          onClick={() => setMode('new')}
                          className={`flex-1 py-2 text-center rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                       >
                          <Plus size={16} /> Add New Address
                       </button>
                   </div>
               )}
               
               {/* Saved Addresses List */}
               {mode === 'saved' && (
                   <div className="space-y-4">
                       {addresses.map(addr => (
                           <label 
                              key={addr.id} 
                              className={`block p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                           >
                               <div className="flex items-start gap-3">
                                   <div className="mt-1">
                                       <input 
                                          type="radio" 
                                          name="selectedAddress" 
                                          checked={selectedAddressId === addr.id}
                                          onChange={() => setSelectedAddressId(addr.id)}
                                          className="w-4 h-4 text-blue-600"
                                       />
                                   </div>
                                   <div className="flex-1">
                                       <div className="flex justify-between items-start mb-1">
                                           <div className="flex items-center gap-2">
                                               <span className="font-bold text-gray-900">{addr.name}</span>
                                               <span className="bg-white border border-gray-200 text-xs px-2 py-0.5 rounded uppercase font-bold text-gray-500">{addr.type}</span>
                                           </div>
                                            {selectedAddressId === addr.id && <CheckCircle size={18} className="text-blue-600" />}
                                       </div>
                                       <p className="text-gray-600 text-sm mb-1">{addr.address}</p>
                                       <p className="text-gray-500 text-sm">{addr.landmark ? `${addr.landmark}, ` : ''}{addr.city} - {addr.pincode}</p>
                                       <p className="text-gray-500 text-sm mt-1">Phone: {addr.phone}</p>
                                   </div>
                               </div>
                           </label>
                       ))}
                       
                       <button 
                          onClick={handleProceed}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-6"
                       >
                          Deliver Here
                       </button>
                   </div>
               )}

               {/* New Address Form */}
               {mode === 'new' && (
                   <form onSubmit={handleProceed} className="space-y-4">
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                               <User className="absolute left-3 top-3 text-gray-400" size={18} />
                               <input 
                                  type="text" 
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="John Doe"
                                  required 
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                               <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                               <input 
                                  type="email" 
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="john@example.com"
                                  required 
                               />
                            </div>
                         </div>
                      </div>

                      {/* Phone Numbers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                               <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                               <input 
                                  type="tel" 
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="+1 234 567 8900"
                                  required 
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Phone</label>
                            <div className="relative">
                               <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                               <input 
                                  type="tel" 
                                  name="altPhone"
                                  value={formData.altPhone}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="Optional"
                               />
                            </div>
                         </div>
                      </div>

                      {/* Address Line */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                          <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Street address, Apartment, Suite, etc."
                            required
                          ></textarea>
                      </div>

                      {/* City, Pincode, Landmark */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input 
                               type="text" 
                               name="city"
                               value={formData.city}
                               onChange={handleChange}
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                               placeholder="New York"
                               required 
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input 
                               type="text" 
                               name="pincode"
                               value={formData.pincode}
                               onChange={handleChange}
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                               placeholder="10001"
                               required 
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                            <input 
                               type="text" 
                               name="landmark"
                               value={formData.landmark}
                               onChange={handleChange}
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                               placeholder="Near Park"
                            />
                         </div>
                      </div>
                      
                      {/* Address Type */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                          <div className="flex gap-4">
                              <label className={`flex-1 border p-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all ${formData.type === 'Home' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-gray-200 text-gray-600'}`}>
                                 <input type="radio" name="type" value="Home" checked={formData.type === 'Home'} onChange={handleChange} className="hidden" />
                                 <Home size={18} /> Home
                              </label>
                              <label className={`flex-1 border p-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all ${formData.type === 'Work' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-gray-200 text-gray-600'}`}>
                                 <input type="radio" name="type" value="Work" checked={formData.type === 'Work'} onChange={handleChange} className="hidden" />
                                 <MapPin size={18} /> Work
                              </label>
                          </div>
                      </div>

                      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4">
                         Save Address & Continue
                      </button>

                   </form>
               )}

            </div>
         </div>

         {/* Right: Order Summary */}
         <div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
               <h3 className="text-lg font-bold mb-4">Order Summary</h3>
               <div className="space-y-3 mb-6">
                  {cartItems.map(item => (
                     <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                     </div>
                  ))}
               </div>
               
               <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                     <span>Subtotal</span>
                     <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                     <span>Tax (8%)</span>
                     <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 pt-2">
                     <span>Total</span>
                     <span>${total.toFixed(2)}</span>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default Checkout;
