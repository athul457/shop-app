import { ShoppingCart, Heart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
     <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 group h-full flex flex-col">
        <div className="relative h-[250px] overflow-hidden bg-gray-100">
           <img
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             src={product.image_url} 
             alt={product.name}
             onError={(e) => { e.target.src = 'https://placehold.co/400x350?text=Product'; }}
           />
           {/* Badges */}
           <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">SALE</span>
           </div>
           
           {/* Quick Actions overlay */}
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
               <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                   <ShoppingCart size={20} />
               </button>
               <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100">
                   <Heart size={20} />
               </button>
           </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
           <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors" title={product.name}>{product.name}</h3>
           
           <div className="flex items-center gap-1 mb-3">
               <Star size={14} className="text-yellow-400 fill-yellow-400" />
               <span className="text-sm font-medium text-gray-600">{product.rating}</span>
               <span className="text-xs text-gray-400 ml-1">(120 reviews)</span>
           </div>

           <div className="mt-auto flex items-center justify-between">
               <div className="flex flex-col">
                   <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                   <span className="text-sm text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
               </div>
               <button className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                   Details
               </button>
           </div>
        </div>
     </div>
  );
};

export default ProductCard;
