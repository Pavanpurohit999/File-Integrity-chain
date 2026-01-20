import { QRCodeSVG } from "qrcode.react";
import { Download, CheckCircle2, AlertTriangle, Clock, ShieldCheck, FileText } from "lucide-react";
import { generateCertificate } from "./certificate";

interface VerificationResultProps {
  valid: boolean;
  hash: string;
  issuer: string;
  purpose: string;
  issuedAt: number;
  expiresAt: number;
}

export default function VerificationResult({
  valid,
  hash,
  issuer,
  purpose,
  issuedAt,
  expiresAt,
}: VerificationResultProps) {
  const now = Math.floor(Date.now() / 1000);
  const isExpired = expiresAt !== 0 && now > expiresAt;

  const qrData = JSON.stringify({
    hash,
    issuer,
    purpose,
    issuedAt,
    expiresAt,
    valid,
  });

  const handleDownload = () => {
    generateCertificate({
      hash,
      issuer,
      purpose,
      issuedAt,
      expiresAt,
    });
  };

  if (!valid) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex flex-col items-center gap-4 text-center animate-fade-up">
        <div className="p-4 bg-red-500/10 rounded-full">
          <AlertTriangle size={48} />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">Verification Failed</h3>
          <p className="text-sm text-red-300/80">
            This file is not registered or has been modified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* STATUS BANNER */}
      <div
        className={`p-4 rounded-xl border flex items-center gap-4 ${
          isExpired
            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
            : "bg-green-500/10 border-green-500/20 text-green-400"
        }`}
      >
        <div
          className={`p-2 rounded-full ${
            isExpired ? "bg-amber-500/10" : "bg-green-500/10"
          }`}
        >
          {isExpired ? <Clock size={24} /> : <CheckCircle2 size={24} />}
        </div>
        <div>
          <h3 className="font-bold text-lg">
            {isExpired ? "Certificate Expired" : "Valid Certificate"}
          </h3>
          <p className="text-xs opacity-80">
            {isExpired
              ? "This document was valid but has expired."
              : "The integrity of this document is verified."}
          </p>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 space-y-3">
             <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2">
                <ShieldCheck size={14} /> Issuer Details
             </div>
             <div>
                <span className="text-xs text-zinc-500 block">Issuer Address</span>
                <code className="text-xs text-zinc-300 bg-zinc-950 px-2 py-1 rounded block mt-1 break-all border border-white/5">
                  {issuer}
                </code>
             </div>
             <div>
                <span className="text-xs text-zinc-500 block">Registered Purpose</span>
                <span className="text-sm text-zinc-200 block mt-1 font-medium">{purpose}</span>
             </div>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 space-y-3">
             <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2">
                <Clock size={14} /> Timeline
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="text-xs text-zinc-500 block">Issued</span>
                  <span className="text-sm text-zinc-300 block mt-1">
                    {new Date(issuedAt * 1000).toLocaleDateString()}
                  </span>
               </div>
               <div>
                  <span className="text-xs text-zinc-500 block">Expires</span>
                  <span className={`text-sm block mt-1 ${isExpired ? "text-amber-400" : "text-zinc-300"}`}>
                    {expiresAt === 0 ? "Never" : new Date(expiresAt * 1000).toLocaleDateString()}
                  </span>
               </div>
             </div>
          </div>
        </div>

        {/* QR CODE CARD */}
        <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-4 text-center shadow-xl shadow-indigo-500/5">
          <div className="bg-white p-2 rounded-lg">
             <QRCodeSVG value={qrData} size={140} level="M" />
          </div>
          <div className="space-y-1">
            <p className="text-zinc-900 font-bold text-sm">Scan to Verify</p>
            <p className="text-zinc-500 text-xs px-4">
              Use any QR scanner to check the digital signature of this document.
            </p>
          </div>
        </div>
      </div>

      {/* DOWNLOAD ACTIONS */}
      <button
        onClick={handleDownload}
        className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98]"
      >
        <FileText size={18} />
        Download Verified Certificate
        <Download size={18} className="opacity-70" />
      </button>

       <div className="text-center">
        <p className="text-[10px] text-zinc-600 font-mono break-all max-w-md mx-auto">
          HASH: {hash}
        </p>
      </div>
    </div>
  );
}