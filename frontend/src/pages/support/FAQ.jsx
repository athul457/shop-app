import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. International shipping can take 7-14 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Visa, MasterCard, American Express, PayPal, and Apple Pay."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you will receive an email with a tracking number. You can also track your order from the 'My Orders' section in your account."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "You can cancel or modify your order within 1 hour of placing it. After that, we begin processing the order and cannot make changes."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all hover:border-blue-200"
          >
            <button 
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-gray-800">{faq.question}</span>
              {openIndex === index ? <ChevronUp className="text-blue-500" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 bg-gray-50/50">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-500 text-sm mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQ;
