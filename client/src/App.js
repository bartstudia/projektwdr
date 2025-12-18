import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageLakes from './pages/admin/ManageLakes';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected user routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Placeholder routes - będą dodane później */}
              <Route
                path="/lakes"
                element={
                  <ProtectedRoute>
                    <div className="page-container">
                      <h1>Jeziora - W budowie</h1>
                      <p>Ta strona będzie wkrótce dostępna</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute>
                    <div className="page-container">
                      <h1>Moje Rezerwacje - W budowie</h1>
                      <p>Ta strona będzie wkrótce dostępna</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/lakes"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageLakes />
                  </ProtectedRoute>
                }
              />

              {/* 404 route */}
              <Route
                path="*"
                element={
                  <div className="page-container">
                    <h1>404 - Strona nie znaleziona</h1>
                    <p>Przepraszamy, ta strona nie istnieje.</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
