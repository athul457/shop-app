import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, ShoppingBag, TrendingUp, Users, Plus, Pencil, Trash2, Eye, EyeOff, AlertCircle, Search, X, CheckCircle2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/product.api';
import { getAllOrders, deliverOrder } from '../../api/order.api';
import toast from 'react-hot-toast';
import VendorForm from './venderForm';

const VendorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [products, setProducts] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showProducts, setShowProducts] = useState(false); // New state for visibility
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        image: ''
    });

    // Stats State
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 154, // Mock
        todaySales: 1250, // Mock
        monthlyRevenue: 45200, // Mock
        pendingOrders: 12, // Mock
        lowStock: 0
    });

    useEffect(() => {
        // Verify Vendor Access
        const requests = JSON.parse(localStorage.getItem('mockVendorRequests') || '[]');
        const myRequest = requests.find(r => r.user.email === user?.email);
        
        if (!myRequest || myRequest.status !== 'approved') {
            navigate('/dashboard');
            return;
        } 
        setRequest(myRequest);

        // Load Products from API
        // Load Data
        loadVendorData();

    }, [user, navigate]);



    const [orders, setOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false); // Toggle for orders
    const [orderFilter, setOrderFilter] = useState('all'); // 'all' or 'pending'

    const loadVendorData = async () => {
        setIsLoading(true);
        try {
            // PRODUCTS
            const productData = await fetchProducts(`vendor_${user._id}`);
            setProducts(productData);

            // ORDERS (Fetch all, filter for 'Accepted' ones)
            // Note: Ideally backend should filter, but we are reusing getOrders endpoint
            const orderData = await getAllOrders();
            
            // Filter: Paid (Accepted by Admin) -> Both Pending and Delivered
            const myOrders = orderData.filter(o => o.isPaid);
            const pendingOrders = myOrders.filter(o => !o.isDelivered);
            const deliveredOrdersCount = myOrders.filter(o => o.isDelivered).length;

            setOrders(myOrders);

            // Update Stats
            setStats(prev => ({
                ...prev,
                totalProducts: productData.length,
                lowStock: productData.filter(p => p.stock < 10).length,
                // Stats for orders
                totalOrders: myOrders.length,
                pendingOrders: pendingOrders.length,
                deliveredOrders: deliveredOrdersCount
            }));
            
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ... (omitted handlers)

    // Helper to filtered orders
    const displayedOrders = orderFilter === 'pending' 
        ? orders.filter(o => !o.isDelivered) 
        : orders;
    
    // Toggle Logic with Filters
    const handleTotalOrdersClick = () => {
        if (showOrders && orderFilter === 'all') {
            setShowOrders(false);
        } else {
            setOrderFilter('all');
            setShowOrders(true);
        }
    };

    const handlePendingOrdersClick = () => {
        if (showOrders && orderFilter === 'pending') {
            setShowOrders(false);
        } else {
            setOrderFilter('pending');
            setShowOrders(true);
        }
    };

    // Product Filter Logic
    const [productFilter, setProductFilter] = useState('all'); // 'all' or 'lowStock'

    const displayedProducts = productFilter === 'lowStock'
        ? products.filter(p => Number(p.stock) < 10)
        : products;

    const handleTotalProductsClick = () => {
        if (showProducts && productFilter === 'all') {
            setShowProducts(false);
        } else {
            setProductFilter('all');
            setShowProducts(true);
        }
    };

    const handleLowStockClick = () => {
        if (showProducts && productFilter === 'lowStock') {
            setShowProducts(false);
        } else {
            setProductFilter('lowStock');
            setShowProducts(true);
        }
    };



    const handleVendorDeliver = async (orderId) => {
        try {
            await deliverOrder(orderId);
            
            // Send Notification to User
            const order = orders.find(o => o._id === orderId);
            if (order && order.user) {
                const newNotification = {
                    id: Date.now(),
                    userId: order.user._id || order.user.id,
                    userEmail: order.user.email,
                    type: 'success',
                    title: 'Order Delivered',
                    message: `Your order #${order._id.substring(0,8)} has been delivered!`,
                    read: false,
                    createdAt: new Date().toISOString()
                };
                const existingNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
                localStorage.setItem('mockNotifications', JSON.stringify([newNotification, ...existingNotifications]));
            }

            toast.success("Order Delivered Successfully");
            loadVendorData(); // Refresh list
        } catch (error) {
            toast.error("Delivery Update Failed");
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            name: productForm.name,
            price: Number(productForm.price),
            description: productForm.description,
            image: productForm.image,
            category: productForm.category,
            stock: Number(productForm.stock),
            vendorId: `vendor_${user._id}` // Consistent vendor ID format
            // isApproved will be handled by backend (default false/pending for vendors)
        };

        try {
            if (editingProduct) {
                const updated = await updateProduct(editingProduct._id, payload);
                setProducts(products.map(p => p._id === updated._id ? updated : p));
                toast.success("Product updated successfully");
            } else {
                const created = await createProduct(payload);
                setProducts([created, ...products]);
                toast.success("Product created! Waiting for approval.");
            }

            // Update stats
            setStats(prev => ({
                ...prev,
                totalProducts: products.length + (editingProduct ? 0 : 1), // Approximate update
                // Re-calculating properly would be better but this is fast feedback
            }));
            
            // Reload to be sure
            loadVendorProducts();

            setIsProductModalOpen(false);
            setEditingProduct(null);
            setEditingProduct(null);
            setProductForm({ name: '', price: '', category: '', stock: '', description: '', image: '' });

        } catch (error) {
            console.error("Product operation failed", error);
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            description: product.description,
            image: product.image
        });
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                const updatedProducts = products.filter(p => p._id !== productId);
                setProducts(updatedProducts);
                
                setStats(prev => ({
                    ...prev,
                    totalProducts: updatedProducts.length,
                    lowStock: updatedProducts.filter(p => p.stock < 10).length
                }));
                toast.success("Product deleted");
            } catch (error) {
                console.error("Delete failed", error);
                toast.error("Failed to delete product");
            }
        }
    };

    const handleToggleVisibility = async (product) => {
   
        toast.error("Contact admin to change visibility status");
    };

    if (!request) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{request.storeName} Dashboard</h1>
                <p className="text-gray-500">Welcome back, manager. Here's what's happening with your store today.</p>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Products */}
                {/* Total Products */}
                <div 
                    onClick={handleTotalProductsClick}
                    className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer ${showProducts && productFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</h3>
                            <p className="text-xs text-blue-500 mt-2 font-medium">Click to {showProducts ? 'Hide' : 'View'}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Package size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                {/* Total Orders */}
                <div 
                    onClick={handleTotalOrdersClick}
                    className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer ${showOrders && orderFilter === 'all' ? 'ring-2 ring-purple-500' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Total Orders</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</h3>
                             <p className="text-xs text-purple-500 mt-2 font-medium">Click to {showOrders ? 'Hide' : 'View History'}</p>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                </div>

                {/* Today's Sales */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Today's Sales</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">${stats.todaySales}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Monthly Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">${stats.monthlyRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>

                {/* Pending Orders */}
                {/* Pending Orders */}
                <div 
                    onClick={handlePendingOrdersClick}
                    className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer ${showOrders && orderFilter === 'pending' ? 'ring-2 ring-orange-500' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Ready to Deliver</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</h3>
                             <p className="text-xs text-orange-500 mt-2 font-medium">Click to {showOrders ? 'Hide' : 'Manage'}</p>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div 
                    onClick={handleLowStockClick}
                    className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer ${showProducts && productFilter === 'lowStock' ? 'ring-2 ring-red-500' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Low Stock Alerts</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.lowStock}</h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Management Section */}
            {showOrders && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {orderFilter === 'pending' ? 'Ready to Deliver' : 'Order History'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {orderFilter === 'pending' 
                                ? 'Manage accepted orders waiting for delivery'
                                : 'View all past and present orders'}
                        </p>
                    </div>
                    {/* Toggle Button for convenience */}
                     <div className="flex bg-gray-100 rounded-lg p-1">
                        <button 
                            onClick={() => setOrderFilter('pending')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${orderFilter === 'pending' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => setOrderFilter('all')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${orderFilter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            All
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Order ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Customer</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Products</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No {orderFilter === 'pending' ? 'pending' : ''} orders found.
                                    </td>
                                </tr>
                            ) : (
                                displayedOrders.map(order => (
                                 <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                     <td className="px-6 py-4 text-sm font-mono text-gray-600">#{order._id.substring(0, 8)}</td>
                                     <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                         {order.user?.name || "Guest"}
                                         <span className="block text-xs text-gray-400">{order.user?.email}</span>
                                     </td>
                                     <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="space-y-1">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <span className="font-bold text-gray-800">{item.qty}x</span>
                                                    <span>{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                     </td>
                                     <td className="px-6 py-4">
                                         {order.isDelivered ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Delivered
                                            </span>
                                         ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Ready to Deliver
                                            </span>
                                         )}
                                     </td>
                                     <td className="px-6 py-4">
                                         {order.isDelivered ? (
                                            <span className="text-sm font-bold text-gray-400">Completed</span>
                                         ) : (
                                             <button 
                                                 onClick={() => handleVendorDeliver(order._id)}
                                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm"
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
            )}

            {/* Product Management Section */}
            {showProducts && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {productFilter === 'lowStock' ? 'Low Stock Alerts' : 'Product Management'}
                    </h2>
                    <button 
                        onClick={() => {
                            setEditingProduct(null);
                            setEditingProduct(null);
                            setProductForm({ name: '', price: '', category: '', stock: '', description: '', image: '' });
                            setIsProductModalOpen(true);
                            setIsProductModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Product</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Price</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Stock</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading products...</td></tr>
                            ) : displayedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No {productFilter === 'lowStock' ? 'low stock' : ''} products found.
                                    </td>
                                </tr>
                            ) : (
                                displayedProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Package className="h-full w-full p-2 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">${product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                Number(product.stock) < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {product.stock} Units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.isApproved ? (
                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle2 size={16} /> Active</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium"><AlertCircle size={16} /> Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}

            {/* Add/Edit Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setIsProductModalOpen(false)}>
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <VendorForm 
                            existingProduct={editingProduct} 
                            onSuccess={() => {
                                setIsProductModalOpen(false);
                                setEditingProduct(null);
                                loadVendorProducts();
                            }} 
                            onCancel={() => setIsProductModalOpen(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorDashboard;
