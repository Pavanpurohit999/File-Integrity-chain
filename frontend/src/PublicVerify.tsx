import { useState } from "react";
import { ethers } from "ethers";
import { FileSearch, UploadCloud, CheckCircle2 } from "lucide-react";
import { hashFile } from "./hashFile";
import { getContract } from "./contract";
import VerificationResult from "./VerificationResult";

export default function PublicVerify() {
  const [file, setFile] = useState<File | null>(null);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function verify() {
    if (!file) return alert("Select a file first");
    if (!purpose) return alert("Purpose is required");

    try {
      setLoading(true);
      setResult(null);

      const hash = await hashFile(file, purpose);
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = getContract(provider);

      const [valid, issuer, purposeRes, issuedAt, expiresAt] =
        await contract.verifyFile(`0x${hash}`);

      setResult({
        valid,
        hash,
        issuer,
        purpose: purposeRes,
        issuedAt: Number(issuedAt),
        expiresAt: Number(expiresAt),
      });
    } catch (err) {
      console.error(err);
      setResult({ valid: false, hash: "", issuer: "", purpose: "", issuedAt: 0, expiresAt: 0 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* LEFT: INPUT */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <FileSearch className="text-zinc-400" size={20} />
            Public Verification
          </h2>
          <p className="text-sm text-zinc-500">
            Verify file integrity without connecting a wallet. Files are hashed locally and checked against the blockchain.
          </p>
        </div>

        <div className="space-y-4">
          {/* File Drop Area */}
          <div className="relative group">
            <input
              type="file"
              id="public-file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className={`
               border border-dashed rounded-lg p-6 text-center transition-all duration-200
               ${file
                ? "border-indigo-500/30 bg-indigo-500/5"
                : "border-zinc-700 bg-zinc-900/50 group-hover:border-zinc-500 group-hover:bg-zinc-800/50"
              }
             `}>
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-full ${file ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800 text-zinc-400"}`}>
                  {file ? <CheckCircle2 size={24} /> : <UploadCloud size={24} />}
                </div>
                <div className="text-sm">
                  {file ? (
                    <span className="font-medium text-indigo-400">{file.name}</span>
                  ) : (
                    <span className="text-zinc-400">Click to upload document</span>
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
              placeholder="Enter original purpose to verify"
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <button
            onClick={verify}
            disabled={loading || !file}
            className={`
              w-full py-3.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all
              ${loading || !file
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-white text-zinc-950 hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
              }
            `}
          >
            {loading ? "Verifying..." : "Verify Document"}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULT */}
      <div className="relative">
        {result ? (
          <VerificationResult
            valid={result.valid}
            hash={result.hash}
            issuer={result.issuer}
            purpose={result.purpose}
            issuedAt={result.issuedAt}
            expiresAt={result.expiresAt}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
            <div className="text-center text-zinc-700 space-y-2 opacity-50">
              <FileSearch size={48} className="mx-auto" />
              <p className="text-sm">Ready to verify</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
