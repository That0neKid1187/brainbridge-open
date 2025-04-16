// src/pages/Login.jsx
import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input className="w-full p-2 border" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full p-2 border" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default Login;