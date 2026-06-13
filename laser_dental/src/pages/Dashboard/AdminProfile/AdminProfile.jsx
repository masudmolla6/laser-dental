import { useState, useRef } from "react";
import { Camera, User, Mail, Lock, Eye, EyeOff, Save, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useUpdateProfile, useUploadPhoto, useChangePassword } from "../../../hooks/useAdminProfile";
import useAuth from "../../../hooks/useAuth";

// ── Small reusable alert ──────────────────────────────────────────────────
const Alert = ({ type, message }) => {
  if (!message) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium
        ${isSuccess
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}
    >
      {isSuccess
        ? <CheckCircle2 size={16} className="flex-shrink-0" />
        : <AlertCircle size={16} className="flex-shrink-0" />}
      {message}
    </div>
  );
};

// ── Section wrapper ───────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
        <Icon size={16} />
      </div>
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Input field ───────────────────────────────────────────────────────────
const Field = ({ label, type = "text", value, onChange, placeholder, disabled, rightEl }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400
          bg-white transition-all duration-200 outline-none
          focus:border-sky-400 focus:ring-2 focus:ring-sky-500/15
          disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${rightEl ? "pr-11" : ""}
          border-slate-200 hover:border-slate-300`}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────
const AdminProfile = () => {
  const { user } = useAuth();
  const fileRef = useRef(null);

  // profile form
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  // photo preview
  const [previewURL, setPreviewURL] = useState(user?.photoURL || "");
  const [photoFile, setPhotoFile]   = useState(null);

  const updateProfile  = useUpdateProfile();
  const uploadPhoto    = useUploadPhoto();
  const changePassword = useChangePassword();

  // ── Photo pick ───────────────────────────────────────────────────────
  const handlePhotoPick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  // ── Save profile ─────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setProfileMsg({ type: "", text: "" });
    try {
      let photoURL = user?.photoURL || "";
      if (photoFile) {
        photoURL = await uploadPhoto.mutateAsync(photoFile);
      }
      await updateProfile.mutateAsync({ displayName, photoURL });
      setPhotoFile(null);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Update failed." });
    }
  };

  // ── Change password ──────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPwMsg({ type: "", text: "" });
    if (!currentPw || !newPw || !confirmPw) {
      return setPwMsg({ type: "error", text: "Please fill all password fields." });
    }
    if (newPw.length < 6) {
      return setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
    }
    if (newPw !== confirmPw) {
      return setPwMsg({ type: "error", text: "New passwords do not match." });
    }
    try {
      await changePassword.mutateAsync({ currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwMsg({ type: "success", text: "Password changed successfully!" });
    } catch (err) {
      const msg =
        err.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : err.code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : err.message || "Failed to change password.";
      setPwMsg({ type: "error", text: msg });
    }
  };

  const isSavingProfile =
    updateProfile.isPending || uploadPhoto.isPending;

  const eyeBtn = (show, setShow) => (
    <button
      type="button"
      onClick={() => setShow((v) => !v)}
      className="text-slate-400 hover:text-slate-600 transition-colors"
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="min-h-full bg-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account information and security</p>
        </div>

        {/* ── Profile hero card ── */}
        <div className="bg-gradient-to-br from-[#0a1628] via-[#0c2340] to-[#0f2d52] rounded-2xl p-6 flex items-center gap-5">
          {/* Avatar with camera overlay */}
          <div className="relative flex-shrink-0">
            <img
              src={previewURL || "https://i.ibb.co/2kR8z2Q/user.png"}
              alt="avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-400
                flex items-center justify-center text-white border-2 border-[#0c2340]
                transition-colors shadow-lg"
              title="Change photo"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoPick}
            />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-bold text-lg leading-tight truncate">
                {user?.displayName || "Admin"}
              </p>
              <span className="flex items-center gap-1 bg-sky-500/20 text-sky-300 text-[10px] font-bold
                uppercase tracking-widest px-2.5 py-1 rounded-full border border-sky-500/30">
                <ShieldCheck size={10} />
                Super Admin
              </span>
            </div>
            <p className="text-white/40 text-sm mt-1 truncate">{user?.email}</p>
            <p className="text-white/25 text-xs mt-2">
              Member since {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        {/* ── Profile info section ── */}
        <Section title="Profile Information" icon={User}>
          <div className="flex flex-col gap-4">
            <Field
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
            <Field
              label="Email Address"
              value={user?.email || ""}
              disabled
            />
            {photoFile && (
              <p className="text-xs text-sky-500 font-medium flex items-center gap-1.5">
                <Camera size={13} />
                New photo selected — will upload on save
              </p>
            )}
            <Alert type={profileMsg.type} message={profileMsg.text} />
            <button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                bg-sky-500 hover:bg-sky-400 active:scale-[0.98]
                text-white text-sm font-semibold transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25"
            >
              <Save size={15} />
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Section>

        {/* ── Password section ── */}
        <Section title="Change Password" icon={Lock}>
          <div className="flex flex-col gap-4">
            <Field
              label="Current Password"
              type={showCurrent ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password"
              rightEl={eyeBtn(showCurrent, setShowCurrent)}
            />
            <Field
              label="New Password"
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Minimum 6 characters"
              rightEl={eyeBtn(showNew, setShowNew)}
            />
            <Field
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Re-enter new password"
              rightEl={eyeBtn(showConfirm, setShowConfirm)}
            />

            {/* password strength hint */}
            {newPw && (
              <div className="flex gap-1.5">
                {[1,2,3,4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${newPw.length >= i * 3
                        ? i <= 1 ? "bg-red-400"
                          : i <= 2 ? "bg-amber-400"
                          : i <= 3 ? "bg-yellow-400"
                          : "bg-emerald-400"
                        : "bg-slate-200"
                      }`}
                  />
                ))}
                <span className="text-xs text-slate-400 ml-1">
                  {newPw.length < 4 ? "Weak"
                    : newPw.length < 7 ? "Fair"
                    : newPw.length < 10 ? "Good"
                    : "Strong"}
                </span>
              </div>
            )}

            <Alert type={pwMsg.type} message={pwMsg.text} />
            <button
              onClick={handleChangePassword}
              disabled={changePassword.isPending}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                bg-slate-800 hover:bg-slate-700 active:scale-[0.98]
                text-white text-sm font-semibold transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Lock size={15} />
              {changePassword.isPending ? "Changing..." : "Change Password"}
            </button>
          </div>
        </Section>

        {/* bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  );
};

export default AdminProfile;
