// src/pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      navigate('/login');
    };
    signOut();
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;