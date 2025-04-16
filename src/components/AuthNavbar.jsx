import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthNavbar = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 transition"
        >
          BrainBridge
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 mt-2 sm:mt-0 text-sm sm:text-base">
          <Link to="/analytics" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition">
            Analytics
          </Link>
          <Link to="/about" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition">
            About
          </Link>
          <Link to="/ai-disclosure" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition">
            AI Disclosure
          </Link>
          <Link to="/whats-the-problem" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition">
            What’s the Problem?
          </Link>

          {user ? (
            <>
              <Link
                to={role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                className="text-zinc-800 dark:text-white font-semibold hover:text-blue-700 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition"
              >
                Profile
              </Link>
              <Link
                to="/logout"
                className="text-red-500 hover:text-red-600 font-medium transition"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;