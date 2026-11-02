import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Clock,
  Calendar,
  CheckCircle2,
  Award,
  ShieldCheck,
  Star,
  MapPin,
  ArrowLeft,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick slot booking state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 10:30 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        if (res.data.success) {
          setDoctor(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const slots = [
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:30 AM - 12:00 PM',
    '12:00 PM - 12:30 PM',
    '02:00 PM - 02:30 PM',
    '03:00 PM - 03:30 PM'
  ];

  const handleDirectBooking = async (e) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      toast.error('Please enter patient name and contact number');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/appointments', {
        patientName,
        patientPhone,
        doctorId: doctor.id,
        doctorName: doctor.name,
        departmentId: doctor.departmentId,
        departmentName: doctor.departmentName,
        date: selectedDate,
        timeSlot: selectedSlot,
        appointmentType: 'OPD Consultation',
        symptoms: symptoms || 'General OPD consultation request',
        fee: doctor.consultationFee || 800,
        paymentMethod: 'UPI'
      });

      if (res.data.success) {
        toast.success(`Appointment Confirmed! ID: ${res.data.data.appointmentId}`);
        navigate(`/appointments?confirmedId=${res.data.data.appointmentId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-secondary">Doctor Not Found</h2>
        <Link to="/doctors" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctors Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <Link to="/doctors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Doctor Directory</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
              {doctor.departmentName}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {doctor.name}
          </h1>
          <p className="text-base text-slate-300 max-w-3xl">
            {doctor.designation} · {doctor.qualification}
          </p>
        </div>
      </section>

      {/* Main Profile Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Doctor Bio & Credentials */}
          <div className="lg:col-span-7 space-y-8">
            {/* Overview Card */}
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-2xl object-cover object-top border-2 border-primary/20 shadow-md shrink-0"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-secondary">{doctor.name}</h2>
                  <p className="text-xs font-bold text-primary">{doctor.designation}</p>
                  <p className="text-xs text-medical-muted">{doctor.qualification}</p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-secondary justify-center sm:justify-start">
                    <div className="p-2.5 rounded-xl bg-medical-coolgray border border-medical-border">
                      <span className="text-medical-muted block text-[10px] uppercase font-bold">Experience</span>
                      <strong>{doctor.experienceYears}+ Years</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-medical-coolgray border border-medical-border">
                      <span className="text-medical-muted block text-[10px] uppercase font-bold">Consultation Fee</span>
                      <strong className="text-primary font-bold">₹{doctor.consultationFee}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-medical-coolgray border border-medical-border">
                      <span className="text-medical-muted block text-[10px] uppercase font-bold">Rating</span>
                      <strong className="text-amber-600">★ {doctor.rating || 4.9}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-4">
              <h3 className="text-xl font-bold text-secondary tracking-tight">
                Professional Biography
              </h3>
              <p className="text-medical-muted text-sm leading-relaxed">
                {doctor.bio || `${doctor.name} is a senior clinical specialist at Brahm Shakti Hospital, dedicated to providing ethical, evidence-based patient management and surgical precision.`}
              </p>
            </div>

            {/* Specializations & Procedures */}
            {doctor.specializations && doctor.specializations.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-4">
                <h3 className="text-xl font-bold text-secondary tracking-tight">
                  Clinical Focus & Specializations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.specializations.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-medical-coolgray border border-medical-border">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs font-semibold text-secondary">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OPD Schedule Card */}
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-4">
              <h3 className="text-xl font-bold text-secondary tracking-tight">
                OPD Schedule & Room Location
              </h3>
              <div className="p-4 rounded-xl bg-primary-50 border border-primary/20 space-y-2 text-xs text-secondary">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.opdSchedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-medical-muted" />
                  <span>Chamber: <strong>{doctor.room || 'OPD Block'}</strong>, Brahm Shakti Hospital</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Appointment Booking Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-2xl border-2 border-primary/20 shadow-elevated space-y-6">
              <div>
                <span className="px-2.5 py-1 rounded bg-accent text-accent-dark text-[10px] font-bold uppercase tracking-wider">
                  Confirmed OPD Booking
                </span>
                <h3 className="text-xl font-black text-secondary mt-2">
                  Book Slot with {doctor.name}
                </h3>
                <p className="text-xs text-medical-muted mt-1">
                  Select your preferred appointment date and slot. Subsidized fee: ₹{doctor.consultationFee}.
                </p>
              </div>

              <form onSubmit={handleDirectBooking} className="space-y-4">
                {/* Select Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>

                {/* Available Slots Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                    Available Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                          selectedSlot === slot
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-medical-coolgray text-secondary border-medical-border hover:border-primary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter full name"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>

                {/* Patient Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                    Mobile Number (for SMS & OPD token)
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91-98XXXXXXXX"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>

                {/* Symptoms / Chief Complaint */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                    Symptoms / Chief Complaint
                  </label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Briefly describe health symptoms..."
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden resize-none"
                  ></textarea>
                </div>

                {/* Fee Summary */}
                <div className="p-3 rounded-xl bg-medical-coolgray border border-medical-border flex items-center justify-between text-xs">
                  <span className="font-semibold text-secondary">Total Subsidized Fee:</span>
                  <span className="text-base font-black text-primary">₹{doctor.consultationFee}</span>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{bookingLoading ? 'Confirming...' : 'Confirm Appointment'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorProfilePage;
