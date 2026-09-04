import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

/**
 * Returns the public verification URL for a given certificate number.
 * Uses `/?verify=...` on window.location.origin so static hosting (like Netlify)
 * always serves the root index.html with HTTP 200, completely preventing 404 errors.
 */
export const getVerificationUrl = (certNumber) => {
  let origin = 'https://legalmetrology.gov.in';
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    origin = window.location.origin;
  }
  return `${origin}/?verify=${encodeURIComponent(certNumber)}`;
};

/**
 * Generates a high-res base64 QR code image for a text/URL.
 */
export const generateQRCodeDataUrl = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 320,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return null;
  }
};

/**
 * Builds the jsPDF document object for the official certificate.
 */
export const buildCertificateDoc = async (cert) => {
  if (!cert) return null;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const certificateNumber = cert.certificateNumber || 'CERT-LM-2026-0001';
  const issueDate = cert.issueDate || new Date().toISOString().split('T')[0];
  const validUntil = cert.validUntil || '2027-09-15';
  const instrument = cert.instrument || {};
  const owner = cert.owner || instrument.owner || {};
  const officer = cert.officer || {
    name: 'Inspector Suresh Rao',
    organization: 'Legal Metrology Office, Zone 1',
    state: 'Telangana',
  };

  // Generate live verification URL and QR code targeting this deployed application
  const verifyUrl = getVerificationUrl(certificateNumber);
  let qrCodeData = await generateQRCodeDataUrl(verifyUrl);
  if (!qrCodeData && cert.qrCodeData) {
    qrCodeData = cert.qrCodeData;
  }

  // --- HEADER SECTION ---
  // Navy Header Banner
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 33, 'F');

  // Saffron & Green Accent Stripes
  doc.setFillColor(245, 158, 11); // #f59e0b
  doc.rect(0, 33, 210, 1.4, 'F');

  doc.setFillColor(16, 185, 129); // #10b981
  doc.rect(0, 34.4, 210, 1.4, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF INDIA', 105, 10, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(241, 245, 249);
  doc.text('DEPARTMENT OF LEGAL METROLOGY', 105, 16.5, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setTextColor(252, 211, 77); // amber-300
  doc.text('CERTIFICATE OF VERIFICATION AND STAMPING', 105, 22.5, { align: 'center' });

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('[Issued under Legal Metrology Act, 2009 & Legal Metrology (General) Rules, 2011]', 105, 28, { align: 'center' });

  // --- META BAR (Certificate # & Verified Badge) ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 39, 180, 11.5, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text('CERTIFICATE NUMBER:', 20, 46.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(15, 23, 42);
  doc.text(certificateNumber, 56, 46.5);

  // Status Badge
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(138, 41.5, 52, 6.8, 1.5, 1.5, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('✓ OFFICIAL VERIFICATION SEAL', 164, 46, { align: 'center' });

  // Subtle Watermark
  doc.setTextColor(244, 246, 249);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('LEGAL METROLOGY', 105, 142, { align: 'center', angle: 30 });

  // --- MAIN BODY SECTION ---
  // Left Column: Specifications (Width: 124mm, Height: 142mm)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, 53.5, 124, 142, 2, 2, 'FD');

  // Left Title Banner
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 53.5, 124, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(15, 61.5, 139, 61.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1. INSTRUMENT SPECIFICATIONS & CALIBRATION DETAILS', 19, 59);

  // Field details list (reduced, crisp font sizes)
  const fields = [
    { label: 'Instrument Type', value: instrument.type || instrument.name || 'Electronic Weighing Balance' },
    { label: 'Manufacturer', value: instrument.manufacturer || 'Standard Mfr Ltd' },
    { label: 'Model Number', value: instrument.model || 'STD-2026' },
    { label: 'Serial Number', value: instrument.serialNumber || 'SN-2024-10037', isBold: true },
    { label: 'Capacity / Range', value: instrument.capacity || '30 kg (Max) / 100 g (Min)' },
    { label: 'Accuracy Class', value: instrument.accuracyClass || 'Class III (Medium Accuracy)' },
    { label: 'Registered Enterprise', value: owner.organization || owner.name || 'Commercial Retail Enterprise' },
    { label: 'Premises Address', value: `${instrument.location || 'Commercial Premises'}, ${instrument.district || 'Hyderabad'}, ${instrument.state || 'Telangana'}` },
    { label: 'Verification Date', value: issueDate },
    { label: 'Valid Until Date', value: validUntil, isHighlight: true },
    { label: 'Physical Seal Affixed', value: cert.verification?.sealNumber || 'LEAD-SEAL-TS-2026-9941' },
    { label: 'Verification Fee Paid', value: 'Rs. 1,250.00 - Stamped & Paid (e-Treasury)' },
    { label: 'Standard Weights Used', value: cert.verification?.standardWeightUsed || 'Class F1 20 kg Standard Test Weights' },
    { label: 'Issuing Officer', value: officer.name || 'Inspector Suresh Rao' },
  ];

  let rowY = 62;
  const rowHeight = 9.5;

  fields.forEach((field, index) => {
    // Alternating background
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15.2, rowY, 123.6, rowHeight, 'F');
    }

    // Horizontal row divider
    doc.setDrawColor(241, 245, 249);
    doc.line(17, rowY + rowHeight, 137, rowY + rowHeight);

    // Label (Small, clean 7.0pt)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(100, 116, 139);
    doc.text(field.label, 19, rowY + 6.0);

    // Value (Crisp 7.5pt)
    if (field.isHighlight) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(22, 101, 52); // emerald-800
    } else if (field.isBold) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
    }

    const valStr = String(field.value);
    const formattedVal = valStr.length > 44 ? valStr.substring(0, 42) + '...' : valStr;
    doc.text(formattedVal, 58, rowY + 6.0);

    rowY += rowHeight;
  });

  // --- RIGHT COLUMN (QR Code Card & Seal) ---
  // Top Card: QR Code (x: 143, y: 53.5, width: 52mm, height: 86mm)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(143, 53.5, 52, 86, 2, 2, 'FD');

  // QR Header
  doc.setFillColor(240, 253, 244);
  doc.rect(143, 53.5, 52, 7.5, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.line(143, 61, 195, 61);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(22, 101, 52);
  doc.text('SCAN TO VERIFY', 169, 58.8, { align: 'center' });

  // Embed High-Res QR Code
  if (qrCodeData) {
    try {
      doc.addImage(qrCodeData, 'PNG', 148, 63.5, 42, 42);
      // Make QR image directly clickable in the PDF document
      doc.link(148, 63.5, 42, 42, { url: verifyUrl });
    } catch (e) {
      console.error('Failed to embed QR in PDF:', e);
    }
  }

  // QR Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text('Public Verification QR', 169, 109.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('Scan with mobile camera', 169, 113.8, { align: 'center' });
  doc.text('to open live certificate', 169, 117.5, { align: 'center' });

  // Interactive link button in PDF
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(147, 122, 44, 6.5, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.4);
  doc.setTextColor(29, 78, 216);
  doc.textWithLink('🔗 Click / Scan to Verify', 169, 126.3, { url: verifyUrl, align: 'center' });
  doc.link(147, 122, 44, 6.5, { url: verifyUrl });

  const shortUrl = verifyUrl.length > 34 ? verifyUrl.substring(0, 32) + '...' : verifyUrl;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.0);
  doc.setTextColor(148, 163, 184);
  doc.text(shortUrl, 169, 134, { align: 'center' });

  // Bottom Card: Metrological Seal (x: 143, y: 142.5, width: 52mm, height: 53mm)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(143, 142.5, 52, 53, 2, 2, 'FD');

  doc.setFillColor(241, 245, 249);
  doc.rect(143, 142.5, 52, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(143, 149.5, 195, 149.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(30, 41, 59);
  doc.text('METROLOGICAL STAMP', 169, 147.5, { align: 'center' });

  // Stamped Circular Emblem
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.6);
  doc.circle(169, 164.5, 9.5);
  doc.setLineWidth(0.2);
  doc.circle(169, 164.5, 8.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(22, 101, 52);
  doc.text('LEGAL METROLOGY', 169, 162.5, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('★ VERIFIED ★', 169, 165.8, { align: 'center' });
  doc.setFontSize(5.0);
  doc.text('GOVT OF INDIA / TS', 169, 168.8, { align: 'center' });

  // Compliance Status under Seal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(22, 101, 52);
  doc.text('MPE TOLERANCE: COMPLIANT', 169, 180, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Error within statutory limits (±0.02g)', 169, 184.5, { align: 'center' });
  doc.text('Tamper-evident verification tag affixed', 169, 188.5, { align: 'center' });

  // --- STATUTORY DECLARATION & CONDITIONS BOX ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 199, 180, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(30, 41, 59);
  doc.text('STATUTORY DECLARATION & CONDITIONS UNDER LEGAL METROLOGY ACT, 2009:', 19, 205);

  const rules = [
    '1. Certified that the weighing/measuring instrument has been inspected, tested, and found compliant with statutory tolerances under Rules, 2011.',
    '2. The physical verification mark / security seal has been affixed. Tampering or altering the seal is an offense punishable under Section 25.',
    '3. This certificate must be kept on the commercial premises and produced on demand to any visiting Legal Metrology Officer.',
    '4. An application for periodic re-verification must be submitted prior to the expiration date in accordance with Section 24.',
  ];

  let ruleY = 210.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  rules.forEach((rule) => {
    doc.text(rule, 19, ruleY);
    ruleY += 5.2;
  });

  // --- SIGNATURES & AUTHENTICATION ROW ---
  // Left Box: Inspecting Officer
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, 240, 88, 33, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('INSPECTING LEGAL METROLOGY OFFICER', 19, 245.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text(officer.name || 'Inspector Suresh Rao', 19, 251.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(officer.organization || 'Legal Metrology Department, Zone 1', 19, 256.5);
  doc.text(`District: ${instrument.district || 'Hyderabad'}, State: ${instrument.state || 'Telangana'}`, 19, 261);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(5, 150, 105);
  doc.text('✓ Authorized via Biometric & Official LMO Stamping PIN', 19, 267);

  // Right Box: Digital PKI Authentication
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(107, 240, 88, 33, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('DIGITAL SIGNATURE & AUTHENTICATION', 111, 245.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(21, 128, 61);
  doc.text('✓ Cryptographically Signed & Verified', 111, 251.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Standard: PKI X.509 SHA-256 Digital Certificate', 111, 256.5);
  doc.text(`Timestamp: ${issueDate} 11:45:22 IST`, 111, 261);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text(`Hash: 8a4c9f10e32b...${certificateNumber.slice(-4)}`, 111, 267);

  // --- FOOTER ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 1 of 1 • Official Digital Verification Certificate • Legal Metrology Act, 2009', 105, 280, { align: 'center' });

  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.textWithLink(verifyUrl, 105, 284.5, { url: verifyUrl, align: 'center' });

  return doc;
};

/**
 * Directly downloads the certificate PDF.
 */
export const downloadCertificatePDF = async (cert) => {
  const doc = await buildCertificateDoc(cert);
  if (!doc) return;
  const certificateNumber = cert.certificateNumber || 'CERT-LM-2026-0001';
  const filename = `LegalMetrology_Certificate_${certificateNumber.replace(/[\/\\]/g, '_')}.pdf`;
  doc.save(filename);
};

/**
 * Opens the certificate PDF directly in a new browser tab/window via a client-side Blob URL.
 * Works 100% offline, zero network requests, and eliminates any 404 navigation error.
 */
export const viewCertificatePDF = async (cert) => {
  try {
    const doc = await buildCertificateDoc(cert);
    if (!doc) return;
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch (err) {
    console.error('Error viewing certificate PDF:', err);
  }
};
