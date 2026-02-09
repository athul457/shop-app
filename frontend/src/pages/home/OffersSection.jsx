import { useState, useEffect } from "react";

const OffersSection = () => {
  const [coupons, setCoupons] = useState([]);
  
  useEffect(() => {
    const allOffers = JSON.parse(localStorage.getItem('mockVendorOffers') || '[]');
    const activeOffers = allOffers.filter(o => o.status === 'ACTIVE' && new Date(o.validUntil) >= new Date().setHours(0,0,0,0));
    setCoupons(activeOffers);
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon ${code} copied!`);
  };

  if (coupons.length === 0) return null;

  return (
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
  );
};

export default OffersSection;
