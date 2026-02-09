import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const NewArrivalsSection = ({ config, products }) => {
  if (!config) return null;
  const { title, subtitle, categories, count } = config;

  // Handle case where categories might be undefined or string
  const categoryArray = (Array.isArray(categories) ? categories : [categories])
      .map(c => c.trim().toLowerCase());

  const filteredProducts = products
      .filter(p => categoryArray.includes(p.category.toLowerCase()))
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

export default NewArrivalsSection;
