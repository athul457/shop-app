import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const VendorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);

    useEffect(() => {
        const requests = JSON.parse(localStorage.getItem('mockVendorRequests') || '[]');
        const myRequest = requests.find(r => r.user.email === user?.email);
        
        if (!myRequest || myRequest.status !== 'approved') {
            navigate('/dashboard');
        } else {
            setRequest(myRequest);
        }
    }, [user, navigate]);

    if (!request) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{request.storeName} Dashboard</h1>
                <p className="text-gray-500">Welcome back, manager</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Sales</p>
                        <h2 className="text-2xl font-bold text-gray-900">$12,450</h2>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Active Orders</p>
                        <h2 className="text-2xl font-bold text-gray-900">45</h2>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <ShoppingBag size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Products</p>
                        <h2 className="text-2xl font-bold text-gray-900">128</h2>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                        <Package size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Views</p>
                        <h2 className="text-2xl font-bold text-gray-900">1.2k</h2>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Store Management</h2>
                <p className="text-gray-500 mb-6">Manage your products, orders, and store settings from here.</p>
                <div className="flex justify-center gap-4">
                    <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                        Add New Product
                    </button>
                    <button className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                        View Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
