import { ShoppingBag, Loader, Package, ChevronRight, Truck, CheckCircle2, AlertCircle, Clock, CalendarDays, DollarSign, ArrowRight } from 'lucide-react';
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
              // Sort orders by date (newest first) locally if not sorted by API
              const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              setOrders(sortedData);
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
  const [returnComments, setReturnComments] = useState(''); // Correct location
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReturnRequest = async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      try {
          const token = localStorage.getItem('token'); 
          const response = await fetch(`/api/orders/${returnModal.orderId}/return`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
             body: JSON.stringify({
                 itemId: returnModal.itemId,
                 type: returnType,
                 reason: returnComments ? `${returnReason} | ${returnComments}` : returnReason
             })
          });

          const data = await response.json();

          if (response.ok) {
              toast.success('Request submitted successfully');
              setReturnModal({ ...returnModal, isOpen: false });
              setReturnReason('');
              setReturnType('return');
              
              const ordersData = await getMyOrders();
              setOrders(ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
              
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

  /* CANCEL MODAL STATE */
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDescription, setCancelDescription] = useState('');



  const handleCancelSubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
          const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
          await fetch(`/api/orders/${cancelModal.orderId}/cancel`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ action: 'request', reason: cancelReason, description: cancelDescription })
          });
          
          toast.success("Cancellation requested");
          setCancelModal({ isOpen: false, orderId: null });
          window.location.reload(); // Refresh to see status change
      } catch (error) {
          toast.error("Failed to request cancellation");
      } finally {
          setIsSubmitting(false);
      }
  };

  const confirmHandover = async (orderId, itemId) => {
      try {
          const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
          await fetch(`/api/orders/${orderId}/return-status`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ itemId, status: 'return_acknowledged' })
          });
          
          toast.success("Return Pickup Confirmed");
          // Refresh orders
          const data = await getMyOrders();
          setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          
          if (selectedOrder) {
              const updated = data.find(o => o._id === selectedOrder._id);
              if (updated) setSelectedOrder(updated);
          }
      } catch (error) {
          toast.error("Confirmation failed");
      }
  };

  const openReturnModal = (orderId, item) => {
      if (item.returnExchange?.status && item.returnExchange.status !== 'none') {
          toast.error("Request already active for this item");
          return;
      }
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
          <div className="flex flex-col justify-center items-center h-[50vh] text-blue-600">
              <Loader className="animate-spin mb-4" size={48} />
              <p className="font-medium animate-pulse">Loading your orders...</p>
          </div>
      );
  }

  // STATUS HELPERS
  const getStatusColor = (status) => {
      switch (status) {
          case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
          case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
          case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
          case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
          case 'Out for Delivery': return 'bg-orange-50 text-orange-700 border-orange-200';
          case 'Returned': return 'bg-gray-100 text-gray-700 border-gray-200';
          default: return 'bg-amber-50 text-amber-700 border-amber-200';
      }
  };

  const getStatusIcon = (status) => {
      switch (status) {
          case 'Delivered': return <CheckCircle2 size={16} />;
          case 'Shipped': return <Truck size={16} />;
          case 'Processing': return <Loader size={16} />;
          case 'Cancelled': return <AlertCircle size={16} />;
          case 'Returned': return <CheckCircle2 size={16} />;
          default: return <Clock size={16} />;
      }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track your recent purchases</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            Total Orders: {orders.length}
        </div>
      </div>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
             
             {/* Card Header */}
             <div className="bg-gray-50/50 p-5 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Package size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Order ID</p>
                        <p className="font-bold text-gray-900 font-mono">#{order._id.substring(0, 8).toUpperCase()}</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                    <div>
                         <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1"><CalendarDays size={12} /> Date Placed</p>
                         <p className="font-semibold text-gray-900 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                         <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1"><DollarSign size={12} /> Total Amount</p>
                         <p className="font-bold text-gray-900 text-sm">${order.totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border flex items-center gap-2 ${getStatusColor(order.orderStatus || 'Placed')}`}>
                    {getStatusIcon(order.orderStatus || 'Placed')}
                    {order.orderStatus || 'Placed'}
                </div>
             </div>

             {/* Card Body */}
             <div className="p-5 sm:p-6">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex-1 w-full">
                        <div className="flex -space-x-4 overflow-hidden py-2 pl-1">
                            {order.orderItems.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="relative w-16 h-16 rounded-xl border-2 border-white shadow-md bg-gray-100 flex-shrink-0 z-0 hover:z-10 hover:scale-110 transition-transform cursor-pointer" title={item.name}>
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                </div>
                            ))}
                            {order.orderItems.length > 4 && (
                                <div className="w-16 h-16 rounded-xl border-2 border-white shadow-md bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 z-0">
                                    +{order.orderItems.length - 4}
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            {order.orderItems[0].name} {order.orderItems.length > 1 && <span className="text-gray-400 font-normal">+ {order.orderItems.length - 1} more items</span>}
                        </p>
                    </div>

                    <button 
                        onClick={() => setSelectedOrder(order)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600 transition-all shadow-sm group"
                    >
                        View Order Details <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
             </div>
          </div>
        ))}

        {orders.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-inner">
                  <ShoppingBag size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders placed yet</h3>
              <p className="text-gray-500 max-w-md mb-8">It looks like you haven't bought anything from us yet. Browse our products and find something you love!</p>
              <Link 
                to="/dashboard" 
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                 Start Shopping <ArrowRight size={20} />
              </Link>
           </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
            <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-start sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedOrder.orderStatus || 'Placed')}`}>
                                {selectedOrder.orderStatus || 'Placed'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">ID: #{selectedOrder._id}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-8 max-h-[75vh] overflow-y-auto bg-gray-50/30">
                    {/* Progress Tracker (Simplified Visual) */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between relative">
                            {/* Line */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
                            
                            {/* Steps */}
                            <div className={`flex flex-col items-center gap-2 bg-white px-2 ${selectedOrder.createdAt ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${selectedOrder.createdAt ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-gray-300'}`}>
                                    <Clock size={14} />
                                </div>
                                <span className="text-xs font-bold">Placed</span>
                            </div>
                            
                            <div className={`flex flex-col items-center gap-2 bg-white px-2 ${selectedOrder.isPaid ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${selectedOrder.isPaid ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-gray-300'}`}>
                                    <DollarSign size={14} />
                                </div>
                                <span className="text-xs font-bold">Paid</span>
                            </div>

                            <div className={`flex flex-col items-center gap-2 bg-white px-2 ${selectedOrder.isDelivered ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${selectedOrder.isDelivered ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-white border-gray-300'}`}>
                                    <CheckCircle2 size={14} />
                                </div>
                                <span className="text-xs font-bold">Delivered</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Shipping Info */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                <Truck size={16} className="text-blue-600" /> Shipping Info
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-semibold text-gray-900">{selectedOrder.shippingAddress.address}</p>
                                <p>{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</p>
                                <p>{selectedOrder.shippingAddress.country}</p>
                                <p className="pt-2 text-xs font-medium text-gray-400">Phone Contact</p>
                                <p className="font-mono text-gray-800">{selectedOrder.shippingAddress.phone}</p>
                            </div>
                        </div>

                         {/* Payment Info */}
                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                <DollarSign size={16} className="text-green-600" /> Payment Info
                            </h3>
                            <div className="text-sm text-gray-600 space-y-3">
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span>Method</span>
                                    <span className="font-bold uppercase">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className={`font-bold px-2 py-0.5 rounded text-xs uppercase ${selectedOrder.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedOrder.isPaid ? 'Paid' : 'Pending'}</span>
                                </div>
                                {selectedOrder.paidAt && (
                                     <div className="flex justify-between text-xs text-gray-400">
                                        <span>Paid on</span>
                                        <span>{new Date(selectedOrder.paidAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                         {/* Order Summary */}
                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                <Package size={16} className="text-purple-600" /> Order Summary
                            </h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex justify-between">
                                    <span>Items Total</span>
                                    <span className="font-medium">${selectedOrder.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-100 mt-2">
                                    <span className="font-bold text-gray-900 text-base">Grand Total</span>
                                    <span className="font-bold text-blue-600 text-lg">${selectedOrder.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">Order Items ({selectedOrder.orderItems.length})</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {selectedOrder.orderItems.map((item, idx) => (
                                <div key={idx} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-gray-50 transition-colors">
                                    
                                    <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-700">Qty: {item.quantity}</span>
                                            <span>x</span>
                                            <span className="font-semibold text-gray-900">${item.price}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                        <span className="font-bold text-xl text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        
                                        {/* Return/Exchange Action */}
                                        {(selectedOrder.isDelivered || selectedOrder.orderStatus === 'Returned') && (
                                           <div>
                                              {item.returnExchange?.status && item.returnExchange.status !== 'none' ? (
                                                  <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border inline-flex items-center gap-1 ${
                                                     item.returnExchange.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                     item.returnExchange.status === 'return_initiated' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                     item.returnExchange.status === 'return_acknowledged' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                     item.returnExchange.status === 'returned' ? 'bg-green-50 text-green-700 border-green-200' :
                                                     item.returnExchange.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                     'bg-orange-50 text-orange-700 border-orange-200'
                                                  }`}>
                                                      {item.returnExchange.status === 'returned' && <CheckCircle2 size={12}/>}
                                                      {item.returnExchange.status === 'rejected' && <AlertCircle size={12}/>}
                                                      {
                                                          item.returnExchange.status === 'returned' ? 'Product Returned' :
                                                          item.returnExchange.status === 'return_acknowledged' ? 'Return Picked Up' :
                                                          item.returnExchange.status.replace('_', ' ')
                                                      }
                                                  </span>
                                              ) : (
                                                  <button 
                                                     onClick={() => openReturnModal(selectedOrder._id, item)}
                                                     className="text-xs font-bold text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-lg transition-all border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow active:scale-95"
                                                  >
                                                     Request Return
                                                  </button>
                                              )}
                                            {/* Action Buttons & Details */}
                                            {item.returnExchange?.status === 'return_initiated' && (
                                                <button 
                                                    onClick={() => confirmHandover(selectedOrder._id, item._id)}
                                                    className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                                >
                                                    Confirm Handover
                                                </button>
                                            )}

                                            {item.returnExchange?.status === 'returned' && item.returnExchange.refundAmount && (
                                                <div className="mt-2 text-right">
                                                    <p className="text-xs text-gray-500">Refund Processed</p>
                                                    <p className="font-bold text-green-600">${item.returnExchange.refundAmount.toFixed(2)}</p>
                                                    <p className="text-[10px] text-gray-400">{new Date(item.returnExchange.refundedAt).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                         </div>
                                      )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    {(selectedOrder.orderStatus === 'Placed' || selectedOrder.orderStatus === 'Processing') && (
                        <button 
                            onClick={() => { setCancelModal({ isOpen: true, orderId: selectedOrder._id }); setSelectedOrder(null); }}
                            className="px-4 py-2 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                            Cancel Order
                        </button>
                    )}
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returnModal.isOpen && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100">
               <div className="text-center mb-6">
                   <h3 className="text-2xl font-extrabold text-gray-900">Request Action</h3>
                   <p className="text-gray-500 text-sm mt-1">Submit a return or exchange request</p>
               </div>
               
               <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                     <img src={returnModal.itemImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                      <p className="font-bold text-gray-900 text-sm line-clamp-2">{returnModal.itemName}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">Selected Item</p>
                  </div>
               </div>

               <form onSubmit={handleReturnRequest} className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-3">I want to...</label>
                     <div className="grid grid-cols-3 gap-3">
                        {['return', 'exchange', 'cancel'].map((type) => (
                           <button
                              key={type}
                              type="button"
                              onClick={() => setReturnType(type)}
                              className={`px-4 py-3 text-sm font-bold rounded-xl border transition-all ${
                                 returnType === type 
                                 ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' 
                                 : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                              }`}
                           >
                              <span className="capitalize">{type}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Reason (Required)</label>
                     <select 
                        required
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm outline-none transition-all mb-4"
                     >
                        <option value="">Select a reason</option>
                        <option value="Damaged or defective product">Damaged or defective product</option>
                        <option value="Wrong item delivered">Wrong item delivered</option>
                        <option value="Size or fit issues">Size or fit issues</option>
                        <option value="Product not as described">Product not as described</option>
                        <option value="Missing parts or accessories">Missing parts or accessories</option>
                        <option value="Unsatisfactory quality">Unsatisfactory quality</option>
                        <option value="Change of mind">Change of mind</option>
                     </select>
                     
                     <label className="block text-sm font-bold text-gray-700 mb-2">Additional Comments</label>
                     <textarea 
                        value={returnComments}
                        onChange={(e) => setReturnComments(e.target.value)}
                        placeholder="Please provide any additional details..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 min-h-[100px] text-sm resize-none outline-none transition-all placeholder:text-gray-400"
                     />
                  </div>

                  <div className="flex gap-4 pt-2">
                     <button 
                        type="button" 
                        onClick={() => setReturnModal({ ...returnModal, isOpen: false })}
                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                     >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
      {/* Cancel Order Modal */}
      {cancelModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
             <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-extrabold text-gray-900 text-red-600">Cancel Order?</h3>
                    <p className="text-gray-500 text-sm mt-1">Please tell us why you want to cancel.</p>
                </div>
                <form onSubmit={handleCancelSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Reason</label>
                        <select 
                            required 
                            className="w-full px-4 py-2 border rounded-xl"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            <option value="Changed my mind">Changed my mind</option>
                            <option value="Found better price">Found better price</option>
                            <option value="Ordered by mistake">Ordered by mistake</option>
                            <option value="Other">Other</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea 
                            className="w-full px-4 py-2 border rounded-xl"
                            value={cancelDescription}
                            onChange={(e) => setCancelDescription(e.target.value)}
                        />
                     </div>
                     <div className="flex gap-4">
                        <button type="button" onClick={() => setCancelModal({ isOpen: false, orderId: null })} className="flex-1 px-4 py-2 border rounded-xl font-bold">Close</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Processing...' : 'Confirm Cancel'}
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
