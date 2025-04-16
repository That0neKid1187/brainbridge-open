// src/App.jsx
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import supabase from "./supabaseClient";

import Layout from './components/Layout';
import Home from './pages/Home';
import TopicPage from './pages/TopicPage';
import TopicOverview from './pages/TopicOverview'; // ✅ Added this import
import WhatsTheProblemPage from './pages/WhatsTheProblemPage';
import Lessons from './pages/Lessons';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import Logout from './pages/Logout';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import PrivacyPage from './pages/PrivacyPage';
import FeedbackPage from './pages/FeedbackPage';
import About from './pages/About';
import AIDisclosurePage from './pages/AIDisclosurePage';

import { AuthContext } from './context/AuthContext';

function App() {
  const { role } = useContext(AuthContext);

  useEffect(() => {
    const logUserSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }

      if (user) {
        const { error: insertError } = await supabase.from('user_sessions').insert([
          {
            user_id: user.id,
            user_agent: navigator.userAgent,
            ip_address: null,
          },
        ]);
        if (insertError) {
          console.error('Error logging session:', insertError.message);
        }
      }
    };

    logUserSession();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories/:topic" element={<TopicPage />} />
          <Route path="topics/:topic/overview" element={<TopicOverview />} /> {/* ✅ Added this route */}
          <Route path="lessons/:lessonId" element={<Lessons />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="logout" element={<Logout />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="dashboard"
            element={
              role === 'owner'
                ? <OwnerDashboard />
                : role === 'admin'
                ? <AdminDashboard />
                : <UserDashboard />
            }
          />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="whats-the-problem" element={<WhatsTheProblemPage />} />
          <Route path="about" element={<About />} />
          <Route path="ai-disclosure" element={<AIDisclosurePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;