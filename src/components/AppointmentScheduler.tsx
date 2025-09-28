'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone, 
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Zap,
  CheckCircle,
  X,
  CalendarDays,
  Timer
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  experience: string;
  consultationType: ('in-person' | 'video' | 'phone')[];
  availability: {
    date: string;
    slots: string[];
  }[];
  color: string;
  icon: React.ReactNode;
}

interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'completed';
  patient: string;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    avatar: 'SC',
    rating: 4.9,
    experience: '12 years',
    consultationType: ['in-person', 'video', 'phone'],
    availability: [
      { date: '2025-09-29', slots: ['09:00', '10:30', '14:00', '15:30'] },
      { date: '2025-09-30', slots: ['09:30', '11:00', '13:30', '16:00'] },
      { date: '2025-10-01', slots: ['08:30', '10:00', '14:30'] },
    ],
    color: 'from-rose-500 to-pink-600',
    icon: <Heart className="w-4 h-4" />
  },
  {
    id: '2',
    name: 'Dr. Michael Torres',
    specialty: 'Neurology',
    avatar: 'MT',
    rating: 4.8,
    experience: '15 years',
    consultationType: ['in-person', 'video'],
    availability: [
      { date: '2025-09-29', slots: ['10:00', '11:30', '15:00'] },
      { date: '2025-09-30', slots: ['09:00', '10:30', '14:00', '16:30'] },
      { date: '2025-10-02', slots: ['09:30', '11:00', '13:00'] },
    ],
    color: 'from-purple-500 to-indigo-600',
    icon: <Brain className="w-4 h-4" />
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Ophthalmology',
    avatar: 'ER',
    rating: 4.7,
    experience: '8 years',
    consultationType: ['in-person', 'video', 'phone'],
    availability: [
      { date: '2025-09-29', slots: ['08:30', '12:00', '16:00'] },
      { date: '2025-10-01', slots: ['09:00', '10:30', '14:30', '15:30'] },
      { date: '2025-10-02', slots: ['10:00', '13:30', '15:00'] },
    ],
    color: 'from-emerald-500 to-teal-600',
    icon: <Eye className="w-4 h-4" />
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Emergency Medicine',
    avatar: 'JW',
    rating: 4.9,
    experience: '20 years',
    consultationType: ['in-person', 'video', 'phone'],
    availability: [
      { date: '2025-09-29', slots: ['24/7', 'Emergency'] },
      { date: '2025-09-30', slots: ['24/7', 'Emergency'] },
      { date: '2025-10-01', slots: ['24/7', 'Emergency'] },
    ],
    color: 'from-orange-500 to-red-600',
    icon: <Zap className="w-4 h-4" />
  }
];

export function AppointmentScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'in-person' | 'video' | 'phone'>('video');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBookingModal, setIsBookingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj));
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || doctor.specialty.toLowerCase().includes(filterSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const getAvailableDoctorsForDate = (date: string) => {
    return mockDoctors.filter(doctor => 
      doctor.availability.some(avail => avail.date === date && avail.slots.length > 0)
    );
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTimeSlot) {
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTimeSlot,
        type: consultationType,
        status: 'confirmed',
        patient: 'Current User'
      };
      
      setAppointments([...appointments, newAppointment]);
      setIsBookingModal(false);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
    }
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  return (
    <div className="bg-slate-800/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CalendarDays className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Smart Appointment Scheduler</h2>
            <p className="text-slate-400 text-sm">Book with top-rated specialists instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
          </motion.button>
          
          <motion.button
            onClick={() => setIsBookingModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'calendar' ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                
                <h3 className="text-xl font-semibold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                
                <motion.button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dateString = formatDate(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = formatDate(day) === formatDate(new Date());
                  const availableDoctors = getAvailableDoctorsForDate(dateString);
                  const dayAppointments = getAppointmentsForDate(dateString);
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedDate(dateString)}
                      className={`
                        relative p-2 h-16 rounded-lg text-sm transition-all duration-300 border
                        ${isCurrentMonth 
                          ? selectedDate === dateString
                            ? 'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-400 text-white' 
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500/50'
                          : 'bg-slate-800/20 border-slate-700/30 text-slate-600'
                        }
                        ${isToday && 'ring-2 ring-emerald-400/50'}
                      `}
                      whileHover={{ scale: isCurrentMonth ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!isCurrentMonth}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`font-medium ${isToday ? 'text-emerald-400' : ''}`}>
                          {day.getDate()}
                        </span>
                        
                        {/* Available doctors indicator */}
                        {availableDoctors.length > 0 && (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="flex gap-1 flex-wrap">
                              {availableDoctors.slice(0, 3).map(doctor => (
                                <div
                                  key={doctor.id}
                                  className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500"
                                />
                              ))}
                              {availableDoctors.length > 3 && (
                                <span className="text-xs text-emerald-400">+{availableDoctors.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Appointments indicator */}
                        {dayAppointments.length > 0 && (
                          <div className="absolute bottom-1 right-1">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Available Doctors Sidebar */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
                
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                >
                  <option value="all">All Specialties</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="ophthalmology">Ophthalmology</option>
                  <option value="emergency">Emergency Medicine</option>
                </select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  Available Doctors
                  {selectedDate && (
                    <span className="text-xs text-slate-400">
                      ({getAvailableDoctorsForDate(selectedDate).length})
                    </span>
                  )}
                </h4>
                
                <AnimatePresence>
                  {(selectedDate ? getAvailableDoctorsForDate(selectedDate) : filteredDoctors).map(doctor => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setIsBookingModal(true);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doctor.color} flex items-center justify-center text-white font-bold`}>
                          {doctor.avatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-white truncate">{doctor.name}</h5>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-slate-400">{doctor.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {doctor.icon}
                            <span className="text-sm text-slate-400">{doctor.specialty}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            {doctor.consultationType.map(type => (
                              <span
                                key={type}
                                className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full"
                              >
                                {type === 'in-person' ? 'In-Person' : type === 'video' ? 'Video' : 'Phone'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="font-medium text-white">Your Appointments</h4>
            {appointments.length > 0 ? (
              <div className="grid gap-3">
                {appointments.map(appointment => {
                  const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doctor?.color} flex items-center justify-center text-white font-bold`}>
                            {doctor?.avatar}
                          </div>
                          <div>
                            <h5 className="font-medium text-white">{doctor?.name}</h5>
                            <p className="text-sm text-slate-400">{doctor?.specialty}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {appointment.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center gap-1">
                                {appointment.type === 'video' && <Video className="w-3 h-3" />}
                                {appointment.type === 'phone' && <Phone className="w-3 h-3" />}
                                {appointment.type === 'in-person' && <MapPin className="w-3 h-3" />}
                                {appointment.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            appointment.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                            appointment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No appointments scheduled</p>
                <p className="text-sm">Book your first appointment to get started</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsBookingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Book Appointment</h3>
                <button
                  onClick={() => setIsBookingModal(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {selectedDoctor && (
                <div className="space-y-6">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedDoctor.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {selectedDoctor.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{selectedDoctor.name}</h4>
                      <p className="text-slate-400">{selectedDoctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-400">{selectedDoctor.rating} • {selectedDoctor.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Consultation Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDoctor.consultationType.map(type => (
                        <button
                          key={type}
                          onClick={() => setConsultationType(type)}
                          className={`p-3 rounded-lg border transition-all ${
                            consultationType === type
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                              : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:border-slate-500/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {type === 'video' && <Video className="w-4 h-4" />}
                            {type === 'phone' && <Phone className="w-4 h-4" />}
                            {type === 'in-person' && <MapPin className="w-4 h-4" />}
                            <span className="text-xs">{type === 'in-person' ? 'In-Person' : type === 'video' ? 'Video' : 'Phone'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Available Times for {selectedDate}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedDoctor.availability
                          .find(avail => avail.date === selectedDate)
                          ?.slots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`p-3 rounded-lg border transition-all ${
                                selectedTimeSlot === slot
                                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                                  : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:border-slate-500/50'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">{slot}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <motion.button
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTimeSlot}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Confirm Appointment
                    </span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}