import { useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import data from "../data/data";

import HeroSection from "./home/HeroSection";
import FeaturesSection from "./home/FeaturesSection";
import OffersSection from "./home/OffersSection";
import CategoriesSection from "./home/CategoriesSection";
import BigDiscountsSection from "./home/BigDiscountsSection";
import PromotionalBannerSection from "./home/PromotionalBannerSection";
import NewArrivalsSection from "./home/NewArrivalsSection";
import BestSalesSection from "./home/BestSalesSection";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Products
    setProducts(data);

    // 2. Fetch Home Page Configuration
    const fetchConfig = async () => {
        try {
            const { data } = await axios.get('/api/home');
            setConfig(data);
        } catch (error) {
            console.error("Error fetching home config:", error);
            // Fallback to null config or handle error UI
        } finally {
            setLoading(false);
        }
    };

    fetchConfig();
  }, []);

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader className="animate-spin text-blue-600" size={40} />
          </div>
      );
  }

  // If config failed to load for some reason, we could show an error or fallback
  if (!config) {
      return <div className="text-center py-20">Failed to load home page content.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <HeroSection slides={config.heroSlides} />
      <FeaturesSection features={config.features} />
      <OffersSection offers={config.offers} />
      <CategoriesSection categories={config.categories} />
      
      <BigDiscountsSection 
          config={config.bigDiscounts} 
          products={products} 
      />
      
      <PromotionalBannerSection banner={config.promotionalBanner} />
      
      <NewArrivalsSection 
          config={config.newArrivals} 
          products={products} 
      />
      
      <BestSalesSection 
          config={config.bestSales} 
          products={products} 
      />
    </div>
  );
};

export default Home;
