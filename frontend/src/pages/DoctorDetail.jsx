import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { doctorAPI } from '@/services/api';
import { User, Star, Award, Mail, Calendar, Clock } from 'lucide-react';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorAPI.getDoctor(id);
      setDoctor(response.data.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Doctor not found</p>
      </div>
    );
  }

  const avgRating = doctor.reviews?.length > 0
    ? (doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  {doctor.profilePic ? (
                    <img
                      src={doctor.profilePic}
                      alt={doctor.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">{doctor.specialization}</p>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-700">{avgRating} ({doctor.reviews?.length || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{doctor.email}</span>
                    </div>
                  </div>
                  {doctor.description && (
                    <p className="text-gray-600 leading-relaxed mb-4">{doctor.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-green-600">₹{doctor.fees}</div>
                    <Button asChild>
                      <Link to={`/ai-book-appointment?doctor=${doctor.id}`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                {doctor.treatments?.length > 0 ? (
                  <div className="space-y-3">
                    {doctor.treatments.map((treatment) => (
                      <div key={treatment.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{treatment.name}</h3>
                          <Badge>{treatment.category}</Badge>
                        </div>
                        {treatment.description && (
                          <p className="text-sm text-gray-600 mb-2">{treatment.description}</p>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {treatment.duration} min
                          </span>
                          <span className="font-semibold text-green-600">₹{treatment.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No services listed</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {doctor.reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {doctor.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold">{review.patient?.name}</p>
                          <div className="flex">
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
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDetail;
