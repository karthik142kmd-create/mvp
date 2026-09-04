// Mock storage for static deployments (Netlify) when backend server is offline

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
    certificates: [
      {
        id: 'cert-1',
        certificateNumber: 'CERT-LM-2025-8821',
        issueDate: '2025-09-15',
        validUntil: '2026-09-15',
        status: 'ACTIVE',
      },
    ],
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
    certificates: [
      {
        id: 'cert-2',
        certificateNumber: 'CERT-LM-2025-7732',
        issueDate: '2025-09-20',
        validUntil: '2026-09-20',
        status: 'EXPIRING_SOON',
      },
    ],
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
    notes: 'Periodic verification and stamping under Legal Metrology Rules, 2011.',
    createdAt: '2026-09-01T10:00:00.000Z',
    instrumentId: 'ins-1',
    instrument: DEFAULT_INSTRUMENTS[0],
    applicant: DEFAULT_INSTRUMENTS[0].owner,
    assignedTo: { name: 'Inspector Suresh Rao', role: 'LMO' },
  },
  {
    id: 'app-2',
    applicationId: 'LM-2026-010002',
    status: 'SUBMITTED',
    verificationType: 'INITIAL',
    preferredDate: '2026-09-15',
    preferredTime: '02:00 PM',
    location: 'Warehouse 4, Patancheru Industrial Area, Hyderabad',
    notes: 'New weighing scale stamping required prior to commercial retail usage.',
    createdAt: '2026-09-02T14:30:00.000Z',
    instrumentId: 'ins-2',
    instrument: DEFAULT_INSTRUMENTS[1],
    applicant: DEFAULT_INSTRUMENTS[1].owner,
    assignedTo: null,
  },
];

const DEFAULT_CERTIFICATES = [
  {
    id: 'cert-1',
    certificateNumber: 'CERT-LM-2025-8821',
    issueDate: '2025-09-15',
    validUntil: '2026-09-15',
    status: 'ACTIVE',
    instrument: DEFAULT_INSTRUMENTS[0],
    owner: DEFAULT_INSTRUMENTS[0].owner,
    officer: { name: 'Inspector Suresh Rao' },
    verification: {
      standardWeightUsed: '20 kg Class F1 standard weights',
      errorObserved: '+0.02 grams',
      toleranceAllowed: '+/- 0.05 grams',
      remarks: 'All tolerance checks within statutory limits under Rules 2011.',
    },
  },
];

export const getStoredInstruments = () => {
  try {
    const raw = localStorage.getItem('lm_mock_instruments');
    if (raw) return JSON.parse(raw);
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
    name: insData.name || `${insData.type || 'Instrument'} - Commercial`,
    type: insData.type || 'Weighing Scale',
    manufacturer: insData.manufacturer || 'Standard Mfr Ltd',
    model: insData.model || 'STD-2026',
    serialNumber: insData.serialNumber || `SN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    capacity: insData.capacity || '30 kg',
    accuracyClass: insData.accuracyClass || 'Class III',
    maxCapacity: insData.maxCapacity || insData.capacity || '30 kg',
    minCapacity: insData.minCapacity || '100 grams',
    location: insData.location || 'Commercial Outlet, Hyderabad',
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
  return instruments.find((ins) => ins.id === id || ins.instrumentId === id) || instruments[0] || null;
};

export const getStoredApplications = () => {
  try {
    const raw = localStorage.getItem('lm_mock_applications');
    if (raw) return JSON.parse(raw);
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
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    instrumentId: targetIns.id,
    instrument: targetIns,
    applicant: targetIns.owner,
    assignedTo: null,
  };

  apps.unshift(newApp);
  localStorage.setItem('lm_mock_applications', JSON.stringify(apps));
  return newApp;
};

export const getStoredCertificates = () => {
  try {
    const raw = localStorage.getItem('lm_mock_certificates');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('lm_mock_certificates', JSON.stringify(DEFAULT_CERTIFICATES));
  return DEFAULT_CERTIFICATES;
};

export const getDashboardStats = () => {
  const instruments = getStoredInstruments();
  const applications = getStoredApplications();
  const certificates = getStoredCertificates();

  return {
    summary: {
      totalInstruments: instruments.length,
      verifiedCount: instruments.filter((i) => i.status === 'VERIFIED').length,
      expiringCount: instruments.filter((i) => i.status === 'EXPIRING_SOON').length,
      expiredCount: instruments.filter((i) => i.status === 'EXPIRED').length,
      pendingVerification: applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'SCHEDULED').length,
      activeCertificates: certificates.length,
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

export const handleMockGet = (endpoint) => {
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
    return getStoredCertificates();
  }
  if (url.startsWith('/certificates/verify/')) {
    const certs = getStoredCertificates();
    return certs[0];
  }
  if (url === '/dashboard/stats') {
    return getDashboardStats();
  }
  if (url === '/notifications') {
    return getNotifications();
  }
  if (url === '/audit-logs') {
    return [
      { id: 'log-1', action: 'INSTRUMENT_CREATE', entity: 'Instrument', details: 'Added new instrument to portal', createdAt: '2026-09-04T12:00:00.000Z', userName: 'Apex Retail' },
      { id: 'log-2', action: 'VERIFICATION_SCHEDULE', entity: 'Application', details: 'Inspection date confirmed', createdAt: '2026-09-03T10:00:00.000Z', userName: 'Admin' },
    ];
  }
  if (url.startsWith('/users')) {
    return [
      { id: 'u-1', name: 'Inspector Suresh Rao', role: 'LMO', district: 'Hyderabad' },
      { id: 'u-2', name: 'Officer K. Venkat', role: 'LMO', district: 'Warangal' },
    ];
  }
  return null;
};

export const handleMockPost = (endpoint, body) => {
  const url = endpoint.split('?')[0];

  if (url === '/instruments') {
    return saveInstrument(body);
  }
  if (url === '/applications') {
    return saveApplication(body);
  }
  if (url.includes('/schedule')) {
    return { message: 'Verification scheduled successfully.' };
  }
  if (url.includes('/complete')) {
    return {
      message: 'Field verification completed and digital certificate issued.',
      certificateNumber: `CERT-LM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }
  return null;
};
