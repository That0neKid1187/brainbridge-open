import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import Modal from "react-modal";
import { AuthProvider } from "./context/AuthContext"; // ✅ Add this line
import "./index.css";

Modal.setAppElement("#root");

const container = document.getElementById('root');
const root = createRoot(container);

// ✅ Wrap <App /> in <AuthProvider>
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);