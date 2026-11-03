import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Stethoscope,
  Building2,
  Newspaper,
  ArrowRight,
  Sparkles,
  CalendarDays,
  FlaskConical,
  Droplets,
  Pill,
  PhoneCall,
  Info
} from 'lucide-react';
import api from '../../services/api';

// Static site pages matched by keywords so Quick Search also navigates to
// important hospital services, not just database records.
const staticPages = [
  { label: 'Book an Appointment', keywords: ['appoint', 'book', 'consult', 'opd'], path: '/consultation', icon: CalendarDays, desc: 'Public consultation portal — no login required' },
  { label: 'Lab Test Results', keywords: ['lab', 'report', 'result', 'test', 'blood test'], path: '/lab-results', icon: FlaskConical, desc: 'Retrieve diagnostic reports with UHID + mobile' },
  { label: 'Blood Bank & Availability', keywords: ['blood', 'donate', 'platelet', 'plasma'], path: '/blood-bank', icon: Droplets, desc: 'Live inventory, donation & request workflows' },
  { label: 'Pharmacy & Medicines', keywords: ['pharmac', 'medicine', 'drug', 'prescription'], path: '/pharmacy', icon: Pill, desc: 'In-house 24x7 pharmacy store' },
  { label: 'About Brahm Shakti Hospital', keywords: ['about', 'hospital', 'trust', 'history'], path: '/about', icon: Info, desc: 'Heritage, mission & leadership' },
  { label: 'Contact & Emergency', keywords: ['contact', 'emergency', 'address', 'phone', 'location'], path: '/contact', icon: PhoneCall, desc: 'Helplines, OPD timings & directions' }
];

const popularSearches = ['Cardiology', 'Dr. Dev Patel', 'Dialysis', 'Blood Test', 'Knee Replacement', 'Emergency'];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [docRes, deptRes, newsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/departments'),
          api.get('/news').catch(() => ({ data: { data: [] } }))
        ]);
        setDoctors(docRes.data?.data || []);
        setDepartments(deptRes.data?.data || []);
        setNews(newsRes.data?.data || []);
      } catch (err) {
        console.error('Quick search data load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return { doctors: [], departments: [], news: [], pages: [] };
    const match = (text = '') => String(text).toLowerCase().includes(q);
    return {
      doctors: doctors
        .filter((d) => match(d.name) || match(d.departmentName) || match(d.qualification) || match(d.designation))
        .slice(0, 6),
      departments: departments
        .filter((d) => match(d.name) || match(d.category) || match(d.shortDescription) || match(d.description))
        .slice(0, 6),
      news: news.filter((n) => match(n.title) || match(n.excerpt) || match(n.category)).slice(0, 4),
      pages: staticPages.filter((p) => p.keywords.some(match))
    };
  }, [q, doctors, departments, news]);

  const totalFound =
    results.doctors.length + results.departments.length + results.news.length + results.pages.length;

  const submitQuery = (value) => {
    setQuery(value);
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-medical-coolgray">
      {/* Search Hero */}
      <div className="bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-primary-light text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Quick Search</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            What are you looking for today?
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base">
            Search across doctors, departments, hospital news and patient services — one box for the whole hospital.
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => submitQuery(e.target.value)}
              placeholder="Search doctor name, speciality, test, service…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-secondary text-sm sm:text-base font-semibold placeholder:text-medical-muted/70 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-elevated"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Popular:</span>
            {popularSearches.map((p) => (
              <button
                key={p}
                onClick={() => submitQuery(p)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-primary text-white text-[11px] font-bold border border-white/15 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-16">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-medical-muted font-semibold">
            <Search className="w-5 h-5 animate-pulse text-primary" />
            Loading hospital directory…
          </div>
        ) : !q ? (
          <div className="bg-white rounded-2xl border border-medical-border p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-extrabold text-secondary text-lg">Start typing to search</h3>
            <p className="text-sm text-medical-muted mt-1.5 max-w-md mx-auto leading-relaxed">
              Find a specialist by name, browse departments and specialities, look up hospital announcements,
              or jump straight to services like appointment booking and lab report retrieval.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3 text-left">
              <Link to="/consultation" className="p-4 rounded-xl border border-medical-border hover:border-primary hover:bg-primary-50/50 transition-all group">
                <CalendarDays className="w-5 h-5 text-primary mb-2" />
                <div className="font-bold text-secondary text-sm group-hover:text-primary">Book Appointment</div>
                <div className="text-[11px] text-medical-muted mt-0.5">No login required consultation portal</div>
              </Link>
              <Link to="/lab-results" className="p-4 rounded-xl border border-medical-border hover:border-primary hover:bg-primary-50/50 transition-all group">
                <FlaskConical className="w-5 h-5 text-primary mb-2" />
                <div className="font-bold text-secondary text-sm group-hover:text-primary">Lab Results</div>
                <div className="text-[11px] text-medical-muted mt-0.5">Retrieve reports with UHID + mobile</div>
              </Link>
              <a href="tel:7840089703" className="p-4 rounded-xl border border-medical-border hover:border-red-300 hover:bg-red-50/50 transition-all group">
                <PhoneCall className="w-5 h-5 text-status-error mb-2" />
                <div className="font-bold text-secondary text-sm group-hover:text-status-error">24x7 Emergency</div>
                <div className="text-[11px] text-medical-muted mt-0.5">Instant helpline 7840089703</div>
              </a>
            </div>
          </div>
        ) : totalFound === 0 ? (
          <div className="bg-white rounded-2xl border border-medical-border p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Info className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-extrabold text-secondary text-lg">No matches for “{query.trim()}”</h3>
            <p className="text-sm text-medical-muted mt-1.5 max-w-md mx-auto">
              Try a doctor's name (e.g. “Dev Patel”), a speciality (e.g. “kidney”), or call the helpdesk at{' '}
              <a href="tel:7840089703" className="text-primary font-bold hover:underline">7840089703</a> for guidance.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {popularSearches.map((p) => (
                <button
                  key={p}
                  onClick={() => submitQuery(p)}
                  className="px-3 py-1.5 rounded-full bg-medical-coolgray text-secondary text-[11px] font-bold hover:bg-primary hover:text-white transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-sm font-bold text-medical-slate">
              {totalFound} result{totalFound === 1 ? '' : 's'} for “<span className="text-secondary">{query.trim()}</span>”
            </div>

            {/* Matching Pages / Services */}
            {results.pages.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-medical-muted mb-3">
                  <Sparkles className="w-4 h-4 text-primary" /> Hospital Services & Pages
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.pages.map((p) => {
                    const Icon = p.icon;
                    return (
                      <Link
                        key={p.label}
                        to={p.path}
                        className="flex items-center gap-3.5 bg-white rounded-xl border border-medical-border p-4 hover:border-primary hover:shadow-soft transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-secondary text-sm group-hover:text-primary truncate">{p.label}</div>
                          <div className="text-[11px] text-medical-muted truncate">{p.desc}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-medical-muted group-hover:text-primary shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Doctors */}
            {results.doctors.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-medical-muted mb-3">
                  <Stethoscope className="w-4 h-4 text-primary" /> Doctors
                </h2>
                <div className="space-y-3">
                  {results.doctors.map((d) => (
                    <Link
                      key={d.id}
                      to={`/doctors/${d.id}`}
                      className="flex items-center gap-4 bg-white rounded-xl border border-medical-border p-4 hover:border-primary hover:shadow-soft transition-all group"
                    >
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary-50 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-secondary group-hover:text-primary truncate">{d.name}</div>
                        <div className="text-xs text-medical-muted mt-0.5 truncate">
                          {d.designation} · {d.departmentName} · {d.qualification}
                        </div>
                      </div>
                      <span className="hidden sm:block text-[11px] font-bold text-medical-muted bg-medical-coolgray px-2.5 py-1 rounded-lg shrink-0">
                        ₹{d.consultationFee}
                      </span>
                      <ArrowRight className="w-4 h-4 text-medical-muted group-hover:text-primary shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Departments */}
            {results.departments.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-medical-muted mb-3">
                  <Building2 className="w-4 h-4 text-primary" /> Departments & Specialities
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.departments.map((d) => (
                    <Link
                      key={d.id}
                      to={`/departments/${d.id}`}
                      className="bg-white rounded-xl border border-medical-border p-4 hover:border-primary hover:shadow-soft transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-bold text-secondary group-hover:text-primary truncate">{d.name}</div>
                          <div className="text-[11px] font-bold text-accent-dark uppercase tracking-wide mt-0.5">{d.category}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-medical-muted group-hover:text-primary shrink-0 mt-1" />
                      </div>
                      <p className="text-xs text-medical-muted mt-2 line-clamp-2">{d.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* News */}
            {results.news.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-medical-muted mb-3">
                  <Newspaper className="w-4 h-4 text-primary" /> News & Announcements
                </h2>
                <div className="space-y-3">
                  {results.news.map((n) => (
                    <Link
                      key={n.id || n._id}
                      to="/"
                      className="flex items-start gap-4 bg-white rounded-xl border border-medical-border p-4 hover:border-primary hover:shadow-soft transition-all group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-secondary group-hover:text-primary leading-snug">{n.title}</div>
                        <div className="text-xs text-medical-muted mt-1 line-clamp-2">{n.excerpt}</div>
                        <div className="text-[11px] font-bold text-primary mt-1.5">{n.category} · {n.date}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-medical-muted group-hover:text-primary shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
