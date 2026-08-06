import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Loader2, GraduationCap, UserCog, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import AuthInput from "./AuthInput";
import PrimaryButton from "../ui/PrimaryButton";
import { authService } from "../../services/authService";

// Steps: 0 = enter details, 1 = enter OTP + password, 2 = success
const ActivateAccountForm = () => {
  const [role, setRole] = useState("student");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 0 fields
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  // Step 1 fields
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpInputs = useRef([]);

  // From registration response
  const [registeredEmail, setRegisteredEmail] = useState("");

  // OTP input handler
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Step 0: Verify & send OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!regNo.trim() || !email.trim() || !dob) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (role === "student") {
        await authService.registerStudent({
          regNo: regNo.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          dob,
        });
      } else {
        await authService.registerFaculty({
          facultyId: regNo.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          dob,
        });
      }
      setRegisteredEmail(email.trim().toLowerCase());
      toast.success("OTP sent to your email! Check your inbox.");
      setStep(1);
      startResendCooldown();
    } catch (err) {
      const msg = err?.response?.data || err?.message || "Verification failed.";
      toast.error(typeof msg === "string" ? msg : "Could not verify details.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify OTP + set password
  const handleActivate = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(registeredEmail, otpCode, newPassword);
      toast.success("Account activated successfully! You can now login.");
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data || err?.message || "OTP verification failed.";
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
      await authService.resendOtp(registeredEmail);
      toast.success("New OTP sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      startResendCooldown();
    } catch (err) {
      const msg = err?.response?.data || err?.message || "Could not resend OTP.";
      toast.error(typeof msg === "string" ? msg : "Resend failed.");
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const passwordStrength = () => {
    if (newPassword.length === 0) return null;
    if (newPassword.length < 8) return { label: "Weak", color: "text-red-400" };
    if (newPassword.length < 12) return { label: "Medium", color: "text-yellow-400" };
    return { label: "Strong", color: "text-green-400" };
  };
  const strength = passwordStrength();

  // ─── Step 2: Success ──────────────────────────────────
  if (step === 2) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-500/20 p-6 rounded-full">
            <CheckCircle size={64} className="text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Account Activated!</h2>
        <p className="text-slate-400">
          Your SmartLab AI account has been activated successfully.
          You can now login with your credentials.
        </p>
        <Link
          to="/login"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-4xl font-bold text-white">Activate Account</h2>
      <p className="text-slate-400 mt-2">
        Verify your college information to activate your SmartLab account.
      </p>

      {/* Role Tabs */}
      <div className="mt-8 flex bg-slate-800 rounded-xl p-1">
        <button
          type="button"
          onClick={() => { setRole("student"); setStep(0); }}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${
            role === "student" ? "bg-orange-500 text-white" : "text-slate-400"
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => { setRole("faculty"); setStep(0); }}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${
            role === "faculty" ? "bg-orange-500 text-white" : "text-slate-400"
          }`}
        >
          Faculty
        </button>
      </div>

      {/* ─── Step 0: Enter Details ─── */}
      {step === 0 && (
        <form onSubmit={handleVerify} className="space-y-5 mt-8">
          <div>
            <label className="block mb-2 text-slate-300">
              {role === "student" ? "Register Number" : "Faculty ID"}
            </label>
            <input
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder={role === "student" ? "717824F226" : "FAC-101"}
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-300">College Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "student" ? "717824f226@kce.ac.in" : "faculty@smartlab.com"}
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : "Verify & Send OTP"}
          </button>
        </form>
      )}

      {/* ─── Step 1: OTP + Password ─── */}
      {step === 1 && (
        <form onSubmit={handleActivate} className="space-y-6 mt-8">
          <div className="bg-slate-800 rounded-xl p-4 text-sm text-slate-300 flex items-start gap-3">
            <CheckCircle size={18} className="text-green-400 mt-0.5 shrink-0" />
            <span>OTP sent to <span className="text-white font-medium">{registeredEmail}</span>. Check your inbox.</span>
          </div>

          {/* OTP Boxes */}
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
              <span className="text-slate-400">Didn't receive OTP?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="text-orange-500 hover:underline disabled:text-slate-500 disabled:no-underline flex items-center gap-1 transition"
              >
                <RefreshCw size={14} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-2 text-slate-300">Create Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
            {strength && (
              <p className={`mt-1 text-sm ${strength.color}`}>
                Password strength: {strength.label}
              </p>
            )}
          </div>

          {/* Confirm Password */}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Activating...</> : "Activate Account"}
          </button>

          <button
            type="button"
            onClick={() => setStep(0)}
            className="w-full text-slate-400 hover:text-white text-sm transition"
          >
            ← Back to details
          </button>
        </form>
      )}

      <p className="text-center mt-8 text-slate-400">
        Already activated?
        <Link to="/login" className="ml-2 text-orange-500 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default ActivateAccountForm;