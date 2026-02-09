import React from 'react';
import { HelpCircle, MessageCircle, Truck, RefreshCw } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
        <div className="relative max-w-xl mx-auto">
          <input 
            type="text" 
            placeholder="Search for help..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
          />
          <HelpCircle className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Truck size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Order Tracking</h3>
          <p className="text-gray-500 text-sm">Check the status of your recent orders and shipments.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <RefreshCw size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Returns & Refunds</h3>
          <p className="text-gray-500 text-sm">Start a return or check the status of a refund.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Contact Support</h3>
          <p className="text-gray-500 text-sm">Reach out to our customer service team directly.</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Articles</h2>
        <div className="space-y-4">
          {[
            "How do I track my order?",
            "What is your return policy?",
            "How can I change my shipping address?",
            "Payment methods accepted",
            "International shipping information"
          ].map((topic, bg) => (
            <div key={bg} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center cursor-pointer hover:border-blue-200 transition-colors">
              <span className="text-gray-700 font-medium">{topic}</span>
              <span className="text-blue-500 text-sm font-bold">Read &rarr;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
