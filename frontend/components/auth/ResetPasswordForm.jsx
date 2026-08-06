import { useState, useRef } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../ui/PrimaryButton";

const ResetPasswordForm = () => {

  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const inputs = useRef([]);

  const handleOtpChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {

      inputs.current[index + 1].focus();

    }

  };

  const passwordStrength = () => {

    if (password.length < 6) return "Weak";

    if (password.length < 10) return "Medium";

    return "Strong";

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    /*
      Backend

      Verify OTP

      Update Password

    */

    alert("Password Reset Successfully!");

    navigate("/login");

  };

  return (

    <div>

      <h2 className="text-4xl font-bold text-white">

        Reset Password

      </h2>

      <p className="text-slate-400 mt-3">

        Enter the OTP sent to your college email and create a new password.

      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 mt-8"
      >

        {/* OTP */}

        <div>

          <label className="block mb-3 text-slate-300">

            Enter OTP

          </label>

          <div className="flex justify-between gap-3">

            {otp.map((digit, index) => (

              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                value={digit}
                maxLength={1}
                onChange={(e) =>
                  handleOtpChange(e.target.value, index)
                }
                className="w-12 h-14 rounded-xl bg-slate-800 border border-slate-700 text-center text-xl font-bold outline-none focus:border-orange-500"
              />

            ))}

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="block mb-2 text-slate-300">

            New Password

          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pr-12 outline-none focus:border-orange-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-4"
            >

              {showPassword ? <EyeOff /> : <Eye />}

            </button>

          </div>

          <p
            className={`mt-2 text-sm ${
              passwordStrength() === "Strong"
                ? "text-green-400"
                : passwordStrength() === "Medium"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >

            Password Strength : {passwordStrength()}

          </p>

        </div>

        {/* Confirm */}

        <div>

          <label className="block mb-2 text-slate-300">

            Confirm Password

          </label>

          <div className="relative">

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pr-12 outline-none focus:border-orange-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-4"
            >

              {showConfirmPassword ? (
                <EyeOff />
              ) : (
                <Eye />
              )}

            </button>

          </div>

        </div>

        <PrimaryButton className="w-full">

          <ShieldCheck className="inline mr-2" size={18} />

          Reset Password

        </PrimaryButton>

      </form>

    </div>

  );

};

export default ResetPasswordForm;