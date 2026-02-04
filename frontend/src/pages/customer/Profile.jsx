import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { User, Mail, Lock, Camera, Edit2, Shield, AlertCircle, Save, X, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
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
    <div className="max-w-6xl mx-auto px-4 py-10">
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
           <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Profile Settings</h1>
              <p className="text-gray-500 font-medium">Manage your personal information and security preferences.</p>
           </div>
           
           {!isEditing && (
               <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
               >
                  <Edit2 size={18} /> Edit Profile
               </button>
           )}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4">
             <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-28">
                {/* Cover Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                </div>
                
                <div className="px-8 pb-8 text-center relative">
                   {/* Avatar */}
                   <div className="relative -mt-16 mb-6 inline-block group">
                      <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-lg bg-gray-50 overflow-hidden flex items-center justify-center">
                         {imagePreview ? (
                           <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                         ) : user?.profileImage ? (
                           <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-4xl font-extrabold text-gray-400 select-none block">{user?.name?.charAt(0) || 'U'}</span>
                         )}
                      </div>
                      
                      {isEditing && (
                         <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-blue-700 hover:scale-105 transition-all z-10">
                            <Camera size={16} />
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

                   <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                   <p className="text-gray-500 font-medium mb-4">{user?.email}</p>
                   
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-full uppercase tracking-wider mb-6">
                      <Shield size={14} /> {user?.role} Account
                   </div>

                   <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                       <div className="text-center">
                           <span className="block text-2xl font-bold text-gray-900">0</span>
                           <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Orders</span>
                       </div>
                       <div className="text-center border-l border-gray-100">
                           <span className="block text-2xl font-bold text-gray-900">0</span>
                           <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Reviews</span>
                       </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Details Form */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                {isEditing && (
                    <div className="absolute top-0 px-8 py-2 bg-amber-50 w-full flex items-center gap-2 text-amber-700 text-sm font-bold border-b border-amber-100">
                        <AlertCircle size={16} /> You are currently editing your profile
                    </div>
                )}

                <div className={`p-8 ${isEditing ? 'pt-14' : ''}`}>
                   <div className="flex items-center gap-3 mb-8">
                       <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                           <User size={24} />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                   </div>
                   
                   <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-gray-400" /> Full Name
                            </label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 placeholder:text-gray-400"
                                placeholder="Enter your full name"
                            />
                         </div>
                         <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" /> Email Address
                            </label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing} 
                                className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 placeholder:text-gray-400"
                                placeholder="name@example.com"
                            />
                         </div>
                         
                         {isEditing && (
                           <div className="col-span-1 md:col-span-2 pt-8 mt-2 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                              <div className="flex items-center gap-3 mb-6">
                                   <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                       <Lock size={20} />
                                   </div>
                                   <h4 className="text-lg font-bold text-gray-900">Security Settings</h4>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                      <label className="text-sm font-bold text-gray-700">New Password</label>
                                      <input 
                                          type="password" 
                                          name="password"
                                          value={formData.password}
                                          onChange={handleChange}
                                          placeholder="••••••••"
                                          className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                                      <input 
                                          type="password" 
                                          name="confirmPassword"
                                          value={formData.confirmPassword}
                                          onChange={handleChange}
                                          placeholder="••••••••"
                                          className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                      />
                                  </div>
                              </div>
                           </div>
                         )}
                         
                         {isEditing && (
                            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 pt-6 mt-4 border-t border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                               <button 
                                  type="button"
                                  onClick={() => setIsEditing(false)}
                                  className="px-6 py-3 flex items-center gap-2 font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                               >
                                  <X size={18} /> Cancel
                               </button>
                               <button 
                                  type="submit" 
                                  className="px-8 py-3 flex items-center gap-2 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg shadow-blue-500/30 transition-all"
                               >
                                  <Save size={18} /> Save Changes
                               </button>
                            </div>
                         )}
                      </div>
                   </form>
                </div>
             </div>

             {/* Become a Vendor CTA - Only for customers */}
             {user?.role === 'customer' && (
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-2xl shadow-xl p-6 text-white group cursor-pointer hover:shadow-purple-900/40 transition-shadow">
                   <div className="absolute top-0 right-0 p-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
                   <div className="absolute bottom-0 left-0 p-24 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
                   
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="max-w-xl">
                         <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 text-purple-200 shadow-inner border border-white/10">
                            <Sparkles size={20} />
                         </div>
                         <h3 className="text-xl font-extrabold mb-2 tracking-tight">Turn your passion into profit</h3>
                         <p className="text-indigo-200 text-sm leading-relaxed">Join thousands of successful sellers on MultiMart. Start listing your products today.</p>
                      </div>
                      <button className="flex-shrink-0 px-6 py-2.5 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 group-hover:gap-2 text-sm">
                         Become a Seller <ChevronRight size={16} />
                      </button>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default Profile;
