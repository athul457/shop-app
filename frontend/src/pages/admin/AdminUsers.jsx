import { useState } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    // Mock Data
    const [users, setUsers] = useState([
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer' },
        { _id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'customer' },
    ]);

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u._id !== id));
            toast.success('User deleted');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Users Management</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">ID</th>
                                <th className="p-4 font-semibold text-gray-600">Name</th>
                                <th className="p-4 font-semibold text-gray-600">Email</th>
                                <th className="p-4 font-semibold text-gray-600">Role</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-500 text-sm">#{user._id}</td>
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="View Orders"><ShoppingBag size={16} /></button>
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
