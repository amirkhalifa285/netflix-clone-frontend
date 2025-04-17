import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Placeholder components (to be implemented later)
const ProfileSelection = () => <div>Profile Selection Page</div>;
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
          
          {/* Protected Routes */}
          <Route path="/profiles" element={
            <ProtectedRoute>
              <ProfileSelection />
            </ProtectedRoute>
          } />
          
          <Route path="/browse" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/tv-shows" element={
            <ProtectedRoute>
              <TVShows />
            </ProtectedRoute>
          } />
          
          <Route path="/movies" element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          } />
          
          <Route path="/new-popular" element={
            <ProtectedRoute>
              <NewAndPopular />
            </ProtectedRoute>
          } />
          
          <Route path="/my-list" element={
            <ProtectedRoute>
              <MyList />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;