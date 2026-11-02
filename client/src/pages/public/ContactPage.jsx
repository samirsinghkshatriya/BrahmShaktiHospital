import React, { useState } from 'react';
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Hospital Enquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error('Please complete name, phone, and message');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/enquiries', {
        name,
        phone,
        email,
        subject,
        message
      });

      if (res.data.success) {
        setSubmitted(true);
        toast.success('Your message has been delivered to hospital reception desk.');
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Hospital Contact & Location</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Connect with Brahm Shakti Hospital
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Our medical helpdesk and casualty teams are available 24 hours a day to assist with admissions, appointment bookings, and inquiries.
          </p>
        </div>
      </section>

      {/* Main Grid: Details + Functional Form */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Authentic Hospital Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-6">
              <h2 className="text-2xl font-bold text-secondary tracking-tight">
                Hospital Address & Contact Desk
              </h2>

              <div className="space-y-5 text-xs text-secondary">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-secondary mb-0.5">Physical Campus</strong>
                    <p className="text-medical-muted leading-relaxed">
                      Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi, Delhi, 110085
                    </p>
                    <span className="text-[11px] text-primary font-semibold block mt-1">
                      Managed by Brahm Shakti Trust (Regd.)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-status-error flex items-center justify-center shrink-0 mt-0.5">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-secondary mb-0.5">24x7 Emergency Casualty</strong>
                    <a href="tel:7840089703" className="text-status-error font-black text-base hover:underline block">
                      7840089703
                    </a>
                    <span className="text-[11px] text-medical-muted">Mobile ICU Ambulance & Trauma Desk</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-secondary mb-0.5">General Reception & OPD</strong>
                    <a href="tel:01127531683" className="text-secondary font-bold text-sm hover:underline block">
                      011-27531683
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-secondary mb-0.5">Email Communications</strong>
                    <a href="mailto:enquiry@brahmshaktihospital.com" className="text-primary font-bold hover:underline block">
                      enquiry@brahmshaktihospital.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-4 border-t border-medical-border space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-secondary">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Institutional Working Hours</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-medical-muted pt-1">
                  <div>Emergency / Trauma: <strong className="text-secondary block">24 Hours / 7 Days</strong></div>
                  <div>OPD Consultations: <strong className="text-secondary block">09:00 AM - 05:00 PM</strong></div>
                  <div>Blood Bank: <strong className="text-secondary block">24 Hours / 7 Days</strong></div>
                  <div>Pharmacy: <strong className="text-secondary block">24 Hours / 7 Days</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Functional Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-6">
            <div>
              <span className="px-2.5 py-1 rounded bg-accent text-accent-dark text-[10px] font-bold uppercase tracking-wider">
                Direct Communication
              </span>
              <h2 className="text-2xl font-bold text-secondary mt-2">
                Send an Inquiry to Hospital Administration
              </h2>
              <p className="text-xs text-medical-muted mt-1">
                We review inquiries within 2 hours during normal hospital operational shifts.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-status-success mx-auto" />
                <h3 className="text-lg font-bold text-secondary">Message Sent Successfully</h3>
                <p className="text-xs text-medical-muted max-w-sm mx-auto">
                  Thank you for contacting Brahm Shakti Hospital. Our administrative desk will reach out via phone or email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted">Contact Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91-98XXXXXXXX"
                      required
                      className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-medical-muted">Department / Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                    >
                      <option value="General Hospital Enquiry">General Hospital Enquiry</option>
                      <option value="OPD Appointment Booking">OPD Appointment Booking</option>
                      <option value="IPD Admission & Bed Booking">IPD Admission & Bed Booking</option>
                      <option value="Dialysis Department Support">Dialysis Department Support</option>
                      <option value="Blood Bank Inquiry">Blood Bank Inquiry</option>
                      <option value="Cashless TPA & Insurance Desk">Cashless TPA & Insurance Desk</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-medical-muted">Your Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details of your clinical or administrative question..."
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Transmit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Google Maps Integration for Budh Vihar Phase I, New Delhi */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl overflow-hidden border border-medical-border shadow-soft">
          <div className="p-6 border-b border-medical-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-secondary text-base">Hospital Location Map</h3>
              <p className="text-xs text-medical-muted">Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi - 110085</p>
            </div>
            <a
              href="https://maps.google.com/?q=Brahm+Shakti+Hospital+Budh+Vihar+New+Delhi"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-primary hover:underline"
            >
              Open in Google Maps App ↗
            </a>
          </div>
          <iframe
            title="Brahm Shakti Hospital Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.878563381648!2d77.0673!3d28.7188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d06f698308cf5%3A0xb3fc6440ca4b4cb7!2sBrahm%20Shakti%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="380"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
