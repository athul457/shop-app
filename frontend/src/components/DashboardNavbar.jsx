import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Search, LogOut, Package, MapPin, Heart, Settings, ShoppingBag, Users, Bell, ChevronDown, Store, X, CheckCircle2, Clock, LayoutTemplate, HelpCircle, FileQuestion } from 'lucide-react';

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Notification Dropdown State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  
  // Vendor Form State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    storeName: '',
    description: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save to localStorage
    const newRequest = {
        id: Date.now(),
        user: {
            name: user.name,
            email: user.email,
            id: user._id
        },
        ...vendorForm,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    const existingRequests = JSON.parse(localStorage.getItem('mockVendorRequests') || '[]');
    localStorage.setItem('mockVendorRequests', JSON.stringify([newRequest, ...existingRequests]));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Close modal after success message
    setTimeout(() => {
        setIsVendorModalOpen(false);
        setIsSuccess(false);
        setVendorForm({ storeName: '', description: '', phone: '', address: '' });
    }, 2000);
  };

  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, notificationRef]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
                MultiMart
                </span>
            </Link>
          </div>

          {/* Admin Navigation */}
          {user?.role === 'admin' ? (
            <div className="hidden md:flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50">
                <Link to="/admin/products" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all flex items-center gap-2">
                    <ShoppingBag size={18} /> Products
                </Link>
                <Link to="/admin/orders" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all flex items-center gap-2">
                    <Package size={18} /> Orders
                </Link>
                <Link to="/admin/users" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all flex items-center gap-2">
                    <Users size={18} /> Users
                </Link>
                <Link to="/admin/vendors" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all flex items-center gap-2">
                    <Store size={18} /> Vendors
                </Link>
                <Link to="/admin/home" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all flex items-center gap-2">
                    <LayoutTemplate size={18} /> Home Page
                </Link>
            </div>
          ) : (
            /* Search Bar for Non-Admin */
            <div className="flex-1 max-w-lg mx-8 hidden md:block group">
                <div className="relative transition-all duration-300 group-focus-within:scale-[1.02]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 sm:text-sm transition-all duration-200 ease-in-out shadow-sm"
                        placeholder="Search for products..."
                        defaultValue={new URLSearchParams(window.location.search).get("search") || ""}
                        onChange={(e) => {
                            const params = new URLSearchParams(window.location.search);
                            if (e.target.value) {
                                params.set("search", e.target.value);
                            } else {
                                params.delete("search");
                            }
                            navigate(`/dashboard?${params.toString()}`, { replace: true });
                        }}
                    />
                </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
             
              {/* Vendor Dashboard Link (Top Level) */}
             {(() => {
                const requests = JSON.parse(localStorage.getItem('mockVendorRequests') || '[]');
                const myRequest = requests.find(r => r.user.email === user?.email);
                if (myRequest?.status === 'approved') {
                    return (
                        <Link to="/vendor" className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors group" title="Vendor Dashboard">
                            <div className="bg-indigo-50 p-2 rounded-full group-hover:bg-indigo-100 transition-colors">
                                <Store className="h-6 w-6 text-indigo-600" />
                            </div>
                        </Link>
                    );
                }
                return null;
             })()}

             {/* Notifications (All Users) */}
             <div className="relative" ref={notificationRef}>
                <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-50"
                >
                    <Bell size={22} />
                    {cartCount > 0 && ( // Temporarily using cartCount logic for demo, fetch actual notifications below
                       null
                    )}
                     {(() => {
                        const notifs = JSON.parse(localStorage.getItem('mockNotifications') || '[]').filter(n => n.userEmail === user?.email && !n.read);
                        return notifs.length > 0 ? (
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        ) : null;
                    })()}
                </button>

                {isNotificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            <button 
                                onClick={() => {
                                    const notifs = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
                                    const updated = notifs.map(n => n.userEmail === user?.email ? {...n, read: true} : n);
                                    localStorage.setItem('mockNotifications', JSON.stringify(updated));
                                    setIsNotificationOpen(false); 
                                }}
                                className="text-xs text-blue-600 font-medium hover:underline"
                            >
                                Mark all read
                            </button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {(() => {
                                const allNotifs = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
                                const userNotifs = allNotifs.filter(n => n.userEmail === user?.email).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                                
                                if (userNotifs.length === 0) {
                                    return (
                                        <div className="p-8 text-center text-gray-500">
                                            <Bell className="mx-auto h-8 w-8 mb-2 opacity-20" />
                                            <p className="text-sm">No notifications</p>
                                        </div>
                                    );
                                }

                                return userNotifs.map(notification => (
                                    <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                                                <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}
             </div>

             {/* Cart (Non-Admin only) */}
             {user?.role !== 'admin' && (
                <Link to="/dashboard/cart" className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors group">
                    <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white shadow-sm">
                            {cartCount}
                        </span>
                    )}
                </Link>
             )}

            {/* Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1 pl-2 pr-1 rounded-full border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all focus:outline-none shadow-sm group"
              >
                {/* For Admin, show name prominently. For User, only show profile image (user request). */}
                {user?.role === 'admin' && (
                  <div className="hidden md:flex flex-col items-end mr-1">
                      <span className="font-bold text-sm text-gray-800 leading-tight">{user?.name}</span>
                      <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider bg-blue-50 px-1.5 py-0.5 rounded-md">Admin</span>
                  </div>
                )}
                
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px] shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-blue-600 font-bold text-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Modern Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out transform origin-top-right animate-in fade-in zoom-in-95 border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 rounded-t-2xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    {user?.role === 'admin' ? (
                        <>
                        <Link to="/admin" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3" onClick={() => setIsDropdownOpen(false)}>
                            <Settings size={18} className="text-gray-400" /> Dashboard Home
                        </Link>
                        </>
                    ) : (
                        <>
                        <Link to="/dashboard/profile" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3" onClick={() => setIsDropdownOpen(false)}>
                            <User size={18} className="text-gray-400" /> My Profile
                        </Link>
                        <Link to="/dashboard/orders" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3" onClick={() => setIsDropdownOpen(false)}>
                            <Package size={18} className="text-gray-400" /> My Orders
                        </Link>
                        <Link to="/dashboard/addresses" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3" onClick={() => setIsDropdownOpen(false)}>
                            <MapPin size={18} className="text-gray-400" /> Addresses
                        </Link>
                        <Link to="/dashboard/wishlist" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3" onClick={() => setIsDropdownOpen(false)}>
                            <Heart size={18} className="text-gray-400" /> Wishlist
                        </Link>
                        <Link to="/help" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3" onClick={() => setIsDropdownOpen(false)}>
                            <HelpCircle size={18} className="text-gray-400" /> Help Center
                        </Link>
                        <Link to="/faq" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3" onClick={() => setIsDropdownOpen(false)}>
                            <FileQuestion size={18} className="text-gray-400" /> FAQ
                        </Link>
                      
                        
                        {user?.role === 'customer' && (
                           <button 
                              onClick={() => { setIsDropdownOpen(false); setIsVendorModalOpen(true); }}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-3"
                           >
                              <Store size={18} className="text-gray-400" /> Become a Vendor
                           </button>
                        )}
                       
                        </>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-100 mt-1 p-2">
                    <button 
                        onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Become a Vendor Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setIsVendorModalOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
             
             {/* Header */}
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                   <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Become a Vendor</h2>
                   <p className="text-gray-500 text-sm mt-1">Start selling on MultiMart today</p>
                </div>
                <button 
                   onClick={() => setIsVendorModalOpen(false)}
                   className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                   <X size={20} />
                </button>
             </div>

             {isSuccess ? (
                <div className="p-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 size={40} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                   <p className="text-gray-500 max-w-xs">Your application to become a vendor has been received. We will review it shortly!</p>
                </div>
             ) : (
                <form onSubmit={handleVendorSubmit} className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Store Name</label>
                         <input 
                            type="text" 
                            required
                            value={vendorForm.storeName}
                            onChange={(e) => setVendorForm({...vendorForm, storeName: e.target.value})}
                            placeholder="e.g. My Awesome Shop"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Phone Number</label>
                         <input 
                            type="tel" 
                            required
                            value={vendorForm.phone}
                            onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                         />
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Store Description</label>
                         <textarea 
                            required
                            value={vendorForm.description}
                            onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                            placeholder="Tell us about what you sell..."
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none"
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Business Address</label>
                         <input 
                            type="text" 
                            required
                            value={vendorForm.address}
                            onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})}
                            placeholder="123 Business St, City"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                         />
                      </div>
                   </div>
                   
                   <div className="pt-2">
                      <button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                         {isSubmitting ? (
                            <>Processing...</>
                         ) : (
                            <>Submit Application</>
                         )}
                      </button>
                   </div>
                </form>
             )}
          </div>
        </div>
      )}
    </nav>
      {/* Become a Vendor Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setIsVendorModalOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
             
             {/* Header */}
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                   <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Become a Vendor</h2>
                   <p className="text-gray-500 text-sm mt-1">Start selling on MultiMart today</p>
                </div>
                <button 
                   onClick={() => setIsVendorModalOpen(false)}
                   className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                   <X size={20} />
                </button>
             </div>

             {isSuccess ? (
                <div className="p-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 size={40} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                   <p className="text-gray-500 max-w-xs">Your application to become a vendor has been received. We will review it shortly!</p>
                </div>
             ) : (
                <form onSubmit={handleVendorSubmit} className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Store Name</label>
                         <input 
                            type="text" 
                            required
                            value={vendorForm.storeName}
                            onChange={(e) => setVendorForm({...vendorForm, storeName: e.target.value})}
                            placeholder="e.g. My Awesome Shop"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Phone Number</label>
                         <input 
                            type="tel" 
                            required
                            value={vendorForm.phone}
                            onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                         />
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Store Description</label>
                         <textarea 
                            required
                            value={vendorForm.description}
                            onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                            placeholder="Tell us about what you sell..."
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none"
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Business Address</label>
                         <input 
                            type="text" 
                            required
                            value={vendorForm.address}
                            onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})}
                            placeholder="123 Business St, City"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                         />
                      </div>
                   </div>
                   
                   <div className="pt-2">
                      <button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                         {isSubmitting ? (
                            <>Processing...</>
                         ) : (
                            <>Submit Application</>
                         )}
                      </button>
                   </div>
                </form>
             )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;
