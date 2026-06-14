import { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Camera, User, Lock, Eye, EyeOff, Save,
  ShieldCheck, AlertCircle, CheckCircle2,
  CalendarCheck, Star, Stethoscope,
} from "lucide-react";
import { useUpdateProfile, useUploadPhoto, useChangePassword } from "../../../hooks/useAdminProfile";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import useReviewsSecure from "../../../hooks/useReviewsSecure";
import useAppointmentsSecure from "../../../hooks/useAppointmentsSecure";
import useServicesSecure from "../../../hooks/useServicesSecure";

// ── Alert ─────────────────────────────────────────────────────────────────
const Alert = ({ type, message }) => {
  if (!message) return null;
  const ok = type === "success";
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border
      ${ok
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-red-50 text-red-600 border-red-200"}`}>
      {ok
        ? <CheckCircle2 size={15} className="flex-shrink-0" />
        : <AlertCircle  size={15} className="flex-shrink-0" />}
      {message}
    </div>
  );
};

// ── Field (React Hook Form compatible) ───────────────────────────────────
const Field = ({ label, type = "text", placeholder, disabled, rightEl, registration, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...registration}
        className={`w-full px-4 py-3 rounded-xl border-[1.5px] text-sm text-slate-800
          placeholder-slate-400 bg-white outline-none transition-all duration-200
          focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10
          disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${rightEl ? "pr-11" : ""}
          ${error ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-slate-200 hover:border-slate-300"}`}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
    {error && (
      <p className="text-[11px] text-red-500 flex items-center gap-1 mt-0.5">
        <AlertCircle size={11} />
        {error.message}
      </p>
    )}
  </div>
);

// ── Stat pill ─────────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, label, value, loading }) => (
  <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08]">
    <Icon size={14} className="text-white/30" />
    <span className="text-white font-bold text-base leading-none">
      {loading ? "—" : value}
    </span>
    <span className="text-[10px] text-white/25 uppercase tracking-widest">{label}</span>
  </div>
);

// ── Tab button ────────────────────────────────────────────────────────────
const Tab = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
      ${active
        ? "bg-[#0f2d52] text-white shadow-md"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
  >
    <Icon size={15} />
    {label}
  </button>
);

// ── Section card ──────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, iconBg, title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={17} />
      </div>
      <div>
        <p className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">{title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="p-6 flex flex-col gap-5">{children}</div>
  </div>
);

// ── Password strength ─────────────────────────────────────────────────────
const StrengthBar = ({ password }) => {
  if (!password) return null;
  const len = password.length;
  const s = len < 4 ? 0 : len < 7 ? 1 : len < 10 ? 2 : 3;
  const labels    = ["Weak", "Fair", "Good", "Strong"];
  const barColors = ["bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-500"];
  const txtColors = ["text-red-500", "text-amber-500", "text-yellow-500", "text-emerald-600"];
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s ? barColors[s] : "bg-slate-200"}`} />
      ))}
      <span className={`text-[11px] font-semibold min-w-[38px] ${txtColors[s]}`}>{labels[s]}</span>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────
const AdminProfile = () => {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [previewURL, setPreviewURL] = useState(user?.photoURL || "");
  const [photoFile, setPhotoFile]   = useState(null);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg]           = useState({ type: "", text: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Data hooks ───────────────────────────────────────────────────────
  const [reviews,      reviewsLoading]      = useReviewsSecure();
  const [appointments, appointmentsLoading] = useAppointmentsSecure();
  const [services,     servicesLoading]     = useServicesSecure();

  // ── Mutation hooks ───────────────────────────────────────────────────
  const updateProfileMutation  = useUpdateProfile();
  const uploadPhotoMutation    = useUploadPhoto();
  const changePasswordMutation = useChangePassword();

  // ── Profile form (React Hook Form) ──────────────────────────────────
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: { displayName: user?.displayName || "" },
  });

  // ── Password form (React Hook Form) ─────────────────────────────────
  const {
    register: registerPw,
    handleSubmit: handlePwSubmit,
    watch,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm();

  const newPwValue = watch("newPassword", "");

  // ── Photo pick ───────────────────────────────────────────────────────
  const handlePhotoPick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  // ── Save profile ─────────────────────────────────────────────────────
  const onProfileSubmit = async (data) => {
    setProfileMsg({ type: "", text: "" });
    try {
      let photoURL = user?.photoURL || "";
      if (photoFile) {
        photoURL = await uploadPhotoMutation.mutateAsync(photoFile);
      }
      await updateProfileMutation.mutateAsync({ displayName: data.displayName, photoURL });
      setPhotoFile(null);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Update failed." });
    }
  };

  // ── Change password ──────────────────────────────────────────────────
  const onPwSubmit = async (data) => {
    setPwMsg({ type: "", text: "" });
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPw();
      setPwMsg({ type: "success", text: "Password changed successfully!" });
    } catch (err) {
      const msg =
        err.code === "auth/wrong-password"       ? "Current password is incorrect."
        : err.code === "auth/invalid-credential" ? "Current password is incorrect."
        : err.code === "auth/too-many-requests"  ? "Too many attempts. Try again later."
        : err.message || "Failed to change password.";
      setPwMsg({ type: "error", text: msg });
    }
  };

  const isSavingProfile = updateProfileMutation.isPending || uploadPhotoMutation.isPending;

  const eyeToggle = (show, setShow) => (
    <button type="button" onClick={() => setShow((v) => !v)}
      className="text-slate-400 hover:text-slate-600 transition-colors">
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="min-h-full bg-slate-100 p-4 md:p-8">
      <div className="max-w-8xl mx-auto flex flex-col gap-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account information and security</p>
        </div>

        {/* Hero card */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a1628 0%, #0c2340 55%, #0f2d52 100%)" }}
        >
          <div className="absolute -right-4 -top-6 text-[110px] opacity-[0.04] pointer-events-none select-none">🦷</div>
          <div className="absolute right-10 -bottom-8 w-28 h-28 rounded-full border border-white/5 pointer-events-none" />

          <div className="flex items-center gap-5 flex-wrap">
            {/* avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={previewURL || "https://i.ibb.co/2kR8z2Q/user.png"}
                alt="avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10"
              />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0c2340]" />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2.5 -right-2.5 w-8 h-8 rounded-xl bg-sky-500
                  hover:bg-sky-400 flex items-center justify-center text-white
                  border-2 border-[#0c2340] transition-colors shadow-lg"
                title="Change photo"
              >
                <Camera size={13} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoPick} />
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xl leading-tight truncate">
                {user?.displayName || "Admin"}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2 mb-2.5 bg-sky-500/15
                text-sky-300 text-[10px] font-bold uppercase tracking-widest
                px-3 py-1 rounded-full border border-sky-500/25">
                <ShieldCheck size={10} />
                Super Admin
              </span>
              <p className="text-white/40 text-sm truncate">{user?.email}</p>
              <p className="text-white/20 text-xs mt-1.5">
                Member since&nbsp;
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })
                  : "—"}
              </p>
            </div>

            {/* live stats from hooks */}
            <div className="flex gap-2 flex-wrap">
              <StatPill icon={CalendarCheck} label="Appointments" value={appointments?.length ?? 0} loading={appointmentsLoading} />
              <StatPill icon={Star}          label="Reviews"      value={reviews?.length      ?? 0} loading={reviewsLoading} />
              <StatPill icon={Stethoscope}   label="Services"     value={services?.length     ?? 0} loading={servicesLoading} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          <Tab active={activeTab === "profile"}  onClick={() => setActiveTab("profile")}  icon={User} label="Profile Info" />
          <Tab active={activeTab === "password"} onClick={() => setActiveTab("password")} icon={Lock} label="Change Password" />
        </div>

        {/* ── Profile tab ── */}
        {activeTab === "profile" && (
          <SectionCard
            icon={User}
            iconBg="bg-sky-50 text-sky-500"
            title="Personal Information"
            subtitle="Update your display name and profile photo"
          >
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Display Name"
                  placeholder="Your full name"
                  registration={registerProfile("displayName", {
                    required: "Display name is required",
                    minLength: { value: 2, message: "At least 2 characters" },
                  })}
                  error={profileErrors.displayName}
                />
                <Field
                  label="Email Address"
                  disabled
                  registration={{ value: user?.email || "", onChange: () => {} }}
                />
              </div>

              {photoFile && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                  bg-sky-50 border border-sky-200 text-sky-600 text-sm font-medium">
                  <Camera size={14} className="flex-shrink-0" />
                  New photo selected — will upload when you save
                </div>
              )}

              <Alert type={profileMsg.type} message={profileMsg.text} />

              <button
                type="submit"
                disabled={isSavingProfile}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                  text-white text-sm font-bold transition-all duration-200 active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}
              >
                <Save size={15} />
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </SectionCard>
        )}

        {/* ── Password tab ── */}
        {activeTab === "password" && (
          <SectionCard
            icon={Lock}
            iconBg="bg-rose-50 text-rose-500"
            title="Change Password"
            subtitle="Secure your account with a strong password"
          >
            <form onSubmit={handlePwSubmit(onPwSubmit)} className="flex flex-col gap-5">
              <Field
                label="Current Password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                registration={registerPw("currentPassword", {
                  required: "Current password is required",
                })}
                error={pwErrors.currentPassword}
                rightEl={eyeToggle(showCurrent, setShowCurrent)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  registration={registerPw("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  error={pwErrors.newPassword}
                  rightEl={eyeToggle(showNew, setShowNew)}
                />
                <Field
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  registration={registerPw("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) => val === newPwValue || "Passwords do not match",
                  })}
                  error={pwErrors.confirmPassword}
                  rightEl={eyeToggle(showConfirm, setShowConfirm)}
                />
              </div>

              <StrengthBar password={newPwValue} />

              <Alert type={pwMsg.type} message={pwMsg.text} />

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                  bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold
                  transition-all duration-200 active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Lock size={15} />
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </button>
            </form>
          </SectionCard>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
};

export default AdminProfile;
