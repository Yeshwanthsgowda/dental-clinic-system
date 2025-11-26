import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat/ChatWidget';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/Dashboard';
import Unauthorized from '@/pages/Unauthorized';
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import TreatmentsPage from '@/pages/doctor/TreatmentsPage';
import SchedulePage from '@/pages/doctor/SchedulePage';
import AppointmentsPage from '@/pages/doctor/AppointmentsPage';
import DoctorProfile from '@/pages/doctor/DoctorProfile';
import ReviewsPage from '@/pages/doctor/ReviewsPage';
import AIBookAppointment from '@/pages/AIBookAppointment';
import Doctors from '@/pages/Doctors';
import DoctorDetail from '@/pages/DoctorDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PatientAppointments from '@/pages/patient/PatientAppointments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        <ChatWidget />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Doctor Routes */}
            <Route 
              path="doctor/dashboard" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="doctor/treatments" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <TreatmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="doctor/schedule" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <SchedulePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="doctor/appointments" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <AppointmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="doctor/profile" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="doctor/reviews" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <ReviewsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Patient Routes */}
            <Route 
              path="patient/appointments" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientAppointments />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctor/:id" element={<DoctorDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="ai-book-appointment" element={<AIBookAppointment />} />
            
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;