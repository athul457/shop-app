import { useState } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    // Mock Data
    const [orders, setOrders] = useState([
        { _id: '101', user: 'John Doe', date: '2023-10-25', total: 299.99, isPaid: true, isDelivered: false },
        { _id: '102', user: 'Jane Smith', date: '2023-10-24', total: 59.99, isPaid: true, isDelivered: true },
        { _id: '103', user: 'Bob Johnson', date: '2023-10-26', total: 120.50, isPaid: false, isDelivered: false },
    ]);

    const markAsDelivered = (id) => {
        setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true } : o));
        toast.success('Order marked as delivered');
    };

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
                                <th className="p-4 font-semibold text-gray-600">Paid</th>
                                <th className="p-4 font-semibold text-gray-600">Delivered</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{order._id}</td>
                                    <td className="p-4">{order.user}</td>
                                    <td className="p-4 text-gray-500">{order.date}</td>
                                    <td className="p-4 font-bold">${order.total}</td>
                                    <td className="p-4">
                                        {order.isPaid ? 
                                            <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle size={14} /> Paid</span> : 
                                            <span className="flex items-center gap-1 text-red-500 font-medium"><XCircle size={14} /> Pending</span>
                                        }
                                    </td>
                                    <td className="p-4">
                                        {order.isDelivered ? 
                                            <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle size={14} /> Delivered</span> : 
                                            <span className="flex items-center gap-1 text-yellow-600 font-medium"><XCircle size={14} /> Pending</span>
                                        }
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="View Details"><Eye size={16} /></button>
                                        {!order.isDelivered && (
                                            <button onClick={() => markAsDelivered(order._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Mark as Delivered">
                                                <CheckCircle size={16} />
                                            </button>
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
