// Comprehensive Mock Storage & Fallback for static deployments (Netlify) and offline testing
import QRCode from 'qrcode';

const generateQR = (text) => {
  try {
    return QRCode.toDataURL(text, {
      margin: 1,
      width: 240,
      color: { dark: '#0f172a', light: '#ffffff' },
    });
  } catch {
    return Promise.resolve(null);
  }
};

const DEFAULT_INSTRUMENTS = [
  {
    id: 'ins-1',
    instrumentId: 'INS-1001',
    name: 'Electronic Balance (30 kg) - Apex Retail',
    type: 'Electronic Balance',
    manufacturer: 'Essae Scales Ltd',
    model: 'EB-30K',
    serialNumber: 'SN-2024-10037',
    capacity: '30 kg',
    accuracyClass: 'Class III',
    maxCapacity: '30 kg',
    minCapacity: '100 grams',
    location: 'Plot 45, Jubilee Hills Checkpost, Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    purchaseDate: '2024-01-15',
    lastVerificationDate: '2025-09-15',
    expiryDate: '2026-09-15',
    status: 'VERIFIED',
    ownerId: 'demo-biz-id',
    owner: {
      id: 'demo-biz-id',
      name: 'Apex Retail Stores Pvt Ltd',
      organization: 'Apex Retail & Supermarkets',
      email: 'business@demo.com',
      phone: '+91 98765 00004',
      address: 'Plot 45, Jubilee Hills Checkpost, Hyderabad',
    },
    certificates: [],
    applications: [],
  },
  {
    id: 'ins-2',
    instrumentId: 'INS-1002',
    name: 'Weighbridge (50 Ton) - Apex Logistics',
    type: 'Weighbridge',
    manufacturer: 'Avery India Ltd',
    model: 'WB-50T',
    serialNumber: 'SN-2024-10074',
    capacity: '50 Ton',
    accuracyClass: 'Class III',
    maxCapacity: '50 Ton',
    minCapacity: '500 kg',
    location: 'Warehouse 4, Patancheru Industrial Area, Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    purchaseDate: '2023-08-10',
    lastVerificationDate: '2025-09-20',
    expiryDate: '2026-09-20',
    status: 'EXPIRING_SOON',
    ownerId: 'demo-biz-id',
    owner: {
      id: 'demo-biz-id',
      name: 'Apex Retail Stores Pvt Ltd',
      organization: 'Apex Retail & Supermarkets',
      email: 'business@demo.com',
      phone: '+91 98765 00004',
      address: 'Plot 45, Jubilee Hills Checkpost, Hyderabad',
    },
    certificates: [],
    applications: [],
  },
  {
    id: 'ins-3',
    instrumentId: 'INS-1003',
    name: 'Fuel Dispenser (80 L/min) - Station Pump #2',
    type: 'Fuel Dispenser',
    manufacturer: 'Tokheim India',
    model: 'FD-800',
    serialNumber: 'SN-2024-10111',
    capacity: '80 L/min',
    accuracyClass: 'Class I',
    maxCapacity: '80 L/min',
    minCapacity: '2 Litres',
    location: 'Outer Ring Road Exit 4, Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    purchaseDate: '2024-02-20',
    lastVerificationDate: '2025-03-10',
    expiryDate: '2026-03-10',
    status: 'EXPIRED',
    ownerId: 'demo-biz-id',
    owner: {
      id: 'demo-biz-id',
      name: 'Apex Retail Stores Pvt Ltd',
      organization: 'Apex Retail & Supermarkets',
      email: 'business@demo.com',
      phone: '+91 98765 00004',
      address: 'Plot 45, Jubilee Hills Checkpost, Hyderabad',
    },
    certificates: [],
    applications: [],
  },
  {
    id: 'ins-4',
    instrumentId: 'INS-1004',
    name: 'Precision Gold Balance (220g) - Sri Laxmi',
    type: 'Electronic Balance',
    manufacturer: 'Sartorius India',
    model: 'AB-220',
    serialNumber: 'SN-2024-10148',
    capacity: '220 grams',
    accuracyClass: 'Class I',
    maxCapacity: '220 grams',
    minCapacity: '1 milligram',
    location: 'Main Road, Hanamkonda, Warangal',
    state: 'Telangana',
    district: 'Warangal',
    purchaseDate: '2024-05-12',
    lastVerificationDate: '2025-08-14',
    expiryDate: '2026-08-14',
    status: 'VERIFIED',
    ownerId: 'demo-biz-id',
    owner: {
      id: 'demo-biz-id',
      name: 'Sri Laxmi Jewellers',
      organization: 'Sri Laxmi Jewellers Pvt Ltd',
      email: 'business@demo.com',
      phone: '+91 98765 00004',
      address: 'Main Road, Warangal',
    },
    certificates: [],
    applications: [],
  },
];

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-1',
    applicationId: 'LM-2026-010001',
    status: 'SCHEDULED',
    verificationType: 'PERIODIC',
    preferredDate: '2026-09-12',
    preferredTime: '10:30 AM',
    location: 'Plot 45, Jubilee Hills Checkpost, Hyderabad',
    notes: 'Periodic annual verification and stamping under Legal Metrology Rules, 2011.',
    createdAt: '2026-09-01T10:00:00.000Z',
    instrumentId: 'ins-1',
    instrument: DEFAULT_INSTRUMENTS[0],
    applicant: DEFAULT_INSTRUMENTS[0].owner,
    assignedTo: { id: 'u-1', name: 'Inspector Suresh Rao', role: 'LMO', organization: 'Legal Metrology Office, Zone 1' },
    schedules: [
      {
        id: 'sch-1',
        scheduledDate: '2026-09-12',
        scheduledTime: '10:30 AM',
        remarks: 'Assigned for official field tolerance testing.',
        officer: { name: 'Inspector Suresh Rao' },
      },
    ],
  },
  {
    id: 'app-2',
    applicationId: 'LM-2026-010002',
    status: 'SUBMITTED',
    verificationType: 'INITIAL',
    preferredDate: '2026-09-15',
    preferredTime: '02:00 PM',
    location: 'Warehouse 4, Patancheru Industrial Area, Hyderabad',
    notes: 'New weighbridge stamping required prior to commercial logistics usage.',
    createdAt: '2026-09-02T14:30:00.000Z',
    instrumentId: 'ins-2',
    instrument: DEFAULT_INSTRUMENTS[1],
    applicant: DEFAULT_INSTRUMENTS[1].owner,
    assignedTo: null,
    schedules: [],
  },
  {
    id: 'app-3',
    applicationId: 'LM-2026-010003',
    status: 'SCHEDULED',
    verificationType: 'PERIODIC',
    preferredDate: '2026-09-14',
    preferredTime: '11:00 AM',
    location: 'Outer Ring Road Exit 4, Hyderabad',
    notes: 'Dispenser calibration test before statutory permit renewal.',
    createdAt: '2026-09-03T09:15:00.000Z',
    instrumentId: 'ins-3',
    instrument: DEFAULT_INSTRUMENTS[2],
    applicant: DEFAULT_INSTRUMENTS[2].owner,
    assignedTo: { id: 'u-1', name: 'Inspector Suresh Rao', role: 'LMO', organization: 'Legal Metrology Office, Zone 1' },
    schedules: [
      {
        id: 'sch-3',
        scheduledDate: '2026-09-14',
        scheduledTime: '11:00 AM',
        remarks: 'Scheduled field inspection for fuel dispenser.',
        officer: { name: 'Inspector Suresh Rao' },
      },
    ],
  },
];

const DEFAULT_USERS = [
  { id: 'u-admin', name: 'Rajesham Sharma', email: 'admin@demo.com', organization: 'Department of Legal Metrology, HQ', district: 'Hyderabad', state: 'Telangana', role: 'ADMIN' },
  { id: 'u-1', name: 'Inspector Suresh Rao', email: 'lmo@demo.com', organization: 'Legal Metrology Office, Zone 1', district: 'Hyderabad', state: 'Telangana', role: 'LMO' },
  { id: 'u-2', name: 'Officer K. Venkat', email: 'lmo2@demo.com', organization: 'Legal Metrology Dept (Warangal)', district: 'Warangal', state: 'Telangana', role: 'LMO' },
  { id: 'u-3', name: 'Officer P. Anitha', email: 'lmo3@demo.com', organization: 'Legal Metrology Dept (Vijayawada)', district: 'Vijayawada', state: 'Andhra Pradesh', role: 'LMO' },
  { id: 'u-gatc', name: 'National Test House - GATC', email: 'gatc@demo.com', organization: 'Government Approved Test Centre #402', district: 'Hyderabad', state: 'Telangana', role: 'GATC' },
  { id: 'u-biz', name: 'Apex Retail Stores Pvt Ltd', email: 'business@demo.com', organization: 'Apex Retail & Supermarkets', district: 'Hyderabad', state: 'Telangana', role: 'BUSINESS' },
  { id: 'u-biz2', name: 'Sri Laxmi Jewellers', email: 'biz2@demo.com', organization: 'Sri Laxmi Jewellers Pvt Ltd', district: 'Warangal', state: 'Telangana', role: 'BUSINESS' },
];

let cachedCertificates = null;

const createInitialCertificates = async () => {
  const qr1 = await generateQR('https://legalmetrology.gov.in/verify/CERT-LM-2025-8821');
  const qr2 = await generateQR('https://legalmetrology.gov.in/verify/CERT-LM-2025-7732');

  return [
    {
      id: 'cert-1',
      certificateNumber: 'CERT-LM-2025-8821',
      issueDate: '2025-09-15',
      validUntil: '2026-09-15',
      status: 'ACTIVE',
      qrCodeData: qr1,
      issuingAuthority: 'Department of Legal Metrology, Government of Telangana',
      instrument: DEFAULT_INSTRUMENTS[0],
      owner: DEFAULT_INSTRUMENTS[0].owner,
      officer: { name: 'Inspector Suresh Rao', organization: 'Legal Metrology Office, Zone 1', state: 'Telangana' },
      verification: {
        standardWeightUsed: '20 kg Class F1 standard weights',
        errorObserved: '+0.02 grams',
        toleranceAllowed: '+/- 0.05 grams',
        remarks: 'All tolerance checks within statutory limits under Rules 2011.',
      },
    },
    {
      id: 'cert-2',
      certificateNumber: 'CERT-LM-2025-7732',
      issueDate: '2025-09-20',
      validUntil: '2026-09-20',
      status: 'ACTIVE',
      qrCodeData: qr2,
      issuingAuthority: 'Department of Legal Metrology, Government of Telangana',
      instrument: DEFAULT_INSTRUMENTS[1],
      owner: DEFAULT_INSTRUMENTS[1].owner,
      officer: { name: 'Inspector Suresh Rao', organization: 'Legal Metrology Office, Zone 1', state: 'Telangana' },
      verification: {
        standardWeightUsed: 'Class M1 500kg test block weights',
        errorObserved: '+0.5 kg at 50 Ton load',
        toleranceAllowed: '+/- 2.0 kg',
        remarks: 'Weighbridge accuracy class III verified and stamped.',
      },
    },
  ];
};

export const getStoredInstruments = () => {
  try {
    const raw = localStorage.getItem('lm_mock_instruments');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('lm_mock_instruments', JSON.stringify(DEFAULT_INSTRUMENTS));
  return DEFAULT_INSTRUMENTS;
};

export const saveInstrument = (data) => {
  const instruments = getStoredInstruments();
  let insData = {};

  if (data instanceof FormData) {
    data.forEach((val, key) => {
      if (typeof val === 'string') insData[key] = val;
    });
  } else if (typeof data === 'object' && data !== null) {
    insData = { ...data };
  }

  const count = instruments.length + 1;
  const newId = 'ins-' + Date.now();
  const instrumentId = `INS-${1000 + count}`;

  const newInstrument = {
    id: newId,
    instrumentId: instrumentId,
    name: insData.name || `${insData.type || 'Weighing Scale'} - Commercial`,
    type: insData.type || 'Weighing Scale',
    manufacturer: insData.manufacturer || 'Standard Mfr Ltd',
    model: insData.model || 'STD-2026',
    serialNumber: insData.serialNumber || `SN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    capacity: insData.capacity || '30 kg',
    accuracyClass: insData.accuracyClass || 'Class III',
    maxCapacity: insData.maxCapacity || insData.capacity || '30 kg',
    minCapacity: insData.minCapacity || '100 grams',
    location: insData.location || 'Commercial Outlet, Jubilee Hills, Hyderabad',
    state: insData.state || 'Telangana',
    district: insData.district || 'Hyderabad',
    purchaseDate: insData.purchaseDate || new Date().toISOString().split('T')[0],
    lastVerificationDate: null,
    expiryDate: null,
    status: 'PENDING',
    ownerId: 'demo-biz-id',
    owner: {
      id: 'demo-biz-id',
      name: 'Apex Retail Stores Pvt Ltd',
      organization: 'Apex Retail & Supermarkets',
      email: 'business@demo.com',
      phone: '+91 98765 00004',
      address: insData.location || 'Plot 45, Jubilee Hills Checkpost, Hyderabad',
    },
    certificates: [],
    applications: [],
    createdAt: new Date().toISOString(),
  };

  instruments.unshift(newInstrument);
  localStorage.setItem('lm_mock_instruments', JSON.stringify(instruments));
  return newInstrument;
};

export const getInstrumentById = (id) => {
  const instruments = getStoredInstruments();
  const certs = getStoredCertificatesSync();
  const ins = instruments.find((i) => i.id === id || i.instrumentId === id) || instruments[0] || null;
  if (ins) {
    const matchedCerts = certs.filter((c) => c.instrument?.id === ins.id || c.instrument?.instrumentId === ins.instrumentId);
    return { ...ins, certificates: matchedCerts.length > 0 ? matchedCerts : (certs[0] ? [certs[0]] : []) };
  }
  return null;
};

export const getStoredApplications = () => {
  try {
    const raw = localStorage.getItem('lm_mock_applications');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('lm_mock_applications', JSON.stringify(DEFAULT_APPLICATIONS));
  return DEFAULT_APPLICATIONS;
};

export const saveApplication = (data) => {
  const apps = getStoredApplications();
  const instruments = getStoredInstruments();
  const count = apps.length + 1;
  const appId = `LM-2026-${String(10000 + count).padStart(6, '0')}`;
  const targetIns = instruments.find((i) => i.id === data.instrumentId) || instruments[0];

  const newApp = {
    id: 'app-' + Date.now(),
    applicationId: appId,
    status: 'SUBMITTED',
    verificationType: data.verificationType || 'PERIODIC',
    preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
    preferredTime: data.preferredTime || '10:00 AM',
    location: data.location || targetIns.location,
    notes: data.notes || 'Verification requested under Legal Metrology Rules, 2011.',
    createdAt: new Date().toISOString(),
    instrumentId: targetIns.id,
    instrument: targetIns,
    applicant: targetIns.owner,
    assignedTo: null,
    schedules: [],
  };

  apps.unshift(newApp);
  localStorage.setItem('lm_mock_applications', JSON.stringify(apps));
  return newApp;
};

export const getStoredCertificatesSync = () => {
  try {
    const raw = localStorage.getItem('lm_mock_certificates');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return cachedCertificates || [];
};

export const getStoredCertificates = async () => {
  const existing = getStoredCertificatesSync();
  if (existing.length > 0 && existing[0].qrCodeData) return existing;

  const initial = await createInitialCertificates();
  cachedCertificates = initial;
  localStorage.setItem('lm_mock_certificates', JSON.stringify(initial));
  return initial;
};

export const getDashboardStats = () => {
  const instruments = getStoredInstruments();
  const applications = getStoredApplications();
  const certificates = getStoredCertificatesSync();

  return {
    summary: {
      totalInstruments: instruments.length,
      verifiedCount: instruments.filter((i) => i.status === 'VERIFIED').length,
      expiringCount: instruments.filter((i) => i.status === 'EXPIRING_SOON').length,
      expiredCount: instruments.filter((i) => i.status === 'EXPIRED').length,
      pendingVerification: applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'SCHEDULED').length,
      activeCertificates: certificates.length > 0 ? certificates.length : 2,
      totalInspections: 42,
      todaySchedules: 3,
      complianceRate: 94,
    },
    appStatusBreakdown: [
      { name: 'Verified', count: 12 },
      { name: 'Submitted', count: 4 },
      { name: 'Scheduled', count: 3 },
      { name: 'Under Review', count: 2 },
    ],
    recentApplications: applications.slice(0, 5),
    queue: applications.slice(0, 5),
    charts: {
      monthlyVerifications: [
        { month: 'Apr', count: 24 },
        { month: 'May', count: 38 },
        { month: 'Jun', count: 45 },
        { month: 'Jul', count: 52 },
        { month: 'Aug', count: 68 },
        { month: 'Sep', count: 81 },
      ],
    },
    recentVerifications: certificates.slice(0, 5),
  };
};

export const getNotifications = () => {
  return [
    {
      id: 'notif-1',
      title: 'Verification Stamping Due',
      message: 'Weighbridge INS-1002 is due for periodic annual verification within 15 days.',
      type: 'EXPIRY_WARNING',
      read: false,
      createdAt: '2026-09-03T08:00:00.000Z',
    },
    {
      id: 'notif-2',
      title: 'Inspector Visit Scheduled',
      message: 'Inspector Suresh Rao will visit for inspection of INS-1001 on 12 Sep 2026, 10:30 AM.',
      type: 'SCHEDULE',
      read: false,
      createdAt: '2026-09-02T11:00:00.000Z',
    },
  ];
};

export const handleMockGet = async (endpoint) => {
  const url = endpoint.split('?')[0];

  if (url === '/instruments') {
    return getStoredInstruments();
  }
  if (url.startsWith('/instruments/')) {
    const id = url.replace('/instruments/', '');
    return getInstrumentById(id);
  }
  if (url === '/applications') {
    return getStoredApplications();
  }
  if (url.startsWith('/applications/')) {
    const id = url.replace('/applications/', '');
    const apps = getStoredApplications();
    return apps.find((a) => a.id === id || a.applicationId === id) || apps[0];
  }
  if (url === '/certificates') {
    return await getStoredCertificates();
  }
  if (url.startsWith('/certificates/verify/')) {
    const certNumber = decodeURIComponent(url.replace('/certificates/verify/', ''));
    const certs = await getStoredCertificates();
    const match = certs.find((c) => c.certificateNumber.toLowerCase() === certNumber.toLowerCase());
    return match || certs[0];
  }
  if (url === '/dashboard/stats') {
    return getDashboardStats();
  }
  if (url === '/notifications') {
    return getNotifications();
  }
  if (url === '/audit-logs') {
    return [
      { id: 'log-1', action: 'INSTRUMENT_CREATE', entity: 'Instrument', details: 'Added new weighing balance INS-1001 to portal', createdAt: '2026-09-04T12:00:00.000Z', userName: 'Apex Retail' },
      { id: 'log-2', action: 'VERIFICATION_SCHEDULE', entity: 'Application', details: 'Admin assigned LM-2026-010001 to Inspector Suresh Rao', createdAt: '2026-09-03T10:00:00.000Z', userName: 'Rajesham Sharma (Admin)' },
      { id: 'log-3', action: 'CERTIFICATE_ISSUE', entity: 'Certificate', details: 'Issued digital certificate CERT-LM-2025-8821 with QR seal', createdAt: '2026-09-02T16:45:00.000Z', userName: 'Inspector Suresh Rao (LMO)' },
      { id: 'log-4', action: 'USER_LOGIN', entity: 'User', details: 'User logged in via demo evaluator role', createdAt: '2026-09-05T01:30:00.000Z', userName: 'Admin' },
    ];
  }
  if (url.startsWith('/users')) {
    const users = DEFAULT_USERS;
    if (endpoint.includes('/officers')) {
      return users.filter((u) => u.role === 'LMO');
    }
    const roleParam = new URLSearchParams(endpoint.split('?')[1] || '').get('role');
    if (roleParam) {
      return users.filter((u) => u.role === roleParam);
    }
    return users;
  }
  return null;
};

export const handleMockPost = async (endpoint, body) => {
  const url = endpoint.split('?')[0];

  if (url === '/instruments') {
    return saveInstrument(body);
  }
  if (url === '/applications') {
    return saveApplication(body);
  }

  // Admin Scheduling application
  if (url.includes('/schedule')) {
    const appId = url.split('/')[2];
    const apps = getStoredApplications();
    const appIndex = apps.findIndex((a) => a.id === appId || a.applicationId === appId);
    const officers = DEFAULT_USERS.filter((u) => u.role === 'LMO');
    const selectedOfficer = officers.find((o) => o.id === body.officerId) || officers[0];

    if (appIndex !== -1) {
      apps[appIndex].status = 'SCHEDULED';
      apps[appIndex].assignedTo = selectedOfficer;
      apps[appIndex].schedules = [
        {
          id: 'sch-' + Date.now(),
          scheduledDate: body.scheduledDate,
          scheduledTime: body.scheduledTime || '11:00 AM',
          remarks: body.remarks || 'Official field inspection assigned.',
          officer: selectedOfficer,
        },
      ];
      localStorage.setItem('lm_mock_applications', JSON.stringify(apps));
    }
    return { message: 'Verification scheduled successfully.', application: apps[appIndex] };
  }

  // LMO Complete Field Verification
  if (url.includes('/complete')) {
    const appId = url.split('/')[2];
    const apps = getStoredApplications();
    const app = apps.find((a) => a.id === appId || a.applicationId === appId) || apps[0];
    const certNumber = `CERT-LM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrData = await generateQR(`https://legalmetrology.gov.in/verify/${certNumber}`);

    const newCertificate = {
      id: 'cert-' + Date.now(),
      certificateNumber: certNumber,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: '2027-09-15',
      status: 'ACTIVE',
      qrCodeData: qrData,
      issuingAuthority: 'Department of Legal Metrology, Government of Telangana',
      instrument: app.instrument || DEFAULT_INSTRUMENTS[0],
      owner: app.applicant || DEFAULT_INSTRUMENTS[0].owner,
      officer: app.assignedTo || { name: 'Inspector Suresh Rao', organization: 'Legal Metrology Office, Zone 1', state: 'Telangana' },
      verification: {
        standardWeightUsed: '20 kg Class F1 standard weights',
        errorObserved: '+0.01 grams',
        toleranceAllowed: '+/- 0.05 grams',
        remarks: body.observations || 'All 7 verification checkpoints tested under Legal Metrology Rules, 2011. Unit meets MPE tolerance.',
      },
    };

    const certs = await getStoredCertificates();
    certs.unshift(newCertificate);
    localStorage.setItem('lm_mock_certificates', JSON.stringify(certs));

    // Update application status
    if (app) {
      app.status = body.result === 'PASS' ? 'VERIFIED' : 'FAILED';
      localStorage.setItem('lm_mock_applications', JSON.stringify(apps));
    }

    return {
      message: 'Field verification completed and digital certificate issued.',
      certificate: newCertificate,
    };
  }

  return null;
};
