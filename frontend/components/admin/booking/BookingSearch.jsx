import React, { useState } from "react";
import { Search, QrCode } from "lucide-react";
import QRScannerModal from "../../common/QRScannerModal";

const BookingSearch = ({ search, setSearch, onRefresh }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative flex-1 w-full">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search || ""}
          onChange={(e) => setSearch && setSearch(e.target.value)}
          placeholder="Search by Booking ID, Student, Register No or Equipment..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsScannerOpen(true)}
        className="w-full sm:w-auto px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 shrink-0"
      >
        <QrCode size={16} />
        <span>Scan QR Access Pass</span>
      </button>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onVerificationSuccess={onRefresh}
      />
    </div>
  );
};

export default BookingSearch;