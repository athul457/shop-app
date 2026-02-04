import { Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      <div className="bg-white rounded-lg shadow-sm">
         {wishlistItems.map((item, index) => (
            <div key={item._id || item.id} className={`p-6 flex flex-col md:flex-row items-center gap-6 ${index !== wishlistItems.length - 1 ? 'border-b' : ''}`}>
               <Link to={`/dashboard/product/${item._id || item.id}`} className="shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-md hover:opacity-80 transition-opacity" />
               </Link>
               
               <div className="flex-grow text-center md:text-left">
                  <Link to={`/dashboard/product/${item.id}`} className="hover:text-blue-600 transition-colors">
                     <h3 className="font-semibold text-lg">{item.name}</h3>
                  </Link>
                  <p className="text-blue-600 font-bold mt-1">${item.price}</p>
                  <p className={`text-sm mt-1 ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                     {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
               </div>

               <div className="flex gap-3">
                  <button 
                    onClick={() => removeFromWishlist(item._id || item.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                     <Trash2 size={18} /> Remove
                  </button>
                  <button 
                     disabled={item.stock === 0}
                     onClick={() => addToCart(item)}
                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                     <ShoppingCart size={18} /> Add to Cart
                  </button>
               </div>
            </div>
         ))}

         {wishlistItems.length === 0 && (
            <div className="p-12 text-center text-gray-500">
               Your wishlist is empty.
            </div>
         )}
      </div>
    </div>
  );
};

export default Wishlist;
