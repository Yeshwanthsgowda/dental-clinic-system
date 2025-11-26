import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { role } = useAuth();

  // Redirect based on user role
  if (role === 'doctor') {
    return <Navigate to="/doctor/dashboard" replace />;
  } else if (role === 'patient') {
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Dashboard;