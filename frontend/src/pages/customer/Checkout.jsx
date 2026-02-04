import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAddress } from '../../context/AddressContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, User, Home, ArrowRight, Plus, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems } = useCart();
  const { addresses, addNewAddress } = useAddress();
  const navigate = useNavigate();

  // Mode: 'saved' or 'new'
  const [mode, setMode] = useState('new'); 
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
              <ShieldCheck size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
         {/* Left: Address Selection */}
         <div className="lg:col-span-2">
            
            {/* Toggle Tabs */}
            {addresses.length > 0 && (
                <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8">
                    <button 
                        onClick={() => setMode('saved')}
                        className={`flex-1 py-3 text-center rounded-lg font-bold text-sm transition-all shadow-sm ${mode === 'saved' ? 'bg-white text-blue-600 shadow-md ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                    >
                        Saved Addresses
                    </button>
                    <button 
                        onClick={() => setMode('new')}
                        className={`flex-1 py-3 text-center rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${mode === 'new' ? 'bg-white text-blue-600 shadow-md ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                    >
                        <Plus size={16} /> Add New Address
                    </button>
                </div>
            )}
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                  <MapPin className="text-blue-600" /> Shipping Details
               </h2>

               {/* Saved Addresses List */}
               {mode === 'saved' && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                       {addresses.map(addr => (
                           <div 
                               key={addr.id} 
                               onClick={() => setSelectedAddressId(addr.id)}
                               className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all group ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                           >
                               <div className="flex items-start gap-4">
                                   <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                       {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                   </div>
                                   
                                   <div className="flex-1">
                                       <div className="flex justify-between items-start mb-2">
                                           <div className="flex items-center gap-3">
                                               <span className="font-bold text-lg text-gray-900">{addr.name}</span>
                                               <span className="bg-white border border-gray-200 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
                                                   {addr.type === 'Home' ? <Home size={10} /> : <Briefcase size={10} />} {addr.type}
                                               </span>
                                           </div>
                                            {selectedAddressId === addr.id && <CheckCircle2 size={20} className="text-blue-600" />}
                                       </div>
                                       <p className="text-gray-700 text-sm mb-1 font-medium">{addr.address}</p>
                                       <p className="text-gray-500 text-sm">{addr.landmark ? `${addr.landmark}, ` : ''}{addr.city} - {addr.pincode}</p>
                                       <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                           <Phone size={14} /> <span>{addr.phone}</span>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       ))}
                       
                       <button 
                          onClick={handleProceed}
                          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all mt-6 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                       >
                          Deliver to this Address <ArrowRight size={20} />
                       </button>
                   </div>
               )}

               {/* New Address Form */}
               {mode === 'new' && (
                   <form onSubmit={handleProceed} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative group">
                               <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                               <input 
                                  type="text" 
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                  placeholder="John Doe"
                                  required 
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <div className="relative group">
                               <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                               <input 
                                  type="email" 
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                  placeholder="john@example.com"
                                  required 
                               />
                            </div>
                         </div>
                      </div>

                      {/* Phone Numbers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative group">
                               <Phone className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                               <input 
                                  type="tel" 
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                  placeholder="+1 234 567 8900"
                                  required 
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Alternative Phone <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                            <div className="relative group">
                               <Phone className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                               <input 
                                  type="tel" 
                                  name="altPhone"
                                  value={formData.altPhone}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                  placeholder="+1 234..."
                               />
                            </div>
                         </div>
                      </div>

                      {/* Address Line */}
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Address Line</label>
                          <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                            placeholder="Street address, Apartment, Suite, etc."
                            required
                          ></textarea>
                      </div>

                      {/* City, Pincode, Landmark */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                            <input 
                               type="text" 
                               name="city"
                               value={formData.city}
                               onChange={handleChange}
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                               placeholder="New York"
                               required 
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                            <input 
                               type="text" 
                               name="pincode"
                               value={formData.pincode}
                               onChange={handleChange}
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                               placeholder="10001"
                               required 
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Landmark <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                            <input 
                               type="text" 
                               name="landmark"
                               value={formData.landmark}
                               onChange={handleChange}
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                               placeholder="Near Park"
                            />
                         </div>
                      </div>
                      
                      {/* Address Type */}
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">Address Type</label>
                          <div className="flex gap-4">
                              <label className={`flex-1 border-2 p-4 rounded-xl cursor-pointer flex items-center justify-center gap-3 transition-all ${formData.type === 'Home' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600'}`}>
                                 <input type="radio" name="type" value="Home" checked={formData.type === 'Home'} onChange={handleChange} className="hidden" />
                                 <Home size={20} /> Home
                              </label>
                              <label className={`flex-1 border-2 p-4 rounded-xl cursor-pointer flex items-center justify-center gap-3 transition-all ${formData.type === 'Work' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600'}`}>
                                 <input type="radio" name="type" value="Work" checked={formData.type === 'Work'} onChange={handleChange} className="hidden" />
                                 <Briefcase size={20} /> Work
                              </label>
                          </div>
                      </div>

                      <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                         Save Address & Continue <ArrowRight size={20} />
                      </button>

                   </form>
               )}

            </div>
         </div>

         {/* Right: Order Summary */}
         <div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
               <h3 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h3>
               <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                     <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs overflow-hidden">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                     </div>
                  ))}
               </div>
               
               <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm">
                     <span>Subtotal</span>
                     <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                     <span>Tax (8%)</span>
                     <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                     <span>Shipping</span>
                     <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 mt-2">
                     <span className="font-bold text-lg text-gray-900">Total Pay</span>
                     <span className="font-extrabold text-2xl text-blue-600">${total.toFixed(2)}</span>
                  </div>
               </div>

               <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 py-2 rounded-lg font-medium border border-green-100">
                    <ShieldCheck size={14} /> 100% Secure Checkout
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default Checkout;
