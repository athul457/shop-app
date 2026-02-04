import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping logic can be added here
  const tax = subtotal * 0.08; // 8% Tax
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
             {cartItems.length} items
          </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center animate-in fade-in zoom-in-95 duration-300">
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-inner">
               <ShoppingBag size={48} />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
           <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Browse our products and discover great deals!</p>
           <Link to="/dashboard" className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:-translate-y-0.5">
              Start Shopping <ArrowRight size={20} />
           </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
             {cartItems.map((item) => (
                <div key={item.id} className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-md transition-all duration-300">
                   {/* Image */}
                   <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   </div>

                   {/* Details */}
                   <div className="flex-1 min-w-0 w-full">
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{item.name}</h3>
                              <p className="text-sm text-gray-500 font-medium">Sold by: {item.vendor}</p>
                          </div>
                          <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove item"
                          >
                              <Trash2 size={20} />
                          </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                         <span className="font-extrabold text-xl text-gray-900">${item.price.toFixed(2)}</span>
                         
                         {/* Quantity Controls */}
                         <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-200">
                            <button 
                               onClick={() => updateQuantity(item.id, -1)}
                               className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                               disabled={item.quantity <= 1}
                            >
                               <Minus size={16} />
                            </button>
                            <span className="text-base font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                            <button 
                               onClick={() => updateQuantity(item.id, 1)}
                               className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                               <Plus size={16} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
             <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between text-gray-600 text-sm">
                      <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                      <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-gray-600 text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold flex items-center gap-1"><Truck size={14}/> Free</span>
                   </div>
                   <div className="flex justify-between text-gray-600 text-sm">
                      <span>Tax (8%)</span>
                      <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                   </div>
                   
                   <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                       <div className="flex justify-between items-end">
                          <span className="font-bold text-lg text-gray-900">Total</span>
                          <span className="font-extrabold text-2xl text-blue-600">${total.toFixed(2)}</span>
                       </div>
                   </div>
                </div>

                <button 
                   onClick={() => navigate('/dashboard/checkout')}
                   className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95"
                >
                   Checkout Now <ArrowRight size={20} />
                </button>

                <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                        <span>Secure Checkout with 256-bit Encryption</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
