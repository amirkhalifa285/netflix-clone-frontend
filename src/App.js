import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProfileSelection from './pages/ProfileSelection';

// Main Pages
import HomePage from './pages/HomePage';
import ReviewPage from './pages/ReviewPage';
import TVShowsPage from './pages/TVShowsPage';
import MoviesPage from './pages/MoviesPage';
import SearchPage from './pages/SearchPage';
import MyListPage from './pages/MyListPage';
import NewAndPopularPage from './pages/NewAndPopularPage';

// Admin Dashboard
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes with Profile Context */}
          <Route path="/profiles" element={
            <ProtectedRoute>
              <ProfileProvider>
                <ProfileSelection />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/browse" element={
            <ProtectedRoute>
              <ProfileProvider>
                <HomePage />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/tv-shows" element={
            <ProtectedRoute>
              <ProfileProvider>
                <TVShowsPage />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/movies" element={
            <ProtectedRoute>
              <ProfileProvider>
                <MoviesPage />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/new-popular" element={
            <ProtectedRoute>
              <ProfileProvider>
                <NewAndPopularPage />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/my-list" element={
            <ProtectedRoute>
              <ProfileProvider>
                <MyListPage />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <ProfileProvider>
                <SearchPage />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          {/* New Review Route */}
          <Route path="/review/:contentId" element={
            <ProtectedRoute>
              <ProfileProvider>
                <ReviewPage />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes - Now also wrapped in ProfileProvider */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/profiles" replace />} />
          <Route path="*" element={<Navigate to="/profiles" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;