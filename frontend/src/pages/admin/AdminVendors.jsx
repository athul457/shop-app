import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Eye, X, Store, Phone, MapPin, Search, Filter } from 'lucide-react';

const AdminVendors = () => {
    const [vendorRequests, setVendorRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

    useEffect(() => {
        // Fetch Vendor Requests from LocalStorage
        const requests = JSON.parse(localStorage.getItem('mockVendorRequests') || '[]');
        setVendorRequests(requests);
    }, []);

    const [adminMessage, setAdminMessage] = useState('');

    const handleVendorAction = (requestId, status) => {
        const updatedRequests = vendorRequests.map(req => {
            if (req.id === requestId) {
                return { ...req, status };
            }
            return req;
        });

        setVendorRequests(updatedRequests);
        localStorage.setItem('mockVendorRequests', JSON.stringify(updatedRequests));

        // Create Notification
        const targetRequest = vendorRequests.find(r => r.id === requestId);
        if (targetRequest) {
            const newNotification = {
                id: Date.now(),
                userId: targetRequest.user.id, // Target the specific user
                userEmail: targetRequest.user.email,
                type: status === 'approved' ? 'success' : 'error',
                title: status === 'approved' ? 'Vendor Application Accepted' : 'Vendor Application Rejected',
                message: adminMessage || `Your vendor application has been ${status}.`,
                read: false,
                createdAt: new Date().toISOString()
            };

            const existingNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
            localStorage.setItem('mockNotifications', JSON.stringify([newNotification, ...existingNotifications]));
        }
        
        // Also update selected request if it's open
        if (selectedRequest && selectedRequest.id === requestId) {
            setSelectedRequest({ ...selectedRequest, status });
        }
        setAdminMessage(''); // Reset message
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const filteredRequests = vendorRequests.filter(req => {
        if (filter === 'all') return true;
        return req.status === filter;
    });

    // Sections for different stati
    const pendingRequests = vendorRequests.filter(req => req.status === 'pending');
    const acceptedRequests = vendorRequests.filter(req => req.status === 'approved');
    const rejectedRequests = vendorRequests.filter(req => req.status === 'rejected');

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
                <p className="text-gray-500">Manage vendor applications and partnerships</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-yellow-600 font-medium mb-1">Ongoing Applications</p>
                        <h2 className="text-3xl font-bold text-yellow-700">{pendingRequests.length}</h2>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                        <Clock size={24} />
                    </div>
                </div>
                <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-green-600 font-medium mb-1">Active Vendors</p>
                        <h2 className="text-3xl font-bold text-green-700">{acceptedRequests.length}</h2>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-red-600 font-medium mb-1">Rejected</p>
                        <h2 className="text-3xl font-bold text-red-700">{rejectedRequests.length}</h2>
                    </div>
                    <div className="bg-red-100 p-3 rounded-xl text-red-600">
                        <XCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="space-y-10">
                
                {/* Ongoing Applications */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">Ongoing Applications</h2>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {pendingRequests.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">
                                <Clock className="mx-auto h-10 w-10 mb-3 opacity-50" />
                                <p>No pending applications</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Store</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Applicant</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pendingRequests.map(req => (
                                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-900">{req.storeName}</div>
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">{req.description}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900">{req.user.name}</div>
                                                    <div className="text-sm text-gray-500">{req.user.email}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-500">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => setSelectedRequest(req)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleVendorAction(req.id, 'approved')}
                                                            className="px-3 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleVendorAction(req.id, 'rejected')}
                                                            className="px-3 py-2 bg-white text-red-600 border border-red-200 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>


                {/* Accepted Vendors */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">Accepted Vendors</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {acceptedRequests.length === 0 ? (
                            <div className="col-span-full p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
                                <CheckCircle2 className="mx-auto h-10 w-10 mb-3 opacity-50" />
                                <p>No active vendors yet</p>
                            </div>
                        ) : (
                            acceptedRequests.map(req => (
                                <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                            <Store size={24} />
                                        </div>
                                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-green-100">
                                            Active
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{req.storeName}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{req.description}</p>
                                    
                                    <div className="space-y-2 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone size={16} className="text-gray-400" /> {req.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin size={16} className="text-gray-400" /> <span className="truncate">{req.address}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setSelectedRequest(req)}
                                        className="w-full mt-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
                                    >
                                        View Full Profile
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Rejected Applications */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">Rejected Applications</h2>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        {rejectedRequests.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">
                                <p>No rejected applications</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Store</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Applicant</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Date Rejected</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rejectedRequests.map(req => (
                                            <tr key={req.id} className="hover:bg-gray-50/50">
                                                <td className="p-4 opacity-50">
                                                    <div className="font-bold text-gray-900">{req.storeName}</div>
                                                </td>
                                                <td className="p-4 opacity-50">
                                                    <div className="font-medium text-gray-900">{req.user.name}</div>
                                                    <div className="text-sm text-gray-500">{req.user.email}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-500 opacity-50">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => handleVendorAction(req.id, 'pending')}
                                                        className="text-sm text-blue-600 hover:underline font-medium"
                                                    >
                                                        Reconsider
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* View Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70] overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setSelectedRequest(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.storeName}</h2>
                                <p className="text-gray-500 text-sm">Application Details</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Applicant Info</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Full Name</p>
                                            <p className="font-semibold text-gray-900">{selectedRequest.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="font-semibold text-gray-900">{selectedRequest.user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</h3>
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${getStatusColor(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Store Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Store Description</p>
                                            <p className="text-gray-900 leading-relaxed">{selectedRequest.description}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Business Address</p>
                                            <div className="flex gap-2 items-start mt-1">
                                                <MapPin size={16} className="text-gray-400 mt-0.5" />
                                                <p className="text-gray-900">{selectedRequest.address}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Contact Phone</p>
                                            <div className="flex gap-2 items-center mt-1">
                                                <Phone size={16} className="text-gray-400" />
                                                <p className="text-gray-900 font-medium">{selectedRequest.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message to Applicant (Optional)</label>
                            <textarea
                                value={adminMessage}
                                onChange={(e) => setAdminMessage(e.target.value)}
                                placeholder="Enter reason for rejection or welcome message..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            {selectedRequest.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => { handleVendorAction(selectedRequest.id, 'rejected'); setSelectedRequest(null); }}
                                        className="px-5 py-2.5 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => { handleVendorAction(selectedRequest.id, 'approved'); setSelectedRequest(null); }}
                                        className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all hover:translate-y-[-2px]"
                                    >
                                        Accept Application
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendors;
