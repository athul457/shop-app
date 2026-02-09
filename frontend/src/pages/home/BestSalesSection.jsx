import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const BestSalesSection = ({ products }) => {
  return (
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
  );
};

export default BestSalesSection;
