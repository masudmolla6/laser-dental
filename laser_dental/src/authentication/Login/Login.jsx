import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ToothSVG = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z" />
  </svg>
);

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { logIn } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    setLoading(true);
    setError("");
    logIn(data.email, data.password)
      .then(async (result) => {
        const user = result.user;
        const token = await user.getIdToken();
        localStorage.setItem("access-token", token);
        const res = await axiosSecure.post("/users", { email: user.email });
        if (res.data.insertedId) {
          Swal.fire({ title: "Welcome!", icon: "success", draggable: true });
        }
        navigate(from, { replace: true });
      })
      .catch(() => setError("Invalid email or password. Please try again."))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .login-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(14,165,233,0.08),
            0 20px 60px rgba(0,0,0,0.12),
            0 4px 16px rgba(0,0,0,0.06);
          width: 100%;
        }

        .login-top-bar {
          height: 5px;
          width: 100%;
          background: linear-gradient(90deg, #0284c7 0%, #6366f1 50%, #0ea5e9 100%);
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeSlideUp 0.55s cubic-bezier(0.4,0,0.2,1) both; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.35), 0 8px 24px rgba(14,165,233,0.3); }
          50%       { box-shadow: 0 0 0 8px rgba(14,165,233,0.08), 0 8px 24px rgba(14,165,233,0.3); }
        }
        .logo-pulse { animation: pulse-glow 3s ease-in-out infinite; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-label {
          background: linear-gradient(90deg, #0284c7 0%, #6366f1 50%, #0284c7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
          font-family: 'Playfair Display', serif;
        }

        .login-field {
          width: 100%;
          padding: 13px 16px 13px 44px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .login-field::placeholder { color: #94a3b8; }
        .login-field:focus {
          border-color: #0ea5e9;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(14,165,233,0.1);
        }
        .login-field.has-error { border-color: #f87171; }
        .login-field.has-error:focus { box-shadow: 0 0 0 4px rgba(248,113,113,0.1); }

        .login-submit {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.22s ease;
          box-shadow: 0 6px 22px rgba(14,165,233,0.38);
          font-family: 'DM Sans', sans-serif;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(14,165,233,0.48);
        }
        .login-submit:active:not(:disabled) { transform: scale(0.985); }
        .login-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 99px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          font-size: 11px;
          font-weight: 600;
          color: #0369a1;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="login-card">

        {/* Top gradient bar */}
        <div className="login-top-bar" />

        <div className="px-8 md:px-10 py-10">

          {/* ── Logo + title ───────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              className="logo-pulse w-16 h-16 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}
            >
              <ToothSVG size={30} />
            </div>
            <div className="text-center">
              <h1 className="shimmer-label text-2xl md:text-3xl font-bold leading-tight">
                Laser Dental Point
              </h1>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.18em] mt-1.5">
                Admin Portal
              </p>
            </div>
          </div>

          {/* ── Security badge ──────────────────────────────────────────── */}
          <div className="flex justify-center mb-7">
            <div className="security-badge">
              <ShieldCheck size={12} className="text-sky-500" />
              Authorized Access Only
            </div>
          </div>

          {/* ── Divider ─────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">Sign in to continue</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* ── Form ────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={11} className="text-sky-500" />
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="admin@laserdental.com"
                  className={`login-field${errors.email ? " has-error" : ""}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle size={12} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={11} className="text-sky-500" />
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••"
                  style={{ paddingRight: "46px" }}
                  className={`login-field${errors.password ? " has-error" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "At least 6 characters required",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle size={12} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API error */}
            {error && (
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm text-red-700"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="login-submit mt-1">
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div
            className="mt-8 pt-5 flex flex-col items-center gap-1.5 text-center"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck size={12} className="text-gray-300" />
              This portal is for authorized admins only
            </div>
            <p className="text-xs text-gray-300">
              Laser Dental Point · Dhaka, Bangladesh
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
