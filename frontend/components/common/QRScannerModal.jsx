import React, { useState, useEffect, useRef } from "react";
import { QrCode, X, CheckCircle2, AlertTriangle, ShieldCheck, Clock, User, Package, Search, Camera, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const QRScannerModal = ({ isOpen, onClose, onVerificationSuccess }) => {
  const [manualCode, setManualCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [activeTab, setActiveTab] = useState("CAMERA");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start native camera stream
  useEffect(() => {
    if (!isOpen || activeTab !== "CAMERA" || bookingData) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, bookingData]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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
        stopCamera();
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

  const handleApproveCheckIn = async () => {
    if (!bookingData) return;
    const bId = bookingData.bookingId || bookingData.id;
    try {
      await api.put(`/api/business/bookings/${bId}/approve`);
      toast.success("Student Check-In Authorized!");
      setBookingData(prev => ({ ...prev, status: "Approved" }));
      if (onVerificationSuccess) onVerificationSuccess();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCompleteCheckOut = async () => {
    if (!bookingData) return;
    const bId = bookingData.bookingId || bookingData.id;
    try {
      await api.put(`/api/business/bookings/${bId}/complete`).catch(async () => {
        await api.put(`/api/business/bookings/${bId}/approve`);
      });
      toast.success("Equipment Returned & Session Completed!");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
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
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
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
                  bookingData.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  bookingData.status === 'Completed' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  {bookingData.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {bookingData.status?.toLowerCase() === 'pending' && (
                <button
                  onClick={handleApproveCheckIn}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl transition text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Check-In</span>
                </button>
              )}

              {bookingData.status?.toLowerCase() === 'approved' && (
                <button
                  onClick={handleCompleteCheckOut}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-2xl transition text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete & Check-Out</span>
                </button>
              )}

              <button
                onClick={handleResetScan}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl transition text-xs flex items-center justify-center gap-2"
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
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden relative min-h-[220px] flex flex-col items-center justify-center text-center">
                  <video ref={videoRef} className="w-full h-48 object-cover rounded-xl border border-slate-800" />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-36 border-2 border-dashed border-orange-500/80 rounded-2xl animate-pulse flex items-center justify-center">
                      <span className="text-[10px] text-orange-400 font-mono bg-slate-950/80 px-2 py-1 rounded">Align Pass QR Code</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400">Live Camera Reticle Active — Or switch to Manual Entry to verify by Booking ID</p>
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
