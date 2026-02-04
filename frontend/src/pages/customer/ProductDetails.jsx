import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Minus, Plus, Heart, ArrowLeft } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../../api/product.api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist(); 
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
     const load = async () => {
         try {
             const data = await fetchProductById(id);
             setProduct(data);
             
             // Fetch all products for related (filter by category)
             const allProducts = await fetchProducts();
             setRelatedProducts(allProducts.filter(p => p.category === data.category && p._id !== data._id));

         } catch (error) {
             toast.error("Failed to load product");
             navigate('/dashboard');
         } finally {
             setLoading(false);
         }
     };
     load();
  }, [id, navigate]);

  // State for reviews
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const { data } = await axios.get(`/api/reviews/${id}`);
        setReviews(data);
      } catch (error) {
        // Silent failure for reviews if endpoint doesn't exist yet
        console.log("Reviews not loaded");
      } finally {
        setLoadingReviews(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  // Check if user has purchased the product
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
        if (!user) {
            setHasPurchased(false);
            return;
        }

        try {
            setCheckingPurchase(true);
            const token = localStorage.getItem('token');
            const { data: myOrders } = await axios.get('/api/orders/myorders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Check if any paid order contains this product
            const bought = myOrders.some(order => 
                order.isPaid && 
                order.orderItems.some(item => (item.product || item._id) === id || item.name === product?.name) // Fallback to name match if IDs vary or product ref is missing
            );
            
            // For robust checking with ID, ensure orderItems structure matches. 
            // Usually item.product is the ID ref. adjusting check:
             const boughtById = myOrders.some(order => 
                order.isPaid && 
                order.orderItems.some(item => {
                   // item.product might be an object or string depending on population
                   const pId = typeof item.product === 'object' ? item.product._id : item.product;
                   return pId === id;
                })
            );

            setHasPurchased(boughtById);
        } catch (error) {
            console.error("Failed to check purchase status", error);
            setHasPurchased(false);
        } finally {
            setCheckingPurchase(false);
        }
    };

    if (user && id) {
        checkPurchaseStatus();
    }
  }, [user, id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    try {
      const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };

      const reviewData = {
        productId: id,
        rating,
        comment
      };

      const { data: newReview } = await axios.post('/api/reviews', reviewData, config);
      
      setReviews([newReview, ...reviews]);
      setComment("");
      toast.success("Review submitted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading product...</div>;

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <Link to="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  // Calculate average rating from real reviews or fallback to dummy rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left: Image */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
             <img 
               src={product.image} 
               alt={product.name} 
               className="max-h-[400px] object-contain hover:scale-105 transition-transform duration-300" 
               onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
             />
          </div>

          {/* Right: Info */}
          <div>
              <div className="flex justify-between items-start">
                  <div>
                      <span className="text-blue-600 font-bold uppercase text-sm tracking-wider">{product.category}</span>
                      <h1 className="text-3xl font-bold mt-2 text-gray-900">{product.name}</h1>
                      <div className="flex items-center gap-2 mt-2">
                          <div className="flex text-yellow-500">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} />
                             ))}
                          </div>
                          <span className="text-gray-500 text-sm">({product.rating} Rating)</span>
                      </div>
                  </div>
                  <button 
                     onClick={() => toggleWishlist(product)}
                     className={`p-3 rounded-full border shadow-sm transition-all ${isInWishlist(product._id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'}`}
                  >
                     <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                  </button>
              </div>

              <div className="mt-6">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  <span className={`block mt-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {product.stock > 0 ? `${product.stock} Units in Stock` : 'Out of Stock'}
                  </span>
              </div>

              <p className="mt-6 text-gray-600 leading-relaxed border-t border-b border-gray-100 py-6">
                 {product.description}
              </p>

             {/* Vendor Info */}
             <div className="border-t border-b border-gray-100 py-4 mb-8">
                <p className="text-sm text-gray-500">Sold by <span className="font-bold text-gray-900">{product.vendorId}</span></p>
             </div>
             {/* Actions */}
             <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                   <ShoppingCart size={20} /> Add to Cart
                </button>
                <button className="bg-gray-100 text-gray-600 p-4 rounded-xl hover:bg-gray-200 transition-colors">
                   <Heart size={24} />
                </button>
             </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* Review List */}
               <div className="lg:col-span-7 space-y-8">
                  {loadingReviews ? (
                    <p>Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((review) => (
                       <div key={review._id} className="bg-gray-50 p-6 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                   {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div>
                                   <p className="font-bold text-gray-900">{review.userName || 'Anonymous'}</p>
                                   <div className="flex text-yellow-500 text-xs">
                                      {[...Array(5)].map((_, i) => (
                                         <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                      ))}
                                   </div>
                                </div>
                             </div>
                             <span className="text-sm text-gray-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                       </div>
                    ))
                  )}
               </div>

               {/* Add Review Form */}
               <div className="lg:col-span-5">
                  <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm sticky top-24">
                     <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                     
                     {user ? (
                        hasPurchased ? (
                            <form onSubmit={handleSubmitReview}>
                               <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                  <div className="flex gap-2">
                                     {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                          type="button" 
                                          key={star}
                                          onClick={() => setRating(star)}
                                          className={`p-1 focus:outline-none ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                           <Star size={24} fill="currentColor" />
                                        </button>
                                     ))}
                                  </div>
                               </div>
                               
                               <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                                  <textarea 
                                     rows="4"
                                     value={comment}
                                     onChange={(e) => setComment(e.target.value)}
                                     className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                     placeholder="Share your thoughts about this product..."
                                     required
                                  ></textarea>
                               </div>

                               <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                                  Submit Review
                               </button>
                            </form>
                        ) : (
                            <div className="text-center py-6 bg-yellow-50 rounded-lg border border-dashed border-yellow-200">
                               <p className="text-yellow-700 font-medium mb-1">Verify Purchase to Review</p>
                               <p className="text-yellow-600 text-sm">You must purchase this product to leave a review.</p>
                            </div>
                        )
                     ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                           <p className="text-gray-500 mb-4">Please login to write a review</p>
                           <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 inline-block">Login Now</Link>
                        </div>
                     )}
                  </div>
               </div>
            </div>
        </div>

        {/* Suggested Products Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts
                  .slice(0, 4)
                  .map(suggested => (
                    <Link key={suggested._id} to={`/dashboard/product/${suggested._id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden block">
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                             <img 
                                src={suggested.image} 
                                alt={suggested.name} 
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Product'; }}
                             />
                             {suggested.stock === 0 && (
                                <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>
                             )}
                        </div>
                        <div className="p-4">
                             <h3 className="font-bold text-gray-900 truncate mb-1">{suggested.name}</h3>
                             <p className="text-blue-600 font-bold">${suggested.price}</p>
                        </div>
                    </Link>
                  ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
