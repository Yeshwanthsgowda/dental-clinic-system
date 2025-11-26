import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { doctorAPI } from '@/services/api';
import { 
  Calendar, 
  Users, 
  Star, 
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await doctorAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Appointments',
      value: dashboardData?.stats?.totalAppointments || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Patients',
      value: dashboardData?.stats?.totalPatients || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Average Rating',
      value: dashboardData?.stats?.averageRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: "Today's Appointments",
      value: dashboardData?.stats?.todayAppointments || 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-blue-100 text-sm md:text-base">Welcome back! Here's your practice overview.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                      <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Appointments
                </CardTitle>
                <CardDescription className="text-sm">
                  {dashboardData?.todayAppointments?.length || 0} appointments scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {dashboardData?.todayAppointments?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.todayAppointments.map((appointment, idx) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100"
                      >
                        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-sm">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{appointment.patient?.name}</p>
                            <p className="text-sm text-gray-600">{appointment.treatment?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end space-x-3 sm:space-x-0">
                          <p className="font-semibold text-gray-900">{appointment.timeSlot}</p>
                          <Badge className={`${getStatusColor(appointment.status)} border-0 shadow-sm`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 md:p-6">
                <Button className="w-full justify-start hover:scale-105 transition-transform shadow-sm hover:shadow-md" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Appointments
                </Button>
                <Button className="w-full justify-start hover:scale-105 transition-transform shadow-sm hover:shadow-md" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Services
                </Button>
                <Button className="w-full justify-start hover:scale-105 transition-transform shadow-sm hover:shadow-md" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Update Schedule
                </Button>
                <Button className="w-full justify-start hover:scale-105 transition-transform shadow-sm hover:shadow-md" variant="outline">
                  <Star className="mr-2 h-4 w-4" />
                  View Reviews
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Star className="h-5 w-5 text-yellow-600" />
                Recent Patient Feedback
              </CardTitle>
              <CardDescription className="text-sm">
                Latest reviews from your patients
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {dashboardData?.recentReviews?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentReviews.slice(0, 5).map((review, idx) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.patient?.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;