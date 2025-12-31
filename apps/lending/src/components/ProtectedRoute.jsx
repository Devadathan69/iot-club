import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessDenied from '../pages/AccessDenied';

export default function ProtectedRoute({ children, adminOnly = false, memberOnly = false }) {
    const { currentUser, isAdmin, isMember, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>; // Simple loading state
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" />;
    }

    if (memberOnly && !isMember) {
        // If user is admin, they should probably bypass this, but for now strict check:
        if (isAdmin) return children;
        return <AccessDenied />;
    }

    return children;
}
