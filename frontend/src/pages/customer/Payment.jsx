import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { CreditCard, Wallet, Truck, CheckCircle } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Payment Method</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           
           {/* Credit Card */}
           <label className={`block border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-4">
                 <input 
                    type="radio" 
                    name="payment" 
                    value="card" 
                    checked={paymentMethod === 'card'} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                 />
                 <div className="p-2 bg-white rounded-lg border border-gray-100 text-blue-600">
                    <CreditCard size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">Credit / Debit Card</h3>
                    <p className="text-sm text-gray-500">Pay securely with Visa, Mastercard</p>
                 </div>
              </div>
           </label>

           {/* UPI / Wallet */}
           <label className={`block border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-4">
                 <input 
                    type="radio" 
                    name="payment" 
                    value="upi" 
                    checked={paymentMethod === 'upi'} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                 />
                 <div className="p-2 bg-white rounded-lg border border-gray-100 text-purple-600">
                    <Wallet size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">UPI / Wallets</h3>
                    <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                 </div>
              </div>
           </label>

           {/* COD */}
           <label className={`block border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-4">
                 <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                 />
                 <div className="p-2 bg-white rounded-lg border border-gray-100 text-green-600">
                    <Truck size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                    <p className="text-sm text-gray-500">Pay when you receive the order</p>
                 </div>
              </div>
           </label>

        </div>

        {/* Summary */}
        <div>
           <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Payment Details</h3>
              
              <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
                 <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                 </div>
              </div>

              <div className="flex justify-between font-bold text-xl text-gray-900 mb-6">
                 <span>Total Payable</span>
                 <span>${total.toFixed(2)}</span>
              </div>

              <button 
                 onClick={handlePlaceOrder}
                 disabled={isProcessing}
                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                 {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                 <CheckCircle size={12} className="text-green-500" /> Secure Encryption
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
