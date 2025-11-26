import axios from 'axios';
import { toast } from '@/hooks/useToast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      toast({
        title: 'Request Timeout',
        description: 'AI is taking longer than expected. Please try again.',
        variant: 'destructive',
      });
    }
    
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      toast({
        title: 'Session Expired',
        description: 'Please login again',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } else if (error.response?.status >= 500) {
      toast({
        title: 'Server Error',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  registerDoctor: (data) => api.post('/auth/register/doctor', data),
  registerPatient: (data) => api.post('/auth/register/patient', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Doctor API
export const doctorAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  updateProfile: (data) => api.put('/doctors/profile', data),
  getDashboard: () => api.get('/doctors/dashboard'),
  getAppointments: (params) => api.get('/doctors/appointments', { params }),
  getReviews: () => api.get('/doctors/reviews'),
  getTreatments: () => api.get('/doctors/treatments'),
  addTreatment: (data) => api.post('/doctors/treatments', data),
  updateTreatment: (id, data) => api.put(`/doctors/treatments/${id}`, data),
  deleteTreatment: (id) => api.delete(`/doctors/treatments/${id}`),
  setSchedule: (data) => api.put('/doctors/schedule', data),
  getScheduleOverrides: () => api.get('/doctors/schedule-overrides'),
  setScheduleOverride: (data) => api.post('/doctors/schedule-overrides', data),
  deleteScheduleOverride: (id) => api.delete(`/doctors/schedule-overrides/${id}`),
};

// Patient API
export const patientAPI = {
  getPatients: () => api.get('/patients'),
  getPatient: (id) => api.get(`/patients/${id}`),
  updateProfile: (data) => api.put(`/patients/${id}`, data),
};

// Appointment API
export const appointmentAPI = {
  getAppointments: (params) => api.get('/appointments', { params }),
  createAppointment: (data) => api.post('/appointments', data),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
};

// Review API
export const reviewAPI = {
  getReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default api;