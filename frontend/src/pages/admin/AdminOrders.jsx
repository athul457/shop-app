import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Loader, Truck, CheckSquare } from 'lucide-react';
import { getAllOrders, deliverOrder } from '../../api/order.api';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (error) {
                toast.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleAccept = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            // Move to Processing
            await axios.put(`/api/orders/${id}/status`, { status: 'Processing' }, config);
            
            setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: 'Processing', isPaid: true } : o));
            toast.success('Order Accepted & Forwarded to Vendor');
        } catch (error) {
            toast.error(error.response?.data?.message || "Acceptance failed");
        }
    };

    const handleCancelDecision = async (id, action) => {
        try {
            const config = {
                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            await axios.put(`/api/orders/${id}/cancel`, { action }, config);

            // Optimistic update
            setOrders(orders.map(o => {
                if (o._id === id) {
                    if (action === 'approve') return { ...o, orderStatus: 'Cancelled' };
                    if (action === 'reject') return { ...o, cancelDetails: undefined }; // specific to controller logic
                }
                return o;
            }));
            toast.success(`Cancellation request ${action}ed`);
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleDeliver = async (id) => {
        try {
            await deliverOrder(id);
            setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o));
            toast.success('Order marked as delivered');
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    const [requestModal, setRequestModal] = useState({
        isOpen: false,
        order: null
    });

    const handleRequestUpdate = async (orderId, itemId, status) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            await axios.put(`/api/orders/${orderId}/return-status`, { itemId, status }, config);
            
            // Refresh local state without full reload
            const updatedOrders = orders.map(order => {
                if (order._id === orderId) {
                    const updatedItems = order.orderItems.map(item => {
                        if (item._id === itemId) {
                            return { ...item, returnExchange: { ...item.returnExchange, status } };
                        }
                        return item;
                    });
                    return { ...order, orderItems: updatedItems };
                }
                return order;
            });
            
            setOrders(updatedOrders);
            setRequestModal({ ...requestModal, order: updatedOrders.find(o => o._id === orderId) });
            toast.success(`Request ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('_id'); // _id, name, email, date

    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        
        switch(searchCategory) {
            case '_id':
                return order._id.toLowerCase().includes(term);
            case 'name':
                return order.user?.name?.toLowerCase().includes(term);
            case 'email':
                return order.user?.email?.toLowerCase().includes(term);
            case 'date':
                return new Date(order.createdAt).toLocaleDateString().toLowerCase().includes(term);
            default:
                return true;
        }
    });

    if (loading) return <div className="p-8 text-center"><Loader className="animate-spin inline-block text-blue-600" /></div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

            {/* Filter / Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <select 
                    value={searchCategory} 
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer font-medium"
                >
                    <option value="_id">Order ID</option>
                    <option value="name">User Name</option>
                    <option value="email">Email</option>
                    <option value="date">Date</option>
                </select>
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder={`Search by ${searchCategory === '_id' ? 'Order ID' : searchCategory}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Order ID</th>
                                <th className="p-4 font-semibold text-gray-600">User</th>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600">Total</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => {
                                const hasPendingRequests = order.orderItems?.some(item => item.returnExchange?.status === 'pending');
                                
                                return (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{order._id.substring(0, 8).toUpperCase()}</td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <p className="font-bold text-gray-900">{order.user?.name || 'Unknown'}</p>
                                            <p className="text-gray-500">{order.user?.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold">${order.totalPrice.toFixed(2)}</td>
                                    <td className="p-4">
                                        {hasPendingRequests ? (
                                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase animate-pulse">
                                                <CheckCircle size={12} /> Action Needed
                                             </span>
                                        ) : order.orderStatus === 'Cancelled' ? 
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase"><XCircle size={12} /> Cancelled</span> :
                                            order.orderStatus === 'Delivered' ? 
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase"><CheckCircle size={12} /> Delivered</span> : 
                                            order.orderStatus === 'Processing' ?
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase"><Loader size={12} /> Processing</span> :
                                            order.orderStatus === 'Shipped' ?
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase"><Truck size={12} /> Shipped</span> :
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase"><CheckSquare size={12} /> New Order</span>
                                        }
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        {hasPendingRequests && (
                                            <button 
                                                onClick={() => setRequestModal({ isOpen: true, order })}
                                                className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
                                            >
                                                Review Requests
                                            </button>
                                        )}
                                        
                                        {!order.isPaid && !hasPendingRequests && (
                                            <button 
                                                onClick={() => handleAccept(order._id)} 
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                            >
                                                Accept
                                            </button>
                                        )}

                                        {order.cancelDetails && !order.cancelDetails.isVerified && order.orderStatus !== 'Cancelled' && (
                                            <div className="flex gap-1">
                                                <button onClick={() => handleCancelDecision(order._id, 'approve')} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Approve Cancel</button>
                                                <button onClick={() => handleCancelDecision(order._id, 'reject')} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">Reject</button>
                                            </div>
                                        )}
                                        {/* Accept Button only for Placed Orders */}
                                        {(order.orderStatus === 'Placed' || (!order.orderStatus && !order.isPaid)) && !hasPendingRequests && (
                                            <button 
                                                onClick={() => handleAccept(order._id)} 
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                            >
                                                Accept
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Review Modal */}
            {requestModal.isOpen && requestModal.order && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Process Requests - Order #{requestModal.order._id.substring(0,8)}</h3>
                            <button onClick={() => setRequestModal({ isOpen: false, order: null })} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                            {requestModal.order.orderItems
                                .filter(item => item.returnExchange?.status)
                                .map((item, idx) => (
                                <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex gap-4 mb-3">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-white" />
                                        <div>
                                            <h4 className="font-bold">{item.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                                    {item.returnExchange.type}
                                                </span>
                                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                                    item.returnExchange.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    item.returnExchange.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                    item.returnExchange.status === 'return_initiated' ? 'bg-orange-100 text-orange-700' :
                                                    item.returnExchange.status === 'return_acknowledged' ? 'bg-purple-100 text-purple-700' :
                                                    item.returnExchange.status === 'returned' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {
                                                        item.returnExchange.status === 'returned' ? 'Product Returned' :
                                                        item.returnExchange.status === 'return_acknowledged' ? 'Return Picked Up' :
                                                        item.returnExchange.status.replace('_', ' ')
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-3 rounded border border-gray-200 mb-4 text-sm space-y-2">
                                        <div>
                                            <span className="font-semibold text-gray-700 block text-xs uppercase text-gray-400">Reason</span>
                                            {item.returnExchange.reason.split('|')[0].trim()}
                                        </div>
                                        {item.returnExchange.reason.includes('|') && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <span className="font-semibold text-gray-700 block text-xs uppercase text-gray-400">Customer Comments</span>
                                                <p className="text-gray-600 italic">"{item.returnExchange.reason.split('|')[1].trim()}"</p>
                                            </div>
                                        )}
                                        {item.returnExchange.refundAmount && (
                                            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <span className="font-semibold text-gray-700 block text-xs uppercase text-gray-400">Refund Issued</span>
                                                    <span className="text-xs text-gray-400">{new Date(item.returnExchange.refundedAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className="font-bold text-green-600 text-lg">${item.returnExchange.refundAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {item.returnExchange.status === 'pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                onClick={() => handleRequestUpdate(requestModal.order._id, item._id, 'rejected')}
                                                className="px-3 py-1.5 border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 text-sm"
                                            >
                                                Reject
                                            </button>
                                            <button 
                                                onClick={() => handleRequestUpdate(requestModal.order._id, item._id, 'approved')}
                                                className="px-3 py-1.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 text-sm"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {requestModal.order.orderItems.filter(i => i.returnExchange?.status).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No requests found for this order.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
