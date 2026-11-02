export const usersData = [
  {
    name: "Dr. B.S. Sharma (Super Administrator)",
    email: "superadmin@brahmshaktihospital.com",
    password: "SuperAdmin@123",
    role: "superadmin",
    phone: "+91-9811029381",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Rohit Verma (Hospital Administrator)",
    email: "admin@brahmshaktihospital.com",
    password: "Admin@123",
    role: "admin",
    phone: "+91-9871038291",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Dr. Rajiv Singhal (Lead Cardiologist)",
    email: "doctor@brahmshaktihospital.com",
    password: "Doctor@123",
    role: "doctor",
    doctorId: "doc-card-01",
    phone: "+91-9810192837",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Pooja Sharma (Senior Pharmacist)",
    email: "pharmacist@brahmshaktihospital.com",
    password: "Pharmacist@123",
    role: "pharmacist",
    phone: "+91-9899123456",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1594824813583-e18e806114d3?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Vikram Malhotra (MedEquip Supplies)",
    email: "supplier@brahmshaktihospital.com",
    password: "Supplier@123",
    role: "supplier",
    phone: "+91-9818876543",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Anjali Gupta (OPD Reception Desk)",
    email: "receptionist@brahmshaktihospital.com",
    password: "Receptionist@123",
    role: "receptionist",
    phone: "+91-9811456789",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Ramesh Chand (Patient)",
    email: "patient@brahmshaktihospital.com",
    password: "Patient@123",
    role: "patient",
    patientId: "BSH-2026-001",
    phone: "+91-9873456780",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
];

export const departmentsData = [
  {
    id: "orthopaedics",
    code: "ORTHO",
    name: "Orthopaedics & Spine Surgery",
    category: "Super Specialty",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Joint reconstruction, arthroscopic ligament reconstruction, fracture trauma, and minimally invasive spine surgeries.",
    description: "Brahm Shakti Hospital's Department of Orthopaedics & Spine Surgery provides end-to-end musculoskeletal care. With dedicated modular laminar air flow surgical theatres, specialized arthroplasty units, and round-the-clock emergency fracture triage, we provide robotic-guided knee & hip replacements, spinal decompression, and sports medicine rehabilitation.",
    headOfDepartment: "Dr. Rajesh Gupta (MS Ortho, MCh)",
    features: [
      "Total Knee & Total Hip Joint Replacement Suites",
      "Arthroscopic Meniscal & Cruciate Ligament Repairs",
      "Minimally Invasive Endoscopic Spine Surgery",
      "Dedicated Orthopaedic High-Dependency Care Unit",
      "Subsidised Joint Care via Brahm Shakti Trust"
    ],
    services: [
      "Total Knee Replacement (TKR)",
      "Total Hip Replacement (THR)",
      "Spinal Discectomy & Fusion",
      "Arthroscopic Knee & Shoulder Surgery",
      "Complex Fracture Plating & Fixation",
      "Paediatric Orthopaedics & Deformity Correction"
    ],
    opdTimings: "Mon - Sat: 09:00 AM - 04:30 PM",
    consultationCharges: 800,
    floorLocation: "Block A, 1st Floor",
    emergencyAvailable: true
  },
  {
    id: "cardiology",
    code: "CARD",
    name: "Cardiology & Vascular Center",
    category: "Super Specialty",
    icon: "HeartPulse",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    shortDescription: "24x7 Cath Lab emergency angioplasty, non-invasive cardiac diagnostics, pacemaker implantations, and coronary care.",
    description: "Equipped with state-of-the-art flat panel digital catheterization laboratory, Brahm Shakti Cardiology Center is a beacon for emergency cardiac resuscitation in North-West Delhi. We specialize in primary PCI angioplasty within the golden hour, cardiac electrophysiology, and subsidized bypass pathways.",
    headOfDepartment: "Dr. Rajiv Singhal (MD, DM Cardiology)",
    features: [
      "24x7 Primary Angioplasty (Cath Lab Services)",
      "16-Bed Advanced Coronary Care Unit (CCU)",
      "TMT, Color Doppler Echocardiography & Holter Monitoring",
      "Permanent Pacemaker & ICD Implantations",
      "Subsidized Coronary Care Program"
    ],
    services: [
      "Coronary Angiography & Stenting",
      "Emergency Heart Attack Resuscitation (Golden Hour)",
      "Echocardiogram & Strain Imaging",
      "Treadmill Stress Test (TMT)",
      "Heart Failure Management Clinic",
      "Vascular Doppler & Peripheral Interventions"
    ],
    opdTimings: "Mon - Sat: 09:30 AM - 05:00 PM",
    consultationCharges: 900,
    floorLocation: "Ground Floor & Block B, 2nd Floor",
    emergencyAvailable: true
  },
  {
    id: "nephrology",
    code: "NEPH",
    name: "Nephrology & Dialysis Care",
    category: "Super Specialty",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Round-the-clock subsidized hemodialysis, chronic kidney disease (CKD) management, and vascular access fistula surgery.",
    description: "Our dedicated 20-bed hemodialysis unit operates 24 hours a day with ultra-pure RO water systems and dedicated machines for seronegative and seropositive patients. Supported by Brahm Shakti Trust, high-flux dialysis is provided at heavily subsidized rates.",
    headOfDepartment: "Dr. Alok Mittal (MD, DNB Nephrology)",
    features: [
      "20-Bed Continuous Hemodialysis Facility",
      "Ultra-Pure Dual Stage Reverse Osmosis Water Plant",
      "AV Fistula, Graft Creation & Permcath Insertion",
      "ICU Bedside SLED & CRRT Dialysis Support",
      "Subsidized Dialysis Trust Program"
    ],
    services: [
      "Hemodialysis (Morning, Evening & Night Shifts)",
      "Peritoneal Dialysis (CAPD) Training & Care",
      "Diabetic Kidney Disease Management",
      "Hypertensive Nephropathy Clinic",
      "Renal Biopsy & Glomerular Workup",
      "Pre-Transplant Evaluation & Post-Transplant Care"
    ],
    opdTimings: "Mon - Sat: 08:30 AM - 06:00 PM",
    consultationCharges: 800,
    floorLocation: "Block C, 2nd Floor",
    emergencyAvailable: true
  },
  {
    id: "neurosciences",
    code: "NEUR",
    name: "Neurology & Neuro Spine Surgery",
    category: "Super Specialty",
    icon: "Brain",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Acute stroke thrombolysis, neuro-trauma management, micro-neurosurgery, epilepsy treatment, and nerve conduction.",
    description: "Comprehensive brain and spinal cord treatment combining high-precision surgical microscopes and specialized neuro-intensive care. Our acute stroke response team ensures prompt thrombolysis to reverse ischemic brain deficits.",
    headOfDepartment: "Dr. Sunil Khurana (MCh Neurosurgery)",
    features: [
      "Dedicated 10-Bed Neuro Intensive Care Unit (NICU)",
      "Operating Microscope for Micro-Neurosurgical Procedures",
      "24x7 Stroke Code & IV Thrombolytic Therapy",
      "Advanced Video EEG & EMG / NCV Diagnostic Suite",
      "Comprehensive Neuro-Rehabilitation Therapy"
    ],
    services: [
      "Head Injury & Brain Trauma Triage",
      "Microscopic Brain Tumor Resection",
      "Cervical & Lumbar Spinal Decompression",
      "Stroke Rehabilitation & Thrombolysis",
      "Migraine, Headache & Vertigo Management",
      "Epilepsy & Parkinson's Disease Protocols"
    ],
    opdTimings: "Mon - Sat: 10:00 AM - 04:00 PM",
    consultationCharges: 900,
    floorLocation: "Block A, 3rd Floor",
    emergencyAvailable: true
  },
  {
    id: "oncology",
    code: "ONCO",
    name: "Cancer Care & Medical Oncology",
    category: "Super Specialty",
    icon: "ShieldAlert",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Compassionate cancer management featuring daycare chemotherapy, surgical tumor resections, screening, and tumor boards.",
    description: "The Brahm Shakti Cancer Care Center combines multi-specialty clinical acumen with compassionate support. We offer personalized targeted chemotherapy regimens, immunotherapies, surgical oncology, and patient counseling at affordable costs.",
    headOfDepartment: "Dr. Meenakshi Sundaram (MD, DM Medical Oncology)",
    features: [
      "Day-Care Chemotherapy Infusion Center with HEPA filtration",
      "Port-a-Cath Insertion and Maintenance",
      "Multidisciplinary Tumor Board Consultations",
      "Preventive Cancer Screening & Genetic Risk Assessment",
      "Palliative Pain Care & Nutrition Counseling"
    ],
    services: [
      "Solid Tumor Chemotherapy & Immunotherapy",
      "Hematological Malignancy Care (Lymphoma / Leukaemia)",
      "Surgical Tumor Biopsy & Oncological Resection",
      "Breast, Cervical & Oral Cancer Screening",
      "Palliative Symptom Relief & Home Care Support"
    ],
    opdTimings: "Mon - Sat: 10:00 AM - 03:30 PM",
    consultationCharges: 850,
    floorLocation: "Block C, 3rd Floor",
    emergencyAvailable: false
  },
  {
    id: "general-surgery",
    code: "SURG",
    name: "General & Laparoscopic Surgery",
    category: "Surgical Specialties",
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Minimally invasive keyhole laparoscopic surgeries for gallstones, hernia repair, appendicitis, and surgical emergencies.",
    description: "Brahm Shakti's surgical suites are equipped with 4K Karl Storz laparoscopy towers, harmonic scalpel energy devices, and certified sterile processing. Patients benefit from smaller incisions, reduced post-operative pain, and rapid hospital discharge.",
    headOfDepartment: "Dr. Vineet Batra (MS General Surgery, FIAGES)",
    features: [
      "High-Definition 4K Laparoscopic Towers",
      "Laser Proctology for Piles, Fissure & Fistula",
      "Emergency Trauma Laparotomy Suite",
      "Day Care Surgical Recovery Unit"
    ],
    services: [
      "Laparoscopic Cholecystectomy (Gallbladder)",
      "Laparoscopic Hernia Repair (Inguinal, Umbilical, Incisional)",
      "Laparoscopic Appendectomy",
      "Thyroid & Breast Lump Resections",
      "Diabetic Foot Salvage & Debridement",
      "Emergency Abdominal Trauma Surgeries"
    ],
    opdTimings: "Mon - Sat: 09:00 AM - 05:00 PM",
    consultationCharges: 700,
    floorLocation: "Block B, 1st Floor",
    emergencyAvailable: true
  },
  {
    id: "pediatrics",
    code: "PED",
    name: "Pediatrics & Neonatal Care (NICU)",
    category: "Clinical Specialties",
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Level-III Neonatal ICU, infant incubation, pediatric emergency, growth & development monitoring, and vaccination.",
    description: "Caring for our youngest patients with tender expertise. Our Level-III NICU provides round-the-clock intensive care for premature neonates, low-birth-weight babies, and pediatric critical illnesses.",
    headOfDepartment: "Dr. Sunita Kapoor (MD Pediatrics, Fellow Neonatology)",
    features: [
      "Level-III Neonatal Intensive Care Unit (NICU)",
      "Advanced Infant Radiant Warmers & Phototherapy",
      "Neonatal CPAP & High Frequency Mechanical Ventilation",
      "Comprehensive Immunization Registry & Growth Tracking"
    ],
    services: [
      "Preterm Baby Intensive Resuscitation",
      "Universal Newborn Hearing & Metabolic Screening",
      "Childhood Asthma & Allergy Clinic",
      "Routine & Optional Childhood Vaccinations",
      "Pediatric Infectious Diseases Management"
    ],
    opdTimings: "Mon - Sat: 09:00 AM - 04:00 PM",
    consultationCharges: 700,
    floorLocation: "Block A, 2nd Floor",
    emergencyAvailable: true
  },
  {
    id: "emergency-icu",
    code: "EMERG",
    name: "24x7 Emergency Trauma & Critical Care",
    category: "Emergency & Critical Care",
    icon: "Ambulance",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Immediate emergency casualty desk, ACLS mobile ambulances, 30-bed multi-disciplinary ICU, and round-the-clock doctors.",
    description: "The primary emergency lifeline of North-West Delhi. Our Casualty and Trauma center operates 24 hours a day, 365 days a year with on-duty emergency physicians, orthopedic trauma surgeons, anaesthesiologists, and rapid blood bank access.",
    headOfDepartment: "Dr. Praveen Aggarwal (MD Emergency Medicine)",
    features: [
      "24x7 Triage & Multi-Bay Resuscitation Facility",
      "Fleet of GPS-Tracked Mobile ICU Ambulances",
      "30-Bed State-of-the-Art Intensive Care Unit (ICU)",
      "Direct Access to Blood Bank, 24x7 CT Scan & Labs"
    ],
    services: [
      "Polytrauma & Road Traffic Accident Resuscitation",
      "Cardiac Arrest & Advanced Cardiac Life Support (ACLS)",
      "Acute Respiratory Distress & Mechanical Ventilation",
      "Snake Bite, Poisoning & Drug Overdose Management",
      "Stroke & Sepsis Protocol Management"
    ],
    opdTimings: "24 Hours / 7 Days Active",
    consultationCharges: 800,
    floorLocation: "Ground Floor Main Entrance",
    emergencyAvailable: true
  }
];

export const doctorsData = [
  {
    id: "doc-card-01",
    name: "Dr. Rajiv Singhal",
    email: "rajiv.singhal@brahmshaktihospital.com",
    phone: "+91-9810192837",
    qualification: "MBBS, MD (Medicine), DM (Cardiology), FACC",
    designation: "Chief Interventional Cardiologist & Director Cardiac Sciences",
    departmentId: "cardiology",
    departmentName: "Cardiology & Vascular Center",
    experienceYears: 22,
    specializations: ["Coronary Angioplasty & Stenting", "Complex CTO Interventions", "Pacemakers & ICD", "Heart Failure"],
    consultationFee: 900,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTimings: "09:30 AM - 02:00 PM",
    opdSchedule: "Mon - Sat: 09:30 AM - 02:00 PM (Room 102)",
    room: "OPD Chamber 102",
    languages: ["English", "Hindi", "Punjabi"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
    bio: "Dr. Rajiv Singhal is a renowned interventional cardiologist with over 22 years of clinical excellence. Having performed over 10,000 coronary angiographies and angioplasties, he spearheads Brahm Shakti's emergency heart attack response network.",
    isActive: true,
    rating: 4.9
  },
  {
    id: "doc-ortho-01",
    name: "Dr. Rajesh Gupta",
    email: "rajesh.gupta@brahmshaktihospital.com",
    phone: "+91-9811234567",
    qualification: "MBBS, MS (Orthopaedics), MCh (Ortho, UK), AO Fellow (Switzerland)",
    designation: "Senior Consultant Orthopaedics & Chief Joint Replacement Surgeon",
    departmentId: "orthopaedics",
    departmentName: "Orthopaedics & Spine Surgery",
    experienceYears: 24,
    specializations: ["Robotic Knee Replacement", "Total Hip Arthroplasty", "Arthroscopy & Sports Ligaments", "Complex Pelvic Trauma"],
    consultationFee: 850,
    availableDays: ["Mon", "Wed", "Thu", "Fri", "Sat"],
    availableTimings: "10:00 AM - 03:00 PM",
    opdSchedule: "Mon, Wed, Thu, Fri, Sat: 10:00 AM - 03:00 PM (Room 105)",
    room: "OPD Chamber 105",
    languages: ["English", "Hindi"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
    bio: "A pioneer in joint reconstruction, Dr. Gupta has transformed thousands of lives with sub-vastus minimally invasive joint replacements, ensuring early weight-bearing and faster mobility.",
    isActive: true,
    rating: 4.9
  },
  {
    id: "doc-neph-01",
    name: "Dr. Alok Mittal",
    email: "alok.mittal@brahmshaktihospital.com",
    phone: "+91-9871122334",
    qualification: "MBBS, MD, DNB (Nephrology), MNAMS",
    designation: "Head of Nephrology & Chief Dialysis Physician",
    departmentId: "nephrology",
    departmentName: "Nephrology & Dialysis Care",
    experienceYears: 18,
    specializations: ["Chronic Kidney Disease (CKD)", "Hemodialysis Protocol Management", "Diabetic Nephropathy", "Vascular Access Permcath"],
    consultationFee: 800,
    availableDays: ["Mon", "Tue", "Wed", "Fri", "Sat"],
    availableTimings: "09:00 AM - 02:00 PM",
    opdSchedule: "Mon, Tue, Wed, Fri, Sat: 09:00 AM - 02:00 PM (Dialysis Block)",
    room: "Dialysis OPD Block Chamber 2",
    languages: ["English", "Hindi"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
    bio: "Dr. Alok Mittal oversees the largest charitable dialysis facility in the region, ensuring strict infection control, biocompatible dialyzers, and comprehensive renal failure care.",
    isActive: true,
    rating: 4.8
  },
  {
    id: "doc-neur-01",
    name: "Dr. Sunil Khurana",
    email: "sunil.khurana@brahmshaktihospital.com",
    phone: "+91-9810987654",
    qualification: "MBBS, MS (Surgery), MCh (Neurosurgery - AIIMS)",
    designation: "Senior Consultant Neurosurgeon & Spine Specialist",
    departmentId: "neurosciences",
    departmentName: "Neurology & Neuro Spine Surgery",
    experienceYears: 20,
    specializations: ["Microscopic Brain Surgery", "Endoscopic Spine Discectomy", "Head Injury & Stroke", "Trigeminal Neuralgia"],
    consultationFee: 900,
    availableDays: ["Mon", "Tue", "Thu", "Sat"],
    availableTimings: "10:30 AM - 03:30 PM",
    opdSchedule: "Mon, Tue, Thu, Sat: 10:30 AM - 03:30 PM (Room 201)",
    room: "OPD Chamber 201",
    languages: ["English", "Hindi", "Punjabi"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
    bio: "Trained at AIIMS New Delhi, Dr. Khurana specializes in ultra-precise brain and spinal microsurgeries with intraoperative neuro-monitoring.",
    isActive: true,
    rating: 4.9
  },
  {
    id: "doc-onco-01",
    name: "Dr. Meenakshi Sundaram",
    email: "meenakshi.s@brahmshaktihospital.com",
    phone: "+91-9811445566",
    qualification: "MBBS, MD (Medicine), DM (Medical Oncology - Tata Memorial)",
    designation: "Senior Consultant Medical Oncologist",
    departmentId: "oncology",
    departmentName: "Cancer Care & Medical Oncology",
    experienceYears: 16,
    specializations: ["Day Care Chemotherapy", "Targeted Therapy & Immunotherapy", "Breast & Gynaec Cancers", "Lung & Colon Cancer"],
    consultationFee: 850,
    availableDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTimings: "10:00 AM - 03:00 PM",
    opdSchedule: "Tue - Sat: 10:00 AM - 03:00 PM (Room 304)",
    room: "OPD Chamber 304",
    languages: ["English", "Hindi", "Tamil"],
    image: "https://images.unsplash.com/photo-1594824813583-e18e806114d3?auto=format&fit=crop&q=80&w=600",
    bio: "Dr. Sundaram brings expertise from Tata Memorial Centre, prioritizing patient quality of life and evidence-based personalized oncological regimens.",
    isActive: true,
    rating: 4.8
  },
  {
    id: "doc-surg-01",
    name: "Dr. Vineet Batra",
    email: "vineet.batra@brahmshaktihospital.com",
    phone: "+91-9810334455",
    qualification: "MBBS, MS (General Surgery), FIAGES, FMAS",
    designation: "Senior Consultant Laparoscopic & General Surgeon",
    departmentId: "general-surgery",
    departmentName: "General & Laparoscopic Surgery",
    experienceYears: 19,
    specializations: ["Laparoscopic Gallbladder & Hernia", "Laser Proctology (Piles/Fistula)", "Gastrointestinal Surgery", "Trauma Laparotomy"],
    consultationFee: 700,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTimings: "09:00 AM - 04:00 PM",
    opdSchedule: "Mon - Sat: 09:00 AM - 04:00 PM (Room 110)",
    room: "OPD Chamber 110",
    languages: ["English", "Hindi"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    bio: "Renowned for minimal access laparoscopic surgeries, Dr. Batra has performed over 8,000 successful keyhole gallbladder, appendix, and hernia procedures.",
    isActive: true,
    rating: 4.8
  },
  {
    id: "doc-ped-01",
    name: "Dr. Sunita Kapoor",
    email: "sunita.kapoor@brahmshaktihospital.com",
    phone: "+91-9871556677",
    qualification: "MBBS, DCH, MD (Pediatrics), Fellowship in Neonatal Intensive Care",
    designation: "Head of Pediatrics & In-Charge Neonatal ICU (NICU)",
    departmentId: "pediatrics",
    departmentName: "Pediatrics & Neonatal Care (NICU)",
    experienceYears: 17,
    specializations: ["Extreme Preterm Care", "Neonatal Ventilation", "Pediatric Infections & Asthma", "Vaccination Counseling"],
    consultationFee: 700,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availableTimings: "09:30 AM - 03:00 PM",
    opdSchedule: "Mon - Sat: 09:30 AM - 03:00 PM (Room 114)",
    room: "OPD Chamber 114",
    languages: ["English", "Hindi"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    bio: "Dedicated to newborn survival, Dr. Sunita Kapoor oversees Brahm Shakti's high-tech NICU, championing kangaroo mother care and comprehensive developmental follow-ups.",
    isActive: true,
    rating: 4.9
  },
  {
    id: "doc-emerg-01",
    name: "Dr. Praveen Aggarwal",
    email: "praveen.aggarwal@brahmshaktihospital.com",
    phone: "+91-9811889900",
    qualification: "MBBS, MD (Emergency Medicine), FEM (Royal College of Emergency Medicine, UK)",
    designation: "Head of Emergency Medicine & Critical Care Triage",
    departmentId: "emergency-icu",
    departmentName: "24x7 Emergency Trauma & Critical Care",
    experienceYears: 15,
    specializations: ["Trauma Resuscitation", "Acute Cardiac Life Support", "Poisoning Protocols", "Mass Casualty Disaster Triage"],
    consultationFee: 800,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    availableTimings: "24 Hours On-Call / Emergency Shifts",
    opdSchedule: "Emergency Trauma Desk Ground Floor (24 Hours)",
    room: "Casualty Emergency Triage Unit",
    languages: ["English", "Hindi"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
    bio: "Dr. Aggarwal coordinates rapid dispatch and resuscitation at the casualty bay, with an average triage time of under 3 minutes for critical trauma cases.",
    isActive: true,
    rating: 4.9
  }
];

export const patientsData = [
  {
    patientId: "BSH-2026-001",
    name: "Ramesh Chand",
    age: 58,
    gender: "Male",
    phone: "+91-9873456780",
    email: "patient@brahmshaktihospital.com",
    bloodGroup: "B+",
    address: "House 42, Pocket B, Budh Vihar Phase I, New Delhi - 110085",
    emergencyContact: {
      name: "Suman Chand",
      relationship: "Spouse",
      phone: "+91-9873456781"
    },
    medicalHistory: [
      {
        diagnosis: "Type 2 Diabetes Mellitus with Chronic Kidney Disease Stage 3",
        date: "2026-09-12",
        doctor: "Dr. Alok Mittal",
        notes: "On regular renal protective medications and quarterly biochemical follow-up."
      },
      {
        diagnosis: "Essential Hypertension",
        date: "2026-04-10",
        doctor: "Dr. Rajiv Singhal",
        notes: "Blood pressure controlled on Telmisartan 40mg."
      }
    ],
    admissions: [
      {
        admissionId: "ADM-9921",
        roomType: "Semi-Private Room (Bed 204)",
        admissionDate: "2026-09-10",
        dischargeDate: "2026-09-14",
        status: "Discharged"
      }
    ],
    status: "Active"
  },
  {
    patientId: "BSH-2026-002",
    name: "Sunita Devi",
    age: 52,
    gender: "Female",
    phone: "+91-9818223344",
    email: "sunita.devi@gmail.com",
    bloodGroup: "O+",
    address: "Block D-12, Sector 24, Rohini, New Delhi - 110085",
    emergencyContact: {
      name: "Vikas Kumar",
      relationship: "Son",
      phone: "+91-9818223345"
    },
    medicalHistory: [
      {
        diagnosis: "Severe Osteoarthritis Both Knees (Grade IV)",
        date: "2026-10-02",
        doctor: "Dr. Rajesh Gupta",
        notes: "Advised Total Knee Replacement (TKR) under trust subsidized pathway."
      }
    ],
    admissions: [],
    status: "Active"
  },
  {
    patientId: "BSH-2026-003",
    name: "Harish Chandra",
    age: 64,
    gender: "Male",
    phone: "+91-9899334455",
    email: "harish.c@yahoo.com",
    bloodGroup: "A+",
    address: "Village Pooth Khurd, Near Main Chaupal, Delhi - 110039",
    emergencyContact: {
      name: "Anil Chandra",
      relationship: "Brother",
      phone: "+91-9899334456"
    },
    medicalHistory: [
      {
        diagnosis: "Coronary Artery Disease - Acute Coronary Syndrome",
        date: "2026-10-18",
        doctor: "Dr. Rajiv Singhal",
        notes: "Underwent successful drug-eluting stent (DES) to LAD artery. Recovering well."
      }
    ],
    admissions: [
      {
        admissionId: "ADM-9945",
        roomType: "Coronary Care Unit (CCU Bed 4)",
        admissionDate: "2026-10-18",
        dischargeDate: "2026-10-21",
        status: "Discharged"
      }
    ],
    status: "Active"
  },
  {
    patientId: "BSH-2026-004",
    name: "Meena Sharma",
    age: 34,
    gender: "Female",
    phone: "+91-9811778899",
    email: "meena.sharma@gmail.com",
    bloodGroup: "AB+",
    address: "Pocket 11, Sector 20, Rohini, New Delhi - 110086",
    emergencyContact: {
      name: "Gaurav Sharma",
      relationship: "Husband",
      phone: "+91-9811778890"
    },
    medicalHistory: [
      {
        diagnosis: "Symptomatic Cholelithiasis (Gallbladder Stone 14mm)",
        date: "2026-10-20",
        doctor: "Dr. Vineet Batra",
        notes: "Planned for elective Laparoscopic Cholecystectomy."
      }
    ],
    admissions: [],
    status: "Active"
  },
  {
    patientId: "BSH-2026-005",
    name: "Master Aarav Jain",
    age: 6,
    gender: "Male",
    phone: "+91-9871889900",
    email: "parul.jain@outlook.com",
    bloodGroup: "O-",
    address: "Plot 88, Budh Vihar Phase II, Delhi - 110086",
    emergencyContact: {
      name: "Naveen Jain",
      relationship: "Father",
      phone: "+91-9871889901"
    },
    medicalHistory: [
      {
        diagnosis: "Childhood Bronchial Asthma Exacerbation",
        date: "2026-10-24",
        doctor: "Dr. Sunita Kapoor",
        notes: "Nebulized with Duolin and Budecort, responsive to inhaler maintenance."
      }
    ],
    admissions: [],
    status: "Active"
  }
];

export const appointmentsData = [
  {
    appointmentId: "APT-2026-1001",
    patientName: "Ramesh Chand",
    patientPhone: "+91-9873456780",
    patientEmail: "patient@brahmshaktihospital.com",
    patientAge: 58,
    gender: "Male",
    doctorId: "doc-card-01",
    doctorName: "Dr. Rajiv Singhal",
    departmentId: "cardiology",
    departmentName: "Cardiology & Vascular Center",
    date: "2026-11-03",
    timeSlot: "10:00 AM - 10:30 AM",
    appointmentType: "Follow-up Consultation",
    symptoms: "Mild chest heaviness upon brisk walking, routine blood pressure review",
    fee: 900,
    status: "Confirmed",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    doctorNotes: "ECG reviewed, sinus rhythm maintained. Titrate beta blockers."
  },
  {
    appointmentId: "APT-2026-1002",
    patientName: "Sunita Devi",
    patientPhone: "+91-9818223344",
    patientEmail: "sunita.devi@gmail.com",
    patientAge: 52,
    gender: "Female",
    doctorId: "doc-ortho-01",
    doctorName: "Dr. Rajesh Gupta",
    departmentId: "orthopaedics",
    departmentName: "Orthopaedics & Spine Surgery",
    date: "2026-11-03",
    timeSlot: "11:30 AM - 12:00 PM",
    appointmentType: "OPD Consultation",
    symptoms: "Bilateral knee joint pain, crepitus, difficulty climbing stairs",
    fee: 850,
    status: "Confirmed",
    paymentStatus: "Paid",
    paymentMethod: "Card",
    doctorNotes: "X-ray Bilateral Knees standing AP & Lateral ordered."
  },
  {
    appointmentId: "APT-2026-1003",
    patientName: "Meena Sharma",
    patientPhone: "+91-9811778899",
    patientEmail: "meena.sharma@gmail.com",
    patientAge: 34,
    gender: "Female",
    doctorId: "doc-surg-01",
    doctorName: "Dr. Vineet Batra",
    departmentId: "general-surgery",
    departmentName: "General & Laparoscopic Surgery",
    date: "2026-11-04",
    timeSlot: "10:30 AM - 11:00 AM",
    appointmentType: "OPD Consultation",
    symptoms: "Post-prandial right hypochondriac pain after fatty meals",
    fee: 700,
    status: "Pending",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    doctorNotes: ""
  },
  {
    appointmentId: "APT-2026-1004",
    patientName: "Sanjay Dixit",
    patientPhone: "+91-9810445566",
    patientEmail: "sanjay.dixit@rediffmail.com",
    patientAge: 46,
    gender: "Male",
    doctorId: "doc-neph-01",
    doctorName: "Dr. Alok Mittal",
    departmentId: "nephrology",
    departmentName: "Nephrology & Dialysis Care",
    date: "2026-11-04",
    timeSlot: "01:00 PM - 01:30 PM",
    appointmentType: "OPD Consultation",
    symptoms: "Swelling over feet and facial puffiness in morning, elevated creatinine report",
    fee: 800,
    status: "Confirmed",
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    doctorNotes: "24-hr urine protein and kidney ultrasound scheduled."
  },
  {
    appointmentId: "APT-2026-1005",
    patientName: "Kavita Rastogi",
    patientPhone: "+91-9811667788",
    patientEmail: "kavita.r@gmail.com",
    patientAge: 41,
    gender: "Female",
    doctorId: "doc-neur-01",
    doctorName: "Dr. Sunil Khurana",
    departmentId: "neurosciences",
    departmentName: "Neurology & Neuro Spine Surgery",
    date: "2026-11-02",
    timeSlot: "12:00 PM - 12:30 PM",
    appointmentType: "Emergency Consultation",
    symptoms: "Sudden onset severe occipital headache with transient blurriness",
    fee: 900,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    doctorNotes: "NCCT Head requested immediately. Migraine complex differential."
  }
];

export const bloodInventoryData = [
  // A+
  { bloodGroup: "A+", component: "Whole Blood", unitsAvailable: 14, minThreshold: 6, pricePerUnit: 1200, status: "Adequate" },
  { bloodGroup: "A+", component: "Packed Red Blood Cells", unitsAvailable: 22, minThreshold: 8, pricePerUnit: 1400, status: "Adequate" },
  { bloodGroup: "A+", component: "Platelets", unitsAvailable: 7, minThreshold: 5, pricePerUnit: 1100, status: "Adequate" },
  { bloodGroup: "A+", component: "Fresh Frozen Plasma", unitsAvailable: 18, minThreshold: 6, pricePerUnit: 1000, status: "Adequate" },
  { bloodGroup: "A+", component: "Cryoprecipitate", unitsAvailable: 5, minThreshold: 4, pricePerUnit: 1300, status: "Adequate" },

  // A-
  { bloodGroup: "A-", component: "Whole Blood", unitsAvailable: 4, minThreshold: 4, pricePerUnit: 1300, status: "Low Stock" },
  { bloodGroup: "A-", component: "Packed Red Blood Cells", unitsAvailable: 6, minThreshold: 5, pricePerUnit: 1500, status: "Adequate" },
  { bloodGroup: "A-", component: "Platelets", unitsAvailable: 2, minThreshold: 3, pricePerUnit: 1200, status: "Critical" },
  { bloodGroup: "A-", component: "Fresh Frozen Plasma", unitsAvailable: 8, minThreshold: 4, pricePerUnit: 1100, status: "Adequate" },

  // B+
  { bloodGroup: "B+", component: "Whole Blood", unitsAvailable: 26, minThreshold: 8, pricePerUnit: 1200, status: "Adequate" },
  { bloodGroup: "B+", component: "Packed Red Blood Cells", unitsAvailable: 34, minThreshold: 10, pricePerUnit: 1400, status: "Adequate" },
  { bloodGroup: "B+", component: "Platelets", unitsAvailable: 15, minThreshold: 6, pricePerUnit: 1100, status: "Adequate" },
  { bloodGroup: "B+", component: "Fresh Frozen Plasma", unitsAvailable: 25, minThreshold: 8, pricePerUnit: 1000, status: "Adequate" },
  { bloodGroup: "B+", component: "Cryoprecipitate", unitsAvailable: 9, minThreshold: 5, pricePerUnit: 1300, status: "Adequate" },

  // B-
  { bloodGroup: "B-", component: "Whole Blood", unitsAvailable: 3, minThreshold: 4, pricePerUnit: 1300, status: "Critical" },
  { bloodGroup: "B-", component: "Packed Red Blood Cells", unitsAvailable: 5, minThreshold: 4, pricePerUnit: 1500, status: "Adequate" },
  { bloodGroup: "B-", component: "Platelets", unitsAvailable: 3, minThreshold: 3, pricePerUnit: 1200, status: "Low Stock" },
  { bloodGroup: "B-", component: "Fresh Frozen Plasma", unitsAvailable: 6, minThreshold: 4, pricePerUnit: 1100, status: "Adequate" },

  // AB+
  { bloodGroup: "AB+", component: "Whole Blood", unitsAvailable: 9, minThreshold: 5, pricePerUnit: 1200, status: "Adequate" },
  { bloodGroup: "AB+", component: "Packed Red Blood Cells", unitsAvailable: 12, minThreshold: 6, pricePerUnit: 1400, status: "Adequate" },
  { bloodGroup: "AB+", component: "Platelets", unitsAvailable: 6, minThreshold: 4, pricePerUnit: 1100, status: "Adequate" },
  { bloodGroup: "AB+", component: "Fresh Frozen Plasma", unitsAvailable: 14, minThreshold: 5, pricePerUnit: 1000, status: "Adequate" },

  // AB-
  { bloodGroup: "AB-", component: "Whole Blood", unitsAvailable: 2, minThreshold: 3, pricePerUnit: 1400, status: "Critical" },
  { bloodGroup: "AB-", component: "Packed Red Blood Cells", unitsAvailable: 3, minThreshold: 3, pricePerUnit: 1600, status: "Low Stock" },
  { bloodGroup: "AB-", component: "Platelets", unitsAvailable: 1, minThreshold: 2, pricePerUnit: 1300, status: "Critical" },

  // O+
  { bloodGroup: "O+", component: "Whole Blood", unitsAvailable: 32, minThreshold: 10, pricePerUnit: 1200, status: "Adequate" },
  { bloodGroup: "O+", component: "Packed Red Blood Cells", unitsAvailable: 40, minThreshold: 12, pricePerUnit: 1400, status: "Adequate" },
  { bloodGroup: "O+", component: "Platelets", unitsAvailable: 18, minThreshold: 6, pricePerUnit: 1100, status: "Adequate" },
  { bloodGroup: "O+", component: "Fresh Frozen Plasma", unitsAvailable: 28, minThreshold: 8, pricePerUnit: 1000, status: "Adequate" },
  { bloodGroup: "O+", component: "Cryoprecipitate", unitsAvailable: 8, minThreshold: 5, pricePerUnit: 1300, status: "Adequate" },

  // O-
  { bloodGroup: "O-", component: "Whole Blood", unitsAvailable: 4, minThreshold: 5, pricePerUnit: 1500, status: "Low Stock" },
  { bloodGroup: "O-", component: "Packed Red Blood Cells", unitsAvailable: 7, minThreshold: 6, pricePerUnit: 1700, status: "Adequate" },
  { bloodGroup: "O-", component: "Platelets", unitsAvailable: 2, minThreshold: 3, pricePerUnit: 1400, status: "Critical" }
];

export const bloodRequestsData = [
  {
    requestId: "REQ-BLD-8801",
    patientName: "Harish Chandra",
    hospitalName: "Brahm Shakti Hospital (CCU Bed 4)",
    bloodGroup: "A+",
    component: "Packed Red Blood Cells",
    unitsNeeded: 2,
    urgency: "Urgent",
    contactPhone: "+91-9899334455",
    doctorPrescription: "Dr. Rajiv Singhal (Coronary Stenting Pre-Op)",
    status: "Approved",
    notes: "Cross-matching confirmed without agglutination."
  },
  {
    requestId: "REQ-BLD-8802",
    patientName: "Siddharth Verma",
    hospitalName: "Brahm Shakti Hospital (Emergency Casualty)",
    bloodGroup: "O-",
    component: "Whole Blood",
    unitsNeeded: 2,
    urgency: "Emergency",
    contactPhone: "+91-9811099887",
    doctorPrescription: "Dr. Praveen Aggarwal (Polytrauma Resuscitation)",
    status: "Fulfilled",
    notes: "Universal donor O- negative units transfused immediately."
  },
  {
    requestId: "REQ-BLD-8803",
    patientName: "Geeta Rani",
    hospitalName: "Brahm Shakti Hospital (OT 2 - Ortho)",
    bloodGroup: "B+",
    component: "Packed Red Blood Cells",
    unitsNeeded: 1,
    urgency: "Normal",
    contactPhone: "+91-9871665544",
    doctorPrescription: "Dr. Rajesh Gupta (Revision Hip Surgery)",
    status: "Pending",
    notes: "Reserved for tomorrow morning 08:30 AM surgery."
  }
];

export const bloodDonationsData = [
  {
    donationId: "DON-2026-041",
    donorName: "Vikas Singhal",
    donorPhone: "+91-9810887766",
    donorAge: 29,
    gender: "Male",
    bloodGroup: "O+",
    unitsDonated: 1,
    donationDate: "2026-10-30",
    certificateNo: "BSH-DON-CERT-1041",
    screeningStatus: "Passed"
  },
  {
    donationId: "DON-2026-042",
    donorName: "Neha Chhabra",
    donorPhone: "+91-9871554433",
    donorAge: 26,
    gender: "Female",
    bloodGroup: "B+",
    unitsDonated: 1,
    donationDate: "2026-10-31",
    certificateNo: "BSH-DON-CERT-1042",
    screeningStatus: "Passed"
  },
  {
    donationId: "DON-2026-043",
    donorName: "Mohit Aggarwal",
    donorPhone: "+91-9899332211",
    donorAge: 34,
    gender: "Male",
    bloodGroup: "A+",
    unitsDonated: 1,
    donationDate: "2026-11-01",
    certificateNo: "BSH-DON-CERT-1043",
    screeningStatus: "Passed"
  }
];

export const pharmacyProductsData = [
  {
    productId: "MED-001",
    name: "Augmentin 625 Duo Tablet",
    genericName: "Amoxicillin and Potassium Clavulanate (500mg + 125mg)",
    category: "Antibiotics",
    manufacturer: "GlaxoSmithKline Pharmaceuticals",
    dosage: "625 mg, Oral Tablet",
    price: 215,
    stock: 140,
    minThreshold: 30,
    requiresPrescription: true,
    batchNo: "AG625-26B1",
    expiryDate: "2027-08-31",
    description: "Broad spectrum antibiotic prescribed for respiratory tract infections, ENT infections, skin and soft tissue bacterial infections.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-002",
    name: "Telma-H 40 Tablet",
    genericName: "Telmisartan 40mg + Hydrochlorothiazide 12.5mg",
    category: "Cardiac & Hypertensive Care",
    manufacturer: "Glenmark Pharmaceuticals",
    dosage: "40 mg / 12.5 mg, Strip of 15 Tablets",
    price: 185,
    stock: 220,
    minThreshold: 40,
    requiresPrescription: true,
    batchNo: "TLH40-26D9",
    expiryDate: "2028-01-31",
    description: "Antihypertensive formulation for blood pressure management, cardiac protection, and reduction of cardiovascular events.",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-003",
    name: "Atorva 20 Tablet",
    genericName: "Atorvastatin Calcium 20mg",
    category: "Cardiac & Hypertensive Care",
    manufacturer: "Zydus Healthcare",
    dosage: "20 mg, Strip of 15 Tablets",
    price: 160,
    stock: 180,
    minThreshold: 35,
    requiresPrescription: true,
    batchNo: "ATV20-25K3",
    expiryDate: "2027-11-30",
    description: "HMG-CoA reductase inhibitor for reducing LDL cholesterol, triglycerides, and preventing atherosclerotic coronary plaque.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-004",
    name: "Glycomet-GP 2 Tablet",
    genericName: "Metformin 500mg SR + Glimepiride 2mg",
    category: "Diabetes & Endocrinology",
    manufacturer: "USV Private Limited",
    dosage: "500 mg / 2 mg, Strip of 15 Tablets",
    price: 145,
    stock: 260,
    minThreshold: 45,
    requiresPrescription: true,
    batchNo: "GLYGP-26A4",
    expiryDate: "2027-10-31",
    description: "Combination oral antidiabetic therapy for glycemic control in adult patients with Type 2 Diabetes Mellitus.",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-005",
    name: "Pantocid 40 Tablet",
    genericName: "Pantoprazole Gastro-resistant 40mg",
    category: "Gastrointestinal & Antacids",
    manufacturer: "Sun Pharmaceutical Industries",
    dosage: "40 mg, Strip of 15 Tablets",
    price: 155,
    stock: 310,
    minThreshold: 50,
    requiresPrescription: false,
    batchNo: "PT40-26C7",
    expiryDate: "2028-03-31",
    description: "Proton pump inhibitor (PPI) for GERD, acid reflux, gastric erosions, and ulcer prophylaxis.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-006",
    name: "Combiflam Plus Tablet",
    genericName: "Ibuprofen 400mg + Paracetamol 325mg",
    category: "Analgesics & Pain Relief",
    manufacturer: "Sanofi India",
    dosage: "400 mg / 325 mg, Strip of 20 Tablets",
    price: 45,
    stock: 450,
    minThreshold: 60,
    requiresPrescription: false,
    batchNo: "CBF-26F2",
    expiryDate: "2028-06-30",
    description: "Analgesic and anti-inflammatory medication for muscular pain, joint sprains, headache, and fever reduction.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-007",
    name: "Foracort 200 Inhaler",
    genericName: "Formoterol Fumarate + Budesonide (6mcg + 200mcg)",
    category: "Respiratory & Asthma",
    manufacturer: "Cipla Ltd.",
    dosage: "120 Metered Doses (CFC-free)",
    price: 420,
    stock: 65,
    minThreshold: 20,
    requiresPrescription: true,
    batchNo: "FRC200-25M1",
    expiryDate: "2027-05-31",
    description: "Dual bronchodilator and corticosteroid inhaler for maintenance treatment of asthma and COPD.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-008",
    name: "Becosules Z Capsules",
    genericName: "B-Complex Forte with Vitamin C and Zinc",
    category: "Vitamins & Supplements",
    manufacturer: "Pfizer India Ltd.",
    dosage: "Strip of 20 Soft Gelatin Capsules",
    price: 55,
    stock: 500,
    minThreshold: 80,
    requiresPrescription: false,
    batchNo: "BCZ-26J5",
    expiryDate: "2028-02-28",
    description: "Immunity strengthening vitamin B-complex with zinc for wound healing, tissue repair, and post-illness rejuvenation.",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  },
  {
    productId: "MED-009",
    name: "Clexane 40mg Injection",
    genericName: "Enoxaparin Sodium 40mg / 0.4ml Prefilled Syringe",
    category: "Critical Care & Injections",
    manufacturer: "Sanofi Winthrop Industrie",
    dosage: "40 mg / 0.4 ml, Subcutaneous Prefilled Syringe",
    price: 580,
    stock: 12,
    minThreshold: 15,
    requiresPrescription: true,
    batchNo: "CLX40-26E1",
    expiryDate: "2027-04-30",
    description: "Low molecular weight heparin for prevention and treatment of deep vein thrombosis (DVT) and acute coronary syndromes.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    status: "Low Stock"
  },
  {
    productId: "MED-010",
    name: "Betadine 10% Ointment",
    genericName: "Povidone Iodine Ointment USP 10% w/w",
    category: "Dermatology & Topicals",
    manufacturer: "Win-Medicare Ltd.",
    dosage: "20g Sterile Tube",
    price: 85,
    stock: 190,
    minThreshold: 25,
    requiresPrescription: false,
    batchNo: "BTD10-26H8",
    expiryDate: "2028-07-31",
    description: "Broad-spectrum microbicidal topical ointment for minor wounds, burns, surgical incisions, and lacerations.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400",
    status: "In Stock"
  }
];

export const billingsData = [
  {
    invoiceNumber: "INV-BSH-2026-9001",
    patientId: "BSH-2026-001",
    patientName: "Ramesh Chand",
    patientPhone: "+91-9873456780",
    patientAge: 58,
    billType: "OPD Consultation",
    items: [
      { description: "Specialist OPD Consultation - Dr. Rajiv Singhal (Cardiology)", category: "Doctor Consultation", qty: 1, unitPrice: 900, amount: 900 },
      { description: "12-Lead Electrocardiogram (ECG) Digital", category: "Diagnostic Lab", qty: 1, unitPrice: 350, amount: 350 },
      { description: "Blood Sugar Fasting & Post-Prandial (NABL Lab)", category: "Diagnostic Lab", qty: 1, unitPrice: 200, amount: 200 }
    ],
    subtotal: 1450,
    tax: 0,
    discount: 150,
    totalAmount: 1300,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    generatedBy: "OPD Cashier Counter 1",
    date: "2026-11-02",
    notes: "Senior Citizen concession applied as per Brahm Shakti Trust protocol."
  },
  {
    invoiceNumber: "INV-BSH-2026-9002",
    patientId: "BSH-2026-003",
    patientName: "Harish Chandra",
    patientPhone: "+91-9899334455",
    patientAge: 64,
    billType: "IPD Inpatient",
    items: [
      { description: "Coronary Angiography + DES Stenting Procedure Package", category: "Procedure", qty: 1, unitPrice: 65000, amount: 65000 },
      { description: "Coronary Care Unit (CCU) Stay 3 Days @ 4,000/day", category: "IPD Room", qty: 3, unitPrice: 4000, amount: 12000 },
      { description: "Senior Interventional Cardiologist Rounds (3 Days)", category: "Doctor Consultation", qty: 3, unitPrice: 1500, amount: 4500 },
      { description: "Post-Cath Pharmacy & Anti-Platelet Medications", category: "Pharmacy", qty: 1, unitPrice: 4200, amount: 4200 }
    ],
    subtotal: 85700,
    tax: 0,
    discount: 7700,
    totalAmount: 78000,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    generatedBy: "IPD Central Billing Department",
    date: "2026-10-21",
    notes: "Trust subsidized cardiology package applied for ECHS beneficiary."
  },
  {
    invoiceNumber: "INV-BSH-2026-9003",
    patientId: "BSH-2026-004",
    patientName: "Meena Sharma",
    patientPhone: "+91-9811778899",
    patientAge: 34,
    billType: "Diagnostic & Lab",
    items: [
      { description: "High Resolution Ultrasound Whole Abdomen (USG)", category: "Radiology", qty: 1, unitPrice: 1100, amount: 1100 },
      { description: "Liver Function Test (LFT Profile)", category: "Diagnostic Lab", qty: 1, unitPrice: 650, amount: 650 },
      { description: "Complete Blood Count (CBC) automated", category: "Diagnostic Lab", qty: 1, unitPrice: 350, amount: 350 }
    ],
    subtotal: 2100,
    tax: 0,
    discount: 200,
    totalAmount: 1900,
    paymentMethod: "Online payment",
    paymentStatus: "Paid",
    generatedBy: "Diagnostic Registration Desk",
    date: "2026-10-22",
    notes: "Direct booking online via patient portal."
  }
];

export const purchaseOrdersData = [
  {
    orderNumber: "PO-BSH-2026-018",
    supplierId: "SUP-01",
    supplierName: "MedEquip Healthcare Supplies Pvt Ltd",
    supplierEmail: "supplier@brahmshaktihospital.com",
    items: [
      { productName: "Sterile Surgical Gloves 7.5 (Boxes of 100)", quantity: 200, unitCost: 450, totalCost: 90000 },
      { productName: "Normal Saline 0.9% IV 500ml Infusion Bottles", quantity: 1500, unitCost: 28, totalCost: 42000 },
      { productName: "Disposable Syringes with Needle 5ml", quantity: 3000, unitCost: 4.5, totalCost: 13500 }
    ],
    totalAmount: 145500,
    orderDate: "2026-10-28",
    expectedDelivery: "2026-11-05",
    deliveryAddress: "Central Medical Stores, Brahm Shakti Hospital, Budh Vihar, New Delhi - 110085",
    status: "Confirmed",
    paymentTerms: "30 Days Net from Delivery"
  },
  {
    orderNumber: "PO-BSH-2026-019",
    supplierId: "SUP-02",
    supplierName: "Apex Pharma Distribution",
    supplierEmail: "orders@apexpharmadist.com",
    items: [
      { productName: "Augmentin 625 Duo Tablets (Strips of 10)", quantity: 300, unitCost: 160, totalCost: 48000 },
      { productName: "Clexane 40mg Prefilled Syringes", quantity: 50, unitCost: 440, totalCost: 22000 },
      { productName: "Pantocid 40 Tablets (Strips of 15)", quantity: 400, unitCost: 110, totalCost: 44000 }
    ],
    totalAmount: 114000,
    orderDate: "2026-10-31",
    expectedDelivery: "2026-11-04",
    deliveryAddress: "Hospital Pharmacy Central Store, Brahm Shakti Hospital",
    status: "Dispatched",
    paymentTerms: "15 Days Net"
  }
];

export const newsArticlesData = [
  {
    id: "news-01",
    title: "Brahm Shakti Hospital Inaugurates Subsidized High-Flux Dialysis Wing",
    category: "Hospital News",
    date: "2026-10-15",
    excerpt: "New 20-bed advanced hemodialysis wing launched by Brahm Shakti Trust to serve kidney patients across North-West Delhi.",
    readTime: "4 min read",
    author: "Hospital Communications Board",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "news-02",
    title: "24x7 Cath Lab Rapid Cardiac Response Network Saves 150+ Golden Hour Lives",
    category: "Clinical Milestones",
    date: "2026-10-01",
    excerpt: "Door-to-balloon time lowered to an extraordinary 42 minutes for acute STEMI myocardial infarction patients.",
    readTime: "3 min read",
    author: "Department of Cardiology",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800"
  }
];

