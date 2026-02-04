import { ShoppingBag, Loader, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/order.api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
      const fetchOrders = async () => {
          try {
              const data = await getMyOrders();
              setOrders(data);
          } catch (error) {
              toast.error("Failed to load orders");
          } finally {
              setLoading(false);
          }
      };

      fetchOrders();
  }, []);

  if (loading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-blue-600" size={40} />
          </div>
      );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
             <div>
                <div className="flex items-center gap-3">
                   <h3 className="font-semibold text-lg text-gray-700">#{order._id.substring(0, 8).toUpperCase()}</h3>
                   <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase ${
                      order.isDelivered ? 'bg-green-100 text-green-700' : 
                      order.isPaid ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                      {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Processing'}
                   </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} Items
                    {/* List first item name as preview */}
                    {order.orderItems.length > 0 && <span className="block text-gray-400 text-xs mt-1">{order.orderItems[0].name} {order.orderItems.length > 1 && `+ ${order.orderItems.length - 1} more`}</span>}
                </p>
             </div>
             <div className="text-right">
                <p className="font-bold text-lg">${order.totalPrice.toFixed(2)}</p>
                <button 
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 text-sm hover:underline mt-1 inline-block font-medium"
                >
                    View Details
                </button>
             </div>
          </div>
        ))}

        {orders.length === 0 && (
           <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
              <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">
                 Start Shopping
              </Link>
           </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in relative">
                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-opacity-95 backdrop-blur">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-500">ID: #{selectedOrder._id}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <Package size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Delivery Status */}
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${selectedOrder.isDelivered ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        <Package size={24} />
                        <div>
                            <p className="font-bold">{selectedOrder.isDelivered ? 'Delivered' : 'Processing'}</p>
                            <p className="text-sm opacity-80">{selectedOrder.isDelivered ? `Delivered on ${new Date(selectedOrder.deliveredAt).toLocaleDateString()}` : 'Your order is being processed.'}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <h3 className="font-bold text-gray-900 mb-3">Items</h3>
                    <div className="space-y-3 mb-6">
                        {selectedOrder.orderItems.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-3 border border-gray-100 rounded-lg">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-100" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                                </div>
                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shipping */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Shipping Address</h3>
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                                <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.address}</p>
                                <p>{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</p>
                                <p>{selectedOrder.shippingAddress.country}</p>
                                <p className="mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Payment Info</h3>
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                                <p className="flex justify-between"><span>Method:</span> <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span></p>
                                <p className="flex justify-between mt-1"><span>Status:</span> <span className={`font-bold ${selectedOrder.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>{selectedOrder.isPaid ? 'Paid' : 'Pending'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">${selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
