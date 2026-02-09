import { Link } from "react-router-dom";

const PromotionalBannerSection = ({ banner }) => {
  if (!banner) return null;
  const { title, subtitle, description, image, buttonText } = banner;

  return (
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <div className="rounded-3xl overflow-hidden bg-gray-900 text-white relative h-[300px] flex items-center">
        <img src={image} alt="Promo" className="absolute inset-0 w-full h-full object-cover opacity-400" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-2 block">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-gray-300 mb-8 text-lg">{description}</p>
          <Link to="/login" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg inline-block">
            {buttonText || "Shop Collection"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBannerSection;
