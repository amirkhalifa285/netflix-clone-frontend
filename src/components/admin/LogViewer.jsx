// src/components/admin/LogViewer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';

const LogViewer = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filter states
    const [filters, setFilters] = useState({
        action: '',
        email: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminService.getLogs({
                page,
                ...filters
            });

            if (response.success) {
                setLogs(response.logs);
                setTotalPages(response.pages || 1);
            } else {
                setError('Failed to load logs');
            }
        } catch (err) {
            console.error('Error fetching logs:', err);
            setError('Failed to load logs');
        } finally {
            setLoading(false);
        }
    },[page, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(1); // Reset to first page when filters change
    };

    const clearFilters = () => {
        setFilters({
            action: '',
            email: '',
            startDate: '',
            endDate: ''
        });
        setPage(1);
    };

    const formatTimeString = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const actionLabels = {
        'login': 'Login',
        'logout': 'Logout',
        'add_content': 'Content Added',
        'delete_content': 'Content Deleted',
        'create_profile': 'Profile Created',
        'delete_profile': 'Profile Deleted',
        'add_to_list': 'Added to List',
        'remove_from_list': 'Removed from List',
        'add_review': 'Review Added',
        'delete_review': 'Review Deleted'
    };

    if (loading && logs.length === 0) {
        return <div className="loading">Loading logs...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="log-viewer">
            <h2>System Logs</h2>

            <div className="filters-container">
                <div className="filter-group">
                    <label>Action:</label>
                    <select
                        name="action"
                        value={filters.action}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Actions</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="add_content">Content Added</option>
                        <option value="delete_content">Content Deleted</option>
                        <option value="create_profile">Profile Created</option>
                        <option value="delete_profile">Profile Deleted</option>
                        <option value="add_to_list">Added to List</option>
                        <option value="remove_from_list">Removed from List</option>
                        <option value="add_review">Review Added</option>
                        <option value="delete_review">Review Deleted</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>User Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        placeholder="Filter by email"
                    />
                </div>

                <div className="filter-group">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </div>

                <button className="clear-filters" onClick={clearFilters}>
                    Clear Filters
                </button>
            </div>

            {logs.length === 0 ? (
                <p className="no-logs">No logs found matching your criteria</p>
            ) : (
                <>
                    <div className="logs-table-container">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log._id}>
                                        <td>{log.formattedTimestamp || formatTimeString(log.timestamp)}</td>
                                        <td>
                                            <span className={`action-tag ${log.action}`}>
                                                {actionLabels[log.action] || log.action}
                                            </span>
                                        </td>
                                        <td>{log.user?.email || 'N/A'}</td>
                                        <td>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                        <span className="page-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LogViewer;