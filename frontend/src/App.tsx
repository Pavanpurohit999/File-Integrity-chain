import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  ChevronRight,
  UploadCloud,
} from "lucide-react";

import { hashFile } from "./hashFile";
import { getContract } from "./contract";
import PublicVerify from "./PublicVerify";
import VerificationResult from "./VerificationResult";

type Tab = "register" | "verify" | "public";

export default function App() {
  const [tab, setTab] = useState<Tab>("register");
  const [file, setFile] = useState<File | null>(null);
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  // Default to true for Drizzle aesthetic
  const dark = true;

  // Manage dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  /* ---------------- REGISTER ---------------- */
  async function registerFile() {
    if (!file) return alert("Select a file first");
    if (!purpose) return alert("Purpose is required");

    try {
      setLoading(true);
      setStatus("Hashing file locally…");

      // Pass purpose to hash
      const hash = await hashFile(file, purpose);

      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days default
      const contract = getContract(signer);

      setStatus("Submitting transaction to blockchain…");
      const tx = await contract.registerFile(`0x${hash}`, purpose, expiresAt);
      await tx.wait();

      setStatus("✅ File registered successfully");
    } catch (e) {
      console.error(e);
      setStatus("❌ Registration failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- VERIFY ---------------- */

  async function verifyFile() {
    if (!file) return alert("Select a file first");
    if (!purpose) return alert("Purpose is required for verification");

    try {
      setLoading(true);
      setStatus("Hashing file locally…");
      setVerificationResult(null);

      // Pass purpose to hash
      const hash = await hashFile(file, purpose);

      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = getContract(provider);

      setStatus("Verifying on blockchain…");
      const [valid, issuer, purposeRes, issuedAt, expiresAt] =
        await contract.verifyFile(`0x${hash}`);

      setVerificationResult({
        valid,
        hash,
        issuer,
        purpose: purposeRes,
        issuedAt: Number(issuedAt),
        expiresAt: Number(expiresAt),
      });
      setStatus("");
    } catch (e) {
      console.error(e);
      setStatus("❌ Verification failed");
      setVerificationResult(null);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
              <ShieldCheck size={18} />
            </div>
            <span>IntegrityChain</span>
          </div>

          <nav className="flex items-center gap-1 p-1 rounded-full border border-white/5 bg-white/5">
            {[
              { id: "register", label: "Register" },
              { id: "verify", label: "Verify" },
              { id: "public", label: "Public" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${tab === t.id
                    ? "bg-zinc-800 text-white shadow-sm border border-white/5"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#" className="hidden sm:flex text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">

        {/* HERO HEADER */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Blockchain Powered Security
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Immutable File <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">Verifiable Trust</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Generate cryptographic proofs for your documents and verify their integrity eternally on the blockchain.
          </p>
        </div>

        {/* APP INTERFACE */}
        <div className="w-full glass-card rounded-2xl p-1 overflow-hidden animate-fade-up" style={{ animationDelay: "100ms" }}>

          <div className="bg-zinc-950/50 rounded-xl p-8 md:p-10 min-h-[400px]">
            {tab === "public" ? (
              <PublicVerify />
            ) : (
              <div className="grid md:grid-cols-2 gap-12">

                {/* ACTION COLUMN */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {tab === "register" ? "Register New File" : "Verify Integrity"}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {tab === "register"
                        ? "Upload a document to timestamp and secure it on-chain."
                        : "Check if a file matches its original registered version."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* File Drop Area */}
                    <div className="relative group">
                      <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <div className={`
                        border border-dashed rounded-lg p-6 text-center transition-all duration-200
                        ${file
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-zinc-700 bg-zinc-900/50 group-hover:border-zinc-500 group-hover:bg-zinc-800/50"
                        }
                      `}>
                        <div className="flex flex-col items-center gap-3">
                          <div className={`p-3 rounded-full ${file ? "bg-green-500/10 text-green-400" : "bg-zinc-800 text-zinc-400"}`}>
                            {file ? <CheckCircle2 size={24} /> : <UploadCloud size={24} />}
                          </div>
                          <div className="text-sm">
                            {file ? (
                              <span className="font-medium text-green-400">{file.name}</span>
                            ) : (
                              <span className="text-zinc-400">Click to upload or drag and drop</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 ml-1">Purpose / Context</label>
                      <input
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder={tab === "register" ? "e.g. Final Semester Project" : "Enter original purpose to verify"}
                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                      />
                      {tab === "verify" && (
                        <p className="text-xs text-zinc-500 px-1">
                          Must match the purpose used during registration.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={tab === "register" ? registerFile : verifyFile}
                      disabled={loading || !file}
                      className={`
                        w-full py-3.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all
                        ${loading || !file
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : tab === "register"
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]"
                        }
                      `}
                    >
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          {tab === "register" ? "Sign & Register" : "Verify Integrity"}
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* OUTPUT COLUMN */}
                <div className="relative">
                  {verificationResult && tab === "verify" ? (
                    <VerificationResult
                      valid={verificationResult.valid}
                      hash={verificationResult.hash}
                      issuer={verificationResult.issuer}
                      purpose={verificationResult.purpose}
                      issuedAt={verificationResult.issuedAt}
                      expiresAt={verificationResult.expiresAt}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                      {/* Terminal Header */}
                      <div className="h-9 border-b border-white/5 bg-zinc-900 px-4 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                        <span className="ml-2 text-xs text-zinc-600 font-mono">output.log</span>
                      </div>

                      {/* Terminal Body */}
                      <div className="p-4 font-mono text-sm text-zinc-300 overflow-y-auto flex-1 leading-relaxed">
                        {!status && !loading && (
                          <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-2 opacity-50">
                            <FileText size={32} />
                            <p>Awaiting input...</p>
                          </div>
                        )}

                        {status && (
                          <div className="animate-fade-up">
                            <span className="text-zinc-500">$ </span>
                            <span className="whitespace-pre-wrap">{status}</span>
                            <span className="animate-pulse inline-block w-2 h-4 bg-indigo-500 ml-1 align-middle"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-8 text-zinc-600 text-sm">
        <p>© {new Date().getFullYear()} File Integrity Chain. Secure & Immutable.</p>
      </footer>
    </div>
  );
}
