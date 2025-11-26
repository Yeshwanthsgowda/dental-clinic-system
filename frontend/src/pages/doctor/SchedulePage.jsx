import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { doctorAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, Save, RotateCcw } from 'lucide-react';

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [newOverride, setNewOverride] = useState({
    date: '',
    isOff: false,
    startTime: '09:00',
    endTime: '17:00',
    offSlots: []
  });

  const days = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 
    'FRIDAY', 'SATURDAY', 'SUNDAY'
  ];

  const allTimeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const formatTime12hr = (time24) => {
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const generateTimeSlots = (startTime, endTime) => {
    const start = allTimeSlots.indexOf(startTime);
    const end = allTimeSlots.indexOf(endTime);
    if (start === -1 || end === -1 || start >= end) return [];
    return allTimeSlots.slice(start, end);
  };

  useEffect(() => {
    fetchSchedules();
    fetchOverrides();
  }, []);

  const fetchOverrides = async () => {
    try {
      const response = await doctorAPI.getScheduleOverrides();
      setOverrides(response.data.data || []);
    } catch (error) {
      console.error('Error fetching overrides:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await doctorAPI.getDoctor('me');
      const doctorSchedules = response.data.data.schedules || [];
      
      // Initialize schedules for all days
      const initialSchedules = days.map(day => {
        const existing = doctorSchedules.find(s => s.day === day);
        return existing || {
          day,
          isOff: false,
          startTime: '09:00',
          endTime: '17:00',
          offSlots: []
        };
      });
      
      setSchedules(initialSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDayOff = (dayIndex) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex] = {
      ...newSchedules[dayIndex],
      isOff: !newSchedules[dayIndex].isOff,
      offSlots: newSchedules[dayIndex].isOff ? [] : newSchedules[dayIndex].offSlots
    };
    setSchedules(newSchedules);
  };

  const updateWorkingHours = (dayIndex, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex] = {
      ...newSchedules[dayIndex],
      [field]: value,
      offSlots: [] // Reset off slots when working hours change
    };
    setSchedules(newSchedules);
  };

  const toggleTimeSlot = (dayIndex, timeSlot) => {
    const newSchedules = [...schedules];
    const schedule = newSchedules[dayIndex];
    
    if (schedule.isOff) return;
    
    const offSlots = [...schedule.offSlots];
    const slotIndex = offSlots.indexOf(timeSlot);
    
    if (slotIndex > -1) {
      offSlots.splice(slotIndex, 1);
    } else {
      offSlots.push(timeSlot);
    }
    
    newSchedules[dayIndex] = {
      ...schedule,
      offSlots: offSlots.sort()
    };
    
    setSchedules(newSchedules);
  };

  const saveSchedules = async () => {
    setSaving(true);
    try {
      await doctorAPI.setSchedule({ schedules });
      alert('Schedule updated successfully!');
    } catch (error) {
      console.error('Error saving schedules:', error);
      alert('Error saving schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetSchedules = () => {
    fetchSchedules();
  };

  const saveOverride = async () => {
    try {
      await doctorAPI.setScheduleOverride(newOverride);
      fetchOverrides();
      setShowOverrideForm(false);
      setNewOverride({ date: '', isOff: false, startTime: '09:00', endTime: '17:00', offSlots: [] });
    } catch (error) {
      console.error('Error saving override:', error);
      alert('Error saving override');
    }
  };

  const deleteOverride = async (id) => {
    if (!confirm('Delete this override?')) return;
    try {
      await doctorAPI.deleteScheduleOverride(id);
      fetchOverrides();
    } catch (error) {
      console.error('Error deleting override:', error);
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Management</h1>
              <p className="text-gray-600">Set your availability and manage time slots</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetSchedules}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={saveSchedules} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {schedules.map((schedule, dayIndex) => (
            <motion.div
              key={schedule.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <Card className={`${schedule.isOff ? 'bg-gray-100' : 'bg-white'} transition-colors`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {schedule.day.charAt(0) + schedule.day.slice(1).toLowerCase()}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant={schedule.isOff ? "default" : "outline"}
                      onClick={() => toggleDayOff(dayIndex)}
                    >
                      {schedule.isOff ? 'Day Off' : 'Available'}
                    </Button>
                  </div>
                  {!schedule.isOff && (
                    <CardDescription>
                      {schedule.offSlots.length} slots unavailable
                    </CardDescription>
                  )}
                </CardHeader>
                
                {!schedule.isOff && (
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Working Hours</label>
                      <div className="flex gap-2">
                        <Select value={schedule.startTime} onValueChange={(value) => updateWorkingHours(dayIndex, 'startTime', value)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allTimeSlots.map(time => (
                              <SelectItem key={time} value={time} className="text-xs">{formatTime12hr(time)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-xs self-center">to</span>
                        <Select value={schedule.endTime} onValueChange={(value) => updateWorkingHours(dayIndex, 'endTime', value)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allTimeSlots.map(time => (
                              <SelectItem key={time} value={time} className="text-xs">{formatTime12hr(time)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-2 block">Time Slots</label>
                      <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                        {generateTimeSlots(schedule.startTime, schedule.endTime).map((timeSlot) => {
                          const isOff = schedule.offSlots.includes(timeSlot);
                          return (
                            <button
                              key={timeSlot}
                              onClick={() => toggleTimeSlot(dayIndex, timeSlot)}
                              className={`p-1.5 text-xs rounded border transition-colors ${
                                isOff
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                              }`}
                            >
                              {formatTime12hr(timeSlot)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                )}
                
                {schedule.isOff && (
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Day Off</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Date-Specific Overrides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date-Specific Changes
                </CardTitle>
                <Button size="sm" onClick={() => setShowOverrideForm(!showOverrideForm)}>
                  {showOverrideForm ? 'Cancel' : 'Add Override'}
                </Button>
              </div>
              <CardDescription>Set custom schedules for specific dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showOverrideForm && (
                <div className="p-4 border rounded-lg space-y-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <input
                        type="date"
                        value={newOverride.date}
                        onChange={(e) => setNewOverride({...newOverride, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        size="sm"
                        variant={newOverride.isOff ? 'default' : 'outline'}
                        onClick={() => setNewOverride({...newOverride, isOff: !newOverride.isOff})}
                        className="w-full"
                      >
                        {newOverride.isOff ? 'Day Off' : 'Working Day'}
                      </Button>
                    </div>
                  </div>
                  {!newOverride.isOff && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <Select value={newOverride.startTime} onValueChange={(v) => setNewOverride({...newOverride, startTime: v})}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allTimeSlots.map(t => <SelectItem key={t} value={t}>{formatTime12hr(t)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <Select value={newOverride.endTime} onValueChange={(v) => setNewOverride({...newOverride, endTime: v})}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allTimeSlots.map(t => <SelectItem key={t} value={t}>{formatTime12hr(t)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <Button onClick={saveOverride} className="w-full" size="sm">
                    Save Override
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                {overrides.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No date-specific changes</p>
                ) : (
                  overrides.map((override) => (
                    <div key={override.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(override.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">
                          {override.isOff ? 'Day Off' : `${formatTime12hr(override.startTime)} - ${formatTime12hr(override.endTime)}`}
                        </p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => deleteOverride(override.id)}>
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SchedulePage;