import { Package, AlertCircle, Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';

const VendorInventory = ({ 
    products, 
    stats, 
    onAddProduct, 
    onEditProduct, 
    onDeleteProduct 
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                <button 
                    onClick={onAddProduct}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Low Stock Alerts</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.lowStock}</h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={24} /></div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                            {products.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products found.</td></tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : <Package className="h-full w-full p-2 text-gray-300" />}
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
                                            }`}>{product.stock} Units</span>
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
                                                <button onClick={() => onEditProduct(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                                <button onClick={() => onDeleteProduct(product._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
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

export default VendorInventory;
