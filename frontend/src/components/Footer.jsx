import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4 tracking-wide text-blue-400">MultiMart</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              MultiMart is your one-stop shop for everything you need. 
              We provide high-quality products from trusted vendors with 
              exceptional customer service and fast delivery.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-100">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-100">Customer Care</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-100">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400 mb-6">
               <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-blue-500" />
                  <span>123 Market Street, Suite 456<br/>New York, NY 10001</span>
               </li>
               <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-500" />
                  <span>+1 (234) 567-8900</span>
               </li>
               <li className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-500" />
                  <span>support@multimart.com</span>
               </li>
            </ul>

            <div className="bg-gray-800 p-1 rounded-lg flex">
                <input 
                   type="email" 
                   placeholder="Your Email" 
                   className="bg-transparent text-white text-sm px-4 py-2 w-full focus:outline-none"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                   Subscribe
                </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-500 text-sm">
             &copy; {new Date().getFullYear()} MultiMart. All rights reserved.
           </p>

           {/* Social Icons */}
           <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                 <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all">
                 <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                 <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all">
                 <Linkedin size={18} />
              </a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
