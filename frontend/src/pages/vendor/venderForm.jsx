import { useState, useEffect } from 'react';
import { X, Save, ImageIcon } from 'lucide-react';
import { createProduct, updateProduct } from '../../api/product.api';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const VendorForm = ({ existingProduct = null, onSuccess, onCancel }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    // Initialize form based on Product Schema
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        // vendorId, isApproved, rating, ownerId are handled by backend/defaults
    });

    useEffect(() => {
        if (existingProduct) {
            setFormData({
                name: existingProduct.name || '',
                description: existingProduct.description || '',
                price: existingProduct.price || '',
                category: existingProduct.category || '',
                stock: existingProduct.stock || '',
                image: existingProduct.image || ''
            });
        }
    }, [existingProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Prepare payload according to schema types
        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            vendorId: `vendor_${user?._id}` 
            // isApproved: false (default), rating: 0 (default)
        };

        try {
            if (existingProduct) {
                await updateProduct(existingProduct._id, payload);
                toast.success('Product updated successfully');
            } else {
                await createProduct(payload);
                toast.success('Product created successfully');
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Form submission failed", error);
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">
                    {existingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                {onCancel && (
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. Premium Wireless Headphones"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home Appliances">Home Appliances</option>
                            <option value="Children Items">Children Items</option>
                            <option value="Crockery">Crockery</option>
                            <option value="Bags">Bags</option>
                            <option value="Animal Foods">Animal Foods</option>
                            <option value="Beauty Products">Beauty Products</option>
                            <option value="Laptops">Laptops</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Mobiles">Mobiles</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 block">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-gray-400"
                        placeholder="Detailed product description..."
                    ></textarea>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 block">Image URL</label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                    {/* Image Preview */}
                    {formData.image && (
                        <div className="mt-3 relative h-48 w-full rounded-xl bg-gray-50 border border-gray-200 overflow-hidden group">
                            <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="h-full w-full object-contain" 
                                onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'}}
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {isLoading ? 'Saving...' : (existingProduct ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorForm;
