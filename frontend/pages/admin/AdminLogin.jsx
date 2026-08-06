import { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthSideBanner from "../../components/auth/AuthSideBanner";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("remembered_admin_email");
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

      if (data.role?.toUpperCase() !== "ADMIN") {
        toast.error("This account does not have admin privileges.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("remembered_admin_email", email.trim().toLowerCase());
      } else {
        localStorage.removeItem("remembered_admin_email");
      }

      toast.success(`Welcome, ${data.name}!`);
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err?.response?.data || err?.message || "Login failed.";
      toast.error(typeof msg === "string" ? msg : "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout banner={<AuthSideBanner />}>
      <div>
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 p-4 rounded-full shadow-lg shadow-orange-500/20">
            <ShieldCheck size={38} className="text-white" />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center text-white">
          Administrator Login
        </h2>
        <p className="text-center text-slate-400 mt-3">
          Authorized personnel only.
        </p>

        <form onSubmit={handleLogin} className="space-y-6 mt-10">
          <div>
            <label className="block mb-2 text-slate-300 font-medium text-sm">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartlab.com"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-300 font-medium text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pr-12 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition text-white"
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

          {/* Remember Me Checkbox */}
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
            <Link to="/forgot-password" className="text-orange-500 hover:underline text-xs font-medium">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              "Admin Login"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;