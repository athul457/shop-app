import { useState, useEffect } from "react";
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

  useEffect(() => {
    setProducts(data);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <HeroSection />
      <FeaturesSection />
      <OffersSection />
      <CategoriesSection />
      <BigDiscountsSection products={products} />
      <PromotionalBannerSection />
      <NewArrivalsSection products={products} />
      <BestSalesSection products={products} />
    </div>
  );
};

export default Home;
