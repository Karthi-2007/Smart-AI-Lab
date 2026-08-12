import React, { useState, useEffect, useRef } from "react";
import { QrCode, X, CheckCircle2, AlertTriangle, ShieldCheck, Clock, User, Package, Search, Camera, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Html5Qrcode } from "html5-qrcode";

const QRScannerModal = ({ isOpen, onClose, onVerificationSuccess }) => {
  const [manualCode, setManualCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [activeTab, setActiveTab] = useState("CAMERA");
  const [cameraActive, setCameraActive] = useState(false);
  
  const scannerRef = useRef(null);

  // We manage scanning state using a simple ref to prevent double-starting/concurrency bugs
  const isScanningRef = useRef(false);

  useEffect(() => {
    if (!isOpen || activeTab !== "CAMERA" || bookingData) {
      stopScanner();
      return;
    }

    // Delay start slightly to allow the modal animation and DOM container to fully mount
    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen, activeTab, bookingData]);

  const startScanner = async () => {
    if (isScanningRef.current) return;
    
    setCameraActive(false);
    setVerificationError(null);

    const isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isSecure) {
      console.warn("Camera access requires HTTPS or localhost.");
      setVerificationError(
        "Camera access blocked: Mobile browsers require a secure connection (HTTPS) to open the camera. Please access the portal via HTTPS, localhost, or configure an HTTPS proxy."
      );
      return;
    }

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      isScanningRef.current = true;
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          // Success callback
          verifyBookingCode(decodedText);
        },
        (errorMessage) => {
          // Silent verbose scanner diagnostics
        }
      );

      setCameraActive(true);
    } catch (err) {
      console.warn("QR Scanner start failed:", err);
      isScanningRef.current = false;
      setCameraActive(false);
      
      const errStr = String(err);
      if (errStr.includes("NotAllowedError") || errStr.includes("Permission denied")) {
        setVerificationError(
          "Camera Permission Denied: The browser blocked camera access. Please click the lock or settings icon in your browser address bar, reset the camera permission to 'Allow', and refresh the page."
        );
      } else {
        setVerificationError("Could not access camera. Ensure you have granted camera permissions in your browser.");
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        isScanningRef.current = false;
        await scannerRef.current.stop();
      } catch (err) {
        console.warn("Failed to stop scanner:", err);
      }
    }
    setCameraActive(false);
  };

  const verifyBookingCode = async (codeStr) => {
    if (!codeStr) return;
    setVerifying(true);
    setVerificationError(null);
    setBookingData(null);

    let extractedId = codeStr;
    const match = codeStr.match(/\d+/);
    if (match) {
      extractedId = match[0];
    }

    try {
      const res = await api.get("/api/business/bookings").catch(() => ({ data: [] }));
      const list = Array.isArray(res?.data || res) ? (res?.data || res) : [];
      
      const found = list.find(
        b => String(b.bookingId || b.id) === String(extractedId) ||
             String(b.bookingId || b.id) === String(codeStr)
      );

      if (found) {
        setBookingData(found);
        stopScanner();
        toast.success(`Access Pass Verified: #${found.bookingId || found.id}`);
      } else {
        setVerificationError(`No active booking pass found matching ID: "${codeStr}"`);
        toast.error("Invalid or unknown Access Pass");
      }
    } catch (err) {
      setVerificationError("Failed to communicate with verification server.");
      toast.error("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error("Please enter a Booking Pass ID");
      return;
    }
    verifyBookingCode(manualCode.trim());
  };

  const handleIssueEquipment = async () => {
    if (!bookingData) return;
    const bId = bookingData.bookingId || bookingData.id;
    try {
      await api.put(`/api/business/bookings/${bId}/issue`);
      toast.success("Equipment Handed Over & Status Set to 'Issued'!");
      setBookingData(prev => ({ ...prev, status: "Issued" }));
      if (onVerificationSuccess) onVerificationSuccess();
    } catch (err) {
      toast.error("Failed to update status to Issued");
    }
  };

  const handleCompleteCheckOut = async () => {
    if (!bookingData) return;
    const bId = bookingData.bookingId || bookingData.id;
    try {
      await api.put(`/api/business/bookings/${bId}/complete`);
      toast.success("Equipment Collected & Session Set to 'Completed'!");
      setBookingData(prev => ({ ...prev, status: "Completed" }));
      if (onVerificationSuccess) onVerificationSuccess();
    } catch (err) {
      toast.error("Failed to complete booking");
    }
  };

  const handleResetScan = () => {
    setManualCode("");
    setBookingData(null);
    setVerificationError(null);
    setActiveTab("CAMERA");
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">QR Access Pass Scanner</h2>
              <p className="text-xs text-slate-400">Scan student entry passes for lab check-in & verification</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        {!bookingData && (
          <div className="flex gap-2 mb-6 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab("CAMERA")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                activeTab === "CAMERA" ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab("MANUAL")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                activeTab === "MANUAL" ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Manual Code Entry</span>
            </button>
          </div>
        )}

        {/* Verification Result Card */}
        {bookingData ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Valid Access Pass Verified</h3>
              <p className="text-xs text-emerald-400 font-mono">Pass Code: #{bookingData.bookingId || bookingData.id}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5"><User className="w-4 h-4 text-orange-400" /> Student:</span>
                <span className="font-semibold text-white text-sm">
                  {typeof bookingData.student === 'object' ? (bookingData.student?.name || 'Karthikeyan RKS') : (bookingData.studentName || 'Karthikeyan RKS')}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5"><Package className="w-4 h-4 text-orange-400" /> Equipment:</span>
                <span className="font-semibold text-white">
                  {typeof bookingData.equipment === 'object' ? bookingData.equipment?.name : (bookingData.equipment || 'Equipment')}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-400" /> Slot & Date:</span>
                <span className="text-slate-200 font-mono">
                  {bookingData.date || 'Today'} ({bookingData.timeSlot || 'Session'})
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Current Status:</span>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  bookingData.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  bookingData.status === 'Issued' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  bookingData.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  {bookingData.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {bookingData.status?.toLowerCase() === 'pending' && (
                <div className="flex-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-3.5 rounded-xl font-medium text-center">
                  ⚠️ Request is pending Faculty approval. Equipment cannot be issued yet.
                </div>
              )}

              {bookingData.status?.toLowerCase() === 'approved' && (
                <button
                  onClick={handleIssueEquipment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Issue Equipment</span>
                </button>
              )}

              {bookingData.status?.toLowerCase() === 'issued' && (
                <button
                  onClick={handleCompleteCheckOut}
                  className="flex-1 bg-[#cc6926] hover:bg-[#a8531a] text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Collect Equipment (Return)</span>
                </button>
              )}

              {bookingData.status?.toLowerCase() === 'completed' && (
                <div className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3.5 rounded-xl font-medium text-center">
                  ✅ Equipment successfully returned and session completed.
                </div>
              )}

              <button
                onClick={handleResetScan}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Scan Another</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Camera View Area */}
            {activeTab === "CAMERA" && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden relative min-h-[240px] flex flex-col items-center justify-center text-center">
                  <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />
                  {cameraActive && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-36 border-2 border-dashed border-orange-500/80 rounded-2xl animate-pulse flex items-center justify-center">
                        <span className="text-[10px] text-orange-400 font-mono bg-slate-950/80 px-2 py-1 rounded">Align Pass QR Code</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-center text-xs text-slate-400">Live Camera Scan Active — Or switch to Manual Entry to verify by Booking ID</p>
              </div>
            )}

            {/* Manual Entry Form */}
            {activeTab === "MANUAL" && (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Enter Booking Pass Code / ID</label>
                  <input
                    type="text"
                    required
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g. SMARTLAB-BOOKING-8 or 8"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-orange-500 font-mono transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                >
                  <Search className="w-4 h-4" />
                  <span>{verifying ? "Verifying Pass..." : "Verify Access Pass"}</span>
                </button>
              </form>
            )}

            {/* Verification Error */}
            {verificationError && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerModal;
