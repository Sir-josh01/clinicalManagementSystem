import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import { Calendar, User, Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function AppointmentsHub() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]); // Used by patients to choose a doctor
  const [error, setError] = useState('');
  
  // Booking Form State (for patients)
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: '',
    reasonForVisit: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch appointments and doctors list (if patient) on mount
  useEffect(() => {
    fetchAppointments();
    if (user.role === 'patient') {
      fetchDoctors();
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      // Assuming your backend /auth routes can be queried for users, 
      // or substitute with your explicit user endpoint later.
      const response = await api.get('/auth/users?role=doctor');
      setDoctors(response.data);
    } catch (err) {
      // Fallback empty state if endpoint isn't fully exposed yet
      setDoctors([]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!formData.doctor) return setError('Please select a medical practitioner.');
    
    setBookingLoading(true);
    setError('');
    try {
      await api.post('/appointments', formData);
      setFormData({ doctor: '', appointmentDate: '', reasonForVisit: '' }); // Reset form
      fetchAppointments(); // Refresh list dynamically
    } catch (err) {
      setError(err.response?.data?.message || 'Error scheduling appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-clinical-blue">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      
      {/* LEFT COLUMN: Booking Form (Only visible to Patients) */}
      {user.role === 'patient' && (
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-lg font-bold tracking-tight mb-4">Book an Appointment</h3>
          
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Assign Doctor</label>
              <select
                name="doctor"
                required
                value={formData.doctor}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">-- Select Specialist --</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>Dr. {doc.lastName} ({doc.email})</option>
                ))}
                {/* Fallback mock option for testing immediately */}
                {doctors.length === 0 && <option value="65f123abc456def789012345">Dr. Egene (System Default Specialist)</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                required
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Reason for Visit</label>
              <textarea
                name="reasonForVisit"
                required
                rows="3"
                value={formData.reasonForVisit}
                onChange={handleInputChange}
                placeholder="Briefly explain symptoms..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-clinical-blue py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-blue-dark transition-all cursor-pointer disabled:opacity-70"
            >
              {bookingLoading ? <Loader2 size={16} className="animate-spin" /> : 'Schedule Visit'}
            </button>
          </form>
        </div>
      )}

      {/* RIGHT COLUMN: Live Schedule List (Spans across full screen if Doctor/Admin) */}
      <div className={`${user.role === 'patient' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
        <h3 className="text-lg font-bold tracking-tight">Active Consultations Queue</h3>
        
        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-800">
            <Calendar className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={40} />
            <p className="text-sm font-medium text-slate-500">No scheduled appointments found on record.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appt) => (
              <div 
                key={appt._id} 
                className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-clinical-blue dark:bg-blue-950/50 dark:text-blue-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {user.role === 'patient' 
                        ? `Dr. ${appt.doctor?.lastName || 'Specialist'}` 
                        : `Patient: ${appt.patient?.firstName} ${appt.patient?.lastName}`
                      }
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{appt.reasonForVisit}</p>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(appt.appointmentDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Status Badging */}
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  appt.status === 'scheduled' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                  appt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {appt.status}
                </span>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}