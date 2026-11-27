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
  const userRole = currentUser?.role;
  const isOwnerEmail = currentUser?.email === 'jk7217514087@gmail.com' || currentUser?.email === 'admin@smartdeal.com';
  const validAdminRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ANALYST', 'SUPPORT_ADMIN'];
  const isAdminRole = (userRole && validAdminRoles.includes(userRole as string)) || (role === 'ADMIN' && isOwnerEmail);
  const isNormalUser = userRole === 'USER';

  // Strict check: Must have valid session authentication flag AND verified admin role (never 'USER')
  const isAuthorizedAdmin = sessionAuth && isAdminRole && !isNormalUser;

  if (!isAuthorizedAdmin) {
    // Intercept unauthorized normal users and direct URL access, redirect immediately to /admin/login
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
