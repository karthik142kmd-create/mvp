import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Search,
  CheckCircle2,
  FileCheck,
  QrCode,
  Calendar,
  Building2,
  UserCheck,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';

const LandingPage = () => {
  const [certInput, setCertInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const verifyParam = params.get('verify') || params.get('cert');
      if (verifyParam && verifyParam.trim()) {
        navigate(`/verify/${encodeURIComponent(verifyParam.trim())}`, { replace: true });
      }
    }
  }, [navigate]);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      navigate(`/verify/${encodeURIComponent(certInput.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-20 pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Digital Legal Metrology Act, 2009 Governance Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white">
            Digital Legal Metrology Verification & Certification
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transparent, secure, and efficient verification of weighing and measuring instruments across commercial & industrial transactions.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-sm transition-all"
            >
              Register Instrument
            </Link>
            <Link
              to="/verify"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify Certificate</span>
            </Link>
          </div>

          {/* Quick Certificate Search Input Box */}
          <div className="mt-12 max-w-xl mx-auto p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
            <form onSubmit={handleVerifySubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="Enter Certificate Number (e.g. LM/TS/2026/001001)..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 text-white placeholder-slate-400 rounded-xl text-xs font-mono border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Verify</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">How The Digital Verification Works</h2>
          <p className="text-slate-600 text-xs md:text-sm mt-2">
            Streamlined statutory compliance from instrument registration to field inspection and digital QR stamping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Instrument Registration',
              desc: 'Business owner registers weighing/measuring instrument with specifications & location.',
              icon: Building2,
              color: 'blue',
            },
            {
              step: '02',
              title: 'Verification Application',
              desc: 'Submit periodic/re-verification request with preferred inspection date & documents.',
              icon: FileCheck,
              color: 'indigo',
            },
            {
              step: '03',
              title: 'Field Inspection',
              desc: 'LMO/GATC officer conducts 7-checkpoint mobile field testing & records readings.',
              icon: UserCheck,
              color: 'purple',
            },
            {
              step: '04',
              title: 'QR Certificate Issued',
              desc: 'Pass decision generates tamper-proof digital certificate with QR code for instant public verification.',
              icon: QrCode,
              color: 'emerald',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm relative group hover:shadow-md transition-all">
                <span className="text-3xl font-black text-slate-200 absolute top-4 right-4">{item.step}</span>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Multilateral Stakeholder Roles</h2>
            <p className="text-slate-600 text-xs md:text-sm mt-2">
              Dedicated workflows and customized dashboards tailored for all regulatory actors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-4 text-xs">
                BIZ
              </div>
              <h3 className="font-bold text-slate-900 text-base">Business / Instrument Owners</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                Register scales, weighbridges & dispensers. Track verification validity, apply for re-stamping, and download certificates.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4 text-xs">
                LMO
              </div>
              <h3 className="font-bold text-slate-900 text-base">Legal Metrology Officers (LMO)</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                Mobile field verification mode, 7-point statutory checklists, tolerance measurement logging, and instant certificate issuance.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-4 text-xs">
                GATC
              </div>
              <h3 className="font-bold text-slate-900 text-base">Government Approved Test Centres</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                Third-party laboratory testing assignments, calibration reporting, and compliance verification under Section 19.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Key Features */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Statutory Authenticity</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Eliminating Fraud & Expired Stamping in Commercial Transactions
          </h2>
          <p className="text-slate-600 text-sm mt-4 leading-relaxed">
            The platform brings end-to-end transparency under the Legal Metrology (General) Rules, 2011. Every certificate features a cryptographic QR code that allows public consumers to verify scale calibration in real-time without logging in.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              'Automated 30-day & 7-day instrument expiry risk alerts',
              'Mobile-friendly field inspection checklist with evidence upload',
              'Instant PDF certificate compilation with official signatures',
              'Centralized administrative oversight and state audit logs',
            ].map((feat, idx) => (
              <li key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <h3 className="font-bold text-lg text-white mb-4">Public Certificate Verification</h3>
          <p className="text-slate-300 text-xs mb-6">
            Consumers can scan the QR code printed on any merchant scale or enter the certificate number to instantly verify authenticity.
          </p>

          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">LM/TS/2026/001001</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                ✓ VERIFIED & STAMPED
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-300">
              <p><span className="text-slate-400">Instrument:</span> Electronic Weighing Scale (30 kg)</p>
              <p><span className="text-slate-400">Owner:</span> Apex Retail Stores Pvt Ltd</p>
              <p><span className="text-slate-400">Valid Until:</span> 25 Aug 2027</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
