// File: src/components/Layout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthNavbar from "./AuthNavbar";

const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(match.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    match.addEventListener("change", handler);
    return () => match.removeEventListener("change", handler);
  }, []);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors">
        {/* ✅ Auth-aware Navbar */}
        <AuthNavbar />

        {/* ✅ Dynamic Page Content */}
        <main className="p-6 md:p-12 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>

        {/* ✅ Footer */}
        <footer className="text-center text-sm py-6 border-t dark:border-zinc-700">
          <p>
            Built with 💙 by Jacob Brashear •{" "}
            <a href="/privacy" className="underline">
              Privacy
            </a>{" "}
            •{" "}
            <a href="/feedback" className="underline">
              Feedback
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;