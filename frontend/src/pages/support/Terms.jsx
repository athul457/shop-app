import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
          <p>Welcome to MultiMart. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of Service</h2>
          <p>You must be at least 18 years old to use this service. You agree not to use the website for any illegal or unauthorized purpose.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Products and Pricing</h2>
          <p>We strive to display accurate product information. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free. Prices are subject to change without notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
          <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of MultiMart or its content suppliers and protected by international copyright laws.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Termination</h2>
          <p>We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
