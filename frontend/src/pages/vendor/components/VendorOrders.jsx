// import { useState } from 'react';
// import { ShoppingBag, AlertCircle } from 'lucide-react';

// const VendorOrders = ({ orders, stats, onDeliverOrder }) => {
//     const [orderFilter, setOrderFilter] = useState('all');

//     const displayedOrders = orderFilter === 'pending' 
//         ? orders.filter(o => !o.isDelivered) 
//         : orders;

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
            
//             {/* Order Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-gray-500 font-medium text-sm">Total Orders</p>
//                             <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</h3>
//                         </div>
//                         <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><ShoppingBag size={24} /></div>
//                     </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-gray-500 font-medium text-sm">Pending Delivery</p>
//                             <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</h3>
//                         </div>
//                         <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><AlertCircle size={24} /></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Orders Table */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                 {/* Filter Tabs */}
//                 <div className="p-4 border-b border-gray-100 flex gap-2">
//                     <button 
//                         onClick={() => setOrderFilter('all')}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${orderFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//                     >
//                         All Orders
//                     </button>
//                     <button 
//                         onClick={() => setOrderFilter('pending')}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${orderFilter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//                     >
//                         Pending
//                     </button>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="bg-gray-50/50">
//                             <tr>
//                                 <th className="px-6 py-4 text-sm font-semibold text-gray-500">Order ID</th>
//                                 <th className="px-6 py-4 text-sm font-semibold text-gray-500">Customer</th>
//                                 <th className="px-6 py-4 text-sm font-semibold text-gray-500">Details</th>
//                                 <th className="px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
//                                 <th className="px-6 py-4 text-sm font-semibold text-gray-500">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {displayedOrders.length === 0 ? (
//                                     <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No orders found.</td></tr>
//                             ) : (
//                                 displayedOrders.map(order => (
//                                     <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
//                                             <td className="px-6 py-4 text-sm font-mono text-gray-600">#{order._id.substring(0, 8)}</td>
//                                             <td className="px-6 py-4 text-sm font-medium">
//                                                 <div className="text-gray-900">{order.user?.name || "Guest"}</div>
//                                                 <div className="text-xs text-gray-500">{order.user?.email}</div>
//                                             </td>
//                                             <td className="px-6 py-4 text-sm text-gray-600">
//                                             {order.orderItems.map((item, idx) => (
//                                                 <div key={idx} className="flex gap-2">
//                                                     <span className="font-bold">{item.qty}x</span> {item.name}
//                                                 </div>
//                                             ))}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 {order.isDelivered ? (
//                                                 <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Delivered</span>
//                                                 ) : (
//                                                 <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>
//                                                 )}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                             {!order.isDelivered && (
//                                                 <button onClick={() => onDeliverOrder(order._id)} className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
//                                                     Mark Delivered
//                                                 </button>
//                                             )}
//                                             </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VendorOrders;


import { useState } from 'react';
import { ShoppingBag, AlertCircle } from 'lucide-react';

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
                                                <div key={idx} className="flex gap-2">
                                                    <span className="font-bold">{item.qty}x</span> {item.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isDelivered ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    Delivered
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!order.isDelivered && (
                                                <button
                                                    onClick={() => onDeliverOrder(order._id)}
                                                    className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                                                >
                                                    Mark Delivered
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
