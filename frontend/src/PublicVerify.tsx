import { useState } from "react";
import { ethers } from "ethers";
import { ShieldCheck, FileSearch, Clock, UploadCloud, CheckCircle2, AlertTriangle } from "lucide-react";
import { hashFile } from "./hashFile";
import { getContract } from "./contract";

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
        issuer,
        purpose: purposeRes,
        issuedAt: Number(issuedAt),
        expiresAt: Number(expiresAt),
      });
    } catch (err) {
      console.error(err);
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const isExpired = result && result.expiresAt !== 0 && now > result.expiresAt;

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
         <div className="absolute inset-0 bg-zinc-900 rounded-xl border border-white/5 overflow-hidden flex flex-col">
            {/* Terminal Header */}
            <div className="h-9 border-b border-white/5 bg-zinc-900 px-4 flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
               <span className="ml-2 text-xs text-zinc-600 font-mono">verify.sh</span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm text-zinc-300 overflow-y-auto flex-1 leading-relaxed">
               {!result && !loading && (
                 <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-2 opacity-50">
                    <ShieldCheck size={32} />
                    <p>Ready to verify</p>
                 </div>
               )}

               {loading && (
                 <div className="flex items-center gap-3 animate-pulse text-zinc-400">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <span>Querying blockchain...</span>
                 </div>
               )}

               {result && !loading && (
                 <div className="space-y-4 animate-fade-up">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                       <span className="text-zinc-500">$</span>
                       <span>status check</span>
                    </div>

                    {result.valid && !isExpired && (
                       <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          <span className="font-bold">VALID SIGNATURE</span>
                       </div>
                    )}

                    {result.valid && isExpired && (
                       <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 flex items-center gap-2">
                          <Clock size={16} />
                          <span className="font-bold">EXPIRED SIGNATURE</span>
                       </div>
                    )}

                    {!result.valid && (
                       <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 flex items-center gap-2">
                          <AlertTriangle size={16} />
                          <span className="font-bold">INVALID / NOT FOUND</span>
                       </div>
                    )}

                    {result.valid && (
                       <div className="space-y-2 text-xs text-zinc-400 pt-2">
                          <div className="grid grid-cols-[80px_1fr] gap-2">
                             <span className="text-zinc-600">ISSUER</span>
                             <span className="font-mono text-zinc-300 break-all">{result.issuer}</span>
                          </div>
                          <div className="grid grid-cols-[80px_1fr] gap-2">
                             <span className="text-zinc-600">PURPOSE</span>
                             <span className="text-zinc-300">{result.purpose}</span>
                          </div>
                          <div className="grid grid-cols-[80px_1fr] gap-2">
                             <span className="text-zinc-600">ISSUED</span>
                             <span className="text-zinc-300">{new Date(result.issuedAt * 1000).toLocaleString()}</span>
                          </div>
                          <div className="grid grid-cols-[80px_1fr] gap-2">
                             <span className="text-zinc-600">EXPIRES</span>
                             <span className="text-zinc-300">
                                {result.expiresAt === 0 ? "Never" : new Date(result.expiresAt * 1000).toLocaleString()}
                             </span>
                          </div>
                       </div>
                    )}
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
