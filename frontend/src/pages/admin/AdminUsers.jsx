import { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { updateUserStatus } from '../../api/user.api'; // Import API

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSuspend = async (user) => {
        const action = user.isSuspended ? 'activate' : 'suspend';
        if(window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await updateUserStatus(user._id, !user.isSuspended);
                
                // Update local list
                setUsers(users.map(u => u._id === user._id ? { ...u, isSuspended: !user.isSuspended } : u));
                
                // Notify User
                const newNotification = {
                    id: Date.now(),
                    userId: user._id,
                    userEmail: user.email,
                    type: 'error',
                    title: 'Account Suspended',
                    message: `Your account has been suspended. Please contact support.`,
                    read: false,
                    createdAt: new Date().toISOString()
                };
                if (!user.isSuspended) { // Only notify on suspension
                     const existingNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
                     localStorage.setItem('mockNotifications', JSON.stringify([newNotification, ...existingNotifications]));
                }

                toast.success(`User ${user.isSuspended ? 'Activated' : 'Suspended'}`);
            } catch (error) {
                toast.error("Failed to update status");
            }
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                };
                await axios.delete(`/api/users/${id}`, config);
                setUsers(users.filter(u => u._id !== id));
                toast.success('User deleted');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('name'); // name, email, _id

    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        
        switch(searchCategory) {
            case 'name':
                return user.name?.toLowerCase().includes(term);
            case 'email':
                return user.email?.toLowerCase().includes(term);
            case '_id':
                return user._id.toLowerCase().includes(term);
            case 'role':
                return user.role.toLowerCase().includes(term);
            default:
                return true;
        }
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Users Management</h1>

            {/* Filter / Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <select 
                    value={searchCategory} 
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer font-medium"
                >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="_id">User ID</option>
                    <option value="role">Role</option>
                </select>
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder={`Search by ${searchCategory === '_id' ? 'User ID' : searchCategory}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">ID</th>
                                <th className="p-4 font-semibold text-gray-600">Name</th>
                                <th className="p-4 font-semibold text-gray-600">Email</th>
                                <th className="p-4 font-semibold text-gray-600">Role</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-500 text-sm">#{user._id}</td>
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.isSuspended ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.isSuspended ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button 
                                            onClick={() => handleSuspend(user)}
                                            className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${user.isSuspended ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
                                        >
                                            {user.isSuspended ? 'Activate' : 'Suspend'}
                                        </button>
                                        <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete User"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
