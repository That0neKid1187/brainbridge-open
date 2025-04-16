import React, { useState } from 'react';
import supabase from '../supabaseClient';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.from('feedback').insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message
      }
    ]);

    if (error) {
      console.error('Feedback submission error:', error.message);
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">💬 Feedback</h1>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
        We'd love to hear your thoughts. Whether it’s a bug, suggestion, or kind words — drop it below.
      </p>

      {submitted ? (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded text-center">
          Thanks for your feedback! 💡
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium dark:text-gray-200">Name (optional)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium dark:text-gray-200">Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium dark:text-gray-200">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-4 py-2"
            ></textarea>
          </div>

          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackPage;