// File: src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import supabase from '../supabaseClient';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [classification, setClassification] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      if (user.created_at) {
        const localDate = new Date(user.created_at).toLocaleString();
        setDateJoined(localDate);
      }

      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, state_code, classification')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
        } else if (data) {
          setUsername(data.username || '');
          setStateCode(data.state_code || '');
          setClassification(data.classification || '');
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update({ username, state_code: stateCode, classification })
      .eq('id', user.id);

    if (error) {
      setMessage('Error updating profile: ' + error.message);
    } else {
      setMessage('✅ Profile updated successfully!');
    }
  };

  if (loading) return <p className="text-center text-zinc-500">Loading...</p>;
  if (!user) return <p className="text-center text-zinc-500">Please log in to view or edit your profile.</p>;

  return (
    <div className="max-w-md mx-auto p-6 text-zinc-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      {dateJoined && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          Date Joined: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{dateJoined}</span>
        </p>
      )}

      {message && <p className="mb-4 text-center text-sm text-blue-600 dark:text-blue-400">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">State Code</label>
          <input
            type="text"
            placeholder="e.g., CA"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value.toUpperCase())}
            className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Classification</label>
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
          >
            <option value="">Select Classification</option>
            <option value="Rural">Rural</option>
            <option value="Suburban">Suburban</option>
            <option value="Urban">Urban</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
