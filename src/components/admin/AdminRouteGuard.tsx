import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface Props {
  children?: React.ReactNode;
}

export const AdminRouteGuard: React.FC<Props> = ({ children }) => {
  const { role, currentUser } = useApp();
  const location = useLocation();

  const sessionAuth = sessionStorage.getItem('smartdeal_admin_authenticated') === 'true';
  const isOwnerAdmin = (role === 'ADMIN' && currentUser?.role === 'ADMIN') || (sessionAuth && currentUser?.role === 'ADMIN') || sessionAuth;

  if (!isOwnerAdmin) {
    // Intercept unauthorized users and guests, redirect immediately to /admin/login
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
