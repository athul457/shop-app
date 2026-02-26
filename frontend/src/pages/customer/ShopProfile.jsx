import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchStoreByVendor, followStore, unfollowStore } from '../../api/store.api';
import { fetchProducts } from '../../api/product.api';
import useAuth from '../../hooks/useAuth';
import { MapPin, Phone, Mail, Star, CheckCircle2, UserPlus, UserMinus, ArrowLeft, Grid, Info, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ShopProfile = () => {
    const { id } = useParams(); // id is vendorId
    const { user } = useAuth();
    
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'about'

    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Fetch Store Profile
                const storeData = await fetchStoreByVendor(id);
                setStore(storeData);

                // 2. Fetch Vendor Products
                // We fetch all and filter client-side for now to ensure accuracy if backend filter isn't perfect
                const allProducts = await fetchProducts(); 
                const vendorProducts = allProducts.filter(p => p.vendorId === id || p.vendorId === `vendor_${id}`);
                setProducts(vendorProducts);

                // 3. Check Follow Status
                if (user && storeData.followers && storeData.followers.includes(user._id)) {
                    setIsFollowing(true);
                }

            } catch (error) {
                console.error(error);
                toast.error("Failed to load shop details");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, user]);

    const handleFollowToggle = async () => {
        if (!user) {
            toast.error("Please login to follow this shop");
            return;
        }

        if (!store._id) {
            toast.error("This vendor hasn't set up their shop profile yet");
            return;
        }

        setFollowLoading(true);
        try {
            if (isFollowing) {
                await unfollowStore(store._id);
                setIsFollowing(false);
                setStore(prev => ({ ...prev, followers: prev.followers.filter(fid => fid !== user._id) }));
                toast.success("Unfollowed shop");
            } else {
                await followStore(store._id);
                setIsFollowing(true);
                setStore(prev => ({ ...prev, followers: [...prev.followers, user._id] }));
                toast.success("Following shop!");
            }
        } catch (error) {
            toast.error("Action failed");
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    if (!store) return <div className="p-8 text-center text-gray-500">Shop not found</div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            
            {/* ================= HERO SECTION ================= */}
            <div className="relative bg-white pb-4">
                {/* Banner */}
                <div className="h-64 md:h-80 w-full relative bg-gray-900 overflow-hidden group">
                    {store.banner ? (
                        <img src={store.banner} alt="Shop Banner" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 pattern-grid-lg opacity-100"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Back Nav */}
                    <div className="absolute top-6 left-4 md:left-8 z-20">
                        <Link to="/dashboard" className="flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full transition-all text-sm font-medium border border-white/10">
                            <ArrowLeft size={18} /> Back
                        </Link>
                    </div>
                </div>

                {/* Profile Info Wrapper */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col items-center -mt-20 md:-mt-24 relative z-10">
                        
                        {/* Logo */}
                        <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-full p-1.5 shadow-2xl ring-4 ring-white/50 backdrop-blur-sm overflow-hidden">
                            {store.logo ? (
                                <img src={store.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white">
                                    {store.storeName.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Text Info */}
                        <div className="text-center mt-4 max-w-2xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-2">
                                {store.storeName}
                                <CheckCircle2 size={24} className="text-blue-500 fill-blue-50" />
                            </h1>
                            
                            {/* Stats Row */}
                            <div className="flex items-center justify-center gap-6 mt-3 text-sm md:text-base text-gray-600">
                                <span className="flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-yellow-700 border border-yellow-100 font-medium">
                                    <Star size={16} fill="currentColor" /> 4.8 Rating
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span className="font-bold text-gray-900">{store.followers?.length || 0}</span> Followers
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="font-medium text-gray-500">
                                    {products.length} Products
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-center gap-3">
                                <button 
                                    onClick={handleFollowToggle}
                                    disabled={followLoading}
                                    className={`px-8 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                                        isFollowing 
                                        ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' 
                                        : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
                                    }`}
                                >
                                    {followLoading ? (
                                        <span className="opacity-70">Processing...</span>
                                    ) : isFollowing ? (
                                        <> <UserMinus size={18}/> Unfollow </>
                                    ) : (
                                        <> <UserPlus size={18}/> Follow Shop </>
                                    )}
                                </button>
                                <button className="px-5 py-2.5 rounded-full font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                                    Contact Seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="mt-10 border-b border-gray-200">
                     <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8">
                         <button 
                            onClick={() => setActiveTab('shop')}
                            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                                activeTab === 'shop' 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                         >
                             <Grid size={18} /> Shop Products
                         </button>
                         <button 
                            onClick={() => setActiveTab('about')}
                            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                                activeTab === 'about' 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                         >
                             <Info size={18} /> About & info
                         </button>
                     </div>
                </div>
            </div>

            {/* ================= CONTENT AREA ================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* SHOP TAB */}
                {activeTab === 'shop' && (
                    <div className="animate-fade-in">
                        {/* Featured (only show if available and not filtering) */}
                        {store.featuredProducts && store.featuredProducts.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Star className="text-yellow-500" fill="currentColor" size={20}/> Featured Collection
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {store.featuredProducts.map(fp => (
                                        <Link to={`/dashboard/product/${fp._id}`} key={fp._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                                <img src={fp.image} alt={fp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                                                    Featured
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-gray-900 truncate">{fp.name}</h4>
                                                <p className="text-blue-600 font-bold mt-1">${fp.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Products */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">All Products ({products.length})</h3>
                                <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm text-sm text-gray-500">
                                    <Search size={16} /> Search in shop...
                                </div>
                            </div>

                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {products.map(product => (
                                        <Link to={`/dashboard/product/${product._id}`} key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Product'; }}
                                                />
                                                {product.stock === 0 && (
                                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{product.category}</p>
                                                <h3 className="font-bold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                                    <div className="flex items-center text-yellow-500 text-xs gap-1">
                                                        <Star size={12} fill="currentColor" /> {product.rating}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 font-medium">No products found in this shop yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">About the Brand</h3>
                            <p className="text-gray-600 leading-relax text-lg">
                                {store.description || "This vendor has not added a description yet."}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                    <MapPin className="text-blue-500 mt-1" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
                                        <p className="font-medium text-gray-900 mt-1">{store.address || 'Not Public'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                    <Phone className="text-green-500 mt-1" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                                        <p className="font-medium text-gray-900 mt-1">{store.phone || 'Not Public'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                    <Mail className="text-purple-500 mt-1" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                        <p className="font-medium text-gray-900 mt-1">{store.email || 'Not Public'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ShopProfile;
