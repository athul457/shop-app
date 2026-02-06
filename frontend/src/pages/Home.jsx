import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, Lock, RefreshCcw, ArrowRight, Zap, Gift, Headphones } from "lucide-react";
import data from "../data/data";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Summer Collection",
      desc: "Discover the hottest trends for the season. Flat 50% Off on all new arrivals.",
      bg: "bg-gradient-to-r from-blue-600 to-blue-800",
      image: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 2,
      title: "Next-Gen Electronics",
      desc: "Upgrade your life with the latest gadgets. Smart technology for a smarter you.",
      bg: "bg-gradient-to-r from-emerald-600 to-teal-800",
      image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 3,
      title: "Modern Home Living",
      desc: "Transform your space with our premium furniture and decor collection.",
      bg: "bg-gradient-to-r from-purple-600 to-indigo-800",
      image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 4,
      title: "Exclusive Accessories",
      desc: "Complete your look with our curated collection of luxury watches and leather goods.",
      bg: "bg-gradient-to-r from-rose-500 to-pink-700",
      image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 5,
      title: "Active Performance",
      desc: "Reach your fitness goals with professional-grade sports equipment and apparel.",
      bg: "bg-gradient-to-r from-orange-500 to-amber-600",
      image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
    
  ];

  const features = [
    { icon: <Truck size={32} />, title: "Free Shipping", desc: "On all orders over $50" },
    { icon: <ShieldCheck size={32} />, title: "Secure Payment", desc: "100% protected payments" },
    { icon: <RefreshCcw size={32} />, title: "Easy Returns", desc: "30-day money back guarantee" },
    { icon: <Headphones size={32} />, title: "24/7 Support", desc: "Dedicated support team" },
  ];

  const categories = [
    { name: "Electronics", color: "bg-blue-100 text-blue-600", icon: <Zap /> },
    { name: "Fashion", color: "bg-pink-100 text-pink-600", icon: <Gift /> },
    { name: "Home & Living", color: "bg-orange-100 text-orange-600", icon: <ShoppingCart /> },
    { name: "Home & Living", color: "bg-orange-100 text-orange-600", icon: <ShoppingCart /> },
    { name: "Beauty", color: "bg-purple-100 text-purple-600", icon: <Star /> },
  ];

  // Fetch Coupons
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    const allOffers = JSON.parse(localStorage.getItem('mockVendorOffers') || '[]');
    const activeOffers = allOffers.filter(o => o.status === 'ACTIVE' && new Date(o.validUntil) >= new Date().setHours(0,0,0,0));
    setCoupons(activeOffers);
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    /* Simple alert or toast could go here, but keeping it minimal as per instructions */
    alert(`Coupon ${code} copied!`);
  };

  useEffect(() => {
    setProducts(data);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      
      {/* Hero Section */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
            <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'} ${slide.bg}`}
            >
                {/* Overlay Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative z-10">
                    <div className="w-full md:w-1/2 text-white p-6 md:p-12 animate-fade-in-up">
                        <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold mb-4 border border-white/30 uppercase tracking-wider">
                            Exclusive Offer
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                           {slide.title}
                        </h1>
                        <p className="text-lg md:text-2xl opacity-90 mb-8 max-w-lg font-light leading-relaxed">
                           {slide.desc}
                        </p>
                        <div className="flex gap-4">
                            <Link to="/login" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition transform shadow-xl flex items-center gap-2 group">
                                Shop Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {/* Floating Image (Decorative) */}
         <div className="hidden md:block absolute right-[10%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-8 border-white/20 shadow-2xl overflow-hidden animate-float z-10">
            <img src={slides[currentSlide].image} alt="Hero" className="w-full h-full object-cover" />
         </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, index) => (
                <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                />
            ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 mb-16">
         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                    <div className="p-4 bg-gray-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                        {feature.icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* Offers Section */}
      {coupons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-16">
           <div className="flex items-center gap-2 mb-8">
              <span className="text-2xl">🔥</span>
              <h2 className="text-3xl font-bold text-gray-900">Offers for You</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((offer) => (
                  <div key={offer.id} className="bg-white border border-dashed border-red-200 rounded-xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                      
                      <div className="relative z-10">
                          <h3 className="text-lg font-black text-gray-800 tracking-tight">
                              {offer.code}
                          </h3>
                          <p className="font-medium text-red-600 text-sm">
                              Get {offer.type === 'PERCENTAGE' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                              {offer.type === 'PERCENTAGE' && <span className="text-gray-400 text-xs ml-1">(Max ₹500)</span>}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Valid till {offer.validUntil}</p>
                      </div>

                      <button 
                          onClick={() => copyCode(offer.code)}
                          className="relative z-10 px-4 py-2 bg-red-100 text-red-700 font-bold text-sm rounded-lg hover:bg-red-200 transition-colors uppercase tracking-wide"
                      >
                          APPLY
                      </button>
                  </div>
              ))}
           </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <Link to="/login" className="text-blue-600 font-medium hover:underline">View All Categories</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
                <div key={idx} className={`${cat.color} p-8 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-sm border border-transparent hover:border-current hover:shadow-md h-48`}>
                    <div className="p-4 bg-white rounded-full shadow-sm text-inherit">
                        {cat.icon}
                    </div>
                    <span className="font-bold text-lg">{cat.name}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Featured Products: Big Discount */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
         <SectionHeader title="Big Discounts" subtitle="Unbeatable prices on premium items" />
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.category === 'Crockery').slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
         </div>
      </section>

      {/* Promotional Banner Middle */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="rounded-3xl overflow-hidden bg-gray-900 text-white relative h-[300px] flex items-center">
              <img src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Promo" className="absolute inset-0 w-full h-full object-cover opacity-400" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
              <div className="relative z-10 px-8 md:px-16 max-w-2xl">
                  <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-2 block">Limited Time Offer</span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Experience True Sound</h2>
                  <p className="text-gray-300 mb-8 text-lg">Premium Headphones starting at just $199. Immerse yourself in the music.</p>
                  <Link to="/login" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg inline-block">
                      Shop Collection
                  </Link>
              </div>
          </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
         <SectionHeader title="New Arrivals" subtitle="Fresh styles just added to the store" />
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.category === 'Fashion' || p.category === 'Accessories').slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
         </div>
      </section>

      {/* Best Sales */}
      <section className="bg-white py-16">
         <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Best Sales" subtitle="Top rated products loved by everyone" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.filter(p => p.category === 'Home Appliances').slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
         </div>
      </section>

    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
    <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 font-medium">{subtitle}</p>
        <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
    </div>
);

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

export default Home;
