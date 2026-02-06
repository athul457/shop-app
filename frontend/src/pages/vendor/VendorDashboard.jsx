import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, BarChart3, Wallet, Store, Percent } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/product.api';
import { getAllOrders, deliverOrder } from '../../api/order.api';
import toast from 'react-hot-toast';
import VendorForm from './venderForm';

// Components
import VendorSidebar from './components/VendorSidebar';
import VendorInventory from './components/VendorInventory';
import VendorOrders from './components/VendorOrders';
import VendorAnalytics from './components/VendorAnalytics';
import VendorEarnings from './components/VendorEarnings';
import VendorProfile from './components/VendorProfile';
import VendorOffers from './components/VendorOffers';

const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [products, setProducts] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Sidebar State
    const [activeSection, setActiveSection] = useState('inventory');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const sidebarItems = [
        { id: 'inventory', label: 'Inventory / Stock', icon: Package },
        { id: 'orders', label: 'Order Management', icon: ShoppingBag },
        { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
        { id: 'earnings', label: 'Earnings Overview', icon: Wallet },
        { id: 'profile', label: 'Profile & Shop', icon: Store },
        { id: 'offers', label: 'Offers & Discounts', icon: Percent },
    ];

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
        totalOrders: 0,
        todaySales: 0,
        monthlyRevenue: 0,
        pendingOrders: 0,
        lowStock: 0,
        deliveredOrders: 0
    });

    // Verify and Load Vendor Request
    const loadRequest = () => {
        const requests = JSON.parse(localStorage.getItem('mockVendorRequests') || '[]');
        const myRequest = requests.find(r => r.user.email === user?.email);
        
        if (!myRequest || myRequest.status !== 'approved') {
             // If access revoked or not found, redirect (though might be jarring if just editing)
             // For edit refresh, we assume it exists.
             if(!myRequest) navigate('/dashboard');
             return;
        } 
        setRequest(myRequest);
    };

    useEffect(() => {
        loadRequest();
        loadVendorData();
    }, [user, navigate]);




    const [orders, setOrders] = useState([]);
    // const [orderFilter, setOrderFilter] = useState('all'); // Moved to VendorOrders component

    // Reactive Stats Calculation
    useEffect(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const pendingOrdersCount = orders.filter(o => !o.isDelivered).length;
        const deliveredOrdersCount = orders.filter(o => o.isDelivered).length;
        const lowStockCount = products.filter(p => Number(p.stock) < 10).length;

        const getOrderDate = (order) => {
             // For sales metrics, usage 'paidAt' or 'createdAt' instead of delivery time
            return new Date(order.paidAt || order.createdAt);
        };

        const todaySalesAmount = orders
            .filter(o => getOrderDate(o) >= startOfToday)
            .reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0);

        console.log("DEBUG: Stats Calc - Orders:", orders.length);
        console.log("DEBUG: todaySalesAmount:", todaySalesAmount);

        const monthlyRevenueAmount = orders
            .filter(o => getOrderDate(o) >= startOfMonth)
            .reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0);
        
        console.log("DEBUG: monthlyRevenueAmount:", monthlyRevenueAmount);

        setStats({
            totalProducts: products.length,
            totalOrders: orders.length,
            todaySales: todaySalesAmount,
            monthlyRevenue: monthlyRevenueAmount, 
            pendingOrders: pendingOrdersCount,
            lowStock: lowStockCount,
            deliveredOrders: deliveredOrdersCount
        });

    }, [orders, products]);

    const loadVendorData = async () => {
        setIsLoading(true);
        try {
            // PRODUCTS
            const productData = await fetchProducts(`vendor_${user._id}`);
            setProducts(productData);

            // ORDERS (Fetch all, filter for 'Accepted' ones)
            // Note: Ideally backend should filter, but we are reusing getOrders endpoint
            // Create Set of Vendor Product IDs for efficient lookup
            const vendorProductIds = new Set(productData.map(p => String(p._id)));
            const orderData = await getAllOrders();
            
            console.log("DEBUG: All Orders Fetched:", orderData);
            console.log("DEBUG: My Vendor Product IDs:", Array.from(vendorProductIds));

            // Filter: Paid (Accepted by Admin) -> Filter items specific to this vendor
            const myOrders = orderData.reduce((acc, order) => {
                if (!order.isPaid) {
                    console.log(`DEBUG: Order ${order._id} skipped because not PAID`);
                    return acc;
                }

                // Find items in this order that belong to this vendor
                const vendorItems = order.orderItems.filter(item => {
                    const itemId = item.product && typeof item.product === 'object' ? item.product._id : item.product;
                    return vendorProductIds.has(String(itemId));
                });

                if (vendorItems.length > 0) {
                    // Calculate vendor's share of the total price (Price * Quantity)
                    const vendorTotal = vendorItems.reduce((sum, item) => {
                        const itemPrice = parseFloat(item.price) || 0;
                        const itemQty = parseInt(item.qty) || 0;
                        return sum + (itemPrice * itemQty);
                    }, 0);

                    console.log(`DEBUG: Vendor Order ${order._id} Items:`, vendorItems, "Total:", vendorTotal);

                    acc.push({
                        ...order,
                        orderItems: vendorItems, // Only show vendor's items
                        totalPrice: vendorTotal // Override total with vendor's share
                    });
                } else {
                     console.log(`DEBUG: Order ${order._id} skipped because NO Vendor Items`);
                }
                return acc;
            }, []);

            console.log("DEBUG: Final Vendor Orders:", myOrders);
            setOrders(myOrders);
            
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
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
            
            // Optimistic Update
            setOrders(prevOrders => 
                prevOrders.map(o => 
                    o._id === orderId ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o
                )
            );
            // No need to reload, useEffect will handle stats update
        } catch (error) {
            toast.error("Delivery Update Failed");
        }
    };

    const handleProductSubmit = async (e) => {
        // ... (unchanged handler logic, but need to pass props down or keep here?)
        // Actually, this handler is for the modal which is still in VendorDashboard
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
                toast.success("Product deleted");
            } catch (error) {
                console.error("Delete failed", error);
                toast.error("Failed to delete product");
            }
        }
    };


    // Render Content Helper
    const renderContent = () => {
        switch (activeSection) {
            case 'inventory':
                return (
                    <VendorInventory 
                        products={products}
                        stats={stats}
                        onAddProduct={() => {
                            setEditingProduct(null);
                             // Reset logic moved inside the click or handled by effect
                            setEditingProduct(null);
                            setProductForm({ name: '', price: '', category: '', stock: '', description: '', image: '' }); // Reset form
                            setIsProductModalOpen(true);
                        }}
                        onEditProduct={handleEditClick}
                        onDeleteProduct={handleDeleteProduct}
                    />
                );

            case 'orders':
                return (
                    <VendorOrders 
                        orders={orders}
                        stats={stats}
                        onDeliverOrder={handleVendorDeliver}
                    />
                );

            case 'analytics':
                 return <VendorAnalytics stats={stats} orders={orders} products={products} />;

            case 'earnings':
                return <VendorEarnings stats={stats} />;

            case 'profile':
                return <VendorProfile request={request} user={user} onProfileUpdate={loadRequest} />;

            case 'offers':
                return <VendorOffers />;

            default:
                return null;
        }
    };

    if (!request) return null;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <VendorSidebar 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                storeName={request.storeName}
                sidebarItems={sidebarItems}
            />

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="p-8 max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>

            {/* Product Modal - Kept in Dashboard as it is global and uses complex form state */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setIsProductModalOpen(false)}>
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <VendorForm 
                            existingProduct={editingProduct} 
                            onSuccess={() => {
                                setIsProductModalOpen(false);
                                setEditingProduct(null);
                                loadVendorData(); // Use loadVendorData to refresh everything
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
