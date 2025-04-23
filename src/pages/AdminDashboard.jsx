// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/admin/AdminHeader';
import LogViewer from '../components/admin/LogViewer';
import ContentBrowser from '../components/admin/ContentBrowser';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('logs');

  // Ensure only admins can access this page
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <h2>Admin Dashboard</h2>
          <div className="admin-tabs">
            <button 
              className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              System Logs
            </button>
            <button 
              className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Add Content
            </button>
          </div>
        </div>
        
        <div className="admin-main">
          {activeTab === 'logs' ? (
            <LogViewer />
          ) : (
            <ContentBrowser />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;