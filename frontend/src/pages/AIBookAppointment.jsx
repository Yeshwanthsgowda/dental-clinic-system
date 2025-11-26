import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Calendar, Clock, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AIBookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [recommendedTreatments, setRecommendedTreatments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [doctors, setDoctors] = useState([]);
  const [availableDoctorsForTreatment, setAvailableDoctorsForTreatment] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const doctorId = searchParams.get('doctor');
    if (doctorId && doctors.length > 0) {
      setSelectedDoctor(doctorId);
    }
  }, [searchParams, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      const doctorsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setDoctors([]);
    }
  };

  const analyzeSymptoms = async () => {
    console.log('Analyze clicked, symptoms:', symptoms);
    if (!symptoms.trim()) {
      console.log('Symptoms empty, returning');
      return;
    }
    
    setIsAnalyzing(true);
    setAiResponse(null);
    setRecommendedTreatments([]);
    setAvailableSlots([]);
    
    try {
      console.log('Calling AI API...');
      const response = await api.post('/ai/agent', {
        message: symptoms,
        patientId: user?.id,
      });

      console.log('AI Response:', response.data);
      
      // Get the actual response text
      const responseText = response.data.output || response.data.response || 'No response received';
      setAiResponse(responseText);
      
      if (response.data.metadata?.recommendedTreatments) {
        setRecommendedTreatments(response.data.metadata.recommendedTreatments);
        if (response.data.metadata.recommendedTreatments.length > 0) {
          const firstTreatment = response.data.metadata.recommendedTreatments[0];
          setSelectedTreatment(firstTreatment.id);
          // Find all doctors offering this treatment
          const doctorsForTreatment = response.data.metadata.recommendedTreatments
            .filter(t => t.name === firstTreatment.name)
            .map(t => ({ id: t.doctorId, name: t.doctor.name, treatmentId: t.id }));
          setAvailableDoctorsForTreatment(doctorsForTreatment);
          if (doctorsForTreatment.length > 0) {
            setSelectedDoctor(doctorsForTreatment[0].id);
          }
        }
      }
      
      if (response.data.metadata?.availableSlots) {
        setAvailableSlots(response.data.metadata.availableSlots);
        if (response.data.metadata.availableSlots.length > 0) {
          const firstSlot = response.data.metadata.availableSlots[0];
          setSelectedDate(firstSlot.date);
          setSelectedTime(firstSlot.timeSlot);
        }
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedTreatment || !selectedDoctor || !selectedDate || !selectedTime) {
      return;
    }

    setIsBooking(true);
    
    try {
      await api.post('/appointments', {
        patientId: user.id,
        doctorId: selectedDoctor,
        treatmentId: selectedTreatment,
        date: selectedDate,
        timeSlot: selectedTime,
        notes: notes || symptoms,
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Appointment Booking
          </h1>
          <p className="text-gray-600">Describe your symptoms and let AI recommend the best treatment</p>
        </motion.div>

        {/* Symptoms Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Describe Your Symptoms
              </CardTitle>
              <CardDescription>
                Tell us what you're experiencing, and our AI will recommend the best treatment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  placeholder="E.g., I have severe tooth pain on the upper right side, sensitivity to cold..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={analyzeSymptoms}
                disabled={!symptoms.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Response */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <Sparkles className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 whitespace-pre-wrap leading-relaxed">
                  {aiResponse}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended Treatments */}
        <AnimatePresence>
          {recommendedTreatments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recommended Treatments</CardTitle>
                  <CardDescription>Based on your symptoms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from(new Set(recommendedTreatments.map(t => t.name))).map((treatmentName, index) => {
                    const treatmentsWithSameName = recommendedTreatments.filter(t => t.name === treatmentName);
                    const firstTreatment = treatmentsWithSameName[0];
                    const isSelected = treatmentsWithSameName.some(t => t.id === selectedTreatment);
                    
                    return (
                      <motion.div
                        key={treatmentName}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setSelectedTreatment(firstTreatment.id);
                          const doctorsForTreatment = treatmentsWithSameName.map(t => ({
                            id: t.doctorId,
                            name: t.doctor.name,
                            treatmentId: t.id
                          }));
                          setAvailableDoctorsForTreatment(doctorsForTreatment);
                          setSelectedDoctor(doctorsForTreatment[0].id);
                        }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-lg">{firstTreatment.name}</h3>
                            <p className="text-sm text-gray-600">{firstTreatment.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{firstTreatment.category}</Badge>
                              <span className="text-sm text-gray-500">{firstTreatment.duration} min</span>
                              <span className="text-sm font-semibold text-purple-600">₹{firstTreatment.price}</span>
                            </div>
                            {treatmentsWithSameName.length > 1 ? (
                              <p className="text-sm text-blue-600 mt-1 font-medium">
                                Available with {treatmentsWithSameName.length} doctors
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500 mt-1">Dr. {firstTreatment.doctor?.name}</p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Appointment Details */}
        <AnimatePresence>
          {(recommendedTreatments.length > 0 || selectedDoctor) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Appointment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Doctor</Label>
                      <Select value={selectedDoctor} onValueChange={(doctorId) => {
                        setSelectedDoctor(doctorId);
                        const doctorTreatment = availableDoctorsForTreatment.find(d => d.id === doctorId);
                        if (doctorTreatment) {
                          setSelectedTreatment(doctorTreatment.treatmentId);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDoctorsForTreatment.length > 0 ? (
                            availableDoctorsForTreatment.map((doc) => {
                              const fullDoctor = doctors.find(d => d.id === doc.id);
                              return (
                                <SelectItem key={doc.id} value={doc.id}>
                                  Dr. {doc.name}{fullDoctor ? ` - ${fullDoctor.specialization}` : ''}
                                </SelectItem>
                              );
                            })
                          ) : (
                            Array.isArray(doctors) && doctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                Dr. {doctor.name} - {doctor.specialization}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment</Label>
                      <Select value={selectedTreatment} onValueChange={(treatmentId) => {
                        setSelectedTreatment(treatmentId);
                        const treatment = recommendedTreatments.find(t => t.id === treatmentId);
                        if (treatment) {
                          const doctorsForTreatment = recommendedTreatments
                            .filter(t => t.name === treatment.name)
                            .map(t => ({ id: t.doctorId, name: t.doctor.name, treatmentId: t.id }));
                          setAvailableDoctorsForTreatment(doctorsForTreatment);
                          setSelectedDoctor(treatment.doctorId);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select treatment" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(recommendedTreatments.map(t => t.name))).map((name) => {
                            const treatment = recommendedTreatments.find(t => t.name === name);
                            return (
                              <SelectItem key={treatment.id} value={treatment.id}>
                                {treatment.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time Slot</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlots.length > 0 ? (
                            availableSlots.map((slot, index) => (
                              <SelectItem key={index} value={slot.timeSlot}>
                                {slot.timeSlot} - {slot.date}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="09:00-10:00">09:00 - 10:00</SelectItem>
                              <SelectItem value="10:00-11:00">10:00 - 11:00</SelectItem>
                              <SelectItem value="11:00-12:00">11:00 - 12:00</SelectItem>
                              <SelectItem value="14:00-15:00">14:00 - 15:00</SelectItem>
                              <SelectItem value="15:00-16:00">15:00 - 16:00</SelectItem>
                              <SelectItem value="16:00-17:00">16:00 - 17:00</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedTreatment || !selectedDoctor || !selectedDate || !selectedTime || isBooking}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Booking...
                      </>
                    ) : bookingSuccess ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Booked Successfully!
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available Slots Preview */}
        <AnimatePresence>
          {availableSlots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableSlots.slice(0, 6).map((slot, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSelectedDate(slot.date);
                          setSelectedTime(slot.timeSlot);
                        }}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${
                          selectedDate === slot.date && selectedTime === slot.timeSlot
                            ? 'border-purple-600 bg-purple-100 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="font-semibold">{slot.timeSlot}</div>
                        <div className="text-xs text-gray-500">{slot.date}</div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIBookAppointment;
