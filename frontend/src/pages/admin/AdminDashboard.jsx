import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/products" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4 group">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ShoppingBag size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Products</h2>
                        <p className="text-gray-500">Manage Inventory</p>
                    </div>
                </Link>

                <Link to="/admin/orders" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4 group">
                    <div className="p-4 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Package size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Orders</h2>
                        <p className="text-gray-500">Track Shipments</p>
                    </div>
                </Link>

                <Link to="/admin/users" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4 group">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Users size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Users</h2>
                        <p className="text-gray-500">Manage Accounts</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
