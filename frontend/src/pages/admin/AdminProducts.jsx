import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, X, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/product.api';
import { fetchUsers } from '../../api/user.api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Form Stats
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        vendorId: '',
        description: '',
        image: '',
        rating: 0,
        isApproved: true
    });



    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadProducts();
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users");
        }
    };

    const handleReview = async (product, status) => {
        let message = '';
        if (status === false) { // Reject
            message = window.prompt("Reason for rejection:");
            if (message === null) return; // Cancelled
        } else {
             message = "Congratulations! Your product has been approved.";
        }

        try {
            // Update product status
            const updated = await updateProduct(product._id, { isApproved: status });
            setProducts(products.map(p => p._id === updated._id ? updated : p));
            toast.success(`Product ${status ? 'Approved' : 'Rejected'}`);

            // Send Notification
            // Find owner email
            // Product might have ownerId. If not, try to match vendorId format "vendor_ID"
            let ownerId = product.ownerId;
            if (!ownerId && product.vendorId && product.vendorId.startsWith('vendor_')) {
                 ownerId = product.vendorId.replace('vendor_', '');
            }

            const owner = users.find(u => u._id === ownerId || u.id === ownerId);
            
            if (owner) {
                const newNotification = {
                    id: Date.now(),
                    userId: owner._id,
                    userEmail: owner.email,
                    type: status ? 'success' : 'error',
                    title: status ? 'Product Approved' : 'Product Rejected',
                    message: message || `Your product "${product.name}" has been ${status ? 'approved' : 'rejected'}.`,
                    read: false,
                    createdAt: new Date().toISOString()
                };

                const existingNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
                localStorage.setItem('mockNotifications', JSON.stringify([newNotification, ...existingNotifications]));
            }

        } catch (error) {
            console.error(error);
            toast.error("Review failed");
        }
    };

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted');
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditMode(true);
            setCurrentProductId(product._id);
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                vendorId: product.vendorId,
                description: product.description,
                image: product.image,
                rating: product.rating,
                isApproved: product.isApproved
            });
        } else {
            setEditMode(false);
            setCurrentProductId(null);
            setFormData({
                name: '',
                category: '',
                price: '',
                stock: '',
                vendorId: '',
                description: '',
                image: '',
                rating: 0,
                isApproved: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                rating: Number(formData.rating) || 0
            };

            if (editMode) {
                const updated = await updateProduct(currentProductId, payload);
                setProducts(products.map(p => p._id === updated._id ? updated : p));
                toast.success("Product updated successfully");
            } else {
                const created = await createProduct(payload);
                setProducts([...products, created]);
                toast.success("Product created successfully");
            }
            setIsModalOpen(false);
        } catch (error) {
             toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('name'); // name, category, price, stock, status

    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        
        switch(searchCategory) {
            case 'name':
                return product.name?.toLowerCase().includes(term);
            case 'category':
                return product.category?.toLowerCase().includes(term);
            case 'price':
                return product.price?.toString().includes(term);
            case 'stock':
                return product.stock?.toString().includes(term);
            case 'status':
                const status = product.isApproved ? 'approved' : 'pending';
                return status.includes(term);
            default:
                return true;
        }
    });

    if (loading) return <div className="p-6 text-center">Loading products...</div>;

    return (
        <div className="p-6">
            <div className="sticky top-15 z-30 bg-gray-50/95 backdrop-blur pt-6 pb-6 -mx-6 px-6 border-b border-gray-200 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Products Management</h1>
                    <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all active:scale-95 transform hover:-translate-y-0.5">
                        <Plus size={18} /> Add Product
                    </button>
                </div>

                {/* Filter / Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                    <select 
                        value={searchCategory} 
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer font-medium"
                    >
                        <option value="name">Name</option>
                        <option value="category">Category</option>
                        <option value="price">Price</option>
                        <option value="stock">Stock</option>
                        <option value="status">Status</option>
                    </select>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder={`Search by ${searchCategory}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Product</th>
                                <th className="p-4 font-semibold text-gray-600">Category</th>
                                <th className="p-4 font-semibold text-gray-600">Price</th>
                                <th className="p-4 font-semibold text-gray-600">Stock</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">ID: {product.vendorId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase">{product.category}</span></td>
                                    <td className="p-4 font-medium">${product.price}</td>
                                    <td className="p-4">{product.stock}</td>
                                    <td className="p-4">
                                        {product.isApproved ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle size={14} /> Approved</span>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleReview(product, true)}
                                                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold hover:bg-green-200"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleReview(product, false)}
                                                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button onClick={() => openModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h2 className="text-xl font-bold">{editMode ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select 
                                        name="category" 
                                        value={formData.category} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Home Appliances">Home Appliances</option>
                                        <option value="Children Items">Children Items</option>
                                        <option value="Crockery">Crockery</option>
                                        <option value="Bags">Bags</option>
                                        <option value="Animal Foods">Animal Foods</option>
                                        <option value="Beauty Products">Beauty Products</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <input type="number" name="rating" value={formData.rating} onChange={handleChange} step="0.1" max="5" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor ID</label>
                                    <input type="text" name="vendorId" value={formData.vendorId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="isApproved" checked={formData.isApproved} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                                        <span className="font-medium text-gray-700">Is Approved?</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com/image.jpg" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required></textarea>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2">
                                {editMode ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
