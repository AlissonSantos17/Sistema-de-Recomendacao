import { Navigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
