import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Filter, Heart, ChevronDown, Check, X, Search, SlidersHorizontal } from 'lucide-react';
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

  if (loading) {
     return <div className="min-h-[60vh] flex items-center justify-center text-blue-600 font-medium animate-pulse">Loading products...</div>
  }

  return (
    <div className="pb-12">
        {/* Section 1: Promotional Banner (Sliding Cards) */}
        <div className="mb-10">
            <PromotionalBanner />
        </div>

        {/* Section 2: Products and Filter Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Mobile Filter Toggle */}
            <button 
                className="lg:hidden flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl font-bold w-full shadow-lg"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
                <SlidersHorizontal size={20} /> Show Filters
            </button>

            {/* Sidebar Filters */}
            <aside className={`fixed inset-0 z-40 lg:sticky lg:top-24 lg:z-0 lg:block lg:w-72 flex-shrink-0 transition-transform duration-300 lg:translate-x-0 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-hide ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                
                {/* Mobile Backdrop */}
                <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={() => setIsMobileFilterOpen(false)}></div>

                <div className="relative bg-white lg:bg-transparent h-full lg:h-auto overflow-y-auto lg:overflow-visible p-6 lg:p-0 w-80 lg:w-full">
                    <div className="lg:hidden flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={() => setIsMobileFilterOpen(false)}><X size={24} /></button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-50">
                        <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <Filter size={18} className="text-blue-600" /> Filters
                        </h2>
                        <button onClick={resetFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors">
                            Reset
                        </button>
                        </div>

                        {/* Vendor Filter */}
                        <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Vendor</h3>
                        <div className="relative">
                            <select 
                                value={selectedVendor}
                                onChange={(e) => setSelectedVendor(e.target.value)}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-colors cursor-pointer text-sm"
                            >
                                {vendors.map(vendor => (
                                    <option key={vendor} value={vendor}>{vendor}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Price Range</h3>
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                <input 
                                    type="number" 
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 pl-6 pr-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <span className="text-gray-400 font-medium">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                <input 
                                    type="number" 
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 pl-6 pr-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="1000"
                                />
                            </div>
                        </div>
                        </div>

                        {/* Rating Filter */}
                        <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Rating</h3>
                        <div className="space-y-2">
                            {[4, 3, 2, 1].map(star => (
                                <label key={star} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${minRating === star ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                        {minRating === star && <Check size={12} className="text-white" />}
                                    </div>
                                    <input 
                                        type="radio" 
                                        name="rating"
                                        className="hidden"
                                        checked={minRating === star}
                                        onChange={() => setMinRating(star)}
                                    />
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < star ? "currentColor" : "none"} className={i >= star ? "text-gray-200" : ""} />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600">& Up</span>
                                </label>
                            ))}
                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mt-2">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${minRating === 0 ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                    {minRating === 0 && <Check size={12} className="text-white" />}
                                </div>
                                <input 
                                    type="radio" 
                                    name="rating"
                                    className="hidden"
                                    checked={minRating === 0}
                                    onChange={() => setMinRating(0)}
                                />
                                <span className="text-sm text-gray-600 font-medium">Any Rating</span>
                            </label>
                        </div>
                        </div>

                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
                        <p className="text-gray-500 text-sm mt-1">Found {filteredProducts.length} results matching your criteria</p>
                    </div>
                </div>

                {/* Category Filter Buttons */}
                <div className="sticky top-20 z-20 bg-gray-50/95 backdrop-blur py-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar mask-fade">
                    <div className="flex gap-2 min-w-min pb-2">
                        {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                            selectedCategory === category
                                ? "bg-gray-900 text-white border-gray-900 shadow-md ring-2 ring-gray-200"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {category}
                        </button>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">We couldn't find any products matching your current filters. Try adjusting your search or filters.</p>
                    <button 
                        onClick={resetFilters} 
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Clear All Filters
                    </button>
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                    <div key={product._id} className="group bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative">
                        
                        {/* Wishlist Button */}
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product);
                            }}
                            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
                                isInWishlist(product._id) 
                                ? 'bg-white text-red-500 scale-110 shadow-md' 
                                : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'
                            }`}
                        >
                            <Heart size={18} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                        </button>

                        {/* Image */}
                        <div 
                            onClick={() => navigate(`/dashboard/product/${product._id}`)}
                            className="relative cursor-pointer h-56 overflow-hidden bg-gray-100"
                        >
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }} 
                        />
                        
                        {/* Stock Badge */}
                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-md shadow-sm transform -rotate-2">Out of Stock</span>
                            </div>
                        )}
                        
                        {/* Rating Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm text-xs font-bold text-gray-700">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" /> {product.rating}
                        </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                        <div className="mb-3">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{product.category}</span>
                        </div>
                        
                        <h3 
                                onClick={() => navigate(`/dashboard/product/${product._id}`)}
                                className="font-bold text-gray-900 text-lg mb-1 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1" 
                                title={product.name}
                        >
                            {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">Sold by {product.vendorId}</p>
                        
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{product.description}</p>
                        
                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                            <div>
                                <span className="block text-xs text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                                <span className="text-xl font-extrabold text-gray-900">${product.price}</span>
                            </div>
                            
                            <button 
                                disabled={product.stock === 0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/dashboard/product/${product._id}`);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-bold text-sm shadow-lg shadow-gray-200 active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed group/btn"
                            >
                                <ShoppingCart size={16} className="group-hover/btn:animate-bounce" /> Buy Now
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Products;
