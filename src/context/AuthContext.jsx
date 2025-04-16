// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', currentUser.id)
          .single();

        if (!error && profile) {
          setRole(profile.role);
          setUsername(profile.username);
        }
      }

      setLoading(false);
    };

    fetchUserAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role, username')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setRole(profile.role);
              setUsername(profile.username);
            }
          });
      } else {
        setRole(null);
        setUsername(null);
      }
    });

    return () => {
      if (listener.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, username, loading }}>
      {children}
    </AuthContext.Provider>
  );
};