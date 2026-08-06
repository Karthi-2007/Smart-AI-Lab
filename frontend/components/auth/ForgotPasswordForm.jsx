import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import PrimaryButton from "../ui/PrimaryButton";
import { authService } from "../../services/authService";

// Steps: 0 = enter email, 1 = verify OTP, 2 = reset password, 3 = success
const ForgotPasswordForm = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpInputs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 0: request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Enter your email address."); return; }
    setLoading(true);
    try {
      await authService.requestForgotPassword(email.trim().toLowerCase());
      toast.success("OTP sent to your email!");
      setStep(1);
      startCooldown();
    } catch (err) {
      const msg = err?.response?.data || "Could not send OTP. Check your email.";
      toast.error(typeof msg === "string" ? msg : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) { toast.error("Enter the complete 6-digit OTP."); return; }
    setLoading(true);
    try {
      await authService.verifyForgotPasswordOtp(email.trim().toLowerCase(), otpCode);
      toast.success("OTP verified! Set your new password.");
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data || "OTP verification failed.";
      toast.error(typeof msg === "string" ? msg : "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await authService.resendForgotPasswordOtp(email.trim().toLowerCase());
      toast.success("New OTP sent!");
      setOtp(["", "", "", "", "", ""]);
      startCooldown();
    } catch (err) {
      const msg = err?.response?.data || "Could not resend OTP.";
      toast.error(typeof msg === "string" ? msg : "Resend failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    try {
      await authService.resetPassword(email.trim().toLowerCase(), newPassword);
      toast.success("Password reset successful!");
      setStep(3);
    } catch (err) {
      const msg = err?.response?.data || "Password reset failed.";
      toast.error(typeof msg === "string" ? msg : "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Success
  if (step === 3) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-500/20 p-6 rounded-full">
            <CheckCircle size={64} className="text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Password Reset!</h2>
        <p className="text-slate-400">Your password has been updated successfully.</p>
        <Link to="/login" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-white">Forgot Password</h2>
      <p className="text-slate-400 mt-3">
        {step === 0 && "Enter your registered email to receive an OTP."}
        {step === 1 && "Enter the OTP sent to your email."}
        {step === 2 && "Create your new password."}
      </p>

      {/* Progress indicators */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-orange-500" : "bg-slate-700"}`} />
        ))}
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <form onSubmit={handleRequestOtp} className="space-y-6 mt-8">
          <div>
            <label className="block mb-2 text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : "Send OTP"}
          </button>
        </form>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <form onSubmit={handleVerifyOtp} className="space-y-6 mt-8">
          <div className="bg-slate-800 rounded-xl p-4 text-sm text-slate-300">
            OTP sent to <span className="text-white font-medium">{email}</span>
          </div>
          <div>
            <label className="block mb-3 text-slate-300">Enter 6-Digit OTP</label>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="otp-input flex-1"
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between items-center text-sm">
              <span className="text-slate-400">Didn't receive it?</span>
              <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading} className="text-orange-500 hover:underline disabled:text-slate-500 flex items-center gap-1 transition">
                <RefreshCw size={14} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : "Verify OTP"}
          </button>
        </form>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-6 mt-8">
          <div>
            <label className="block mb-2 text-slate-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-slate-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Resetting...</> : "Reset Password"}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <p className="text-slate-400">Remember your password?</p>
        <Link to="/login" className="text-orange-500 font-semibold hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;