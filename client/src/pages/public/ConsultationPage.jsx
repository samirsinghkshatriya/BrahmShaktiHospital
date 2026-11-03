import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  Stethoscope,
  User,
  Printer,
  IndianRupee,
  GraduationCap
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const todayISO = () => new Date().toISOString().split('T')[0];

// The appointment portal lists ONLY these consultants, in this exact sequence.
const PORTAL_DOCTOR_NAMES = [
  'Dr. Dev Patel',
  'Dr. Samir Singh Kshatriya',
  'Dr. Hardik Patel',
  'Dr. Milan Patel',
  'Dr. Harshit Tiwari',
  'Dr. Ayush Sah',
  'Dr. Rohit Pandit',
  'Dr. Mahir Patel'
];

export const ConsultationPage = () => {
  const [searchParams] = useSearchParams();
  const preDoctor = searchParams.get('doctor') || '';
  const preDept = searchParams.get('specialty') || searchParams.get('department') || '';

  // Search state
  const [mode, setMode] = useState(preDoctor || !preDept ? 'doctor' : 'specialty');
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState(preDept);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preDoctor);

  // Slot state
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Verification / booking state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || null;
  const deptDoctors = selectedDeptId ? doctors.filter((d) => d.departmentId === selectedDeptId) : doctors;

  // Load doctors & departments
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([api.get('/departments'), api.get('/doctors')]);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
        if (docRes.data.success) {
          const all = docRes.data.data || [];
          // Keep only the nominated portal doctors, in the fixed sequence
          const ordered = PORTAL_DOCTOR_NAMES
            .map((name) => all.find((d) => d.name === name))
            .filter(Boolean);
          // Deep-links from doctor profile pages may pass a non-portal doctor;
          // include them so "?doctor=..." links always work.
          const paramDoctor = preDoctor ? all.find((d) => d.id === preDoctor) : null;
          if (paramDoctor && !ordered.some((d) => d.id === paramDoctor.id)) ordered.push(paramDoctor);
          setDoctors(ordered);
          const initial = ordered.find((d) => d.id === preDoctor) || ordered[0];
          if (initial) setSelectedDoctorId(initial.id);
        }
      } catch (err) {
        console.error('Error loading consultation metadata:', err);
        toast.error('Unable to load doctor directory right now.');
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep a valid doctor when switching specialty filter
  useEffect(() => {
    if (mode === 'specialty' && deptDoctors.length > 0 && !deptDoctors.some((d) => d.id === selectedDoctorId)) {
      setSelectedDoctorId(deptDoctors[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeptId, mode, doctors]);

  // Load real DB-backed slots whenever doctor or date changes
  const loadSlots = useCallback(async () => {
    if (!selectedDoctorId || !date) return;
    setSlotsLoading(true);
    setSelectedSlot('');
    try {
      const res = await api.get('/appointments/slots', { params: { doctorId: selectedDoctorId, date } });
      if (res.data.success) {
        setSlots(res.data.data);
        const firstOpen = res.data.data.find((s) => s.remaining > 0 && !s.isClosed);
        if (firstOpen) setSelectedSlot(firstOpen.timeSlot);
      } else {
        setSlots([]);
      }
    } catch (err) {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [selectedDoctorId, date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const shiftDate = (deltaDays) => {
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() + deltaDays);
    const next = d.toISOString().split('T')[0];
    if (next < todayISO()) {
      toast.error('Cannot book appointments for past dates.');
      return;
    }
    setDate(next);
  };

  const openVerification = () => {
    if (!activeDoctor) {
      toast.error('Please select a doctor first.');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please choose an available time slot.');
      return;
    }
    setDetailsOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      toast.error('Patient name and mobile number are required.');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await api.post('/appointments', {
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        patientAge: Number(patientAge) || undefined,
        gender,
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        departmentId: activeDoctor.departmentId,
        departmentName: activeDoctor.departmentName,
        date,
        timeSlot: selectedSlot,
        appointmentType: 'OPD Consultation',
        symptoms: symptoms.trim(),
        fee: activeDoctor.consultationFee || 800,
        paymentMethod: 'Pay at Hospital Counter'
      });
      if (res.data.success) {
        setDetailsOpen(false);
        setConfirmed(res.data.data);
        toast.success('Appointment confirmed!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBooking = () => {
    setConfirmed(null);
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setPatientAge('');
    setSymptoms('');
    loadSlots();
  };

  return (
    <div className="min-h-screen bg-medical-coolgray flex flex-col">
      {/* Standalone Portal Header */}
      <header className="bg-medical-white border-b border-medical-border sticky top-0 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-secondary truncate">BRAHM SHAKTI</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-dark font-bold uppercase tracking-wider shrink-0">
                  Appointment Portal
                </span>
              </div>
              <p className="text-[10px] font-medium text-medical-muted hidden sm:block truncate">
                Consultation &amp; OPD Slot Booking · No Login Required
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="tel:7840089703"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-status-error border border-red-200 text-xs font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">24x7 Emergency</span>
              <span className="sm:hidden">Emergency</span>
            </a>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Back to Main Website</span>
              <span className="md:hidden">Website</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        {/* Page Title Strip */}
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">Book a Consultation</h1>
            <p className="text-sm text-medical-muted mt-1">
              Search a doctor, choose your day, pick an available OPD slot — confirmed instantly with your UHID.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary-50 border border-primary/20 px-3 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>Real-time availability from hospital scheduler</span>
          </div>
        </div>

        {loadingMeta ? (
          <div className="py-24 flex flex-col items-center gap-3 text-medical-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm font-semibold">Loading doctor directory...</span>
          </div>
        ) : confirmed ? (
          /* ---------------- Booking Success ---------------- */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-medical-border shadow-elevated p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary">Appointment Confirmed!</h2>
              <p className="text-sm text-medical-muted mt-1">
                A confirmation has been recorded in the hospital OPD register. Please arrive 15 minutes early.
              </p>
            </div>
            <div className="text-left bg-medical-coolgray rounded-2xl border border-medical-border p-5 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-medical-muted font-semibold">Appointment ID</span>
                <span className="font-black text-secondary">{confirmed.appointmentId}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-medical-muted font-semibold">UHID (Hospital Reg. No.)</span>
                <span className="font-black text-primary">{confirmed.uhid || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-medical-muted font-semibold">Doctor</span>
                <span className="font-bold text-secondary">{confirmed.doctorName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-medical-muted font-semibold">Department</span>
                <span className="font-bold text-secondary">{confirmed.departmentName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-medical-muted font-semibold">Date &amp; Slot</span>
                <span className="font-bold text-secondary">
                  {new Date(confirmed.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {' · '}
                  {confirmed.timeSlot}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-medical-border pt-2.5">
                <span className="text-medical-muted font-semibold">Consultation Fee</span>
                <span className="font-black text-primary">₹{confirmed.fee}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-medical-border text-secondary text-sm font-bold hover:border-primary hover:text-primary transition-all"
              >
                <Printer className="w-4 h-4" />
                Print / Save Slip
              </button>
              <button
                onClick={resetBooking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 transition-all"
              >
                <Calendar className="w-4 h-4" />
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- Two-Panel Booking Interface ---------------- */
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Left Panel: Search & Doctor Profile */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-medical-border shadow-soft overflow-hidden">
              {/* Search By Tabs */}
              <div className="grid grid-cols-2">
                <button
                  onClick={() => setMode('doctor')}
                  className={`py-4 px-3 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
                    mode === 'doctor'
                      ? 'border-primary text-primary bg-primary-50'
                      : 'border-transparent text-medical-muted hover:text-secondary bg-medical-white'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Search By Doctor
                </button>
                <button
                  onClick={() => setMode('specialty')}
                  className={`py-4 px-3 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
                    mode === 'specialty'
                      ? 'border-primary text-primary bg-primary-50'
                      : 'border-transparent text-medical-muted hover:text-secondary bg-medical-white'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  Search By Speciality
                </button>
              </div>

              <div className="p-6 space-y-4">
                {mode === 'specialty' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Speciality / Department</label>
                    <div className="relative">
                      <BuildingIcon />
                      <select
                        value={selectedDeptId}
                        onChange={(e) => setSelectedDeptId(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-medical-border bg-medical-white text-sm font-semibold text-secondary focus:border-primary focus:outline-hidden appearance-none"
                      >
                        <option value="">All Specialities</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Doctor</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-medical-border bg-medical-white text-sm font-semibold text-secondary focus:border-primary focus:outline-hidden appearance-none"
                    >
                      <option value="">Select Doctor</option>
                      {(mode === 'specialty' ? deptDoctors : doctors).map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — {doc.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Doctor Profile Card */}
                {activeDoctor ? (
                  <div className="pt-2 space-y-4">
                    {/* Centered identity (reference layout) */}
                    <div className="flex flex-col items-center text-center gap-2.5">
                      <img
                        src={activeDoctor.image}
                        alt={activeDoctor.name}
                        className="w-28 h-28 rounded-2xl object-cover object-top border-4 border-primary-50 shadow-soft"
                      />
                      <h3 className="text-xl font-black text-primary leading-tight">{activeDoctor.name}</h3>
                      <span className="px-3 py-1 rounded-lg bg-primary-50 text-primary text-[11px] font-bold border border-primary/20">
                        {activeDoctor.departmentName}
                      </span>
                    </div>

                    <div className="border-t border-medical-border pt-3 space-y-1.5">
                      <p className="text-sm font-black text-secondary">Doctor Message</p>
                      <p className="text-xs text-medical-muted leading-relaxed">{activeDoctor.bio}</p>
                    </div>

                    {/* Consultation Fees box */}
                    <div className="rounded-2xl border border-accent/50 bg-accent/10 p-4 space-y-2.5">
                      <p className="flex items-center gap-1.5 text-xs font-black text-accent-dark uppercase tracking-wide">
                        <IndianRupee className="w-4 h-4" />
                        Consultation Fees
                      </p>
                      <div className="flex items-center justify-between bg-white rounded-xl border border-medical-border px-3 py-2">
                        <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary text-[11px] font-bold">Direct Consultation</span>
                        <span className="text-sm font-black text-secondary">₹{activeDoctor.consultationFee}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-xl border border-medical-border px-3 py-2">
                        <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary text-[11px] font-bold">Follow-up</span>
                        <span className="text-sm font-black text-status-success">Free</span>
                      </div>
                      <p className="text-[10px] text-medical-muted font-semibold">Follow-up consultation is complimentary within 10 days of the direct visit.</p>
                    </div>

                    {/* Education / OPD Timings / Room No. rows */}
                    <div className="border-t border-medical-border divide-y divide-medical-border/70 text-xs">
                      <div className="flex items-start gap-3 py-2.5">
                        <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="w-24 shrink-0 font-bold text-medical-slate">Education</span>
                        <span className="font-bold text-secondary leading-snug">{activeDoctor.qualification}</span>
                      </div>
                      <div className="flex items-start gap-3 py-2.5">
                        <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="w-24 shrink-0 font-bold text-medical-slate">OPD Timings</span>
                        <span className="font-bold text-secondary leading-snug">{activeDoctor.opdSchedule}</span>
                      </div>
                      <div className="flex items-start gap-3 py-2.5">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="w-24 shrink-0 font-bold text-medical-slate">Room No.</span>
                        <span className="font-bold text-secondary leading-snug">{activeDoctor.room}</span>
                      </div>
                    </div>

                    <Link
                      to={`/doctors/${activeDoctor.id}`}
                      className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                    >
                      View Full Profile &amp; Expertise
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-2 border border-dashed border-medical-border rounded-2xl">
                    <User className="w-8 h-8 mx-auto text-medical-muted" />
                    <p className="text-xs font-semibold text-medical-muted">Select a doctor to view their profile &amp; live slots</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Date & Slot Selection */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-medical-border shadow-soft overflow-hidden">
              <div className="px-6 py-5 bg-secondary text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <h2 className="text-base font-black leading-tight">Direct Consultation</h2>
                    <p className="text-xs text-slate-300">Visit Doctor in Person · OPD Chamber Booking</p>
                  </div>
                </div>
                {activeDoctor && (
                  <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-primary-light">
                    <MapPin className="w-4 h-4" />
                    {activeDoctor.room}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Date Navigator */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Consultation Date</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => shiftDate(-1)}
                      className="w-11 h-11 rounded-xl border border-medical-border flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-all shrink-0"
                      title="Previous day"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <input
                      type="date"
                      min={todayISO()}
                      value={date}
                      onChange={(e) => setDate(e.target.value || todayISO())}
                      className="flex-1 px-4 py-3 rounded-xl border border-medical-border bg-medical-white text-sm font-bold text-secondary focus:border-primary focus:outline-hidden"
                    />
                    <button
                      onClick={() => shiftDate(1)}
                      className="w-11 h-11 rounded-xl border border-medical-border flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-all shrink-0"
                      title="Next day"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Available Time Slots */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Available Time Slots</label>
                    {activeDoctor && (
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>

                  {!activeDoctor ? (
                    <div className="p-6 rounded-2xl bg-medical-coolgray border border-medical-border text-sm text-medical-muted font-semibold text-center">
                      Choose a doctor on the left to see live availability.
                    </div>
                  ) : slotsLoading ? (
                    <div className="py-12 flex flex-col items-center gap-2 text-medical-muted">
                      <Loader2 className="w-7 h-7 animate-spin text-primary" />
                      <span className="text-xs font-bold">Checking live slot availability...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-900 font-semibold text-center">
                      Dr. {activeDoctor?.name?.replace('Dr. ', '')} does not sit on this date, or slots are fully booked.
                      Try another day or doctor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {slots.map((slot) => {
                        const disabled = slot.isClosed || slot.remaining <= 0;
                        const active = selectedSlot === slot.timeSlot;
                        return (
                          <button
                            key={slot.timeSlot}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedSlot(slot.timeSlot)}
                            className={`p-3 rounded-xl text-center border transition-all ${
                              disabled
                                ? 'bg-medical-coolgray border-medical-border text-medical-muted cursor-not-allowed line-through decoration-status-error/50'
                                : active
                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/25'
                                : 'bg-white border-medical-border text-secondary hover:border-primary hover:bg-primary-50'
                            }`}
                          >
                            <span className="block text-xs font-black">{slot.timeSlot}</span>
                            <span className={`block text-[10px] font-bold mt-0.5 ${disabled ? '' : active ? 'text-white/80' : 'text-medical-muted'}`}>
                              {slot.isClosed ? 'Closed' : disabled ? 'Full' : `${slot.remaining} seat${slot.remaining === 1 ? '' : 's'} left`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-[11px] font-semibold text-medical-muted text-center">
                    (Slot can be selected after verification of details.)
                  </p>
                </div>

                {/* Book CTA */}
                <button
                  onClick={openVerification}
                  disabled={!activeDoctor || !selectedSlot}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary hover:bg-primary-hover disabled:bg-medical-slate/40 disabled:text-medical-muted disabled:cursor-not-allowed text-white text-sm font-black tracking-wide shadow-md shadow-primary/20 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-[11px] text-medical-muted text-center leading-relaxed">
                  No account needed. Your UHID hospital registration is auto-created and linked to your mobile number.
                  Need help? Call <a href="tel:7840089703" className="font-bold text-primary">7840089703</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer strip */}
      <footer className="bg-secondary text-slate-300 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span>© 2026 Brahm Shakti Hospital, Budh Vihar Phase I, New Delhi — NABH &amp; NABL Accredited</span>
          <div className="flex items-center gap-4">
            <a href="tel:7840089703" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-primary-light" /> 7840089703
            </a>
            <a href="mailto:info@brahmshaktihospital.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-primary-light" /> info@brahmshaktihospital.com
            </a>
          </div>
        </div>
      </footer>

      {/* Verification Modal */}
      {detailsOpen && activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-elevated w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-medical-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-secondary">Verify Your Details</h3>
                <p className="text-xs text-medical-muted mt-0.5">
                  {activeDoctor.name} · {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {selectedSlot}
                </p>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="w-9 h-9 rounded-xl bg-medical-coolgray text-medical-muted hover:text-secondary font-black"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Patient Full Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Chand"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-medical-border text-sm text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Mobile Number *</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91-98XXXXXXXX"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-medical-border text-sm text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-medical-border text-sm text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-medical-border text-sm text-secondary font-medium bg-medical-white focus:border-primary focus:outline-hidden"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Email (optional)</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-medical-border text-sm text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">Symptoms / Chief Complaint</label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Briefly describe your health concern..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-medical-border text-sm text-secondary font-medium focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-medical-coolgray border border-medical-border flex items-center justify-between">
                <div className="text-xs">
                  <span className="block font-bold text-secondary">Consultation Fee</span>
                  <span className="text-medical-muted">Payable at hospital counter · {activeDoctor.room}</span>
                </div>
                <span className="text-xl font-black text-primary">₹{activeDoctor.consultationFee}</span>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-black shadow-md shadow-primary/20 transition-all"
              >
                {bookingLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
                <span>{bookingLoading ? 'Confirming Slot...' : 'Confirm & Book Appointment'}</span>
              </button>

              <p className="text-[10px] text-medical-muted text-center leading-relaxed">
                By confirming you agree to the hospital OPD visit policy. Your mobile number becomes your appointment
                identity — the same number links your generated UHID for future visits.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Small inline icon used only inside the specialty select
const BuildingIcon = () => (
  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
);

export default ConsultationPage;
