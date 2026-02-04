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

  /* State for Return/Exchange Modal */
  const [returnModal, setReturnModal] = useState({
      isOpen: false,
      orderId: null,
      itemId: null,
      itemImage: null,
      itemName: null
  });
  const [returnType, setReturnType] = useState('return');
  const [returnReason, setReturnReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReturnRequest = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
          const token = localStorage.getItem('token'); // Assuming token is here as per previous context
          const response = await fetch(`/api/orders/${returnModal.orderId}/return`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
             body: JSON.stringify({
                 itemId: returnModal.itemId,
                 type: returnType,
                 reason: returnReason
             })
          });

          const data = await response.json();

          if (response.ok) {
              toast.success('Request submitted successfully');
              setReturnModal({ ...returnModal, isOpen: false });
              setReturnReason('');
              setReturnType('return');
              
              // Refresh orders
              const ordersData = await getMyOrders();
              setOrders(ordersData);
              
              // Update selected order view if open
              const updatedOrder = ordersData.find(o => o._id === selectedOrder._id);
              if (updatedOrder) setSelectedOrder(updatedOrder);

          } else {
              toast.error(data.message || 'Request failed');
          }
      } catch (error) {
          toast.error('Something went wrong');
      } finally {
          setIsSubmitting(false);
      }
  };

  const openReturnModal = (orderId, item) => {
      setReturnModal({
          isOpen: true,
          orderId,
          itemId: item._id,
          itemImage: item.image,
          itemName: item.name
      });
  };

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
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-opacity-95 backdrop-blur z-10">
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
                    <div className="space-y-4 mb-6">
                        {selectedOrder.orderItems.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                <div className="flex gap-4 flex-1">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-white border border-gray-200" />
                                    <div>
                                        <h4 className="font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} × ${item.price}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col justify-between items-end">
                                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    
                                    {/* Return/Exchange Logic */}
                                    {selectedOrder.isDelivered && (
                                       <div className="mt-2">
                                          {item.returnExchange?.status && item.returnExchange.status !== 'none' ? (
                                              <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${
                                                 item.returnExchange.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                 item.returnExchange.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                 'bg-orange-100 text-orange-700'
                                              }`}>
                                                  {item.returnExchange.type}: {item.returnExchange.status}
                                              </span>
                                          ) : (
                                              <button 
                                                 onClick={() => openReturnModal(selectedOrder._id, item)}
                                                 className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200"
                                              >
                                                 Return / Exchange
                                              </button>
                                          )}
                                       </div>
                                    )}
                                </div>
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

      {/* Return Request Modal */}
      {returnModal.isOpen && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
               <h3 className="text-xl font-bold text-gray-900 mb-4">Request Action</h3>
               
               <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img src={returnModal.itemImage} alt="" className="w-12 h-12 rounded bg-white object-cover" />
                  <p className="font-medium text-sm line-clamp-2">{returnModal.itemName}</p>
               </div>

               <form onSubmit={handleReturnRequest} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
                     <div className="grid grid-cols-3 gap-2">
                        {['return', 'exchange', 'cancel'].map((type) => (
                           <button
                              key={type}
                              type="button"
                              onClick={() => setReturnType(type)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg border capitalize transition-all ${
                                 returnType === type 
                                 ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200' 
                                 : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                              }`}
                           >
                              {type}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Required)</label>
                     <textarea 
                        required
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        placeholder="Please explain why you want to return or exchange..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] text-sm"
                     />
                  </div>

                  <div className="flex gap-3 pt-2">
                     <button 
                        type="button" 
                        onClick={() => setReturnModal({ ...returnModal, isOpen: false })}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                     >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Orders;
