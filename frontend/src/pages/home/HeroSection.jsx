import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
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
  );
};

export default HeroSection;
