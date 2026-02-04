import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">MultiMart</Link>
      
      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative">
          <ShoppingCart />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">0</span>
        </Link>
        
        {user ? (
          <Link to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/dashboard'} className="flex items-center gap-2 border px-3 py-1 rounded hover:bg-gray-100 font-medium">
             <User size={20} /> Dashboard
          </Link>
        ) : (
          <Link to="/login" className="flex items-center gap-2 border px-3 py-1 rounded hover:bg-gray-100">
             <User size={20} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
