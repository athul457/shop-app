import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const BigDiscountsSection = ({ products }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <SectionHeader title="Big Discounts" subtitle="Unbeatable prices on premium items" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.filter(p => p.category === 'Crockery').slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BigDiscountsSection;
