
import { useState } from 'react';
import { ShoppingBag, AlertCircle, Package, Truck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VendorOrders = ({
    orders = [],
    stats = {
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0
    },
    onDeliverOrder
}) => {
    const [orderFilter, setOrderFilter] = useState('all');

    const updateStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } };
            await axios.put(`/api/orders/${id}/status`, { status }, config);
            toast.success(`Order Updated: ${status}`);
            window.location.reload(); 
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const updateItemStatus = async (orderId, itemId, status) => {
        try {
            const config = { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } };
            await axios.put(`/api/orders/${orderId}/return-status`, { itemId, status }, config);
            toast.success(`Return Status: ${status}`);
            window.location.reload();
        } catch (error) {
            toast.error("Item Update failed");
        }
    };

    const displayedOrders =
        orderFilter === 'pending'
            ? orders.filter(o => !o.isDelivered)
            : orders;

    const totalOrders = stats.totalOrders ?? orders.length;
    const pendingOrders = stats.pendingOrders ?? orders.filter(o => !o.isDelivered).length;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Total Orders</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                {totalOrders}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Pending Delivery</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                {pendingOrders}
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Filter Tabs */}
                <div className="p-4 border-b border-gray-100 flex gap-2">
                    <button
                        onClick={() => setOrderFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            orderFilter === 'all'
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All Orders
                    </button>
                    <button
                        onClick={() => setOrderFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            orderFilter === 'pending'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Pending
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Order ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Customer</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Details</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                displayedOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                            #{order._id.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="text-gray-900">{order.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex gap-2 items-center justify-between mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div>
                                                        <span className="font-bold">{item.qty}x</span> {item.name}
                                                    </div>
                                                    
                                                    {/* Return Workflow Actions */}
                                                    {item.returnExchange?.status && item.returnExchange.status !== 'none' && (
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                                                item.returnExchange.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                                item.returnExchange.status === 'return_initiated' ? 'bg-yellow-100 text-yellow-700' :
                                                                item.returnExchange.status === 'return_acknowledged' ? 'bg-purple-100 text-purple-700' :
                                                                item.returnExchange.status === 'returned' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-200 text-gray-700'
                                                            }`}>
                                                                {item.returnExchange.status.replace('_', ' ')}
                                                            </span>

                                                            {item.returnExchange.status === 'approved' && (
                                                                <button 
                                                                    onClick={() => updateItemStatus(order._id, item._id, 'return_initiated')}
                                                                    className="px-2 py-1 bg-white border border-blue-200 text-blue-600 text-[10px] font-bold rounded hover:bg-blue-50"
                                                                >
                                                                    Initiate Return
                                                                </button>
                                                            )}
                                                            {item.returnExchange.status === 'return_acknowledged' && (
                                                                <button 
                                                                    onClick={() => updateItemStatus(order._id, item._id, 'returned')}
                                                                    className="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 shadow-sm"
                                                                >
                                                                    Mark Returned
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                order.orderStatus === 'Packed' ? 'bg-indigo-100 text-indigo-700' :
                                                order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                                                order.orderStatus === 'Out for Delivery' ? 'bg-orange-100 text-orange-700' :
                                                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.orderStatus || 'Placed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {/* Vendor Workflow Actions */}
                                            {order.orderStatus === 'Processing' && (
                                                <button onClick={() => updateStatus(order._id, 'Packed')} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                                                    <Package size={14}/> Pack
                                                </button>
                                            )}
                                            {order.orderStatus === 'Packed' && (
                                                <button onClick={() => updateStatus(order._id, 'Shipped')} className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 flex items-center gap-1">
                                                    <Truck size={14}/> Ship
                                                </button>
                                            )}
                                            {order.orderStatus === 'Shipped' && (
                                                <button onClick={() => updateStatus(order._id, 'Out for Delivery')} className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 flex items-center gap-1">
                                                    <Truck size={14}/> Out Delivery
                                                </button>
                                            )}
                                            {order.orderStatus === 'Out for Delivery' && (
                                                <button onClick={() => updateStatus(order._id, 'Delivered')} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 flex items-center gap-1">
                                                    <CheckCircle2 size={14}/> Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorOrders;

