import React from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Returns = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Returns & Refunds Policy</h1>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10 flex gap-4">
        <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Standard Return Policy</h3>
          <p className="text-blue-700 text-sm">Most items can be returned within 30 days of delivery. Items must be in original condition, unused, and with tags attached.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                Returnable Items
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
                <li>• Clothing (unwashed, unworn, tags attached)</li>
                <li>• Electronics (unopened or defective)</li>
                <li>• Home Decor (undamaged)</li>
                <li>• Beauty Products (unopened)</li>
            </ul>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="text-red-500" size={20} />
                Non-Returnable Items
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
                <li>• Perishable goods (food, flowers)</li>
                <li>• Personal care items (opened)</li>
                <li>• Gift cards</li>
                <li>• Downloadable software products</li>
            </ul>
         </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
             <li>Log in to your account and go to "My Orders".</li>
             <li>Select the order containing the item you wish to return.</li>
             <li>Click on "Request Return" and follow the instructions.</li>
             <li>Print the prepaid shipping label sent to your email.</li>
             <li>Pack the item securely and drop it off at the nearest shipping center.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Refund Process</h2>
          <p className="text-gray-600">Once we receive your return, we will inspect the item. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>
        </section>
      </div>
    </div>
  );
};

export default Returns;
