import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { doctorAPI } from '@/services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Clock,
  DollarSign,
  Stethoscope
} from 'lucide-react';

const TreatmentsPage = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'CLEANING',
    duration: '',
    price: ''
  });

  const categories = [
    'CLEANING', 'FILLING', 'ROOT_CANAL', 'EXTRACTION', 
    'ORTHODONTICS', 'COSMETIC', 'SURGERY'
  ];

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await doctorAPI.getTreatments();
      setTreatments(response.data.data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTreatment) {
        await doctorAPI.updateTreatment(editingTreatment.id, formData);
      } else {
        await doctorAPI.addTreatment(formData);
      }
      fetchTreatments();
      resetForm();
    } catch (error) {
      console.error('Error saving treatment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        await doctorAPI.deleteTreatment(id);
        fetchTreatments();
      } catch (error) {
        console.error('Error deleting treatment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'CLEANING',
      duration: '',
      price: ''
    });
    setShowAddForm(false);
    setEditingTreatment(null);
  };

  const startEdit = (treatment) => {
    setFormData({
      name: treatment.name,
      description: treatment.description || '',
      category: treatment.category,
      duration: treatment.duration.toString(),
      price: treatment.price.toString()
    });
    setEditingTreatment(treatment);
    setShowAddForm(true);
  };

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    const colors = {
      CLEANING: 'bg-blue-100 text-blue-800',
      FILLING: 'bg-green-100 text-green-800',
      ROOT_CANAL: 'bg-red-100 text-red-800',
      EXTRACTION: 'bg-orange-100 text-orange-800',
      ORTHODONTICS: 'bg-purple-100 text-purple-800',
      COSMETIC: 'bg-pink-100 text-pink-800',
      SURGERY: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Services</h1>
              <p className="text-gray-600">Manage the services you offer to patients</p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTreatment ? 'Edit Service' : 'Add New Service'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Service Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                      placeholder="Service description..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingTreatment ? 'Update' : 'Add'} Service
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment, index) => (
            <motion.div
              key={treatment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{treatment.name}</CardTitle>
                      <Badge className={getCategoryColor(treatment.category)}>
                        {treatment.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(treatment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(treatment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {treatment.description && (
                    <p className="text-gray-600 mb-4">{treatment.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {treatment.duration} min
                    </div>
                    <div className="flex items-center font-semibold text-green-600">
                      <span className="font-bold">₹</span>
                      {treatment.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No services found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TreatmentsPage;