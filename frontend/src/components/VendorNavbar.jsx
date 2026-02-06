import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShoppingBag, Store } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const VendorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link to="/vendor" className="flex items-center gap-2 group">
                <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700 transition-all">
                Vendor<span className="text-gray-800">Hub</span>
                </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
             <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-50 transition-all">
                <ShoppingBag size={18} />
                Back To Shop
             </Link>

             <div className="h-6 w-px bg-gray-200"></div>

             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 p-[2px] shadow-sm">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {(user?.profileImage) ? (
                            <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-purple-600 font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">Vendor Account</p>
                </div>
             </div>

             <button 
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Sign Out"
             >
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default VendorNavbar;
