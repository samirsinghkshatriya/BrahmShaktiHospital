import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  ShieldCheck,
  FileText,
  Printer,
  CalendarDays,
  User,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  ChevronDown,
  ChevronUp,
  PhoneCall
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const statusStyle = (status) => {
  if (status === 'Result Ready') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'Sample Collected') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const statusIcon = (status) => {
  if (status === 'Result Ready') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (status === 'Sample Collected') return <Droplets className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
};

const flagStyle = (flag) => {
  if (flag === 'Critical') return 'bg-red-50 text-status-error border-red-200';
  if (flag === 'Abnormal') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

export const LabResultsPage = () => {
  const [uhid, setUhid] = useState('');
  const [phone, setPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null); // { patient, data[] }
  const [openReportId, setOpenReportId] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!uhid.trim() || !phone.trim()) {
      toast.error('Please enter both your UHID and registered mobile number.');
      return;
    }
    setSearching(true);
    setResult(null);
    setOpenReportId(null);
    try {
      const response = await api.get('/lab-reports', {
        params: { uhid: uhid.trim(), phone: phone.trim() }
      });
      if (response.data?.success) {
        setResult({ patient: response.data.patient, data: response.data.data });
        const ready = response.data.data.filter((r) => r.status === 'Result Ready').length;
        toast.success(
          response.data.data.length === 0
            ? 'Verified. No lab tests recorded against this UHID yet.'
            : `Access granted. ${ready} of ${response.data.data.length} reports ready.`
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Please check UHID and mobile number.');
    } finally {
      setSearching(false);
      setSearched(true);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-medical-coolgray">
      {/* Page Header */}
      <div className="bg-secondary text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-primary-light text-xs font-bold uppercase tracking-widest mb-3">
            <FlaskConical className="w-4 h-4" />
            <span>NABL Accredited Central Diagnostic Laboratory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Lab Test Results</h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Retrieve your diagnostic reports securely. Enter the <span className="text-accent font-bold">UHID</span> printed on
            your hospital file along with the <span className="text-accent font-bold">registered mobile number</span> to
            view and print all lab investigations ordered by your treating doctor.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary-light" /> Reports released only after doctor digital verification
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-primary-light" /> Lab Helpdesk:
              <a href="tel:7840089703" className="text-accent font-bold hover:underline">7840089703</a>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 pb-16">
        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-elevated border border-medical-border p-5 sm:p-7">
          <form onSubmit={handleSearch} className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-medical-slate uppercase tracking-wide mb-1.5">
                UHID / Patient File No.
              </label>
              <input
                value={uhid}
                onChange={(e) => setUhid(e.target.value.toUpperCase())}
                placeholder="e.g. BSH-2026-001"
                className="w-full px-4 py-3 rounded-xl border border-medical-border text-sm font-semibold text-secondary placeholder:text-medical-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-medical-slate uppercase tracking-wide mb-1.5">
                Registered Mobile Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl border border-medical-border text-sm font-semibold text-secondary placeholder:text-medical-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="h-[46px] flex items-center justify-center gap-2 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-60"
            >
              <Search className="w-4 h-4" />
              <span>{searching ? 'Verifying…' : 'Find My Reports'}</span>
            </button>
          </form>
          <p className="mt-3 text-[11px] text-medical-muted flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              For patient privacy, reports are shown only when the UHID and mobile number match the hospital
              registration records. Walk-in patients may collect printed copies from the Lab Reporting Counter (Block A, Ground Floor).
            </span>
          </p>
        </div>

        {/* Not Found State */}
        {searched && !searching && !result && (
          <div className="mt-6 bg-white rounded-2xl border border-red-200 p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-status-error" />
            </div>
            <div>
              <h3 className="font-bold text-secondary">No hospital record matched these details</h3>
              <p className="text-sm text-medical-muted mt-1 leading-relaxed">
                Please confirm the UHID printed on your prescription or bill receipt, and ensure the mobile number is the one
                registered at admission. If you were treated as an unregistered walk-in, contact the Lab Helpdesk at{' '}
                <a href="tel:7840089703" className="text-primary font-bold hover:underline">7840089703</a>.
              </p>
            </div>
          </div>
        )}

        {/* Verified Patient + Reports */}
        {result && (
          <div className="mt-6 space-y-5">
            {/* Patient Identity Card */}
            <div className="bg-white rounded-2xl shadow-soft border border-medical-border p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-secondary">{result.patient.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Identity Verified
                    </span>
                  </div>
                  <p className="text-xs text-medical-muted font-semibold mt-0.5">
                    UHID {result.patient.uhid} · {result.patient.age} yrs · {result.patient.gender} · Blood Group {result.patient.bloodGroup}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-primary">{result.data.length}</div>
                <div className="text-[11px] font-bold text-medical-muted uppercase tracking-wide">{result.data.length === 1 ? 'Investigation Recorded' : 'Investigations Recorded'}</div>
              </div>
            </div>

            {result.data.length === 0 && (
              <div className="bg-white rounded-2xl border border-medical-border p-6 text-center text-sm text-medical-muted">
                No lab investigations have been ordered against this UHID yet.
              </div>
            )}

            {/* Report List */}
            {result.data.map((report) => {
              const isOpen = openReportId === report.reportId;
              const Icon = isOpen ? ChevronUp : ChevronDown;
              return (
                <div key={report.reportId} className="bg-white rounded-2xl shadow-soft border border-medical-border overflow-hidden">
                  <button
                    onClick={() => setOpenReportId(isOpen ? null : report.reportId)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-medical-coolgray/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-secondary truncate">{report.testName}</div>
                        <div className="text-xs text-medical-muted mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span className="font-bold text-primary">{report.reportId}</span>
                          <span>{report.category}</span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> Ordered {report.orderedDate}
                          </span>
                          {report.resultDate && <span>Result {report.resultDate}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase tracking-wide ${statusStyle(report.status)}`}>
                        {statusIcon(report.status)}
                        {report.status}
                      </span>
                      <Icon className="w-5 h-5 text-medical-muted" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-medical-border px-5 py-5 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-medical-coolgray/60">
                          <div className="text-medical-muted font-bold uppercase tracking-wide text-[10px]">Referring Doctor</div>
                          <div className="font-bold text-secondary mt-1 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-primary" /> {report.doctorName || '—'}
                          </div>
                          <div className="text-medical-muted mt-0.5">{report.departmentName}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-medical-coolgray/60">
                          <div className="text-medical-muted font-bold uppercase tracking-wide text-[10px]">Sample Details</div>
                          <div className="font-bold text-secondary mt-1">{report.sampleType}</div>
                          <div className="text-medical-muted mt-0.5">
                            Collected {report.collectedDate || 'Pending'}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-medical-coolgray/60">
                          <div className="text-medical-muted font-bold uppercase tracking-wide text-[10px]">Test Value</div>
                          <div className="font-black text-primary mt-1 text-sm">₹{report.price?.toLocaleString('en-IN')}</div>
                          <div className="text-medical-muted mt-0.5">Paid at billing counter</div>
                        </div>
                      </div>

                      {report.status === 'Result Ready' ? (
                        <div className="rounded-xl border border-medical-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-secondary text-white text-left text-[11px] uppercase tracking-wide">
                                <th className="px-4 py-2.5 font-bold">Investigation Parameter</th>
                                <th className="px-4 py-2.5 font-bold">Result</th>
                                <th className="px-4 py-2.5 font-bold hidden sm:table-cell">Normal Range</th>
                                <th className="px-4 py-2.5 font-bold text-right">Flag</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.parameters.map((p) => (
                                <tr key={p.name} className="border-t border-medical-border/70">
                                  <td className="px-4 py-2.5 font-semibold text-secondary">
                                    {p.name}
                                    <span className="block sm:hidden text-[11px] text-medical-muted">Ref: {p.normalRange}</span>
                                  </td>
                                  <td className="px-4 py-2.5 font-black text-secondary">
                                    {p.value} <span className="text-[11px] font-medium text-medical-muted">{p.unit}</span>
                                  </td>
                                  <td className="px-4 py-2.5 text-medical-muted hidden sm:table-cell">{p.normalRange}</td>
                                  <td className="px-4 py-2.5 text-right">
                                    <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-black uppercase ${flagStyle(p.flag)}`}>
                                      {p.flag}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className={`rounded-xl border p-4 flex items-start gap-3 text-sm ${statusStyle(report.status)}`}>
                          <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold">{report.status === 'Pending' ? 'Sample collection pending' : 'Under processing at laboratory'}</div>
                            <div className="opacity-80 mt-0.5">{report.notes}</div>
                          </div>
                        </div>
                      )}

                      {report.status === 'Result Ready' && report.notes && (
                        <div className="text-xs text-medical-muted bg-medical-coolgray/50 rounded-xl p-3.5 leading-relaxed">
                          <span className="font-bold text-secondary">Consultant Note: </span>
                          {report.notes}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          onClick={handlePrint}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-medical-border text-sm font-bold text-secondary hover:border-primary hover:text-primary transition-all"
                        >
                          <Printer className="w-4 h-4" />
                          Print / Save PDF
                        </button>
                        <Link
                          to="/appointments"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all"
                        >
                          <CalendarDays className="w-4 h-4" />
                          Book Follow-up Consultation
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Help Strip */}
        <div className="mt-8 bg-white rounded-2xl border border-medical-border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="font-bold text-secondary text-sm">Need help locating your UHID?</div>
              <div className="text-xs text-medical-muted mt-0.5 leading-relaxed max-w-md">
                Your UHID is printed at the top-right of every prescription, lab barcode slip and billing receipt issued by
                Brahm Shakti Hospital. The Medical Records Desk (Block A, Ground Floor) can re-issue it with a valid photo ID.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:7840089703"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-medical-border text-sm font-bold text-secondary hover:border-primary hover:text-primary transition-all"
            >
              <PhoneCall className="w-4 h-4 text-status-error" />
              Call Lab Helpdesk
            </a>
            <Link
              to="/consultation"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              Book Doctor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResultsPage;
