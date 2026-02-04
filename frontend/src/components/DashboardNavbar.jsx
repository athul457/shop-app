import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Search, LogOut, Package, MapPin, Heart, Settings, ShoppingBag, Users } from 'lucide-react';

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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">MultiMart</Link>
          </div>

          {/* Admin Navigation */}
          {user?.role === 'admin' ? (
            <div className="hidden md:flex items-center gap-8">
                <Link to="/admin/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                    <ShoppingBag size={18} /> Products
                </Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                    <Package size={18} /> Orders
                </Link>
                <Link to="/admin/users" className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                    <Users size={18} /> Users
                </Link>
            </div>
          ) : (
            /* Search Bar for Non-Admin */
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search products..."
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
          <div className="flex items-center gap-4">
             {/* Dashboard Button (Non-Admin only or redundant?) 
                 User asked to removing unnecessary things for admin. 
                 Let's keep it simple: Admin doesn't need "Dashboard" button if they have nav links?
                 Actually, "Dashboard" button is just a link to /dashboard or /admin. 
                 For now, hide it for admin since they have specific links. 
             */}
             {user?.role !== 'admin' && (
                <Link 
                to='/dashboard' 
                className="hidden md:block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                >
                Dashboard
                </Link>
             )}

             {/* Cart (Non-Admin only) */}
             {user?.role !== 'admin' && (
                <Link to="/dashboard/cart" className="p-2 text-gray-500 hover:text-blue-600 transition-colors relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">{cartCount}</span>}
                </Link>
             )}

            {/* Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                {/* For Admin, show name prominently as requested. For User, only show profile image. */}
                {user?.role === 'admin' && (
                  <span className="hidden md:block font-medium text-sm">{user?.name} (Admin)</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out transform origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                  </div>
                  
                  {user?.role === 'admin' ? (
                    <>
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                        <Settings size={16} /> Dashboard Home
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/dashboard/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                        <Package size={16} /> Orders
                      </Link>
                      <Link to="/dashboard/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                        <MapPin size={16} /> Addresses
                      </Link>
                      <Link to="/dashboard/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                        <Heart size={16} /> Wishlist
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-100 mt-1"></div>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
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
