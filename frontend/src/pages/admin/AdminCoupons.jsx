import { useState, useEffect } from 'react';
import { Ticket, Check, X, ShieldAlert, CheckCircle, Ban, Settings, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
    const [offers, setOffers] = useState([]);
    const [settings, setSettings] = useState({ maxDiscount: 80 });
    const [isEditingSettings, setIsEditingSettings] = useState(false);
    // Rejection State
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        const savedOffers = JSON.parse(localStorage.getItem('mockVendorOffers') || '[]');
        setOffers(savedOffers);

        const savedSettings = JSON.parse(localStorage.getItem('adminSettings') || '{"maxDiscount": 80}');
        setSettings(savedSettings);
    }, []);

    const saveOffers = (updatedOffers) => {
        setOffers(updatedOffers);
        localStorage.setItem('mockVendorOffers', JSON.stringify(updatedOffers));
    };

    const updateStatus = (id, newStatus, reason = null) => {
        const updated = offers.map(o => o.id === id ? { ...o, status: newStatus, rejectionReason: reason } : o);
        saveOffers(updated);
        toast.success(`Coupon marked as ${newStatus}`);
        setRejectingId(null);
        setRejectionReason("");
    };

    const handleRejectSubmit = () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }
        updateStatus(rejectingId, 'REJECTED', rejectionReason);
    };

    const saveSettings = () => {
        if (settings.maxDiscount < 1 || settings.maxDiscount > 100) {
            toast.error("Invalid discount limit (1-100)");
            return;
        }
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        setIsEditingSettings(false);
        toast.success("Global policies updated");
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Coupon Governance</h1>
                    <p className="text-gray-500 mt-1">Review vendor offers and set safety limits.</p>
                </div>
                
                {/* Global Settings Card */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Settings size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Max Allowed Discount</p>
                        {isEditingSettings ? (
                            <div className="flex items-center gap-2 mt-1">
                                <input 
                                    type="number" 
                                    value={settings.maxDiscount}
                                    onChange={(e) => setSettings({...settings, maxDiscount: Number(e.target.value)})}
                                    className="w-16 px-2 py-1 border rounded text-sm font-bold"
                                />
                                <button onClick={saveSettings} className="text-green-600 hover:text-green-700 font-medium text-xs">Save</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xl font-extrabold text-gray-900">{settings.maxDiscount}%</span>
                                <button onClick={() => setIsEditingSettings(true)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Ticket size={20} className="text-gray-500"/> Vendor Offers Queue
                    </h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Validity</th>
                                <th className="px-6 py-4">Risk Level</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.map((offer) => {
                                // Calculate Risk
                                const isHighRisk = offer.type === 'PERCENTAGE' && offer.value > settings.maxDiscount;
                                
                                return (
                                    <tr key={offer.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                                offer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                offer.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                offer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {offer.status === 'ACTIVE' && <CheckCircle size={12}/>}
                                                {offer.status === 'REJECTED' && <Ban size={12}/>}
                                                {offer.status === 'PENDING' && <AlertTriangle size={12}/>}
                                                {offer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-gray-800">{offer.code}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {offer.type === 'PERCENTAGE' ? `${offer.value}%` : `₹${offer.value}`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {offer.validFrom} <span className="text-gray-300 mx-1">→</span> {offer.validUntil}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isHighRisk ? (
                                                <span className="flex items-center gap-1 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded border border-orange-100">
                                                    <AlertTriangle size={12}/> Excessive
                                                </span>
                                            ) : (
                                                <span className="text-green-600 text-xs font-medium">Safe</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {offer.status !== 'REJECTED' && (
                                                <button 
                                                    onClick={() => {
                                                        setRejectingId(offer.id);
                                                        setRejectionReason("");
                                                    }}
                                                    className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                            {offer.status !== 'ACTIVE' && (
                                                <button 
                                                    onClick={() => updateStatus(offer.id, 'ACTIVE')}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {offers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400">No coupons found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal */}
            {rejectingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <ShieldAlert className="text-red-500" size={20} /> Reject Coupon
                            </h3>
                            <button onClick={() => setRejectingId(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                            <textarea 
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 min-h-[100px]"
                                placeholder="E.g. Discount too high, Misleading description..."
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={handleRejectSubmit}
                                className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold hover:bg-red-700"
                            >
                                Confirm Rejection
                            </button>
                            <button 
                                onClick={() => setRejectingId(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
