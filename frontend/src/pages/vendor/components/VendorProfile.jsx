import { useState, useEffect } from 'react';
import { CheckCircle2, Store, Save, X, MapPin, Phone, Globe, Image as ImageIcon, Star, Mail, User, Plus, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveStoreProfile } from '../../../api/store.api'; // Import API

const VendorProfile = ({ store, user, products = [], onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial state from store prop or empty defaults
    // If store is null (first time), we show empty fields
    const initialData = {
        storeName: store?.storeName || user.name + "'s Store",
        description: store?.description || '',
        phone: store?.phone || '',
        address: store?.address || '',
        logo: store?.logo || '', 
        banner: store?.banner || '', 
        featuredProducts: store?.featuredProducts?.map(p => typeof p === 'object' ? p._id : p) || [] // Ensure we have IDs
    };

    const [formData, setFormData] = useState(initialData);

    // Update form data when store prop changes (e.g. after fetch)
    useEffect(() => {
        setFormData({
            storeName: store?.storeName || user.name + "'s Store",
            description: store?.description || '',
            phone: store?.phone || '',
            address: store?.address || '',
            logo: store?.logo || '', 
            banner: store?.banner || '', 
            featuredProducts: store?.featuredProducts?.map(p => typeof p === 'object' ? p._id : p) || []
        });
    }, [store, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleFeaturedProduct = (productId) => {
        setFormData(prev => {
            const current = prev.featuredProducts || [];
            if (current.includes(productId)) {
                return { ...prev, featuredProducts: current.filter(id => id !== productId) };
            } else {
                if (current.length >= 4) {
                    toast.error("You can highlight up to 4 products only");
                    return prev;
                }
                return { ...prev, featuredProducts: [...current, productId] };
            }
        });
    };

    const handleSave = async () => {
        if (!formData.storeName.trim()) {
            toast.error("Store name cannot be empty");
            return;
        }

        setIsSaving(true);
        try {
            // Call API instead of localStorage
            await saveStoreProfile(formData);

            if (onProfileUpdate) {
                onProfileUpdate(); // Refresh parent data
            }

            setIsEditing(false);
            toast.success("Shop profile updated successfully");

        } catch (error) {
            console.error("Failed to update profile", error);
            // Show backend error message if available
            const msg = error.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    };

    // Get actual product objects for the selected IDs
    const featuredProductDetails = (formData.featuredProducts || [])
        .map(id => products.find(p => p._id === id))
        .filter(Boolean); 

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Profile & Shop
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm">Manage your brand presence and contact details.</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg hover:to-indigo-600 transition-all flex items-center gap-2 transform active:scale-95"
                    >
                        <Store size={18} className="group-hover:rotate-12 transition-transform"/> 
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Followers Count - Added as requested */}
            {store && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-indigo-100 font-medium mb-1">Total Followers</p>
                        <h3 className="text-4xl font-bold">{store.followers?.length || 0}</h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                        <Users size={32} className="text-white" />
                    </div>
                </div>
            )}

            {/* Main Interactive Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden ring-1 ring-gray-100">
                {/* Banner Section */}
                <div className="h-56 bg-gradient-to-r from-gray-100 to-gray-200 relative group overflow-hidden">
                    {formData.banner ? (
                        <img 
                            src={formData.banner} 
                            alt="Shop Banner" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-slate-50 pattern-grid-lg">
                             <ImageIcon size={48} className="text-gray-300 mb-2" />
                             <span className="text-sm font-medium tracking-wide decoration-dashed">Add a Cover Image</span>
                        </div>
                    )}
                    
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 p-6">
                             <p className="text-white font-medium mb-3 text-sm">Change Cover Image</p>
                             <input 
                                type="text"
                                name="banner"
                                value={formData.banner}
                                onChange={handleChange}
                                placeholder="Paste Image URL (https://...)"
                                className="w-full max-w-lg px-4 py-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 bg-white/90 backdrop-blur shadow-xl"
                             />
                        </div>
                    )}
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Logo & Header */}
                    <div className="flex flex-col md:flex-row gap-6 items-end -mt-16 mb-8 relative z-10">
                         <div className="relative group flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-32 h-32 bg-white rounded-full p-1.5 shadow-2xl ring-4 ring-white relative overflow-hidden">
                                {formData.logo ? (
                                    <img src={formData.logo} alt="Logo" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold">
                                        {formData.storeName.charAt(0)}
                                    </div>
                                )}
                                
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                        <div className="text-white text-xs text-center px-2">
                                            <ImageIcon size={20} className="mx-auto mb-1" />
                                            Change
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 z-20 transition-all">
                                     <input 
                                        type="text"
                                        name="logo"
                                        value={formData.logo}
                                        onChange={handleChange}
                                        placeholder="Logo URL..."
                                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg shadow-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
                                     />
                                </div>
                            )}
                         </div>

                         <div className="flex-1 text-center md:text-left mb-2">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Shop Name</label>
                                    <input 
                                        type="text" 
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-2xl text-gray-800 bg-gray-50 focus:bg-white transition-colors"
                                        placeholder="e.g. My Awesome Store"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                        {formData.storeName}
                                    </h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            <CheckCircle2 size={12} className="mr-1.5"/> Verified Merchant
                                        </span>
                                        <span className="text-gray-400 text-sm flex items-center">
                                            <Star size={14} className="text-yellow-400 mr-1" fill="currentColor"/> 
                                            New Seller
                                        </span>
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        {/* Shop Info form */}
                        <div className="lg:col-span-2 space-y-6">
                             <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Store size={16} className="text-blue-500"/> About the Shop
                                </h3>
                                
                                {isEditing ? (
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 leading-relaxed resize-none bg-white font-medium"
                                        placeholder="Write a compelling description for your customers..."
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {formData.description || (
                                            <span className="italic text-gray-400 flex items-center gap-2">
                                                <Store size={16} /> No description provided yet.
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                            
                            {/* Featured Products Selection (Edit Mode Only) */}
                            {isEditing && (
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                            <Star size={16} className="text-yellow-500"/> Select Featured Products
                                        </h3>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {formData.featuredProducts.length} / 4 Selected
                                        </span>
                                    </div>
                                    
                                    {products.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            No products available. Add products to your inventory first.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                            {products.map(product => {
                                                const isSelected = formData.featuredProducts.includes(product._id);
                                                return (
                                                    <div 
                                                        key={product._id}
                                                        onClick={() => toggleFeaturedProduct(product._id)}
                                                        className={`
                                                            cursor-pointer relative rounded-xl border-2 overflow-hidden transition-all group
                                                            ${isSelected 
                                                                ? 'border-blue-500 ring-2 ring-blue-100' 
                                                                : 'border-gray-100 hover:border-gray-300'}
                                                        `}
                                                    >
                                                        <div className="aspect-square bg-gray-100 relative">
                                                            {product.image && (
                                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                            )}
                                                            {isSelected && (
                                                                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                                                    <div className="bg-blue-500 text-white p-1 rounded-full shadow-lg transform scale-100 transition-transform">
                                                                        <CheckCircle2 size={20} fill="currentColor" className="text-white"/>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-2 text-xs truncate font-medium text-gray-700 bg-white">
                                                            {product.name}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Sidebar: Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500"/> Contact Details
                                </h3>

                                {/* Read-Only User Info */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <User size={18} className="text-gray-400 mt-0.5"/>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Manager</p>
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Mail size={18} className="text-gray-400 mt-0.5"/>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Email</p>
                                            <p className="text-sm font-semibold text-gray-900 break-all">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 my-4"></div>

                                {/* Editable Contact Fields */}
                                <div className="space-y-4">
                                     <div className="group">
                                         <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Phone Number</label>
                                         {isEditing ? (
                                             <input 
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="+1 (555) 000-0000"
                                             />
                                         ) : (
                                             <div className="flex items-center gap-3 text-sm text-gray-700">
                                                 <Phone size={16} className="text-gray-400"/> 
                                                 {formData.phone || <span className="text-gray-400 italic">Not set</span>}
                                             </div>
                                         )}
                                    </div>

                                    <div className="group">
                                         <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Business Address</label>
                                         {isEditing ? (
                                             <textarea 
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                                placeholder="123 Market St..."
                                             />
                                         ) : (
                                             <div className="flex items-start gap-3 text-sm text-gray-700">
                                                 <MapPin size={16} className="text-gray-400 mt-0.5"/> 
                                                 <span className="leading-snug">{formData.address || <span className="text-gray-400 italic">Not set</span>}</span>
                                             </div>
                                         )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {isEditing && (
                        <div className="pt-6 mt-8 border-t border-gray-100 flex items-center justify-end gap-3 animate-fade-in">
                            <span className="text-sm text-gray-500 mr-2">Unsaved changes will be lost</span>
                            <button 
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Save size={18} />
                                {isSaving ? 'Saving Changes...' : 'Save Profile'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Public Page Preview Section */}
            <div className="pt-8">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Globe size={24}/> 
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Live Preview</h3>
                        <p className="text-gray-500 text-sm">This is how your shop looks to customers</p>
                    </div>
                </div>

                <div className="bg-gray-100 p-2 rounded-xl border border-gray-200">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden pointer-events-none select-none opacity-90 scale-[0.98] ring-1 ring-black/5">
                        
                        {/* Preview Banner */}
                        <div className="h-40 bg-slate-200">
                            {formData.banner && <img src={formData.banner} className="w-full h-full object-cover" />}
                        </div>
                        
                        <div className="px-6 relative">
                             <div className="w-20 h-20 bg-white rounded-lg p-1 shadow-md -mt-10 mb-3 absolute left-6 border border-gray-100">
                                 {formData.logo ? (
                                     <img src={formData.logo} className="w-full h-full object-cover rounded" />
                                 ) : (
                                     <div className="w-full h-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xl">{formData.storeName.charAt(0)}</div>
                                 )}
                             </div>
                        </div>

                        <div className="pt-12 px-6 pb-6">
                             <div className="flex justify-between items-start">
                                 <div className="max-w-2xl">
                                     <h4 className="font-bold text-xl text-gray-900">{formData.storeName || 'Your Shop Name'}</h4>
                                     <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                                         {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                         <span className="text-gray-400 ml-1 font-medium">(New)</span>
                                     </div>
                                     <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                                        {formData.description || 'Shop description will appear here...'}
                                     </p>
                                 </div>
                                 <button className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800">
                                     Follow Shop
                                 </button>
                             </div>

                             <div className="mt-8 border-t border-gray-100 pt-6">
                                 <h5 className="font-bold text-sm text-gray-900 mb-4">Featured Products</h5>
                                 <div className="grid grid-cols-4 gap-4">
                                     {featuredProductDetails.length > 0 ? (
                                         featuredProductDetails.map((product) => (
                                             <div key={product._id} className="aspect-[3/4] bg-white rounded-lg border border-gray-100 flex flex-col items-start overflow-hidden">
                                                 <div className="w-full aspect-square bg-gray-50 relative">
                                                     {product.image ? (
                                                         <img src={product.image} className="w-full h-full object-cover"/>
                                                     ) : (
                                                         <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                             <ImageIcon size={20} />
                                                         </div>
                                                     )}
                                                 </div>
                                                 <div className="p-3 w-full">
                                                    <div className="font-medium text-xs text-gray-900 truncate mb-1">{product.name}</div>
                                                    <div className="font-bold text-xs text-gray-900">${product.price}</div>
                                                 </div>
                                             </div>
                                         ))
                                     ) : (
                                        [1,2,3,4].map((item) => (
                                            <div key={item} className="aspect-[3/4] bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                                                <div className="text-center p-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                                                    <div className="h-2 w-16 bg-gray-200 rounded mx-auto mb-1"></div>
                                                    <div className="h-2 w-10 bg-gray-200 rounded mx-auto"></div>
                                                </div>
                                            </div>
                                        ))
                                     )}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;
