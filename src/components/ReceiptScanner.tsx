import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Upload, 
  Camera, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Coins, 
  HelpCircle,
  Clock
} from "lucide-react";

interface ReceiptScannerProps {
  token: string;
  triggerToast: (msg: string, type: "success" | "error") => void;
  triggerSync: () => void;
}

export default function ReceiptScanner({ token, triggerToast, triggerSync }: ReceiptScannerProps) {
  const [activeMode, setActiveMode] = useState<"upload" | "text" | "simulator">("simulator");
  const [loading, setLoading] = useState(false);
  const [scannedItems, setScannedItems] = useState<any[]>([]);

  // Raw receipt text paste
  const [rawText, setRawText] = useState("");
  const [storeName, setStoreName] = useState("");

  // Simulated grocery receipts
  const simulatedBills = [
    {
      id: "bill-1",
      title: "Walmart Pantry Run",
      store: "Walmart Supercenter",
      text: "WALMART INVENTORY LOGS\n-------------------\nWHOLE MILK 2 LITER @ 2.50\nAMUL CHEESE BLOCK 1 PACK @ 4.20\nORGANIC BANANAS 1.5 KG @ 1.80\nWHEAT BREAD 1 PIECE @ 1.50",
      imageMock: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200" // placeholder for receipt thumbnail
    },
    {
      id: "bill-2",
      title: "DMart Indian Staples",
      store: "DMart Mumbai H.Q.",
      text: "DMART INVOICE DECK\n-------------\nBASMATI RICE 5 KG @ 85.00/kg (Total: 425)\nFARM EGGS 1 PACK @ 74.00\nWHEAT BREAD 2 PIECE @ 35.00\nTOTAL SECURED ITEMS: 3",
      imageMock: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=200"
    }
  ];

  // Helper trigger base64 OCR parser for simulation
  const triggerSimulationLoad = async (simulatedText: string, store: string) => {
    try {
      setLoading(true);
      setScannedItems([]);

      const res = await fetch("/api/import/receipt-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ocrText: simulatedText,
          storeName: store
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScannedItems(data.items);
        triggerToast(`Simulated scan complete! Imported ${data.count} items into pantry!`, "success");
        triggerSync();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Model failure");
      }
    } catch (e: any) {
      triggerToast(e.message || "Model failed to parse. check GEMINI_API_KEY", "error");
    } finally {
      setLoading(false);
    }
  };

  // Raw paste text submit handler
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      triggerToast("Please paste receipt content text.", "error");
      return;
    }

    try {
      setLoading(true);
      setScannedItems([]);

      const res = await fetch("/api/import/receipt-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ocrText: rawText,
          storeName: storeName || "Copied Receipt"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScannedItems(data.items);
        setRawText("");
        setStoreName("");
        triggerToast(`Manual text receipt OCR complete! ${data.count} items imported.`, "success");
        triggerSync();
      } else {
        const err = await res.json();
        throw new Error(err.error);
      }
    } catch (e: any) {
      triggerToast(e.message || "Failure analyzing pasted content", "error");
    } finally {
      setLoading(false);
    }
  };

  // Standard File Upload Drag-Drop converter
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read and convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Str = (reader.result as string).split(",")[1];
      try {
        setLoading(true);
        setScannedItems([]);

        const res = await fetch("/api/import/receipt-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            base64Data: base64Str,
            mimeType: file.type,
            storeName: file.name.substring(0, 20) || "Uploaded Receipt"
          })
        });

        if (res.ok) {
          const data = await res.json();
          setScannedItems(data.items);
          triggerToast(`Image OCR Success! Parsed & saved ${data.count} items.`, "success");
          triggerSync();
        } else {
          const err = await res.json();
          throw new Error(err.error || "Multimodal OCR failed. Confirm GEMINI_API_KEY is active.");
        }
      } catch (e: any) {
        triggerToast(e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="scanner-deck">
      
      {/* Left Control Column with clean light border accents (1/3 size) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs max-h-fit space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Receipt OCR Scanner</h2>
          <p className="text-xs text-slate-500 mt-1">Select scanning capture format.</p>
        </div>

        {/* Form selection panels */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              setActiveMode("simulator");
              setScannedItems([]);
            }}
            className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              activeMode === "simulator"
                ? "bg-teal-50/50 border-teal-500 text-teal-800 font-bold shadow-2xs"
                : "border-slate-100 hover:bg-slate-50 text-slate-600"
            }`}
          >
            <Camera className="h-5 w-5 text-teal-600 shrink-0" />
            <div>
              <span className="text-xs font-semibold block">Interactive Virtual Receipt Cam</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Recommended list scanner demo</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveMode("upload");
              setScannedItems([]);
            }}
            className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              activeMode === "upload"
                ? "bg-teal-50/50 border-teal-500 text-teal-800 font-bold shadow-2xs"
                : "border-slate-100 hover:bg-slate-50 text-slate-600"
            }`}
          >
            <Upload className="h-5 w-5 text-indigo-500 shrink-0" />
            <div>
              <span className="text-xs font-semibold block">Drag & Drop Image Scanner</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Parse live JPEG/PNG photos with Gemini</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveMode("text");
              setScannedItems([]);
            }}
            className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              activeMode === "text"
                ? "bg-teal-50/50 border-teal-500 text-teal-800 font-bold shadow-2xs"
                : "border-slate-100 hover:bg-slate-50 text-slate-600"
            }`}
          >
            <FileText className="h-5 w-5 text-rose-500 shrink-0" />
            <div>
              <span className="text-xs font-semibold block">Paste Raw OCR Bill String</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Copy paste text receipt streams</span>
            </div>
          </button>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 leading-normal">
          <Sparkles className="h-3.5 w-3.5 text-teal-600 float-left mr-1.5" />
          OCR scanning triggers base-pricing comparisons and inventories stock instantly, removing manual catalog chores.
        </div>
      </div>

      {/* Right Details Block - Dynamic Active Capture interface (2/3 size) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Simulator Frame */}
        {activeMode === "simulator" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 font-display flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-teal-600" />
                Virtual Scanner Camera Simulation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click a mock bill below to simulate a high-resolution camera scan. Excellent for evaluating AI parsing workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulatedBills.map(bill => (
                <div 
                  key={bill.id}
                  className="border border-slate-150 hover:border-teal-500 hover:shadow-md rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between transition-all"
                  id={`simulator-bill-${bill.id}`}
                >
                  <div className="p-4 space-y-3">
                    <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-sm font-bold block w-fit font-mono">
                      {bill.store}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">{bill.title}</h4>
                    <pre className="p-3 bg-white/80 border border-slate-100 rounded-lg text-[9px] text-slate-500 font-mono leading-relaxed truncate overflow-x-hidden max-h-24">
                      {bill.text}
                    </pre>
                  </div>

                  <button
                    onClick={() => triggerSimulationLoad(bill.text, bill.store)}
                    disabled={loading}
                    className="w-full py-2 bg-slate-100 hover:border-teal-500 hover:bg-teal-50 active:bg-teal-100 text-teal-700 hover:text-teal-900 border-t border-slate-150 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    Simulate Camera Capture
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drag Drop File Frame */}
        {activeMode === "upload" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900 font-display flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-indigo-500" />
                Drag & Drop Multimodal Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Drop standard receipts or bills (JPEG/PNG). Gemini parses names, quantities, and pricing direct from images.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-12 text-center bg-slate-50/20 hover:bg-slate-50/50 transition-all relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={loading}
              />
              <Upload className="h-10 w-10 text-slate-300 mx-auto transition-transform group-hover:scale-105" />
              <p className="text-xs font-bold text-slate-700 mt-4">Select receipt photo, or drag files in frame</p>
              <p className="text-[10px] text-slate-400 mt-1">supports standard image files (up to 5MB)</p>
            </div>
          </div>
        )}

        {/* Text Paste Frame */}
        {activeMode === "text" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 font-display flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-rose-500" />
                  Paste Raw Receipt Content
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste scanned logs, digital transaction SMS, or receipt columns below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Supermarket / Merchant name</label>
                  <input
                    type="text"
                    placeholder="e.g. Walmart center, Daily grocery"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Bill Text lines *</label>
                <textarea
                  placeholder="e.g.&#10;Amul Milk 1 liter 64&#10;Raw apples 1.5 kg 180&#10;Corriander bunces 3 pieces @ 12"
                  rows={6}
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-teal-500 rounded-xl font-mono leading-relaxed focus:bg-white"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Analyze & Import Supplies 
              </button>
            </form>
          </div>
        )}

        {/* Capture / Scanning indicator screen representation - Advanced Skeletons */}
        {loading && (
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 font-mono">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>Gemini Parsing Live Receipt...</span>
            </div>
            <div className="border border-slate-150 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-4 flex justify-between items-center bg-slate-50/20">
                  <div className="space-y-1.5 w-1/2">
                    <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                    <div className="h-2.5 bg-slate-150 rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-12" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scanned result dashboard confirmation panel */}
        {scannedItems.length > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              OCR matched and loaded successfully! Itemized listings:
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {scannedItems.map((item, id) => (
                <div key={id} className="p-3 bg-slate-50/50 hover:bg-white flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">{item.itemName}</span>
                    <div className="flex gap-1.5 text-[10px] text-slate-400 font-semibold font-mono">
                      <span>{item.qty} {item.unit}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-700">₹{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
