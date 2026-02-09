import { Link } from "react-router-dom";

const PromotionalBannerSection = () => {
  return (
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
  );
};

export default PromotionalBannerSection;
