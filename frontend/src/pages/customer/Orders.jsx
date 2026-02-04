import { ShoppingBag } from 'lucide-react';

const Orders = () => {
  // Mock data
  const orders = [
    { id: '#ORD-1234', date: 'Oct 24, 2024', total: '$120.50', status: 'Delivered', items: 3 },
    { id: '#ORD-5678', date: 'Nov 02, 2024', total: '$85.00', status: 'Processing', items: 1 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
             <div>
                <div className="flex items-center gap-3">
                   <h3 className="font-semibold text-lg">{order.id}</h3>
                   <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                      {order.status}
                   </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{order.date} • {order.items} Items</p>
             </div>
             <div className="text-right">
                <p className="font-bold text-lg">{order.total}</p>
                <button className="text-blue-600 text-sm hover:underline mt-1">View Details</button>
             </div>
          </div>
        ))}

        {orders.length === 0 && (
           <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                 Start Shopping
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
