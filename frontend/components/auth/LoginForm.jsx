import { useState, useEffect } from "react";
import { Eye, EyeOff, GraduationCap, UserCog, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthInput from "./AuthInput";
import PrimaryButton from "../ui/PrimaryButton";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (e) {}
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.trim().toLowerCase(), password);

      // Save or clear Remember Me email preference
      if (rememberMe) {
        localStorage.setItem("remembered_email", email.trim().toLowerCase());
      } else {
        localStorage.removeItem("remembered_email");
      }

      // Validate returned role matches selected role
      const returnedRole = data.role?.toUpperCase();
      if (role === "student" && returnedRole !== "STUDENT") {
        toast.error("This account is not a student account.");
        return;
      }
      if (role === "faculty" && returnedRole !== "FACULTY") {
        toast.error("This account is not a faculty account.");
        return;
      }

      toast.success(`Welcome back, ${data.name}!`);

      if (returnedRole === "STUDENT") navigate("/student/dashboard");
      else if (returnedRole === "FACULTY") navigate("/faculty/dashboard");
      else if (returnedRole === "ADMIN") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.message ||
        "Login failed. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-bold text-white">Welcome Back</h2>
      <p className="text-slate-400 mt-2">Login to continue to SmartLab AI</p>

      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`rounded-xl border p-4 transition-all duration-300 ${
            role === "student"
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-slate-800 border-slate-700 hover:border-orange-400"
          }`}
        >
          <GraduationCap className="mx-auto mb-2" size={28} />
          Student
        </button>

        <button
          type="button"
          onClick={() => setRole("faculty")}
          className={`rounded-xl border p-4 transition-all duration-300 ${
            role === "faculty"
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-slate-800 border-slate-700 hover:border-orange-400"
          }`}
        >
          <UserCog className="mx-auto mb-2" size={28} />
          Faculty
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 mt-8">
        {/* Email */}
        <div>
          <label className="block mb-2 text-slate-300">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              role === "student"
                ? "717824f226@kce.ac.in"
                : "faculty@smartlab.com"
            }
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-slate-300">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pr-12 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember Me / Forgot Password */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-orange-500 rounded cursor-pointer" 
            />
            Remember Me
          </label>
          <Link to="/forgot-password" className="text-orange-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-400">First time using SmartLab AI?</p>
        <Link
          to="/activate-account"
          className="text-orange-500 font-semibold hover:underline"
        >
          Activate Account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;