import { Link } from 'react-router-dom';
import { ShoppingCart, User, LayoutDashboard, LogIn } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
              GlobalCart
            </span>
          </Link>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <Link 
                to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/dashboard'} 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 font-medium rounded-full hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
              >
                 <LayoutDashboard size={18} />
                 <span>Dashboard</span>
              </Link>
            )}
            
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 text-white font-bold text-sm tracking-wide shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
               <User size={18} />
               <span>Login</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
