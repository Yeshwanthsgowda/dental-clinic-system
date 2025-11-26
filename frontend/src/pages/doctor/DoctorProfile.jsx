import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { doctorAPI } from '@/services/api';
import { 
  User, 
  Mail, 
  Award, 
  DollarSign, 
  Calendar,
  Star,
  Edit,
  Save,
  X,
  Camera
} from 'lucide-react';

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    description: user?.description || '',
    fees: user?.fees || '',
    profilePic: user?.profilePic || ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await doctorAPI.getReviews();
      setReviews(response.data.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await doctorAPI.updateProfile(formData);
      updateUser(response.data.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      specialization: user?.specialization || '',
      experience: user?.experience || '',
      description: user?.description || '',
      fees: user?.fees || '',
      profilePic: user?.profilePic || ''
    });
    setIsEditing(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSubmit} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience (years)</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="fees">Consultation Fee (₹)</Label>
                        <Input
                          id="fees"
                          type="number"
                          step="0.01"
                          value={formData.fees}
                          onChange={(e) => setFormData({...formData, fees: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">About / Description (Optional)</Label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                        placeholder="Tell patients about yourself, your expertise, and approach to dental care..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="profilePic">Profile Picture URL</Label>
                      <Input
                        id="profilePic"
                        type="url"
                        value={formData.profilePic}
                        onChange={(e) => setFormData({...formData, profilePic: e.target.value})}
                        placeholder="https://example.com/profile.jpg"
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {user?.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <User className="h-10 w-10 text-white" />
                          </div>
                        )}
                        <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                          <Camera className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{user?.name}</h3>
                        <p className="text-gray-600">{user?.specialization}</p>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Experience</p>
                            <p className="font-medium">{user?.experience} years</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Consultation Fee</p>
                            <p className="font-medium">₹{user?.fees}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium">
                              {new Date(user?.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {user?.description && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">About</p>
                        <p className="text-gray-700 leading-relaxed">{user.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats & Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Rating Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Rating & Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {averageRating}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{review.patient?.name}</p>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
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
                  <div className="text-center py-4">
                    <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;