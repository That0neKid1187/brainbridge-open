import React from 'react';

const AIDisclosurePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">AI Disclosure</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why This Matters</h2>
        <p>
          At BrainBridge, we want to be transparent about how we use Artificial Intelligence (AI) to create and improve educational content. AI helps us generate topics and summaries, making sure we can offer a wide range of learning materials. However, your trust is important, and we want to make sure you understand how AI is used and how it’s reviewed for quality and accuracy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How We Use AI</h2>
        <ul className="list-disc ml-6">
          <li><strong>Generating Topics:</strong> AI helps us generate ideas for lesson topics, especially in areas where we might have less expertise.</li>
          <li><strong>Creating Summaries:</strong> AI is used to create summaries for lessons to ensure they’re easy to understand and concise.</li>
          <li><strong>Human Review:</strong> All AI-generated content is reviewed, edited, and customized by me, Jacob Brashear. For topics I’m less familiar with, external educators double-check the lesson before it goes live to ensure accuracy.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">What AI Doesn't Do</h2>
        <ul className="list-disc ml-6">
          <li><strong>Not Used for User Data:</strong> AI does not process or influence personal user data in any way. We only use anonymized data for lesson tracking.</li>
          <li><strong>No Grading or Recommendations:</strong> AI does not handle grading, user recommendations, or any other user-facing functionality beyond lesson creation.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Privacy and AI</h2>
        <p>
          We take your privacy seriously. All data used by AI is de-identified and aggregated. No personal data is shared with AI models, and we don’t sell or share any information with third parties. For more details, please check our <a href="/privacy" className="underline text-blue-600 dark:text-blue-400">Privacy & Data Use</a> page.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">AI Ethics and Quality Control</h2>
        <p>
          We use the latest AI models available, and all AI-generated content undergoes rigorous review. I personally oversee the customization and quality of the content, and if I’m not an expert in a particular area, external educators review it before it’s published. We aim to ensure all content is accurate, ethical, and relevant for students like you.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          If you have any questions or concerns about how we use AI at BrainBridge, feel free to reach out to us. We’re always happy to chat!
        </p>
        <p>
          Contact us at <a href="mailto:jacobbrasheardebate@gmail.com" className="text-blue-600 dark:text-blue-400 underline">jacobbrasheardebate@gmail.com</a> or through our <a href="/feedback" className="underline text-blue-600 dark:text-blue-400">feedback form</a>.
        </p>
      </section>
    </div>
  );
};

export default AIDisclosurePage;