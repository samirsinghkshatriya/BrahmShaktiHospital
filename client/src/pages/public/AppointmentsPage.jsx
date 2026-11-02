import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Building2,
  Printer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const AppointmentsPage = () => {
  const [searchParams] = useSearchParams();
  const { user, role } = useAuth();
  const preDept = searchParams.get('department') || '';
  const preDoctor = searchParams.get('doctor') || '';
  const confirmedIdParam = searchParams.get('confirmedId') || '';

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form states
  const [selectedDept, setSelectedDept] = useState(preDept);
  const [selectedDoctor, setSelectedDoctor] = useState(preDoctor);
  const [appointmentType, setAppointmentType] = useState('OPD Consultation');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientAge, setPatientAge] = useState('35');
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Auto-fill user information if user is loaded asynchronously
  useEffect(() => {
    if (user) {
      if (!patientName && user.name) setPatientName(user.name);
      if (!patientEmail && user.email) setPatientEmail(user.email);
      if (!patientPhone && user.phone) setPatientPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors')
        ]);
        if (deptRes.data.success) {
          setDepartments(deptRes.data.data);
          if (!selectedDept && deptRes.data.data.length > 0) {
            setSelectedDept(deptRes.data.data[0].id);
          }
        }
        if (docRes.data.success) {
          setDoctors(docRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching appointments metadata:', err);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchMeta();
  }, []);

  // Filter doctors based on selected department
  const filteredDoctors = selectedDept
    ? doctors.filter((d) => d.departmentId === selectedDept)
    : doctors;

  // Set default doctor when department changes
  useEffect(() => {
    if (filteredDoctors.length > 0 && !filteredDoctors.some((d) => d.id === selectedDoctor)) {
      setSelectedDoctor(filteredDoctors[0].id);
    }
  }, [selectedDept, doctors]);

  const activeDoc = doctors.find((d) => d.id === selectedDoctor);
  const activeDept = departments.find((d) => d.id === selectedDept);

  const timeSlots = [
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:30 AM - 12:00 PM',
    '12:00 PM - 12:30 PM',
    '02:00 PM - 02:30 PM',
    '03:00 PM - 03:30 PM',
    '04:00 PM - 04:30 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientName || !patientPhone) {
      toast.error('Please enter patient name and contact number');
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        patientName,
        patientPhone,
        patientEmail,
        patientAge: Number(patientAge),
        gender,
        doctorId: selectedDoctor || (activeDoc?.id || 'doc-general'),
        doctorName: activeDoc?.name || 'Senior Consultant Doctor',
        departmentId: selectedDept || (activeDept?.id || 'general'),
        departmentName: activeDept?.name || 'General OPD',
        date,
        timeSlot,
        appointmentType,
        symptoms: symptoms || 'General OPD Consultation',
        fee: activeDoc?.consultationFee || 800,
        paymentMethod: 'UPI'
      };

      const res = await api.post('/appointments', payload);
      if (res.data.success) {
        setConfirmedBooking(res.data.data);
        toast.success(`Appointment Confirmed! ID: ${res.data.data.appointmentId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Outpatient Portal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Book Hospital Appointment
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Schedule a confirmed consultation with Brahm Shakti Hospital specialists. Immediate token generation and verified slot allocation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4">
        {confirmedBooking ? (
          /* Confirmation Screen */
          <div className="bg-white rounded-3xl border-2 border-status-success/30 shadow-elevated p-8 sm:p-12 space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 text-status-success flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3 py-1 rounded-full bg-green-50 text-status-success text-xs font-bold uppercase tracking-wider border border-green-200">
                Booking Confirmed
              </span>
              <h2 className="text-3xl font-black text-secondary tracking-tight">
                Appointment Slip Generated
              </h2>
              <p className="text-sm text-medical-muted">
                Your appointment ID is <strong className="text-primary font-black text-base">{confirmedBooking.appointmentId}</strong>. A confirmation has been registered in the hospital database.
              </p>
            </div>

            {/* Slip Details Card */}
            <div className="p-6 rounded-2xl bg-medical-coolgray border border-medical-border space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-medical-border">
                <div>
                  <div className="text-xs text-medical-muted uppercase font-bold">Patient Information</div>
                  <div className="text-base font-bold text-secondary mt-1">{confirmedBooking.patientName}</div>
                  <div className="text-xs text-medical-muted mt-0.5">
                    {confirmedBooking.patientAge} Years · {confirmedBooking.gender} · {confirmedBooking.patientPhone}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-medical-muted uppercase font-bold">Consulting Doctor</div>
                  <div className="text-base font-bold text-secondary mt-1">{confirmedBooking.doctorName}</div>
                  <div className="text-xs text-primary font-semibold mt-0.5">{confirmedBooking.departmentName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-medical-muted block uppercase font-bold text-[10px]">Date</span>
                  <strong className="text-secondary text-sm">{confirmedBooking.date}</strong>
                </div>
                <div>
                  <span className="text-medical-muted block uppercase font-bold text-[10px]">Time Slot</span>
                  <strong className="text-secondary text-sm">{confirmedBooking.timeSlot}</strong>
                </div>
                <div>
                  <span className="text-medical-muted block uppercase font-bold text-[10px]">Appointment Type</span>
                  <strong className="text-secondary text-sm">{confirmedBooking.appointmentType}</strong>
                </div>
                <div>
                  <span className="text-medical-muted block uppercase font-bold text-[10px]">Consultation Fee</span>
                  <strong className="text-primary text-sm font-black">₹{confirmedBooking.fee} (Paid)</strong>
                </div>
              </div>

              {confirmedBooking.symptoms && (
                <div className="pt-4 border-t border-medical-border text-xs">
                  <span className="text-medical-muted block uppercase font-bold text-[10px]">Reported Symptoms</span>
                  <p className="text-secondary mt-1 italic">"{confirmedBooking.symptoms}"</p>
                </div>
              )}
            </div>

            {/* Hospital Instructions */}
            <div className="p-4 rounded-xl bg-primary-50 border border-primary/20 text-xs text-secondary space-y-1">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Patient Arrival Instructions</span>
              </div>
              <p>
                Please report to the OPD Reception Counter on the Ground Floor 15 minutes prior to your designated slot with this appointment slip or SMS confirmation.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-medical-border">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-secondary text-secondary hover:bg-secondary hover:text-white text-xs font-bold transition-all text-center"
              >
                Book Another Appointment
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white hover:bg-secondary-light text-xs font-bold transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="bg-white rounded-3xl border border-medical-border shadow-soft p-5 sm:p-10 space-y-6 sm:space-y-8">
            {/* Authenticated User Profile Pill */}
            {user && (
              <div className="bg-primary-50/60 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-secondary text-sm flex items-center gap-2 flex-wrap">
                      <span>{user.name}</span>
                      <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                        {role || 'Patient'}
                      </span>
                    </div>
                    <div className="text-medical-muted text-[11px] mt-0.5">
                      {user.email} · Verified hospital profile
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:underline"
                  >
                    Switch Account ↗
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Department & Doctor */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-secondary border-b border-medical-border pb-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>1. Select Specialty & Doctor</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Department
                    </label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-semibold focus:border-primary focus:outline-hidden"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} (₹{dept.consultationCharges || 800})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Consultant Doctor
                    </label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-semibold focus:border-primary focus:outline-hidden"
                    >
                      {filteredDoctors.length === 0 ? (
                        <option value="">General OPD Faculty</option>
                      ) : (
                        filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} — {doc.designation} (₹{doc.consultationFee})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Date, Time & Consultation Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-secondary border-b border-medical-border pb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>2. Schedule & Consultation Type</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Consultation Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-semibold focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Appointment Type
                    </label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-semibold focus:border-primary focus:outline-hidden"
                    >
                      <option value="OPD Consultation">OPD Consultation (First Visit)</option>
                      <option value="Follow-up Consultation">Follow-up Consultation</option>
                      <option value="Emergency Consultation">Emergency Consultation (Priority)</option>
                    </select>
                  </div>
                </div>

                {/* Available Slot Pills */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider block">
                    Choose Time Slot
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={`p-2.5 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center ${
                          timeSlot === slot
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-medical-coolgray text-secondary border-medical-border hover:border-primary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Patient Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-secondary border-b border-medical-border pb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>3. Patient Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      required
                      className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Age & Gender
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="Age"
                        required
                        className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                      />
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Phone Number (for SMS token)
                    </label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91-98XXXXXXXX"
                      required
                      className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="patient@gmail.com"
                      className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                    Symptoms & Medical Complaint
                  </label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Briefly state symptoms, duration, previous diagnoses..."
                    className="w-full p-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Consultation Summary & Payment CTA */}
              <div className="p-6 rounded-2xl bg-secondary text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xs text-accent font-bold uppercase tracking-wider">
                    Total Subsidized Tariff
                  </div>
                  <div className="text-3xl font-black text-white mt-0.5">
                    ₹{activeDoc?.consultationFee || 800}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Applicable for {activeDoc?.name || 'Selected Specialist'} · Brahm Shakti Trust Concession
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {bookingLoading ? 'Registering...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default AppointmentsPage;
