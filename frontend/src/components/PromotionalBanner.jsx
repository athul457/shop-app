import { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const PromotionalBanner = () => {
  const scrollRef = useRef(null);

  const promos = [
    {
      id: 1,
      title: "Children's Items",
      discount: "25% OFF",
      bg: "bg-orange-100",
      image: "https://images.pexels.com/photos/1194027/pexels-photo-1194027.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 2,
      title: "Fashion Best Sales",
      discount: "Hot Deals",
      bg: "bg-blue-100",
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      title: "Home Appliances",
      discount: "Up to 40% OFF",
      bg: "bg-green-100",
      image: "https://images.pexels.com/photos/213162/pexels-photo-213162.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 4,
      title: "Beauty Products",
      discount: "Buy 1 Get 1",
      bg: "bg-pink-100",
      image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 5,
      title: "Bags Collection",
      discount: "New Arrivals",
      bg: "bg-purple-100",
      image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 6,
      title: "Pet Foods",
      discount: "15% OFF",
      bg: "bg-yellow-100",
      image: "https://images.pexels.com/photos/27175967/pexels-photo-27175967.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollInterval = setInterval(() => {
        // Calculate dynamic width of one item
        const itemWidth = scrollContainer.clientWidth / 2;

        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) { // -10 tolerance
            // Reset to start
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Scroll one item width
            scrollContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    }, 3000); // 3 seconds

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="mb-8">
       <div 
         ref={scrollRef}
         className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
       >
          {promos.map((promo) => (
             <div 
               key={promo.id} 
               className={`flex-shrink-0 w-[calc(50%-0.5rem)] h-48 rounded-2xl relative overflow-hidden shadow-sm snap-center group cursor-pointer hover:shadow-md transition-shadow`}
             >
                {/* Background Image */}
                <div className="absolute inset-0">
                   <img 
                     src={promo.image} 
                     alt={promo.title} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                   <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold w-fit mb-2 border border-white/30">
                      {promo.discount}
                   </span>
                   <h3 className="text-xl font-bold leading-tight">{promo.title}</h3>
                   <div className="flex items-center gap-1 text-sm font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      Shop Now <ArrowRight size={14} />
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default PromotionalBanner;
