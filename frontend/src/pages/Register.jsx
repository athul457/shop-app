import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/register', formData);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
       
       {/* Left Side - Image/Branding */}
       <div className="hidden lg:flex w-1/2 bg-purple-600 relative overflow-hidden items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 opacity-90"></div>
            <img 
                src="https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Shopping Bags" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="relative z-10 text-white p-12 max-w-lg">
                <h1 className="text-5xl font-extrabold mb-6">Join Us Today</h1>
                <p className="text-xl text-purple-100 leading-relaxed mb-8">
                    Create an account to start shopping, track your orders, and enjoy exclusive member-only discounts.
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-lg font-medium">
                        <CheckCircle className="text-green-400" /> <span>Free Shipping on First Order</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg font-medium">
                        <CheckCircle className="text-green-400" /> <span>Exclusive Daily Deals</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg font-medium">
                        <CheckCircle className="text-green-400" /> <span>24/7 Premium Support</span>
                    </div>
                </div>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="max-w-md w-full">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-500 mt-2">Get started with your free account</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                         <User size={20} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="John Doe"
                        required
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                         <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="you@example.com"
                        required
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                         <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="Create a strong password"
                        required
                      />
                   </div>
                   <p className="text-xs text-gray-500 mt-1 ml-1">Must be at least 8 characters long</p>
                </div>

                <div className="flex items-center">
                    <input id="terms" type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" required />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? 'Creating Account...' : (
                        <>Sign Up <ArrowRight size={20} /></>
                    )}
                </button>
             </form>

             <div className="mt-8 text-center">
                <p className="text-gray-600">
                   Already have an account?{' '}
                   <Link to="/login" className="text-purple-600 font-bold hover:underline ml-1">
                      Sign in here
                   </Link>
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Register;
