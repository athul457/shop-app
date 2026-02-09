import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const BigDiscountsSection = ({ config, products }) => {
  if (!config) return null;
  const { title, subtitle, category, count } = config;

  const filteredProducts = products
      .filter(p => {
          if (!category) return false;
          const targetCategories = category.split(',').map(c => c.trim().toLowerCase());
          return p.category && targetCategories.includes(p.category.toLowerCase());
      })
      .slice(0, count || 4);

  if (filteredProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BigDiscountsSection;
