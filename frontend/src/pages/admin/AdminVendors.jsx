import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Eye, X, Store, Phone, MapPin, Search, Filter } from 'lucide-react';
import { updateUserRole, fetchUsers, updateUserStatus } from '../../api/user.api';
import toast from 'react-hot-toast';

const AdminVendors = () => {
    const [vendorRequests, setVendorRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [vendorView, setVendorView] = useState('active'); // active, suspended

    const [realUsers, setRealUsers] = useState([]);

    useEffect(() => {
        // Fetch Vendor Requests from LocalStorage
        const requests = JSON.parse(localStorage.getItem('mockVendorRequests') || '[]');
        setVendorRequests(requests);

        // Fetch Real Users to sync status
        const loadUsers = async () => {
            try {
                const users = await fetchUsers();
                setRealUsers(users);
            } catch (error) {
                console.error("Failed to load users", error);
            }
        };
        loadUsers();
    }, []);

    const handleSuspendVendor = async (vendorEmail, currentStatus) => {
        const user = realUsers.find(u => u.email === vendorEmail);
        if (!user) {
            toast.error("User not found in database");
            return;
        }

        const action = currentStatus ? 'activate' : 'suspend';
        if(window.confirm(`Are you sure you want to ${action} this vendor?`)) {
            try {
                await updateUserStatus(user._id, !currentStatus);
                
                // Update local state
                setRealUsers(realUsers.map(u => u._id === user._id ? { ...u, isSuspended: !currentStatus } : u));
                toast.success(`Vendor ${currentStatus ? 'Activated' : 'Suspended'}`);
            } catch (error) {
                toast.error("Failed to update status");
            }
        }
    };

    const [adminMessage, setAdminMessage] = useState('');



    const handleVendorAction = async (requestId, status) => {
        const targetRequest = vendorRequests.find(r => r.id === requestId);
        
        if (status === 'approved' && targetRequest) {
            try {
                // Fetch all users to find the correct DB ID by email
                // This ensures we have the real ID even if localStorage has a mock/old ID
                const users = await fetchUsers();
                const realUser = users.find(u => u.email === targetRequest.user.email);

                if (realUser) {
                    await updateUserRole(realUser._id || realUser.id, 'vendor');
                    console.log(`User ${realUser.email} promoted to vendor.`);
                } else {
                    console.error("User not found in database for role update");
                }
            } catch (error) {
                console.error("Failed to update user role", error);
            }
        }

        const updatedRequests = vendorRequests.map(req => {
            if (req.id === requestId) {
                return { ...req, status };
            }
            return req;
        });

        setVendorRequests(updatedRequests);
        localStorage.setItem('mockVendorRequests', JSON.stringify(updatedRequests));

        // Create Notification
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

    // Split accepted vendors into active and suspended based on real realUsers state
    const activeVendors = acceptedRequests.filter(req => {
        const user = realUsers.find(u => u.email === req.user.email);
        return !user || !user.isSuspended;
    });

    const suspendedVendors = acceptedRequests.filter(req => {
        const user = realUsers.find(u => u.email === req.user.email);
        return user && user.isSuspended;
    });

    return (
        <div className="min-h-screen bg-gray-50/30 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vendor Management</h1>
                        <p className="text-gray-500 mt-1">Oversee applications, manage active vendors, and track performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all shadow-sm">
                            <Search size={20} />
                        </button>
                        <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all shadow-sm">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-yellow-100 shadow-[0_2px_10px_-4px_rgba(234,179,8,0.2)] hover:shadow-lg transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl group-hover:scale-110 transition-transform">
                                <Clock size={24} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
                                Pending
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{pendingRequests.length}</h3>
                        <p className="text-sm text-gray-500 font-medium">Ongoing Applications</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-[0_2px_10px_-4px_rgba(34,197,94,0.2)] hover:shadow-lg transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                Operational
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{activeVendors.length}</h3>
                        <p className="text-sm text-gray-500 font-medium">Active Vendors</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-[0_2px_10px_-4px_rgba(239,68,68,0.2)] hover:shadow-lg transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                                <XCircle size={24} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                                Action Required
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{suspendedVendors.length}</h3>
                        <p className="text-sm text-gray-500 font-medium">Suspended Vendors</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 text-gray-600 rounded-xl group-hover:scale-110 transition-transform">
                                <X size={24} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                                Archived
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{rejectedRequests.length}</h3>
                        <p className="text-sm text-gray-500 font-medium">Rejected Applications</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Ongoing Applications Section */}
                    <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-yellow-50/50 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                                    <Clock size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Pending Applications</h2>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                                {pendingRequests.length} Waiting
                            </span>
                        </div>
                        
                        {pendingRequests.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-10 w-10 opacity-40" />
                                </div>
                                <h3 className="text-gray-900 font-semibold mb-1">All Caught Up!</h3>
                                <p className="text-sm">No pending applications at the moment.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Store Info</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pendingRequests.map(req => (
                                            <tr key={req.id} className="group hover:bg-yellow-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-lg shrink-0">
                                                            {req.storeName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{req.storeName}</div>
                                                            <div className="text-xs text-gray-500 max-w-[200px] truncate">{req.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{req.user.name}</div>
                                                    <div className="text-xs text-gray-500">{req.user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => setSelectedRequest(req)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <div className="w-px h-8 bg-gray-200 mx-1"></div>
                                                        <button 
                                                            onClick={() => handleVendorAction(req.id, 'rejected')}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject Application"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleVendorAction(req.id, 'approved')}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve Application"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Vendors Management Section (Active/Suspended) */}
                    <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${vendorView === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    <Store size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Vendor Directory</h2>
                            </div>
                            
                            {/* Modern Segmented Control */}
                            <div className="flex bg-gray-100 p-1.5 rounded-xl self-start sm:self-auto">
                                <button
                                    onClick={() => setVendorView('active')}
                                    className={`relative px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                        vendorView === 'active' 
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${vendorView === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Active Vendors
                                </button>
                                <button
                                    onClick={() => setVendorView('suspended')}
                                    className={`relative px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                        vendorView === 'suspended' 
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${vendorView === 'suspended' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                    Suspended Vendors
                                </button>
                            </div>
                        </div>

                        {/* Vendor Table Content */}
                        <div className="relative min-h-[300px]">
                            {vendorView === 'active' ? (
                                activeVendors.length === 0 ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-12">
                                        <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                                            <Store className="h-10 w-10 text-green-200" />
                                        </div>
                                        <h3 className="text-gray-900 font-semibold mb-1">No Active Vendors</h3>
                                        <p className="text-sm">Approved vendors will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <table className="w-full">
                                            <thead className="bg-gray-50/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Store Identifier</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Details</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Manage</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {activeVendors.map(req => (
                                                    <tr key={req.id} className="group hover:bg-gray-50/80 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-700 font-bold text-xl shadow-sm">
                                                                    {req.storeName.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-900 text-base">{req.storeName}</div>
                                                                    <div className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">{req.description}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-gray-900">{req.user.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{req.user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Phone size={14} className="text-gray-400"/> 
                                                                    <span className="font-medium">{req.phone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <MapPin size={14} className="text-gray-400 shrink-0"/> 
                                                                    <span className="truncate max-w-[160px]">{req.address}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100 shadow-sm">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                                Active
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button 
                                                                onClick={() => setSelectedRequest(req)}
                                                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group-hover:shadow-md active:scale-95"
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            ) : (
                                suspendedVendors.length === 0 ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-12">
                                        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                                            <XCircle className="h-10 w-10 text-red-200" />
                                        </div>
                                        <h3 className="text-gray-900 font-semibold mb-1">No Suspended Vendors</h3>
                                        <p className="text-sm">Suspended accounts will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <table className="w-full">
                                            <thead className="bg-red-50/30">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Store Identifier</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Details</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Manage</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {suspendedVendors.map(req => (
                                                    <tr key={req.id} className="group hover:bg-red-50/20 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center text-red-700 font-bold text-xl shadow-sm grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                                                    {req.storeName.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-900 text-base">{req.storeName}</div>
                                                                    <div className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">{req.description}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                                            <div className="font-semibold text-gray-900">{req.user.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{req.user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Phone size={14} className="text-gray-400"/> 
                                                                    <span className="font-medium">{req.phone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <MapPin size={14} className="text-gray-400 shrink-0"/> 
                                                                    <span className="truncate max-w-[160px]">{req.address}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full border border-red-100 shadow-sm">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                                Suspended
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button 
                                                                onClick={() => setSelectedRequest(req)}
                                                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group-hover:shadow-md active:scale-95"
                                                            >
                                                                Manage
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                    
                    {/* Rejected Applications Toggle Section */}
                    {rejectedRequests.length > 0 && (
                        <section className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Rejected Applications History</h3>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <tbody className="divide-y divide-gray-100">
                                        {rejectedRequests.map(req => (
                                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900 opacity-60">{req.storeName}</td>
                                                <td className="px-6 py-3 text-sm text-gray-500 opacity-60">{req.user.email}</td>
                                                <td className="px-6 py-3 text-sm text-gray-400 text-right">
                                                    Rejected on {new Date(req.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <button 
                                                        onClick={() => handleVendorAction(req.id, 'pending')}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                                    >
                                                        Revert to Pending
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Premium Detail Modal */ }
            {selectedRequest && (
                <div 
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]"
                    onClick={(e) => e.target === e.currentTarget && setSelectedRequest(null)}
                >
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-gray-100">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedRequest.storeName}</h2>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${selectedRequest.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                                <p className="text-gray-500 font-medium">{selectedRequest.description}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedRequest(null)} 
                                className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm border border-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-blue-500 rounded-full"></div> Owner Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
                                            <p className="font-bold text-gray-900 text-lg">{selectedRequest.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
                                            <p className="font-semibold text-gray-700">{selectedRequest.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-purple-500 rounded-full"></div> Contact Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="p-2 bg-white text-gray-400 rounded-lg shadow-sm border border-gray-100 h-fit">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Address</p>
                                                <p className="text-gray-900 font-medium leading-snug">{selectedRequest.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="p-2 bg-white text-gray-400 rounded-lg shadow-sm border border-gray-100 h-fit">
                                                <Phone size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                                                <p className="text-gray-900 font-medium">{selectedRequest.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Admin Note / Message</label>
                            <textarea
                                value={adminMessage}
                                onChange={(e) => setAdminMessage(e.target.value)}
                                placeholder="Type a message to the applicant..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none text-sm bg-gray-50 focus:bg-white"
                                rows="2"
                            ></textarea>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            {selectedRequest.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => { handleVendorAction(selectedRequest.id, 'rejected'); setSelectedRequest(null); }}
                                        className="px-6 py-2.5 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 hover:shadow-lg hover:shadow-red-900/10 transition-all"
                                    >
                                        Reject Application
                                    </button>
                                    <button 
                                        onClick={() => { handleVendorAction(selectedRequest.id, 'approved'); setSelectedRequest(null); }}
                                        className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/20 hover:scale-105 transition-all"
                                    >
                                        Approve & Onboard
                                    </button>
                                </>
                            )}
                            {selectedRequest.status === 'approved' && (
                                (() => {
                                    const user = realUsers.find(u => u.email === selectedRequest.user.email);
                                    const isSuspended = user?.isSuspended || false;
                                    return (
                                        <button 
                                            onClick={() => {
                                                handleSuspendVendor(selectedRequest.user.email, isSuspended);
                                            }}
                                            className={`px-6 py-2.5 font-bold rounded-xl transition-all shadow-lg hover:scale-105 ${
                                                isSuspended 
                                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20' 
                                                : 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-red-900/10'
                                            }`}
                                        >
                                            {isSuspended ? 'Reactivate Vendor Account' : 'Suspend Vendor Access'}
                                        </button>
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendors;
