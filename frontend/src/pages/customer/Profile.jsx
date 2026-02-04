import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    image: null
  });

  // Sync formData when user data changes or when cancelling edit
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        image: null
      }));
      setImagePreview(null);
    }
  }, [user, isEditing]); // Reset when user updates or editing mode toggles

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) {
        data.append('password', formData.password);
      }
      if (formData.image) {
        data.append('image', formData.image);
      }

      // We need to import axios here or use a utility. 
      // Assuming axios is available globally or we import it.
      // Since I can't easily add import to top without replacing whole file, 
      // I'll rely on global fetch or dynamic import? No, let's use the fetch API or assume axios is used elsewhere.
      // Wait, I can't assume axios is imported. 
      // UseAuth uses it. 
      
      // I will rely on the token in localStorage
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type is set automatically for FormData
        },
        body: data
      });
      
      const updatedData = await response.json();
      
      if (response.ok) {
        updateUser(updatedData);
        setIsEditing(false);
        // Clean up preview
        if (imagePreview) URL.revokeObjectURL(imagePreview);
      } else {
        console.error(updatedData);
        alert(updatedData.message || 'Update failed');
      }

    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Header Section */}
       <div className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences.</p>
           </div>
           <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm ${
                isEditing 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
           >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
           </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
                
                <div className="relative z-10 mb-4 group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gray-100 overflow-hidden relative">
                     {imagePreview ? (
                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                     ) : user?.profileImage ? (
                       <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                       <span className="text-4xl font-bold text-gray-400">{user?.name?.charAt(0) || 'U'}</span>
                     )}
                     
                     {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <span className="text-white text-xs font-semibold">Change</span>
                        </div>
                     )}
                  </div>
                  {isEditing && (
                     <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer transform translate-x-1/4 translate-y-1/4 hover:bg-blue-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input 
                           type="file" 
                           name="image" 
                           accept="image/*"
                           onChange={handleChange}
                           className="hidden"
                        />
                     </label>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 inline-block capitalize">{user?.role}</p>
             </div>
          </div>

          {/* Right Column: Details Form */}
          <div className="lg:col-span-8">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                   <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                   {isEditing && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">Editing Enabled</span>}
                </div>
                
                <div className="p-8">
                   <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                         <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                            />
                         </div>
                         <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing} 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                            />
                         </div>
                         
                         {isEditing && (
                           <>
                             <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-100">
                                <h4 className="text-base font-medium text-gray-900 mb-6">Security</h4>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                />
                             </div>
                           </>
                         )}
                         
                         {isEditing && (
                            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                               <button 
                                  type="button"
                                  onClick={() => setIsEditing(false)}
                                  className="px-6 py-2.5 items-center font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                               >
                                  Cancel
                               </button>
                               <button 
                                  type="submit" 
                                  className="px-6 py-2.5 items-center font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-md shadow-blue-500/20"
                               >
                                  Save Changes
                               </button>
                            </div>
                         )}
                      </div>
                   </form>
                </div>
             </div>
          </div>
       </div>
       {/* Become a Vendor CTA - Only for customers */}
       {user?.role === 'customer' && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-sm p-8 text-white flex justify-between items-center bg-size-200 animate-gradient">
             <div>
                <h3 className="text-2xl font-bold mb-2">Want to sell on MultiMart?</h3>
                <p className="text-purple-100">Apply now to become a vendor and reach millions of customers.</p>
             </div>
             <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transition shadow-lg">
                Become a Seller
             </button>
          </div>
       )}
    </div>
  );
};

export default Profile;
