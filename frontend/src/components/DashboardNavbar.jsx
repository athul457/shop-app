import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Search, LogOut, Package, MapPin, Heart, Settings, ShoppingBag, Users, Bell, ChevronDown } from 'lucide-react';

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
    </nav>
  );
};

export default DashboardNavbar;
