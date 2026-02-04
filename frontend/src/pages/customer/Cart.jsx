import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
           <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
           <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
           <Link to="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Start Shopping
           </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
             {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 items-center">
                   {/* Image */}
                   <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>

                   {/* Details */}
                   <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">Sold by: {item.vendor}</p>
                      <div className="flex items-center gap-4">
                         <span className="font-bold text-blue-600">${item.price.toFixed(2)}</span>
                         
                         {/* Quantity Controls */}
                         <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                            <button 
                               onClick={() => updateQuantity(item.id, -1)}
                               className="p-1 hover:bg-gray-200 transition-colors rounded-l-lg"
                               disabled={item.quantity <= 1}
                            >
                               <Minus size={16} className={item.quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
                            </button>
                            <span className="mx-2 text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button 
                               onClick={() => updateQuantity(item.id, 1)}
                               className="p-1 hover:bg-gray-200 transition-colors rounded-r-lg"
                            >
                               <Plus size={16} className="text-gray-600" />
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Remove item"
                   >
                      <Trash2 size={20} />
                   </button>
                </div>
             ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                   </div>
                   <div className="flex justify-between text-gray-600">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                   </div>
                   <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-900">Total</span>
                      <span className="font-bold text-xl text-blue-600">${total.toFixed(2)}</span>
                   </div>
                </div>

                <button 
                   onClick={() => navigate('/dashboard/checkout')}
                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                   Proceed to Checkout <ArrowRight size={20} />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
