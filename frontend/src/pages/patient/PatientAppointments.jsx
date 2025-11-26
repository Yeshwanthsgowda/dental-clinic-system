import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Stethoscope, FileText, Loader2, Star, MessageSquare } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      console.log('Current user:', user);
      const response = await api.get('/appointments');
      console.log('Appointments response:', response.data);
      const allAppointments = Array.isArray(response.data) ? response.data : [];
      console.log('All appointments count:', allAppointments.length);
      const patientAppointments = allAppointments.filter(apt => {
        console.log('Checking appointment:', apt.id, 'patientId:', apt.patientId, 'user.id:', user.id);
        return apt.patientId === user.id;
      });
      console.log('Filtered patient appointments:', patientAppointments);
      setAppointments(patientAppointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (appointmentId) => {
    try {
      const appointment = appointments.find(a => a.id === appointmentId);
      await api.post('/reviews', {
        appointmentId,
        patientId: user.id,
        doctorId: appointment.doctorId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      setShowReviewForm(null);
      setReviewData({ rating: 5, comment: '' });
      fetchAppointments();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-gray-600">View and manage your dental appointments</p>
        </motion.div>

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
                <p className="text-gray-500">Book your first appointment to get started</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">
                        {appointment.treatment?.name || 'Treatment'}
                      </CardTitle>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Doctor</p>
                          <p className="font-semibold">Dr. {appointment.doctor?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Stethoscope className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="font-semibold">{appointment.doctor?.specialization}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-semibold">{appointment.timeSlot}</p>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="flex items-start gap-3 md:col-span-2">
                          <FileText className="h-5 w-5 text-gray-600 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="text-gray-700">{appointment.notes}</p>
                          </div>
                        </div>
                      )}

                      <div className="md:col-span-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Treatment Price</p>
                            <p className="text-2xl font-bold text-purple-600">
                              ₹{appointment.treatment?.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold">{appointment.treatment?.duration} min</p>
                          </div>
                        </div>
                      </div>

                      {appointment.status === 'COMPLETED' && !appointment.review && (
                        <div className="md:col-span-2 pt-4 border-t">
                          {showReviewForm === appointment.id ? (
                            <div className="space-y-3">
                              <div>
                                <Label>Rating</Label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setReviewData({...reviewData, rating: star})}
                                      className="focus:outline-none"
                                    >
                                      <Star
                                        className={`h-6 w-6 ${
                                          star <= reviewData.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label>Comment</Label>
                                <Textarea
                                  value={reviewData.comment}
                                  onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                  placeholder="Share your experience..."
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => submitReview(appointment.id)} size="sm">
                                  Submit Review
                                </Button>
                                <Button onClick={() => setShowReviewForm(null)} variant="outline" size="sm">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button onClick={() => setShowReviewForm(appointment.id)} className="w-full" variant="outline">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Leave a Review
                            </Button>
                          )}
                        </div>
                      )}

                      {appointment.review && (
                        <div className="md:col-span-2 pt-4 border-t bg-yellow-50 p-3 rounded">
                          <p className="text-sm font-medium text-gray-700 mb-2">Your Review</p>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= appointment.review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">{appointment.review.comment}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
