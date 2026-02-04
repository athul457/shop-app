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
            // Use 'pay' endpoint to simulate acceptance (marking as paid/confirmed)
            await axios.put(`/api/orders/${id}/pay`, { status: 'COMPLETED' }, config);
            
            setOrders(orders.map(o => o._id === id ? { ...o, isPaid: true, paidAt: new Date().toISOString() } : o));
            toast.success('Order Accepted');
        } catch (error) {
            toast.error(error.response?.data?.message || "Acceptance failed");
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

    if (loading) return <div className="p-8 text-center"><Loader className="animate-spin inline-block text-blue-600" /></div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

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
                            {orders.map((order) => (
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
                                        {order.isDelivered ? 
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase"><CheckCircle size={12} /> Delivered</span> : 
                                            order.isPaid ?
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase"><CheckCircle size={12} /> Accepted</span> :
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase"><XCircle size={12} /> Pending</span>
                                        }
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        {!order.isPaid && (
                                            <button 
                                                onClick={() => handleAccept(order._id)} 
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                            >
                                                Accept
                                            </button>
                                        )}
                                        {order.isPaid && !order.isDelivered && (
                                            <button 
                                                onClick={() => handleDeliver(order._id)} 
                                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-1"
                                            >
                                                <Truck size={14} /> Deliver
                                            </button>
                                        )}
                                        {order.isDelivered && (
                                            <span className="text-gray-400 text-sm font-medium flex items-center gap-1"><CheckCircle size={14} /> Done</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
