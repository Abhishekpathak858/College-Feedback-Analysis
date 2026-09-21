// Comprehensive AKTU / UPTAC counselling cutoff and admission database
// Contains realistic JEE Main Opening & Closing ranks across Government & Private institutions in Uttar Pradesh

export const AKTU_CUTOFF_COLLEGES = [
  // ==========================================
  // STATE GOVERNMENT AUTONOMOUS INSTITUTIONS
  // ==========================================
  {
    id: "iet_lucknow",
    name: "Institute of Engineering & Technology (IET)",
    fullName: "Institute of Engineering and Technology, Sitapur Road, Lucknow",
    location: "Lucknow",
    district: "lucknow",
    region: "Central UP",
    isGovt: true,
    annualFee: "₹89,775 / yr",
    feeNumeric: 89775,
    rating: 4.5,
    overallOpeningRank: 18000,
    overallClosingRank: 98000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 18000, closingRank: 36000 },
      { branchName: "CSE (Artificial Intelligence)", openingRank: 26000, closingRank: 42000 },
      { branchName: "Information Technology (IT)", openingRank: 34000, closingRank: 49000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 46000, closingRank: 64000 },
      { branchName: "Electrical / Mechanical / Civil", openingRank: 58000, closingRank: 98000 }
    ],
    facilities: ["Smart Labs", "State Central Library", "High-Speed Campus WiFi", "Govt Hostel Complex"]
  },
  {
    id: "knit_sultanpur",
    name: "Kamla Nehru Institute of Technology (KNIT)",
    fullName: "Kamla Nehru Institute of Technology, Sultanpur",
    location: "Sultanpur",
    district: "sultanpur",
    region: "Eastern UP",
    isGovt: true,
    annualFee: "₹84,350 / yr",
    feeNumeric: 84350,
    rating: 4.3,
    overallOpeningRank: 38000,
    overallClosingRank: 135000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 38000, closingRank: 59000 },
      { branchName: "Information Technology (IT)", openingRank: 52000, closingRank: 74000 },
      { branchName: "Electronics Engineering", openingRank: 68000, closingRank: 92000 },
      { branchName: "Electrical / Mechanical / Civil", openingRank: 85000, closingRank: 135000 }
    ],
    facilities: ["100-Acre Campus", "Central Computing Facility", "Hostels & Mess", "Sports Ground"]
  },
  {
    id: "biet_jhansi",
    name: "Bundelkhand Institute of Engineering & Technology (BIET)",
    fullName: "Bundelkhand Institute of Engineering & Technology, Kanpur Road, Jhansi",
    location: "Jhansi",
    district: "jhansi",
    region: "Bundelkhand",
    isGovt: true,
    annualFee: "₹78,500 / yr",
    feeNumeric: 78500,
    rating: 4.2,
    overallOpeningRank: 45000,
    overallClosingRank: 155000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 45000, closingRank: 69000 },
      { branchName: "Information Technology (IT)", openingRank: 62000, closingRank: 88000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 78000, closingRank: 112000 },
      { branchName: "Mechanical & Civil Engineering", openingRank: 98000, closingRank: 155000 }
    ],
    facilities: ["250-Acre Campus", "Modern Computer Labs", "Auditorium", "Residential Hostels"]
  },

  // ==========================================
  // RAJKIYA ENGINEERING COLLEGES (RECs - GOVT)
  // ==========================================
  {
    id: "rec_banda",
    name: "Rajkiya Engineering College (REC), Banda",
    fullName: "Rajkiya Engineering College, Atarra, Banda",
    location: "Banda",
    district: "banda",
    region: "Bundelkhand",
    isGovt: true,
    annualFee: "₹61,400 / yr",
    feeNumeric: 61400,
    rating: 4.0,
    overallOpeningRank: 75000,
    overallClosingRank: 220000,
    branches: [
      { branchName: "Information Technology (IT)", openingRank: 75000, closingRank: 138000 },
      { branchName: "Electrical Engineering", openingRank: 125000, closingRank: 185000 },
      { branchName: "Mechanical Engineering", openingRank: 150000, closingRank: 220000 }
    ],
    facilities: ["Govt Subsidized Fees", "Modern Academic Block", "Govt Hostels", "Gym & Sports"]
  },
  {
    id: "rec_bijnor",
    name: "Rajkiya Engineering College (REC), Bijnor",
    fullName: "Rajkiya Engineering College, Jhalu, Bijnor",
    location: "Bijnor",
    district: "bijnor",
    region: "Western UP",
    isGovt: true,
    annualFee: "₹61,400 / yr",
    feeNumeric: 61400,
    rating: 4.0,
    overallOpeningRank: 80000,
    overallClosingRank: 230000,
    branches: [
      { branchName: "Information Technology (IT)", openingRank: 80000, closingRank: 142000 },
      { branchName: "Electrical Engineering", openingRank: 130000, closingRank: 190000 },
      { branchName: "Civil Engineering", openingRank: 160000, closingRank: 230000 }
    ],
    facilities: ["Govt Subsidized Hostel", "Computer Center", "Wi-Fi Campus", "Library"]
  },
  {
    id: "rec_kannauj",
    name: "Rajkiya Engineering College (REC), Kannauj",
    fullName: "Rajkiya Engineering College, Aher, Kannauj",
    location: "Kannauj",
    district: "kannauj",
    region: "Central UP",
    isGovt: true,
    annualFee: "₹61,400 / yr",
    feeNumeric: 61400,
    rating: 4.0,
    overallOpeningRank: 82000,
    overallClosingRank: 235000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 82000, closingRank: 145000 },
      { branchName: "Electronics Engineering", openingRank: 135000, closingRank: 195000 },
      { branchName: "Electrical Engineering", openingRank: 155000, closingRank: 235000 }
    ],
    facilities: ["Govt Fee Structure", "High-Speed Internet", "Hostels", "Laboratories"]
  },
  {
    id: "rec_sonbhadra",
    name: "Rajkiya Engineering College (REC), Sonbhadra",
    fullName: "Rajkiya Engineering College, Churk, Sonbhadra",
    location: "Sonbhadra",
    district: "sonbhadra",
    region: "Eastern UP",
    isGovt: true,
    annualFee: "₹61,400 / yr",
    feeNumeric: 61400,
    rating: 3.9,
    overallOpeningRank: 85000,
    overallClosingRank: 245000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 85000, closingRank: 150000 },
      { branchName: "Electrical Engineering", openingRank: 140000, closingRank: 205000 },
      { branchName: "Electronics Engineering", openingRank: 165000, closingRank: 245000 }
    ],
    facilities: ["Govt Hostel & Mess", "Computer Laboratories", "Technical Clubs", "Library"]
  },
  {
    id: "rec_mainpuri",
    name: "Rajkiya Engineering College (REC), Mainpuri",
    fullName: "Rajkiya Engineering College, Mainpuri",
    location: "Mainpuri",
    district: "mainpuri",
    region: "Western UP",
    isGovt: true,
    annualFee: "₹61,400 / yr",
    feeNumeric: 61400,
    rating: 3.9,
    overallOpeningRank: 88000,
    overallClosingRank: 250000,
    branches: [
      { branchName: "Mechanical Engineering", openingRank: 155000, closingRank: 230000 },
      { branchName: "Civil Engineering", openingRank: 168000, closingRank: 250000 },
      { branchName: "Electrical Engineering", openingRank: 145000, closingRank: 215000 }
    ],
    facilities: ["Govt Subsidized Facilities", "Digital Classrooms", "Labs", "Hostel"]
  },
  {
    id: "rec_ambedkar_nagar",
    name: "Rajkiya Engineering College (REC), Ambedkar Nagar",
    fullName: "Rajkiya Engineering College, Akbarpur, Ambedkar Nagar",
    location: "Ambedkar Nagar",
    district: "ambedkar nagar",
    region: "Eastern UP",
    isGovt: true,
    annualFee: "₹61,400 / yr",
    feeNumeric: 61400,
    rating: 4.0,
    overallOpeningRank: 80000,
    overallClosingRank: 230000,
    branches: [
      { branchName: "Information Technology (IT)", openingRank: 80000, closingRank: 140000 },
      { branchName: "Electrical Engineering", openingRank: 130000, closingRank: 195000 },
      { branchName: "Civil Engineering", openingRank: 155000, closingRank: 230000 }
    ],
    facilities: ["Govt Infrastructure", "Computing Labs", "Hostel Accommodations", "Library"]
  },
  {
    id: "rec_azamgarh",
    name: "Rajkiya Engineering College (REC), Azamgarh",
    fullName: "Rajkiya Engineering College, Deogaon, Azamgarh",
    location: "Azamgarh",
    district: "azamgarh",
    region: "Eastern UP",
    isGovt: true,
    annualFee: "₹61,400 / yr",
    feeNumeric: 61400,
    rating: 3.9,
    overallOpeningRank: 84000,
    overallClosingRank: 240000,
    branches: [
      { branchName: "Information Technology (IT)", openingRank: 84000, closingRank: 145000 },
      { branchName: "Mechanical Engineering", openingRank: 155000, closingRank: 225000 },
      { branchName: "Civil Engineering", openingRank: 165000, closingRank: 240000 }
    ],
    facilities: ["Govt Campus", "Hostels", "Sports Ground", "Computing Center"]
  },

  // ==========================================
  // TOP TIER NCR PRIVATE COLLEGES
  // ==========================================
  {
    id: "jss_noida",
    name: "JSS Academy of Technical Education (JSSATE)",
    fullName: "JSS Academy of Technical Education, Sector 62, Noida",
    location: "Noida",
    district: "gautam buddha nagar",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,38,000 / yr",
    feeNumeric: 138000,
    rating: 4.3,
    overallOpeningRank: 42000,
    overallClosingRank: 210000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 42000, closingRank: 88000 },
      { branchName: "CSE (Artificial Intelligence & ML)", openingRank: 70000, closingRank: 115000 },
      { branchName: "Information Technology (IT)", openingRank: 85000, closingRank: 135000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 120000, closingRank: 185000 },
      { branchName: "Electrical / Mechanical Engineering", openingRank: 160000, closingRank: 210000 }
    ],
    facilities: ["28-Acre Prime Noida Campus", "High Placement Ratio", "Advanced Robotics Lab", "AC Library"]
  },
  {
    id: "akgec_ghaziabad",
    name: "Ajay Kumar Garg Engineering College (AKGEC)",
    fullName: "Ajay Kumar Garg Engineering College, Delhi-Meerut Expressway, Ghaziabad",
    location: "Ghaziabad",
    district: "ghaziabad",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,41,256 / yr",
    feeNumeric: 141256,
    rating: 4.3,
    overallOpeningRank: 55000,
    overallClosingRank: 240000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 55000, closingRank: 112000 },
      { branchName: "CSE (AI & ML / Data Science)", openingRank: 95000, closingRank: 148000 },
      { branchName: "Information Technology (IT)", openingRank: 110000, closingRank: 165000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 155000, closingRank: 215000 },
      { branchName: "Mechanical & Civil Engineering", openingRank: 185000, closingRank: 240000 }
    ],
    facilities: ["German Automation Centers", "NAAC Accredited", "27-Acre Lush Campus", "Excellent Placement Drives"]
  },
  {
    id: "kiet_ghaziabad",
    name: "KIET Group of Institutions",
    fullName: "KIET Group of Institutions, Delhi-NCR, Ghaziabad",
    location: "Ghaziabad",
    district: "ghaziabad",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,38,499 / yr",
    feeNumeric: 138499,
    rating: 4.3,
    overallOpeningRank: 60000,
    overallClosingRank: 260000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 60000, closingRank: 122000 },
      { branchName: "Computer Science & Information Tech (CSIT)", openingRank: 105000, closingRank: 155000 },
      { branchName: "Artificial Intelligence (AI & ML)", openingRank: 115000, closingRank: 168000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 165000, closingRank: 235000 },
      { branchName: "Mechanical & Electrical Engineering", openingRank: 195000, closingRank: 260000 }
    ],
    facilities: ["NAAC 'A+' Grade", "Innovation Incubation Cell", "Modern Hostels & Gym", "Active Coding Hackathons"]
  },
  {
    id: "galgotias_college",
    name: "Galgotias College of Engineering & Technology (GCET)",
    fullName: "Galgotias College of Engineering and Technology, Knowledge Park II, Greater Noida",
    location: "Greater Noida",
    district: "gautam buddha nagar",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,26,000 / yr",
    feeNumeric: 126000,
    rating: 4.2,
    overallOpeningRank: 70000,
    overallClosingRank: 310000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 70000, closingRank: 145000 },
      { branchName: "CSE (Artificial Intelligence & ML)", openingRank: 120000, closingRank: 185000 },
      { branchName: "Information Technology (IT)", openingRank: 138000, closingRank: 210000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 185000, closingRank: 275000 },
      { branchName: "Mechanical & Civil Engineering", openingRank: 220000, closingRank: 310000 }
    ],
    facilities: ["Knowledge Park Metro Connectivity", "NBA Accredited", "Top Recruiter Network", "Modern Sports Arena"]
  },
  {
    id: "abes_college",
    name: "ABES Engineering College",
    fullName: "ABES Engineering College, Delhi-Meerut Bypass, Ghaziabad",
    location: "Ghaziabad",
    district: "ghaziabad",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,35,000 / yr",
    feeNumeric: 135000,
    rating: 4.1,
    overallOpeningRank: 85000,
    overallClosingRank: 350000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 85000, closingRank: 165000 },
      { branchName: "CSE (Data Science / AI)", openingRank: 140000, closingRank: 215000 },
      { branchName: "Information Technology (IT)", openingRank: 165000, closingRank: 245000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 210000, closingRank: 310000 },
      { branchName: "Mechanical & Electrical", openingRank: 260000, closingRank: 350000 }
    ],
    facilities: ["Delhi-Meerut Expressway", "Center of Excellence", "Hostel & Multi-Cuisine Mess", "High-Tech Labs"]
  },
  {
    id: "gl_bajaj",
    name: "GL Bajaj Institute of Technology & Management",
    fullName: "GL Bajaj Institute of Technology and Management, Knowledge Park III, Greater Noida",
    location: "Greater Noida",
    district: "gautam buddha nagar",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,32,000 / yr",
    feeNumeric: 132000,
    rating: 4.1,
    overallOpeningRank: 95000,
    overallClosingRank: 380000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 95000, closingRank: 185000 },
      { branchName: "CSE (Artificial Intelligence)", openingRank: 155000, closingRank: 235000 },
      { branchName: "Information Technology (IT)", openingRank: 175000, closingRank: 265000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 230000, closingRank: 340000 },
      { branchName: "Mechanical Engineering", openingRank: 280000, closingRank: 380000 }
    ],
    facilities: ["High Placement Volume", "Modern Apple Lab", "Student Innovation Cell", "Campus WiFi"]
  },
  {
    id: "niet_noida",
    name: "Noida Institute of Engineering and Technology (NIET)",
    fullName: "Noida Institute of Engineering and Technology, Knowledge Park II, Greater Noida",
    location: "Greater Noida",
    district: "gautam buddha nagar",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,28,000 / yr",
    feeNumeric: 128000,
    rating: 4.0,
    overallOpeningRank: 120000,
    overallClosingRank: 420000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 120000, closingRank: 220000 },
      { branchName: "CSE (Cloud / IoT / Cyber Security)", openingRank: 180000, closingRank: 285000 },
      { branchName: "Information Technology (IT)", openingRank: 210000, closingRank: 320000 },
      { branchName: "Biotechnology & Electronics", openingRank: 270000, closingRank: 420000 }
    ],
    facilities: ["Autonomous Status", "Corporate Innovation Labs", "Hostel Blocks", "Gym & Cafeteria"]
  },
  {
    id: "its_engg_greater_noida",
    name: "ITS Engineering College",
    fullName: "I.T.S. Engineering College, Knowledge Park III, Greater Noida",
    location: "Greater Noida",
    district: "gautam buddha nagar",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,18,000 / yr",
    feeNumeric: 118000,
    rating: 4.1,
    overallOpeningRank: 180000,
    overallClosingRank: 550000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 180000, closingRank: 320000 },
      { branchName: "CSE (Artificial Intelligence & ML)", openingRank: 250000, closingRank: 410000 },
      { branchName: "Mechanical / Civil / ECE", openingRank: 340000, closingRank: 550000 }
    ],
    facilities: ["Knowledge Park III", "NBA Accredited", "Incubation Center (MSME Approved)", "Green Campus"]
  },
  {
    id: "abesit_ghaziabad",
    name: "ABES Institute of Technology (ABESIT)",
    fullName: "ABES Institute of Technology, Vijay Nagar, Ghaziabad",
    location: "Ghaziabad",
    district: "ghaziabad",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,15,000 / yr",
    feeNumeric: 115000,
    rating: 3.9,
    overallOpeningRank: 190000,
    overallClosingRank: 520000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 190000, closingRank: 340000 },
      { branchName: "CSE (Data Science / IoT)", openingRank: 270000, closingRank: 425000 },
      { branchName: "Information Technology", openingRank: 310000, closingRank: 520000 }
    ],
    facilities: ["Clean Infrastructure", "Active Placement Assistance", "Computer Laboratories", "Library"]
  },
  {
    id: "ims_ghaziabad",
    name: "IMS Engineering College",
    fullName: "IMS Engineering College, NH-24, Ghaziabad",
    location: "Ghaziabad",
    district: "ghaziabad",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,20,000 / yr",
    feeNumeric: 120000,
    rating: 3.9,
    overallOpeningRank: 210000,
    overallClosingRank: 560000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 210000, closingRank: 360000 },
      { branchName: "Biotechnology Engineering", openingRank: 280000, closingRank: 460000 },
      { branchName: "Mechanical & Civil", openingRank: 350000, closingRank: 560000 }
    ],
    facilities: ["Spacious Campus", "Central Library", "Sports Ground", "Hostel Facilities"]
  },

  // ==========================================
  // CENTRAL & WESTERN UP PRIVATE INSTITUTIONS
  // ==========================================
  {
    id: "psit_kanpur",
    name: "Pranveer Singh Institute of Technology (PSIT)",
    fullName: "Pranveer Singh Institute of Technology, Kanpur-Agra Highway, Kanpur",
    location: "Kanpur",
    district: "kanpur",
    region: "Central UP",
    isGovt: false,
    annualFee: "₹1,45,000 / yr",
    feeNumeric: 145000,
    rating: 4.2,
    overallOpeningRank: 110000,
    overallClosingRank: 390000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 110000, closingRank: 210000 },
      { branchName: "Information Technology (IT)", openingRank: 180000, closingRank: 275000 },
      { branchName: "CSE (AI & ML / Data Science)", openingRank: 165000, closingRank: 260000 },
      { branchName: "Electronics & Communication (ECE)", openingRank: 240000, closingRank: 350000 },
      { branchName: "Mechanical & Electrical", openingRank: 290000, closingRank: 390000 }
    ],
    facilities: ["80-Acre Modern Campus", "Corporate Placement Training", "Air-Conditioned Hostels", "Gym & Sports"]
  },
  {
    id: "miet_meerut",
    name: "Meerut Institute of Engineering & Technology (MIET)",
    fullName: "Meerut Institute of Engineering and Technology, Delhi-Haridwar Highway, Meerut",
    location: "Meerut",
    district: "meerut",
    region: "Western UP",
    isGovt: false,
    annualFee: "₹1,18,000 / yr",
    feeNumeric: 118000,
    rating: 4.0,
    overallOpeningRank: 140000,
    overallClosingRank: 440000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 140000, closingRank: 245000 },
      { branchName: "Information Technology (IT)", openingRank: 210000, closingRank: 320000 },
      { branchName: "Biotechnology & Pharmacy", openingRank: 260000, closingRank: 390000 },
      { branchName: "Mechanical & Civil Engineering", openingRank: 310000, closingRank: 440000 }
    ],
    facilities: ["NH-58 Prime Location", "NAAC 'A' Accredited", "Hi-Tech Laboratories", "Hostels & Food Court"]
  },
  {
    id: "srms_bareilly",
    name: "Shri Ram Murti Smarak College of Engg & Tech (SRMS)",
    fullName: "Shri Ram Murti Smarak College of Engineering & Technology, Bareilly",
    location: "Bareilly",
    district: "bareilly",
    region: "Western UP",
    isGovt: false,
    annualFee: "₹1,22,000 / yr",
    feeNumeric: 122000,
    rating: 4.1,
    overallOpeningRank: 130000,
    overallClosingRank: 410000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 130000, closingRank: 230000 },
      { branchName: "Information Technology (IT)", openingRank: 195000, closingRank: 295000 },
      { branchName: "Electronics & Communication", openingRank: 250000, closingRank: 360000 },
      { branchName: "Mechanical & Electrical", openingRank: 295000, closingRank: 410000 }
    ],
    facilities: ["Strict Academic Discipline", "Medical Campus Hospital Proximity", "Rich Digital Library", "Hostels"]
  },
  {
    id: "bbd_lucknow",
    name: "Babu Banarasi Das National Institute of Tech & Mgmt (BBDNITM)",
    fullName: "Babu Banarasi Das National Institute of Technology and Management, Faizabad Road, Lucknow",
    location: "Lucknow",
    district: "lucknow",
    region: "Central UP",
    isGovt: false,
    annualFee: "₹1,25,000 / yr",
    feeNumeric: 125000,
    rating: 3.9,
    overallOpeningRank: 155000,
    overallClosingRank: 470000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 155000, closingRank: 270000 },
      { branchName: "Information Technology (IT)", openingRank: 225000, closingRank: 350000 },
      { branchName: "Electronics & Communication", openingRank: 285000, closingRank: 410000 },
      { branchName: "Mechanical & Civil", openingRank: 345000, closingRank: 470000 }
    ],
    facilities: ["AKTU College Code 054", "Central Library & Advanced Labs", "Sports Complex", "Placement Cell"]
  },
  {
    id: "bbdniit_lucknow",
    name: "Babu Banarasi Das Northern India Institute of Tech (BBDNIIT)",
    fullName: "Babu Banarasi Das Northern India Institute of Technology, Faizabad Road, Lucknow",
    location: "Lucknow",
    district: "lucknow",
    region: "Central UP",
    isGovt: false,
    annualFee: "₹1,25,000 / yr",
    feeNumeric: 125000,
    rating: 4.0,
    overallOpeningRank: 145000,
    overallClosingRank: 450000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 145000, closingRank: 255000 },
      { branchName: "Information Technology (IT)", openingRank: 215000, closingRank: 335000 },
      { branchName: "Electronics & Communication", openingRank: 275000, closingRank: 395000 },
      { branchName: "Mechanical & Civil", openingRank: 330000, closingRank: 450000 }
    ],
    facilities: ["AKTU College Code 056", "100-Acre BBD City Campus", "Cricket Stadium", "Hostels & Food Courts"]
  },
  {
    id: "srmcem_lucknow",
    name: "Shri Ramswaroop Memorial College of Engg (SRMCEM)",
    fullName: "Shri Ramswaroop Memorial College of Engineering and Management, Tiwariganj, Lucknow",
    location: "Lucknow",
    district: "lucknow",
    region: "Central UP",
    isGovt: false,
    annualFee: "₹1,28,000 / yr",
    feeNumeric: 128000,
    rating: 4.0,
    overallOpeningRank: 150000,
    overallClosingRank: 460000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 150000, closingRank: 260000 },
      { branchName: "Information Technology (IT)", openingRank: 220000, closingRank: 340000 },
      { branchName: "Electrical / ECE", openingRank: 285000, closingRank: 410000 },
      { branchName: "Civil Engineering", openingRank: 340000, closingRank: 460000 }
    ],
    facilities: ["Good Placement Records in Lucknow", "Digital Classrooms", "Modern Hostels", "Tech Fests"]
  },
  {
    id: "anand_engg_agra",
    name: "Anand Engineering College",
    fullName: "Anand Engineering College, Agra-Delhi Highway, Artoni, Agra",
    location: "Agra",
    district: "agra",
    region: "Western UP",
    isGovt: false,
    annualFee: "₹1,05,000 / yr",
    feeNumeric: 105000,
    rating: 3.8,
    overallOpeningRank: 220000,
    overallClosingRank: 590000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 220000, closingRank: 380000 },
      { branchName: "Mechanical & Civil Engineering", openingRank: 340000, closingRank: 490000 },
      { branchName: "Electrical & Electronics", openingRank: 390000, closingRank: 590000 }
    ],
    facilities: ["Large Green Campus", "Computer Labs", "Hostels & Transportation", "Sports Ground"]
  },
  {
    id: "allenhouse_kanpur",
    name: "Allenhouse Institute of Technology",
    fullName: "Allenhouse Institute of Technology, Rooma, Kanpur",
    location: "Kanpur",
    district: "kanpur",
    region: "Central UP",
    isGovt: false,
    annualFee: "₹95,000 / yr",
    feeNumeric: 95000,
    rating: 3.8,
    overallOpeningRank: 240000,
    overallClosingRank: 620000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 240000, closingRank: 410000 },
      { branchName: "Mechanical & Civil", openingRank: 360000, closingRank: 520000 },
      { branchName: "Electrical Engineering", openingRank: 410000, closingRank: 620000 }
    ],
    facilities: ["Affordable Fees", "Modern Computer Centers", "Transport Services", "Hostel"]
  },
  {
    id: "ucer_prayagraj",
    name: "United College of Engineering & Research (UCER)",
    fullName: "United College of Engineering & Research, Naini, Prayagraj",
    location: "Prayagraj",
    district: "allahabad",
    region: "Eastern UP",
    isGovt: false,
    annualFee: "₹1,15,000 / yr",
    feeNumeric: 115000,
    rating: 4.0,
    overallOpeningRank: 160000,
    overallClosingRank: 480000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 160000, closingRank: 280000 },
      { branchName: "Information Technology (IT)", openingRank: 230000, closingRank: 360000 },
      { branchName: "Mechanical & Civil", openingRank: 320000, closingRank: 480000 }
    ],
    facilities: ["High Campus Placement Drives", "Modern Auditoriums", "Hostel Blocks", "WiFi Labs"]
  },
  {
    id: "ambalika_lucknow",
    name: "Ambalika Institute of Management & Technology",
    fullName: "Ambalika Institute of Management and Technology, Mohanlalganj, Lucknow",
    location: "Lucknow",
    district: "lucknow",
    region: "Central UP",
    isGovt: false,
    annualFee: "₹1,02,000 / yr",
    feeNumeric: 102000,
    rating: 3.9,
    overallOpeningRank: 210000,
    overallClosingRank: 580000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 210000, closingRank: 370000 },
      { branchName: "Information Technology (IT)", openingRank: 280000, closingRank: 460000 },
      { branchName: "Mechanical / Civil / ECE", openingRank: 360000, closingRank: 580000 }
    ],
    facilities: ["Scenic Lakeside Campus", "Robotics & CAD Labs", "Hostels & Cafeteria", "Sports Complex"]
  },
  {
    id: "axis_kanpur",
    name: "Axis Institute of Technology and Management",
    fullName: "Axis Institute of Technology and Management, Rooma, Kanpur",
    location: "Kanpur",
    district: "kanpur",
    region: "Central UP",
    isGovt: false,
    annualFee: "₹92,000 / yr",
    feeNumeric: 92000,
    rating: 3.8,
    overallOpeningRank: 250000,
    overallClosingRank: 650000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 250000, closingRank: 430000 },
      { branchName: "Information Technology", openingRank: 320000, closingRank: 520000 },
      { branchName: "Civil & Mechanical Engineering", openingRank: 410000, closingRank: 650000 }
    ],
    facilities: ["Scholarship Support", "Computer Labs", "Hostel & Transport", "Campus Canteen"]
  },
  {
    id: "rkgit_ghaziabad",
    name: "Raj Kumar Goel Institute of Technology (RKGIT)",
    fullName: "Raj Kumar Goel Institute of Technology, 5km Stone Delhi-Meerut Road, Ghaziabad",
    location: "Ghaziabad",
    district: "ghaziabad",
    region: "NCR",
    isGovt: false,
    annualFee: "₹1,24,000 / yr",
    feeNumeric: 124000,
    rating: 3.9,
    overallOpeningRank: 175000,
    overallClosingRank: 490000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 175000, closingRank: 310000 },
      { branchName: "CSE (AI & ML)", openingRank: 240000, closingRank: 390000 },
      { branchName: "Information Technology (IT)", openingRank: 280000, closingRank: 440000 },
      { branchName: "ECE & Mechanical", openingRank: 340000, closingRank: 490000 }
    ],
    facilities: ["Delhi-NCR Connectivity", "Computer Labs", "In-Campus Hostels", "Active Tech Clubs"]
  },
  {
    id: "itm_gorakhpur",
    name: "Institute of Technology & Management (ITM)",
    fullName: "Institute of Technology & Management, AL-1 Sector 7 GIDA, Gorakhpur",
    location: "Gorakhpur",
    district: "gorakhpur",
    region: "Eastern UP",
    isGovt: false,
    annualFee: "₹98,000 / yr",
    feeNumeric: 98000,
    rating: 3.8,
    overallOpeningRank: 230000,
    overallClosingRank: 610000,
    branches: [
      { branchName: "Computer Science & Engineering (CSE)", openingRank: 230000, closingRank: 400000 },
      { branchName: "Information Technology", openingRank: 310000, closingRank: 510000 },
      { branchName: "Mechanical & Civil", openingRank: 390000, closingRank: 610000 }
    ],
    facilities: ["GIDA Industrial Area Advantage", "Computer Labs", "Hostels", "Library"]
  }
];
