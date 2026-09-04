import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export const generateQRCodeDataUrl = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 260,
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

export const downloadCertificatePDF = async (cert) => {
  if (!cert) return;

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

  // Generate QR code if not already available
  let qrCodeData = cert.qrCodeData;
  if (!qrCodeData) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://legalmetrology.gov.in';
    const verifyUrl = `${origin}/verify/${encodeURIComponent(certificateNumber)}`;
    qrCodeData = await generateQRCodeDataUrl(verifyUrl);
  }

  // Header Banner
  doc.setFillColor(15, 23, 42); // Navy Blue
  doc.rect(0, 0, 210, 35, 'F');

  doc.setFillColor(34, 197, 94); // Emerald line
  doc.rect(0, 35, 210, 3, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('GOVERNMENT OF INDIA / STATE LEGAL METROLOGY', 105, 14, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('VERIFICATION CERTIFICATE OF WEIGHING AND MEASURING INSTRUMENT', 105, 22, { align: 'center' });

  doc.setFontSize(8.5);
  doc.text('[Under Legal Metrology Act, 2009 & Legal Metrology (General) Rules, 2011]', 105, 29, { align: 'center' });

  // Certificate Status Badge
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Certificate No: ${certificateNumber}`, 15, 48);

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(145, 42, 50, 10, 2, 2, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(9.5);
  doc.text('VERIFIED & STAMPED', 170, 48.5, { align: 'center' });

  // Watermark
  doc.setTextColor(242, 244, 247);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('LEGAL METROLOGY', 105, 140, { align: 'center', angle: 30 });

  // Grid Details Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 56, 180, 140, 3, 3, 'FD');

  const fields = [
    ['Instrument Type:', instrument.type || 'Weighing Scale'],
    ['Manufacturer:', instrument.manufacturer || 'Standard Mfr Ltd'],
    ['Model Number:', instrument.model || 'STD-2026'],
    ['Serial Number:', instrument.serialNumber || 'SN-2024-10037'],
    ['Capacity / Range:', instrument.capacity || '30 kg'],
    ['Accuracy Class:', instrument.accuracyClass || 'Class III'],
    ['Owner / Organization:', owner.organization || owner.name || 'Commercial Trader'],
    ['Premises Address:', `${instrument.location || 'Commercial Outlet'}, ${instrument.district || 'Hyderabad'}, ${instrument.state || 'Telangana'}`],
    ['Date of Verification:', issueDate],
    ['Certificate Valid Until:', validUntil],
    ['Issuing Officer:', officer.name || 'Inspector Suresh Rao'],
    ['Officer Designation:', `${officer.organization || 'Legal Metrology Office'}, ${officer.state || 'Telangana'}`],
  ];

  let y = 68;
  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 22, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const valStr = String(value);
    const formatted = valStr.length > 55 ? valStr.substring(0, 52) + '...' : valStr;
    doc.text(formatted, 75, y);

    y += 9.5;
  });

  // Embed QR Code
  if (qrCodeData) {
    try {
      doc.addImage(qrCodeData, 'PNG', 148, 145, 42, 42);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('SCAN TO VERIFY', 169, 191, { align: 'center' });
    } catch (e) {
      console.error('Failed to embed QR in PDF:', e);
    }
  }

  // Statutory Notice
  doc.setDrawColor(203, 213, 225);
  doc.line(15, 215, 195, 215);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('IMPORTANT STATUTORY NOTICE:', 15, 222);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    '1. This digital verification certificate is issued under the Legal Metrology Act, 2009.\n2. Any alteration, tampering, or unauthorized duplication is a punishable offense.\n3. Re-verification application must be submitted prior to the expiration date stated above.',
    15,
    227
  );

  // Digital Signature Box
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(135, 245, 60, 25, 2, 2);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('DIGITALLY AUTHENTICATED BY', 165, 251, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94);
  doc.text('✓ Verified & Digitally Signed', 165, 257, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(officer.name || 'Inspector Suresh Rao, LMO', 165, 263, { align: 'center' });

  // Trigger browser download directly
  const filename = `LegalMetrology_Certificate_${certificateNumber.replace(/[\/\\]/g, '_')}.pdf`;
  doc.save(filename);
};
