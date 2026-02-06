import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { Tag, Plus, Trash2, Clock, AlertCircle, CheckCircle2, Ticket, X, Calendar, Percent, MessageSquareWarning } from 'lucide-react';
import toast from 'react-hot-toast';

const VendorOffers = () => {
    const { user } = useAuth();
    const [offers, setOffers] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [newOffer, setNewOffer] = useState({
        code: '',
        type: 'PERCENTAGE', // PERCENTAGE | FLAT
        value: '',
        minOrder: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        description: ''
    });

    useEffect(() => {
        const savedOffers = JSON.parse(localStorage.getItem('mockVendorOffers') || '[]');
        setOffers(savedOffers);
    }, []);

    const saveOffers = (updatedOffers) => {
        setOffers(updatedOffers);
        localStorage.setItem('mockVendorOffers', JSON.stringify(updatedOffers));
    };

    const handleCreate = () => {
        // Validation
        if (!newOffer.code || !newOffer.value || !newOffer.validUntil) {
            toast.error("Please fill all required fields");
            return;
        }

        // Admin Constraint: Dynamic Limit
        const adminSettings = JSON.parse(localStorage.getItem('adminSettings') || '{"maxDiscount": 80}');
        const maxAllowed = adminSettings.maxDiscount;

        if (newOffer.type === 'PERCENTAGE' && Number(newOffer.value) > maxAllowed) {
            toast.error(`Compliance Warning: Discounts cannot exceed ${maxAllowed}% as per Admin Policy.`);
            return;
        }

        // Logic to match Backend Product Controller's vendorId format
        const vIdRaw = user?._id || user?.id;
        const finalVendorId = user?.role === 'vendor' ? `vendor_${vIdRaw}` : vIdRaw;

        const offer = {
            id: Date.now().toString(),
            vendorId: finalVendorId, // Use formatted ID
            ...newOffer,
            code: newOffer.code.toUpperCase(),
            value: Number(newOffer.value),
            status: 'PENDING',
            usageCount: 0
        };

        const updatedOffers = [offer, ...offers];
        saveOffers(updatedOffers);
        
        setIsCreating(false);
        setNewOffer({
            code: '',
            type: 'PERCENTAGE',
            value: '',
            minOrder: '',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: '',
            description: ''
        });
        toast.success("Offer submitted for Admin Approval");
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this offer?')) {
            const updated = offers.filter(o => o.id !== id);
            saveOffers(updated);
            toast.success("Offer deleted");
        }
    };

    const toggleStatus = (id) => {
        const updated = offers.map(o => {
            if (o.id === id) {
                return { ...o, status: o.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
            }
            return o;
        });
        saveOffers(updated);
    };

    // Helper to check expiry
    const isExpired = (dateString) => {
        return new Date(dateString) < new Date().setHours(0,0,0,0);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Offers & Discounts</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage sales campaigns and coupons.</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={18} /> Create New Offer
                    </button>
                )}
            </div>

            {isCreating ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Creation Form */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <h3 className="font-bold text-gray-900">New Campaign Details</h3>
                            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={newOffer.code}
                                        onChange={(e) => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})}
                                        className="w-full pl-10 pr-4 py-2 uppercase border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold tracking-wider"
                                        placeholder="SUMMER2024"
                                    />
                                    <Ticket className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                <select 
                                    value={newOffer.type}
                                    onChange={(e) => setNewOffer({...newOffer, type: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                    <option value="FLAT">Flat Amount (₹)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input 
                                    type="number" 
                                    value={newOffer.value}
                                    onChange={(e) => setNewOffer({...newOffer, value: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder={newOffer.type === 'PERCENTAGE' ? "20" : "500"}
                                />
                            </div>

                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value (Optional)</label>
                                <input 
                                    type="number" 
                                    value={newOffer.minOrder}
                                    onChange={(e) => setNewOffer({...newOffer, minOrder: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. 1000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input 
                                    type="date" 
                                    value={newOffer.validFrom}
                                    onChange={(e) => setNewOffer({...newOffer, validFrom: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input 
                                    type="date" 
                                    value={newOffer.validUntil}
                                    onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea 
                                    value={newOffer.description}
                                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                    placeholder="e.g. Get 20% off on all summer wear"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                onClick={handleCreate}
                                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                                Publish Offer
                            </button>
                            <button 
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Clock size={16} /> Customer Preview
                        </h3>
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl mx-auto max-w-sm">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Percent size={120} />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium border border-white/10">
                                        Limited Time Deal
                                    </div>
                                    <Ticket className="text-white/80" />
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-4xl font-extrabold mb-1">
                                        {newOffer.type === 'PERCENTAGE' ? `${newOffer.value || 0}% OFF` : `₹${newOffer.value || 0} OFF`}
                                    </h4>
                                    <p className="text-indigo-100 text-sm">
                                        {newOffer.description || "On your next purchase"}
                                    </p>
                                    {newOffer.minOrder && (
                                        <p className="text-xs text-indigo-200 mt-2">
                                            Min. order: ₹{newOffer.minOrder}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-white text-indigo-900 rounded-xl p-3 flex justify-between items-center border border-indigo-100/50 shadow-lg">
                                    <span className="font-mono font-bold tracking-widest text-lg">
                                        {newOffer.code || 'CODE'}
                                    </span>
                                    <button className="text-xs font-bold uppercase bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                        Copy
                                    </button>
                                </div>
                                
                                <p className="text-xs text-center text-indigo-200 mt-4">
                                    Valid until {newOffer.validUntil || 'No expiry'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Offers List */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <Tag size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No active offers</p>
                            <p className="text-gray-400 text-sm">Create your first campaign to boost sales</p>
                        </div>
                    ) : offers.map((offer) => {
                        const expired = isExpired(offer.validUntil);
                        return (
                            <div key={offer.id} className={`bg-white rounded-xl border p-5 transition-all ${offer.status === 'INACTIVE' || expired ? 'opacity-60 grayscale-[0.5]' : 'border-gray-200 shadow-sm hover:shadow-md'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-800">
                                            {offer.type === 'PERCENTAGE' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        expired ? 'bg-red-100 text-red-600' :
                                        offer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                                        offer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        offer.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {expired ? 'Expired' : (
                                            offer.status === 'REJECTED' ? 'Rejected by Admin' : 
                                            offer.status === 'PENDING' ? 'Waiting Review' :
                                            offer.status
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center mb-4 border border-dashed border-gray-200">
                                    <code className="font-bold text-gray-700">{offer.code}</code>
                                    <Ticket size={16} className="text-gray-400" />
                                </div>

                                <div className="space-y-2 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} /> 
                                        <span>Ends: {offer.validUntil}</span>
                                    </div>
                                    {offer.minOrder && (
                                        <div className="flex items-center gap-2">
                                            <AlertCircle size={14} /> 
                                            <span>Min Order: ₹{offer.minOrder}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Rejection Notification */}
                                {offer.status === 'REJECTED' && offer.rejectionReason && (
                                    <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2 items-start">
                                        <MessageSquareWarning size={16} className="text-red-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-red-700 uppercase mb-0.5">Admin Feedback</p>
                                            <p className="text-sm text-red-600 leading-snug">{offer.rejectionReason}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <button 
                                        onClick={() => toggleStatus(offer.id)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                                            offer.status === 'ACTIVE' 
                                            ? 'border-gray-200 text-gray-600 hover:bg-gray-50' 
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}
                                    >
                                        {offer.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(offer.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default VendorOffers;
