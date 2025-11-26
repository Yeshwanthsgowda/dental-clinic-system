import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { doctorAPI } from '@/services/api';
import api from '@/services/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      
      const response = await doctorAPI.getAppointments(params);
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      fetchAppointments();
      alert(`Appointment ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return CheckCircle;
      case 'COMPLETED': return CheckCircle;
      case 'CANCELLED': return XCircle;
      default: return AlertCircle;
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.treatment?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
    const date = new Date(appointment.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-600">Manage your patient appointments</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setDateFilter('');
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appointments by Date */}
        <div className="space-y-6">
          {Object.entries(groupedAppointments).map(([date, dayAppointments], index) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {date}
                  </CardTitle>
                  <CardDescription>
                    {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dayAppointments
                      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                      .map((appointment) => {
                        const StatusIcon = getStatusIcon(appointment.status);
                        return (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <StatusIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{appointment.patient?.name}</h3>
                                  <Badge className={getStatusColor(appointment.status)}>
                                    {appointment.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  {appointment.treatment?.name}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {appointment.timeSlot}
                                  </div>
                                  {appointment.patient?.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {appointment.patient.phone}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {appointment.patient?.email}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {appointment.status === 'PENDING' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {appointment.status === 'CONFIRMED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                                >
                                  Mark Complete
                                </Button>
                              )}
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-600">
                                  ₹{appointment.treatment?.price}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {appointment.treatment?.duration} min
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No appointments found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;