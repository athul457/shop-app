import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, Loader, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        usersCount: 0,
        recentUsers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Only fetch if user is admin
            if (user?.role !== 'admin') {
                setLoading(false);
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                };
                const { data } = await axios.get('/api/users', config);
                setStats({
                    usersCount: data.length,
                    recentUsers: data.slice(0, 5) // Get first 5 users
                });
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
                        <h2 className="text-xl font-bold text-gray-800">{stats.usersCount} Users</h2>
                        <p className="text-gray-500">Manage Accounts</p>
                    </div>
                </Link>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
                    <Link to="/admin/users" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Email</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.role}
                                        </span>
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

export default AdminDashboard;
