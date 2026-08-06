import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeCard = ({ value = 'SMARTLAB-BOOKING-8829' }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
      <div className="p-3 bg-white rounded-xl shadow-lg">
        <QRCode value={value} size={120} />
      </div>
      <div>
        <p className="text-xs font-semibold text-white">Lab Entry Pass QR</p>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default QRCodeCard;
