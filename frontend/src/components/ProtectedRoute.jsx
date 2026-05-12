import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function ProtectedRoute({ children }) {
  const { etudiant } = useAuth();
  if (!etudiant) return <Navigate to="/" replace />;
  return children;
}
