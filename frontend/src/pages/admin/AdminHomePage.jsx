import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Plus, Trash2, LayoutTemplate, Image, Tag, Grid, ShoppingBag, Megaphone, Percent, CheckCircle } from 'lucide-react';
import DynamicIcon from '../../components/DynamicIcon';

const AdminHomePage = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const { data } = await axios.get('/api/home');
            setConfig(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching home config", error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const configHeader = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.put('/api/home', config, configHeader);
            alert('Home page updated successfully!');
        } catch (error) {
            console.error("Error updating home config", error);
            alert('Failed to update home page');
        } finally {
            setSaving(false);
        }
    };

    const handleArrayChange = (section, index, field, value) => {
        const newArray = [...config[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        setConfig({ ...config, [section]: newArray });
    };

    const handleAddArrayItem = (section, initialItem) => {
        setConfig({ ...config, [section]: [...config[section], initialItem] });
    };

    const handleRemoveArrayItem = (section, index) => {
        const newArray = config[section].filter((_, i) => i !== index);
        setConfig({ ...config, [section]: newArray });
    };

    const handleNestedChange = (section, field, value) => {
        setConfig({
            ...config,
            [section]: { ...config[section], [field]: value }
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    const tabs = [
        { id: 'hero', label: 'Hero Slides', icon: <Image size={20} />, desc: 'Manage main carousel' },
        { id: 'features', label: 'Features', icon: <LayoutTemplate size={20} />, desc: 'Service highlights' },
        { id: 'categories', label: 'Categories', icon: <Grid size={20} />, desc: 'Homepage grid' },
        { id: 'offers', label: 'Offers', icon: <Percent size={20} />, desc: 'Coupons & deals' },
        { id: 'products', label: 'Product Sections', icon: <ShoppingBag size={20} />, desc: 'Featured collections' },
        { id: 'banner', label: 'Promo Banner', icon: <Megaphone size={20} />, desc: 'Large promotional area' },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-24 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-30 opacity-95 backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Home Page Editor</h1>
                    <p className="text-gray-500 text-sm mt-1">Customize the look and feel of your storefront</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-1 ${
                        saving 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-blue-200'
                    }`}
                >
                    {saving ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent" /> : <Save size={20} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-72 flex flex-col gap-2 shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-32">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-200 group ${
                                activeTab === tab.id 
                                ? 'bg-blue-50 text-blue-700 shadow-sm border-blue-100 border' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                            }`}
                        >
                            <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'bg-gray-100 group-hover:bg-white'}`}>
                                {tab.icon}
                            </div>
                            <div>
                                <span className="font-bold block text-sm">{tab.label}</span>
                                <span className="text-xs opacity-70 font-normal">{tab.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] w-full">
                    
                    {activeTab === 'hero' && (
                        <div>
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Hero Slides</h2>
                                    <p className="text-gray-500 text-sm">Manage the main carousel images and text.</p>
                                </div>
                                <button 
                                    onClick={() => handleAddArrayItem('heroSlides', { title: 'New Slide', desc: '', bg: 'bg-blue-500', image: '' })}
                                    className="text-sm bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors border border-blue-100"
                                >
                                    <Plus size={18} /> Add Slide
                                </button>
                            </div>
                            <div className="space-y-6">
                                {config.heroSlides.map((slide, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-6 relative bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">Slide {index + 1}</span>
                                            <button 
                                                onClick={() => handleRemoveArrayItem('heroSlides', index)}
                                                className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 hover:border-red-200 transition-colors"
                                                title="Remove Slide"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                                            <div className="md:col-span-4 aspect-video bg-gray-200 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                                                {slide.image ? (
                                                    <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Image size={32} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:col-span-8 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                                                        <input 
                                                            value={slide.title} 
                                                            onChange={e => handleArrayChange('heroSlides', index, 'title', e.target.value)}
                                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                                                            placeholder="Summer Collection"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                                                        <textarea 
                                                            value={slide.desc} 
                                                            onChange={e => handleArrayChange('heroSlides', index, 'desc', e.target.value)}
                                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-20 resize-none text-sm"
                                                            placeholder="Briefly describe this slide..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Image URL</label>
                                                        <input 
                                                            value={slide.image} 
                                                            onChange={e => handleArrayChange('heroSlides', index, 'image', e.target.value)}
                                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs font-mono text-gray-600"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">BG Class (Tailwind)</label>
                                                        <input 
                                                            value={slide.bg} 
                                                            onChange={e => handleArrayChange('heroSlides', index, 'bg', e.target.value)}
                                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-mono text-indigo-600 bg-indigo-50"
                                                            placeholder="bg-gradient-to-r..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div>
                             <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Features Section</h2>
                                    <p className="text-gray-500 text-sm">Highlights shown below the hero banner (e.g. Free Shipping).</p>
                                </div>
                             </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {config.features.map((feature, index) => (
                                    <div key={index} className="border border-gray-200 p-4 rounded-xl flex gap-6 bg-white hover:shadow-md transition-all items-center">
                                         <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                                            <DynamicIcon name={feature.icon} size={28} />
                                         </div>
                                         <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Icon Name</label>
                                                <input 
                                                    value={feature.icon} 
                                                    onChange={e => handleArrayChange('features', index, 'icon', e.target.value)}
                                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                                    placeholder="Lucide Icon Name"
                                                />
                                            </div>
                                            <div>
                                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                                                <input 
                                                    value={feature.title} 
                                                    onChange={e => handleArrayChange('features', index, 'title', e.target.value)}
                                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                                    placeholder="Title"
                                                />
                                            </div>
                                             <div>
                                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                                                 <input 
                                                    value={feature.desc} 
                                                    onChange={e => handleArrayChange('features', index, 'desc', e.target.value)}
                                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600"
                                                    placeholder="Description"
                                                />
                                            </div>
                                         </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-3">
                                <div className="text-yellow-600 mt-1"><CheckCircle size={18} /></div>
                                <p className="text-sm text-yellow-800">
                                    <strong>Tip:</strong> Use standard Lucide React icon names like <code>Truck</code>, <code>ShieldCheck</code>, <code>Zap</code>, etc.
                                </p>
                            </div>
                        </div>
                    )}

                     {activeTab === 'categories' && (
                        <div>
                             <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Categories Grid</h2>
                                    <p className="text-gray-500 text-sm">Configure the quick-access category tiles.</p>
                                </div>
                                <button 
                                    onClick={() => handleAddArrayItem('categories', { name: '', color: 'bg-gray-100', icon: 'Tag' })}
                                    className="text-sm bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors border border-blue-100"
                                >
                                    <Plus size={18} /> Add Category
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {config.categories.map((cat, index) => (
                                    <div key={index} className="border border-gray-200 p-4 rounded-xl flex items-center justify-between bg-white hover:border-blue-300 transition-all group relative overflow-hidden">
                                         <div className={`absolute left-0 top-0 bottom-0 w-2 ${cat.color.split(' ')[0] || 'bg-gray-200'}`}></div>

                                         <div className="flex-1 ml-4 grid grid-cols-2 gap-3 mr-4">
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Name</label>
                                                <input 
                                                    value={cat.name} 
                                                    onChange={e => handleArrayChange('categories', index, 'name', e.target.value)}
                                                    className="w-full font-bold text-gray-900 border-none p-0 focus:ring-0 text-lg bg-transparent placeholder-gray-300"
                                                    placeholder="Category Name"
                                                />
                                            </div>
                                             <div className="col-span-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Icon</label>
                                                 <input 
                                                    value={cat.icon} 
                                                    onChange={e => handleArrayChange('categories', index, 'icon', e.target.value)}
                                                    className="w-full text-sm text-gray-600 border border-gray-100 rounded px-2 py-1 focus:ring-2 focus:ring-blue-100 font-mono bg-gray-50"
                                                    placeholder="Icon"
                                                />
                                            </div>
                                             <div className="col-span-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Color Class</label>
                                                 <input 
                                                    value={cat.color} 
                                                    onChange={e => handleArrayChange('categories', index, 'color', e.target.value)}
                                                    className="w-full text-xs text-gray-500 border border-gray-100 rounded px-2 py-1 focus:ring-2 focus:ring-blue-100 font-mono bg-gray-50"
                                                    placeholder="bg-blue-100..."
                                                />
                                            </div>
                                         </div>
                                          <button 
                                            onClick={() => handleRemoveArrayItem('categories', index)}
                                            className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                     {activeTab === 'offers' && (
                        <div>
                             <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Offers & Coupons</h2>
                                    <p className="text-gray-500 text-sm">Active discount codes shown on homepage.</p>
                                </div>
                                <button 
                                    onClick={() => handleAddArrayItem('offers', { code: 'NEW20', value: 20, type: 'PERCENTAGE', validUntil: '2025-12-31' })}
                                    className="text-sm bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors border border-blue-100"
                                >
                                    <Plus size={18} /> Add Offer
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {config.offers.map((offer, index) => (
                                    <div key={index} className="border border-gray-200 border-l-4 border-l-green-500 p-5 rounded-r-xl bg-white shadow-sm flex flex-wrap md:flex-nowrap gap-6 items-end">
                                         
                                         <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Coupon Code</label>
                                                <input 
                                                    value={offer.code} 
                                                    onChange={e => handleArrayChange('offers', index, 'code', e.target.value)}
                                                    className="w-full border-2 border-dashed border-gray-300 p-2 rounded font-mono text-center font-bold text-gray-700 focus:border-green-500 focus:ring-0 uppercase tracking-widest"
                                                    placeholder="CODE"
                                                />
                                            </div>
                                             <div>
                                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Value</label>
                                                 <input 
                                                    value={offer.value} 
                                                    type="number"
                                                    onChange={e => handleArrayChange('offers', index, 'value', e.target.value)}
                                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Value"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
                                                <select 
                                                    value={offer.type}
                                                    onChange={e => handleArrayChange('offers', index, 'type', e.target.value)}
                                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                                >
                                                    <option value="PERCENTAGE">Percentage (%)</option>
                                                    <option value="FIXED">Fixed Amount (₹)</option>
                                                </select>
                                            </div>
                                             <div>
                                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Valid Until</label>
                                                 <input 
                                                    value={offer.validUntil} 
                                                    type="date"
                                                    onChange={e => handleArrayChange('offers', index, 'validUntil', e.target.value)}
                                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                             </div>
                                         </div>
                                          <button 
                                            onClick={() => handleRemoveArrayItem('offers', index)}
                                             className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors mb-0.5"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                         <div className="space-y-10">
                              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Product Columns</h2>
                                    <p className="text-gray-500 text-sm">Configure how products are grouped and displayed on the home page.</p>
                                </div>
                            </div>
                             
                             {[
                                 { id: 'bigDiscounts', label: 'Big Discounts Section', color: 'border-l-purple-500', isArray: false },
                                 { id: 'newArrivals', label: 'New Arrivals Section', color: 'border-l-orange-500', isArray: true }, // Mark as array
                                 { id: 'bestSales', label: 'Best Sales Section', color: 'border-l-emerald-500', isArray: false }
                             ].map((section) => (
                                 <div key={section.id} className={`bg-white border border-gray-200 ${section.color} border-l-4 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <ShoppingBag size={20} className="text-gray-400" />
                                        {section.label}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Section Title</label>
                                            <input 
                                                value={config[section.id].title} 
                                                onChange={e => handleNestedChange(section.id, 'title', e.target.value)} 
                                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" 
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Subtitle</label>
                                            <input 
                                                value={config[section.id].subtitle} 
                                                onChange={e => handleNestedChange(section.id, 'subtitle', e.target.value)} 
                                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                            />
                                        </div>
                                        <div>
                                            {section.isArray ? (
                                                <>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Categories (Comma Sep)</label>
                                                    <input 
                                                        value={Array.isArray(config[section.id].categories) ? config[section.id].categories.join(',') : config[section.id].categories} 
                                                        onChange={e => handleNestedChange(section.id, 'categories', e.target.value.split(',').map(s => s.trim()))} 
                                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm" 
                                                        placeholder="e.g. Fashion, Electronics"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Filter Category</label>
                                                    <input 
                                                        value={config[section.id].category || ''} 
                                                        onChange={e => handleNestedChange(section.id, 'category', e.target.value)} 
                                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm" 
                                                        placeholder="e.g. Fashion"
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Product Count</label>
                                            <input 
                                                value={config[section.id].count} 
                                                type="number" 
                                                onChange={e => handleNestedChange(section.id, 'count', e.target.value)} 
                                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm" 
                                            />
                                        </div>
                                    </div>
                                 </div>
                             ))}
                         </div>
                    )}

                    {activeTab === 'banner' && (
                         <div className="h-full">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Promotional Banner</h2>
                                    <p className="text-gray-500 text-sm">Full-width banner for special campaigns.</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                 <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-gray-900 group">
                                     <img src={config.promotionalBanner.image} alt="Preview" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                         <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-2">{config.promotionalBanner.subtitle}</span>
                                         <h2 className="text-3xl font-bold text-white mb-2">{config.promotionalBanner.title}</h2>
                                         <p className="text-gray-300 text-sm max-w-lg mx-auto">{config.promotionalBanner.description}</p>
                                         <button className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-xs">{config.promotionalBanner.buttonText}</button>
                                     </div>
                                 </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                                        <input value={config.promotionalBanner.title} onChange={e => handleNestedChange('promotionalBanner', 'title', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Subtitle</label>
                                        <input value={config.promotionalBanner.subtitle} onChange={e => handleNestedChange('promotionalBanner', 'subtitle', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                                        <textarea value={config.promotionalBanner.description} onChange={e => handleNestedChange('promotionalBanner', 'description', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Image URL</label>
                                        <input value={config.promotionalBanner.image} onChange={e => handleNestedChange('promotionalBanner', 'image', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Button Text</label>
                                        <input value={config.promotionalBanner.buttonText} onChange={e => handleNestedChange('promotionalBanner', 'buttonText', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 w-1/2" />
                                    </div>
                                </div>
                            </div>
                         </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
