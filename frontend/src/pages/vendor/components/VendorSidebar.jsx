import { X, ChevronRight } from 'lucide-react';

const VendorSidebar = ({ 
    activeSection, 
    setActiveSection, 
    isSidebarOpen, 
    setSidebarOpen, 
    storeName,
    sidebarItems 
}) => {
    return (
        <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-20`}>
            <div className="p-6 flex items-center justify-between">
                {isSidebarOpen ? (
                    <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Vendor<span className="font-light text-gray-400">Hub</span>
                    </h1>
                ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                )}
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                    {isSidebarOpen ? <X size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            activeSection === item.id 
                            ? 'bg-blue-50 text-blue-600 shadow-sm font-semibold' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <item.icon size={20} />
                        {isSidebarOpen && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 ${!isSidebarOpen && 'justify-center'}`}>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                        {storeName.charAt(0)}
                    </div>
                    {isSidebarOpen && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{storeName}</p>
                            <p className="text-xs text-gray-500 truncate">Online</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default VendorSidebar;
