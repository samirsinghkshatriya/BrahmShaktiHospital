import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Globe, Plane, Phone, Mail, FileCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitEnquiry } from '../lib/api';

export const InternationalModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: 'international_patient',
      fullName: '',
      phone: '',
      email: '',
      country: 'Afghanistan',
      department: 'Organ Transplant & Complex Surgery',
      message: ''
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await submitEnquiry(formData);
      setSubmittedData(response);
      toast.success(`International dossier created #${response.referenceNumber}`);
      reset();
    } catch (err) {
      toast.error(err.message || 'Error submitting inquiry.');
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
            <h3 className="font-serif font-bold text-2xl text-[#123653]">
              International Inquiry Received
            </h3>
            <div className="p-4 bg-[#F5F7FA] rounded-xl text-left text-xs space-y-2 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Case Reference:</span>
                <span className="font-mono font-bold text-[#1769AA] text-sm">
                  {submittedData.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Patient Coordinator:</span>
                <span className="font-semibold text-gray-800">Assigned within 12 Hours</span>
              </div>
            </div>
            <p className="text-xs text-[#637386] leading-relaxed">
              Our International Patient Liaison Officer will review your medical query and send a preliminary clinical assessment and Visa invitation guidance.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-[#123653] hover:bg-[#1769AA] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769AA] uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>GLOBAL MEDICAL TRAVEL DESK</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#123653]">
                International Patient Enquiry
              </h3>
              <p className="text-xs text-[#637386] mt-1">
                Get assistance with clinical opinions, treatment estimates, and official Indian medical visa invitation letters.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="As written on passport"
                  {...register('fullName', { required: 'Name is required' })}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
                />
                {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Country of Residence <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UAE, Kenya, UK, Nepal"
                    {...register('country', { required: 'Country is required' })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    WhatsApp / Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="With country code (+...)"
                    {...register('phone', { required: 'Phone with country code is required' })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="For treatment opinion and visa letters"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Primary Medical Condition or Procedure Needed
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Kidney Transplant evaluation, Cardiac Bypass surgery, Oncology second opinion..."
                  {...register('message', { required: 'Please provide brief clinical concern' })}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#123653] hover:bg-[#1769AA] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Submit International Dossier'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
