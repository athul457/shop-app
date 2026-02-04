import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      toast.success('Welcome back!');

      // Role-Based Redirection
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
       
       {/* Left Side - Image/Branding */}
       <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
            <img 
                src="https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Shopping" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="relative z-10 text-white p-12 max-w-lg">
                <h1 className="text-5xl font-extrabold mb-6">Welcome Back</h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                    Discover the best deals and premium products tailored just for you. 
                    Login to access your personalized dashboard.
                </p>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-12 right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="max-w-md w-full">
             <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <LogIn size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                <p className="text-gray-500 mt-2">Enter your details to continue</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="you@example.com"
                        required
                      />
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                   </div>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                         <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="••••••••"
                        required
                      />
                   </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing In...' : (
                        <>Sign In <ArrowRight size={20} /></>
                    )}
                </button>
             </form>

             <div className="mt-8 text-center bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-gray-600">
                   Don't have an account yet?{' '}
                   <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">
                      Create an account
                   </Link>
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Login;
