import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Kiosk from './pages/Kiosk';
import Dashboard from './pages/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Kiosk />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <motion.header className="bg-white shadow p-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <motion.div className="text-xl font-bold" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>Restaurant Kiosk</motion.div>
            <nav className="flex gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="px-2 py-1 rounded hover:bg-gray-100">Kiosk</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to="/dashboard" className="px-2 py-1 rounded hover:bg-gray-100">Dashboard</Link>
              </motion.div>
            </nav>
          </div>
        </motion.header>

        <main className="max-w-6xl mx-auto p-4">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}
