import React, { useState } from "react";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState("30 Minutes");
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginVerification, setLoginVerification] = useState(true);
  const [updating, setUpdating] = useState(false);

  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        toast.error("Please enter your current password");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }
    }

    setUpdating(true);
    setTimeout(() => {
      try {
        const securityPrefs = { sessionTimeout, twoFactor, loginVerification };
        localStorage.setItem("smartlab_security_settings", JSON.stringify(securityPrefs));
        toast.success("Security settings and credentials updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error("Failed to update security settings.");
      } finally {
        setUpdating(false);
      }
    }, 500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Security & Passwords</h2>
          <p className="text-xs text-slate-400">Change your administrative password and session security policies</p>
        </div>
      </div>

      <form onSubmit={handleUpdateSecurity} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-green-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-green-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-green-500 outline-none transition"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Session Inactivity Timeout</label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-green-500 outline-none transition"
            >
              <option value="15 Minutes">15 Minutes</option>
              <option value="30 Minutes">30 Minutes</option>
              <option value="1 Hour">1 Hour</option>
              <option value="Never">Never (Keep Session Active)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex justify-between items-center bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 cursor-pointer hover:border-slate-600 transition">
            <div>
              <span className="font-semibold text-white text-sm block">Enable Two-Factor Authentication (2FA)</span>
              <span className="text-xs text-slate-400">Require OTP verification on admin portal login</span>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="w-5 h-5 accent-green-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex justify-between items-center bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 cursor-pointer hover:border-slate-600 transition">
            <div>
              <span className="font-semibold text-white text-sm block">Require Login IP Verification</span>
              <span className="text-xs text-slate-400">Notify administrator on login attempts from unrecognized IP addresses</span>
            </div>
            <input
              type="checkbox"
              checked={loginVerification}
              onChange={(e) => setLoginVerification(e.target.checked)}
              className="w-5 h-5 accent-green-500 rounded cursor-pointer"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 text-sm transition shadow-lg disabled:opacity-60"
        >
          {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>Update Security Settings</span>
        </button>
      </form>
    </div>
  );
};

export default SecuritySettings;