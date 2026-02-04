import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Filter, Heart } from 'lucide-react';
import { fetchProducts } from '../../api/product.api';
import PromotionalBanner from '../../components/PromotionalBanner';
import { useWishlist } from '../../context/WishlistContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [minRating, setMinRating] = useState(0);

  // Get Search Param
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Derived Data for Options
  const categories = ["All", "Fashion", "Home Appliances", "Children Items", "Crockery", "Bags", "Animal Foods", "Beauty Products"];
  const vendors = ["All", ...new Set(products.map(p => p.vendorId))];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category Filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
      
      // Vendor Filter
      if (selectedVendor !== "All" && product.vendorId !== selectedVendor) return false;

      // Price Filter
      if (product.price < priceRange.min || product.price > priceRange.max) return false;

      // Rating Filter
      if (product.rating < minRating) return false;

      // Search Filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && !product.description.toLowerCase().includes(searchQuery)) {
         return false;
      }

      return true;
    });
  }, [products, selectedCategory, selectedVendor, priceRange, minRating, searchQuery]);

  // Reset Filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedVendor("All");
    setPriceRange({ min: 0, max: 1000 });
    setMinRating(0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <button 
        className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold w-full justify-center"
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
      >
        <Filter size={20} /> Filters
      </button>

      {/* Sidebar Filters */}
      <aside className={`w-full lg:w-64 flex-shrink-0 lg:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h2 className="font-bold text-lg flex items-center gap-2"><Filter size={20} /> Filters</h2>
               <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">Reset All</button>
            </div>

            {/* Vendor Filter */}
            <div className="mb-8">
               <h3 className="font-semibold text-gray-800 mb-3">Vendor</h3>
               <select 
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
               >
                  {vendors.map(vendor => (
                     <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
               </select>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
               <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
               <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded p-1 text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded p-1 text-sm"
                    placeholder="Max"
                  />
               </div>
            </div>

            {/* Rating Filter */}
            <div>
               <h3 className="font-semibold text-gray-800 mb-3">Rating</h3>
               <div className="space-y-2">
                 {[4, 3, 2, 1].map(star => (
                    <label key={star} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                       <input 
                          type="radio" 
                          name="rating"
                          checked={minRating === star}
                          onChange={() => setMinRating(star)}
                          className="text-blue-600 focus:ring-blue-500"
                       />
                       <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={14} fill={i < star ? "currentColor" : "none"} className={i >= star ? "text-gray-300" : ""} />
                          ))}
                       </div>
                       <span>& Up</span>
                    </label>
                 ))}
                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                       <input 
                          type="radio" 
                          name="rating"
                          checked={minRating === 0}
                          onChange={() => setMinRating(0)}
                          className="text-blue-600 focus:ring-blue-500"
                       />
                       Any Rating
                 </label>
               </div>
            </div>

         </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        
        <PromotionalBanner />

        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold">Browse Products</h1>
           <span className="text-gray-500 text-sm">{filteredProducts.length} items found</span>
        </div>

        {/* Category Filter Buttons */}
        <div className="sticky top-16 z-30 bg-gray-50 py-4 mb-8 flex flex-wrap gap-2 -mx-2 px-2">
            {categories.map((category) => (
            <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedCategory === category
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
                {category}
            </button>
            ))}
        </div>

        {filteredProducts.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              <button onClick={resetFilters} className="text-blue-600 font-bold mt-2 hover:underline">Clear Filters</button>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden group">
                <Link to={`/dashboard/product/${product._id}`} className="block h-48 overflow-hidden bg-gray-100 relative">
                   <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }} 
                   />
                   <div className="absolute top-2 right-2 flex items-center gap-2">
                       <button 
                          onClick={(e) => {
                             e.preventDefault(); // Prevent navigating to details
                             toggleWishlist(product);
                          }}
                          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
                       >
                          <Heart 
                             size={18} 
                             className={`${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                       </button>

                       <span className="bg-white/80 backdrop-blur-sm px-2 py-2 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm">
                         <Star size={14} className="text-yellow-500 fill-yellow-500" /> {product.rating}
                       </span>
                   </div>
                </Link>
                
                <div className="p-4">
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex-1 min-w-0 mr-2">
                        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">{product.category}</span>
                        <h3 className="font-bold text-gray-900 truncate" title={product.name}>{product.name}</h3>
                        <p className="text-xs text-gray-500">by {product.vendorId}</p>
                     </div>
                     <p className="font-bold text-lg text-gray-900">${product.price}</p>
                   </div>
                   
                   <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                   
                   <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                      
                      <button 
                         disabled={product.stock === 0}
                         onClick={() => navigate(`/dashboard/product/${product._id}`)}
                         className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                         <ShoppingCart size={16} /> View
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
