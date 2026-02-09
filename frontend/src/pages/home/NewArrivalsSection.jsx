import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const NewArrivalsSection = ({ products }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <SectionHeader title="New Arrivals" subtitle="Fresh styles just added to the store" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.filter(p => p.category === 'Fashion' || p.category === 'Accessories').slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
