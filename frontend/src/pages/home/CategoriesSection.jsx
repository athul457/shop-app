import { Link } from "react-router-dom";
import DynamicIcon from "../../components/DynamicIcon";

const CategoriesSection = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
        <Link to="/login" className="text-blue-600 font-medium hover:underline">View All Categories</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className={`${cat.color} p-8 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-sm border border-transparent hover:border-current hover:shadow-md h-48`}>
            <div className="p-4 bg-white rounded-full shadow-sm text-inherit">
               <DynamicIcon name={cat.icon} />
            </div>
            <span className="font-bold text-lg">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
