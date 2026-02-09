
const SectionHeader = ({ title, subtitle }) => (
    <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 font-medium">{subtitle}</p>
        <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
    </div>
);

export default SectionHeader;
