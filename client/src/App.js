import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageLakes from './pages/admin/ManageLakes';
import ManageSpots from './pages/admin/ManageSpots';
import AdminReservations from './pages/admin/AdminReservations';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSpots from './pages/admin/AdminSpots';
import LakesPage from './pages/user/LakesPage';
import LakeDetailPage from './pages/user/LakeDetailPage';
import ReservationPage from './pages/user/ReservationPage';
import MyReservations from './pages/user/MyReservations';
import MyReviews from './pages/user/MyReviews';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <ErrorBoundary>
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

              {/* User routes - Lakes */}
              <Route
                path="/lakes"
                element={
                  <ProtectedRoute>
                    <LakesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/lakes/:id"
                element={
                  <ProtectedRoute>
                    <LakeDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute>
                    <MyReservations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reservation/:lakeId/:spotId"
                element={
                  <ProtectedRoute>
                    <ReservationPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-reviews"
                element={
                  <ProtectedRoute>
                    <MyReviews />
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

              <Route
                path="/admin/lakes/:lakeId/spots"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageSpots />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/reservations"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminReservations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/reviews"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminReviews />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/spots"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminSpots />
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
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
