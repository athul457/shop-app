import DynamicIcon from "../../components/DynamicIcon";

const FeaturesSection = ({ features }) => {
  if (!features) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 mb-16">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-4 group">
            <div className="p-4 bg-gray-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <DynamicIcon name={feature.icon} size={32} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
