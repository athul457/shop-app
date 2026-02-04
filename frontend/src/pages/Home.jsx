import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, Lock, RefreshCcw } from "lucide-react";
import data from "../data/data"; // Import dummy data directly

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "50% Off Your 1st Order",
      desc: "Sign up now and get a massive discount on your first purchase!",
      bg: "bg-blue-600"
    },
    {
      id: 2,
      title: "Free Home Delivery",
      desc: "We deliver straight to your doorstep within 24 hours, completely free.",
      bg: "bg-green-600"
    },
    {
      id: 3,
      title: "Premium Quality Guaranteed",
      desc: "Shop with confidence. Money-back guarantee on all products.",
      bg: "bg-purple-600"
    },
    {
       id: 4,
       title: "New Arrivals Daily",
       desc: "Check out the latest trends in Fashion and Electronics.",
       bg: "bg-orange-600"
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setProducts(data);

    // Slider Interval
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full h-auto min-h-screen bg-gray-50 pb-12">
      {/* Hero Carousel */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-12">
        <div className={`relative rounded-2xl overflow-hidden shadow-2xl h-[300px] md:h-[400px] flex items-center transition-colors duration-700 ${slides[currentSlide].bg}`}>
           {/* Background Overlay/Pattern could go here */}
           
           <div className="w-full text-center px-6 md:px-20 text-white z-10 transition-opacity duration-500 ease-in-out">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
                 {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
                 {slides[currentSlide].desc}
              </p>
              <Link to="/login" className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition transform shadow-lg inline-block">
                 Shop Now
              </Link>
           </div>

           {/* Dots/Indicators */}
           <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {slides.map((_, index) => (
                 <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                 />
              ))}
           </div>
        </div>
      </div>

      {/* Sections Wrapper */}
      <div className="space-y-16 pb-12">
        
        {/* Big Discount Section */}
        <section className="bg-blue-50 py-12">
           <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
                 <span className="bg-blue-600 text-white p-2 rounded-lg">50% Off</span> Big Discount
              </h2>
              <div className="flex flex-wrap gap-8 justify-center items-center">
                {products.filter(p => p.category === 'Electronics').slice(0, 4).map((product) => (
                   <List key={product.id} product={product} />
                ))}
              </div>
           </div>
        </section>

        {/* New Arrivals Section */}
        <section className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
              <span className="text-green-500">New</span> Arrivals
           </h2>
           <div className="flex flex-wrap gap-8 justify-center items-center">
             {products.filter(p => p.category === 'Fashion' || p.category === 'Accessories').slice(0, 4).map((product) => (
                <List key={product.id} product={product} />
             ))}
           </div>
        </section>

        {/* Best Sales Section */}
        <section className="bg-gray-100 py-12">
           <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Best Sales</h2>
              <div className="flex flex-wrap gap-8 justify-center items-center">
                {products.filter(p => p.category === 'Home & Living').slice(0, 4).map((product) => (
                   <List key={product.id} product={product} />
                ))}
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

const List = ({ product }) => {
  return (
     <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 w-[300px] h-[500px] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Image Container */}
        <div className="w-full h-[250px] overflow-hidden bg-gray-100 relative group">
           <img
             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             src={product.image_url} // Mapped field
             alt={product.name}
             onError={(e) => { e.target.src = 'https://placehold.co/300x250?text=No+Image'; }}
           />
           {/* Rating Badge */}
           <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-800">{product.rating}</span>
           </div>
        </div>

        {/* Card Details */}
        <div className="p-5 flex flex-col justify-between flex-grow">
           <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1" title={product.name}>
                 {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-medium">
                 {product.category}
              </p>
              
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                 <span className="text-sm text-gray-400 line-through mb-1">${(product.price * 1.3).toFixed(2)}</span>
                 <span className="text-xs font-bold text-green-600 mb-1 bg-green-100 px-1 rounded">30% OFF</span>
              </div>
           </div>

           {/* CTA Buttons */}
           <div className="flex flex-col gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition active:scale-95 font-medium shadow-blue-200 shadow-lg">
                 <ShoppingCart size={18} /> Add To Cart
              </button>
              <button className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition active:scale-95 font-medium hover:text-red-500 hover:border-red-200">
                 <Heart size={18} /> Add To Wishlist
              </button>
           </div>
        </div>
     </div>
  );
};

export default Home;
