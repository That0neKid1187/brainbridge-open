import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">🔒 Privacy & Data Use</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why This Matters</h2>
        <p>
          BrainBridge is committed to protecting your privacy. This page outlines what data we collect, why we collect it, and how it is used. Our platform is built for students, educators, and communities who deserve transparency.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">What We Collect</h2>
        <ul className="list-disc ml-6">
          <li><strong>Anonymous Usage Data:</strong> Page views, lessons completed, session durations</li>
          <li><strong>Classification Info:</strong> State and region type (Rural, Urban, Suburban)</li>
          <li><strong>Account Info:</strong> If you create an account, we collect your email address securely through Supabase Auth. We never share or sell this information.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How We Use Data</h2>
        <ul className="list-disc ml-6">
          <li>To improve educational resources and track learning impact</li>
          <li>To visualize anonymous, public metrics on our Analytics Dashboard</li>
          <li>To understand regional access disparities (rural vs. urban usage)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Privacy Choices</h2>
        <p>
          All data is de-identified and aggregated. We don’t run ads or share any information with third parties. If you’d like to opt out of data collection on your user session, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Security Practices</h2>
        <p>
          All data is securely stored in Supabase with encrypted-at-rest protections. We use modern practices to prevent unauthorized access to any platform data.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          Have questions? Contact our team at 
          <a href="mailto:jacobbrasheardebate@gmail.com" className="text-blue-600 dark:text-blue-400 underline"> jacobbrasheardebate@gmail.com </a> 
          or through our <a href="/feedback" className="underline text-blue-600 dark:text-blue-400">feedback form</a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;