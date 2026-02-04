import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update profile logic here
    console.log('Update profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
           <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
               <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
               >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
               </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="col-span-1 flex flex-col items-center p-6 border rounded-lg bg-gray-50">
                 <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-4xl text-blue-600 font-bold mb-4">
                    {user?.name?.charAt(0) || 'U'}
                 </div>
                 <h2 className="text-xl font-semibold">{user?.name}</h2>
                 <p className="text-gray-500">{user?.role}</p>
              </div>

              {/* Details Form */}
              <div className="col-span-2">
                 <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input 
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              disabled={true} // Email usually cannot be changed easily
                              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="+1 234 567 8900"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                       </div>

                       {isEditing && (
                          <div className="pt-4">
                             <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save Changes
                             </button>
                          </div>
                       )}
                    </div>
                 </form>
              </div>
           </div>
       </div>

       {/* Become a Vendor CTA - Only for customers */}
       {user?.role === 'customer' && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-sm p-8 text-white flex justify-between items-center">
             <div>
                <h3 className="text-2xl font-bold mb-2">Want to sell on MultiMart?</h3>
                <p className="text-purple-100">Apply now to become a vendor and reach millions of customers.</p>
             </div>
             <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">
                Become a Seller
             </button>
          </div>
       )}
    </div>
  );
};

export default Profile;
