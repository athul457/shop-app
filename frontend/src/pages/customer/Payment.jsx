import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { CreditCard, Wallet, Truck, CheckCircle2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOrder } from '../../api/order.api';

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Get address from navigation state
  const { state } = useLocation();
  const shippingAddress = state?.address;

  // Redirect if no address selected
  useEffect(() => {
    if (!shippingAddress) {
        toast.error("Please select a shipping address");
        navigate('/dashboard/checkout');
    }
  }, [shippingAddress, navigate]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item._id || item.id, // Fallback for safety
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                vendor: item.vendor || item.vendorId || 'Store'
            })),
            shippingAddress: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                pincode: shippingAddress.pincode,
                phone: shippingAddress.phone,
                country: 'India'
            },
            paymentMethod,
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: 0,
            totalPrice: total
        };

        await createOrder(orderData);
        toast.success("Order Placed Successfully!");
        
        // Clear cart
        clearCart();
        
        navigate('/dashboard/orders');
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-100 text-green-700 p-2 rounded-lg">
              <Lock size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Secure Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
           
           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
               <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
               <div>
                   <h3 className="font-bold text-blue-900 text-sm">Review Shipping Address</h3>
                   <p className="text-blue-700 text-sm mt-1">{shippingAddress?.address}, {shippingAddress?.city} - {shippingAddress?.pincode}</p>
               </div>
               <button onClick={() => navigate('/dashboard/checkout')} className="ml-auto text-xs font-bold text-blue-600 hover:underline">Change</button>
           </div>

           <h2 className="text-xl font-bold text-gray-900 mt-2">Choose Payment Method</h2>

           {/* Credit Card */}
           <div 
              onClick={() => setPaymentMethod('card')}
              className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
           >
              <div className="flex items-center gap-5">
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                     {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                 </div>
                 <div className="p-3 bg-white rounded-xl border border-gray-100 text-blue-600 shadow-sm">
                    <CreditCard size={28} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">Credit / Debit Card</h3>
                    <p className="text-sm text-gray-500">Secure 128-bit SSL Encrypted payment</p>
                    {paymentMethod === 'card' && (
                        <div className="flex gap-2 mt-2">
                            <span className="h-6 w-10 bg-gray-200 rounded"></span>
                            <span className="h-6 w-10 bg-gray-200 rounded"></span>
                            <span className="h-6 w-10 bg-gray-200 rounded"></span>
                        </div>
                    )}
                 </div>
                 {paymentMethod === 'card' && <CheckCircle2 size={24} className="text-blue-600" />}
              </div>
           </div>

           {/* UPI / Wallet */}
           <div 
              onClick={() => setPaymentMethod('upi')}
              className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
           >
              <div className="flex items-center gap-5">
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                     {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                 </div>
                 <div className="p-3 bg-white rounded-xl border border-gray-100 text-purple-600 shadow-sm">
                    <Wallet size={28} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">UPI / Wallets</h3>
                    <p className="text-sm text-gray-500">Pay directly via Google Pay, PhonePe, Paytm</p>
                 </div>
                 {paymentMethod === 'upi' && <CheckCircle2 size={24} className="text-blue-600" />}
              </div>
           </div>

           {/* COD */}
           <div 
              onClick={() => setPaymentMethod('cod')}
              className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
           >
              <div className="flex items-center gap-5">
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                     {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                 </div>
                 <div className="p-3 bg-white rounded-xl border border-gray-100 text-green-600 shadow-sm">
                    <Truck size={28} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">Cash on Delivery</h3>
                    <p className="text-sm text-gray-500">Pay physically when you receive the order</p>
                 </div>
                 {paymentMethod === 'cod' && <CheckCircle2 size={24} className="text-blue-600" />}
              </div>
           </div>

        </div>

        {/* Summary */}
        <div>
           <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6">Payment Summary</h3>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl mb-6">
                 <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">Free</span>
                 </div>
                 <div className="flex justify-between pt-3 border-t border-gray-200 mt-2">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-extrabold text-2xl text-blue-600">${total.toFixed(2)}</span>
                 </div>
              </div>

              <button 
                 onClick={handlePlaceOrder}
                 disabled={isProcessing}
                 className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95"
              >
                 {isProcessing ? (
                     <>Processing...</>
                 ) : (
                     <>
                        <Lock size={18} /> Pay Securely
                     </>
                 )}
              </button>
              
              <div className="mt-6 flex flex-col items-center gap-2">
                  <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> SSL Encrypted Transaction
                  </p>
                  <div className="flex gap-2 opacity-50 grayscale">
                      {/* Placeholder generic card icons */}
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
