// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [classification, setClassification] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    // Sign up via Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    const newUser = data?.user;
    if (!newUser) {
      setMessage('Signup succeeded, but no user returned. Check email confirmation.');
      return;
    }

    // Insert a row in profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: newUser.id, // match the user's UUID
          state_code: stateCode,
          classification,
        },
      ]);

    if (profileError) {
      setMessage('Signup succeeded, but failed to create profile: ' + profileError.message);
    } else {
      setMessage('Signup successful! Check your email for confirmation.');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="State Code (e.g. CA)"
          className="w-full p-2 border rounded"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value.toUpperCase())}
        />
        <select
          className="w-full p-2 border rounded"
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
        >
          <option value="">Select Classification</option>
          <option value="Rural">Rural</option>
          <option value="Suburban">Suburban</option>
          <option value="Urban">Urban</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4 text-center text-lg">{message}</p>}
    </div>
  );
};

export default Signup;