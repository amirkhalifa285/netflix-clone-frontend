import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProfileSelection from './pages/ProfileSelection';

// Placeholder components (to be implemented later)
const Home = () => <div>Home Page</div>;
const TVShows = () => <div>TV Shows Page</div>;
const Movies = () => <div>Movies Page</div>;
const NewAndPopular = () => <div>New & Popular Page</div>;
const MyList = () => <div>My List Page</div>;
const Search = () => <div>Search Page</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

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
                <Home />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/tv-shows" element={
            <ProtectedRoute>
              <ProfileProvider>
                <TVShows />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/movies" element={
            <ProtectedRoute>
              <ProfileProvider>
                <Movies />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/new-popular" element={
            <ProtectedRoute>
              <ProfileProvider>
                <NewAndPopular />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/my-list" element={
            <ProtectedRoute>
              <ProfileProvider>
                <MyList />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <ProfileProvider>
                <Search />
              </ProfileProvider>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
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