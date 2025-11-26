import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { doctorAPI } from '@/services/api';
import { DoctorCardSkeleton } from '@/components/common/LoadingSkeleton';
import { 
  User, 
  Star, 
  Award, 
  DollarSign,
  Search,
  Calendar
} from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getDoctors();
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4">Our Doctors</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Dental Professionals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our team of experienced dentists specialized in various fields
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      {doctor.profilePic ? (
                        <img
                          src={doctor.profilePic}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <User className="h-10 w-10 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl">{doctor.name}</CardTitle>
                        <p className="text-gray-600">{doctor.specialization}</p>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.9 (127)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Award className="h-4 w-4 mr-2" />
                          <span className="text-sm">{doctor.experience} years exp.</span>
                        </div>
                        <div className="flex items-center text-green-600 font-semibold">
                          <span className="font-bold">₹</span>
                          {doctor.fees}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link to={`/ai-book-appointment?doctor=${doctor.id}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="flex-1">
                        <Link to={`/doctor/${doctor.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No doctors found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Doctors;