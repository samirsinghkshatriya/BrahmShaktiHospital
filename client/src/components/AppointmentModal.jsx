import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, User, Phone, Mail, Clock, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitEnquiry } from '../lib/api';

export const AppointmentModal = ({
  isOpen,
  onClose,
  initialDoctor = null,
  initialDepartment = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: 'appointment_consultation',
      fullName: '',
      phone: '',
      email: '',
      department: initialDepartment || 'Cardiology & Cardiac Surgery',
      doctorName: initialDoctor?.name || 'Any Available Specialist',
      preferredDate: '',
      message: ''
    }
  });

  useEffect(() => {
    if (initialDoctor) {
      setValue('doctorName', initialDoctor.name);
      setValue('department', initialDoctor.departmentName);
    } else if (initialDepartment) {
      setValue('department', initialDepartment);
    }
  }, [initialDoctor, initialDepartment, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await submitEnquiry(formData);
      setSubmittedData(response);
      toast.success(`Consultation request logged #${response.referenceNumber}`);
      reset();
    } catch (err) {
      toast.error(err.message || 'Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn my-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedData ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-[#0C2340]">
              Consultation Request Received
            </h3>
            <div className="p-4 bg-[#F5F7FA] rounded-xl text-left text-xs space-y-2 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Reference:</span>
                <span className="font-mono font-bold text-[#006699] text-sm">
                  {submittedData.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Patient Name:</span>
                <span className="font-semibold text-gray-800">{submittedData.data?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-semibold text-amber-600 uppercase text-[10px] bg-amber-50 px-2 py-0.5 rounded">
                  Pending Coordinator Confirmation
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our central OPD registration desk will review consultant availability and contact you via phone within 24 working hours to confirm your consultation time and room number.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 w-full py-2.5 bg-[#006699] hover:bg-[#004D73] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Done & Return to Website
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006699] uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>OUTPATIENT CONSULTATION DESK</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#0C2340]">
                Request an Appointment
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Schedule a consultation with our senior faculty and attending consultants.
              </p>
            </div>

            {initialDoctor && (
              <div className="mb-4 p-3 rounded-lg bg-[#E8F4FA] border border-[#006699]/20 flex items-center gap-3">
                <img
                  src={initialDoctor.image}
                  alt={initialDoctor.name}
                  className="w-10 h-10 rounded-full object-cover border border-white"
                />
                <div className="min-w-0 text-xs">
                  <span className="font-semibold text-[#0C2340] block truncate">{initialDoctor.name}</span>
                  <span className="text-gray-500 block truncate">{initialDoctor.departmentName}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter patient full name"
                    {...register('fullName', {
                      required: 'Patient name is required',
                      minLength: { value: 3, message: 'Minimum 3 characters' }
                    })}
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-[#F8FAFC] border rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA] ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. 9811234567"
                      {...register('phone', {
                        required: 'Phone number is required',
                        minLength: { value: 8, message: 'Invalid phone number' }
                      })}
                      className={`w-full pl-9 pr-3.5 py-2.5 bg-[#F8FAFC] border rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] mt-0.5">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Preferred Consultation Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('preferredDate')}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Department
                </label>
                <select
                  {...register('department')}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                >
                  <option value="Orthopaedics & Spine Surgery">Orthopaedics & Spine Surgery</option>
                  <option value="Heart Surgeries & Interventions">Heart Surgeries & Interventions</option>
                  <option value="Nephrology & Kidney Care">Nephrology & Kidney Care (Subsidized Dialysis)</option>
                  <option value="Aesthetic & Cosmetic Surgeries">Aesthetic & Cosmetic Surgeries</option>
                  <option value="Cancer Treatment & Oncology">Cancer Treatment & Oncology</option>
                  <option value="Neuro & Neuro Spine Surgeries">Neuro & Neuro Spine Surgeries</option>
                  <option value="General & Laparoscopic Surgery">General & Laparoscopic Surgery</option>
                  <option value="Gynaecology & Obstetrics">Gynaecology & Obstetrics</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Eye & Dental Care">Eye & Dental Care</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Brief Medical Reason (Non-sensitive summary)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Routine consultation, second opinion, joint pain, subsidized dialysis..."
                  {...register('message')}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#006699]"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#006699] hover:bg-[#004D73] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                      <span>Registering Request...</span>
                    </>
                  ) : (
                    <span>Submit Appointment Request</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                Submitting this form logs your appointment request with our registration coordinators. It does not automatically book a payment slot until verified.
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
