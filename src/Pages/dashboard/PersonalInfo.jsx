import { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabase";
import {
  User,
  Briefcase,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Link2,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Pencil,
  X,
  FolderGit2,
  Hash,
  Loader2,
  ExternalLink,
  Camera,
  ImagePlus,
} from "lucide-react";
import { useI18n } from "../../i18n";
import Swal from "sweetalert2";

const STORAGE_PREFIX = "personalInfo_";

const storeLocally = (key, value) => {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
};

const loadLocal = (key, fallback) => {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const SETTINGS_KEYS = [
  "totalProjects",
  "yearsExperience",
  "showYearsExperience",
  "address",
  "addressAr",
  "phone",
  "email",
  "socialLinks",
  "profileImage",
  "fullName",
  "quote",
];

const parseJSON = (val, fallback) => {
  try { return JSON.parse(val); } catch { return fallback; }
};

const leadingEllipsis = (url) => {
  if (!url) return url;
  const cleaned = url.endsWith("/") ? url.slice(0, -1) : url;
  const segments = cleaned.split("/");
  const last = segments.filter(Boolean).pop();
  return last ? `.../${last}` : url;
};

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500 pointer-events-none" />
    <div className="relative glass-card rounded-2xl h-full border border-primary strong-shadow">
      {children}
    </div>
  </div>
);

export default function PersonalInfo() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [totalProjects, setTotalProjects] = useState(() => loadLocal("totalProjects", ""));
  const [yearsExp, setYearsExp] = useState(() => loadLocal("yearsExperience", ""));
  const [showYearsExp, setShowYearsExp] = useState(() => loadLocal("showYearsExperience", false));
  const hardcodedDefaults = {
    address: "6th of October, Giza",
    addressAr: "السادس من أكتوبر، الجيزة",
    phone: "+20 112 302 9406",
    email: "khaledelkhly57@gmail.com",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/Omar-Khaled-57" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/" },
      { platform: "WhatsApp", url: "https://wa.me/201123029406" },
    ],
  };

  const [address, setAddress] = useState(() => loadLocal("address", hardcodedDefaults.address));
  const [addressAr, setAddressAr] = useState(() => loadLocal("addressAr", hardcodedDefaults.addressAr));
  const [phone, setPhone] = useState(() => loadLocal("phone", hardcodedDefaults.phone));
  const [email, setEmail] = useState(() => loadLocal("email", hardcodedDefaults.email));
  const [socialLinks, setSocialLinks] = useState(() => {
    const saved = loadLocal("socialLinks", null);
    return saved && saved.length > 0 ? saved : hardcodedDefaults.socialLinks;
  });

  const [profileImage, setProfileImage] = useState("");
  const [fullName, setFullName] = useState("");
  const [quote, setQuote] = useState("");
  const fileInputRef = useRef(null);

  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const [editTotalProjects, setEditTotalProjects] = useState("");
  const [editYearsExp, setEditYearsExp] = useState("");
  const [editShowYearsExp, setEditShowYearsExp] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editAddressAr, setEditAddressAr] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSocialLinks, setEditSocialLinks] = useState([]);
  const [editProfileImage, setEditProfileImage] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editQuote, setEditQuote] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const startEditing = () => {
    setEditTotalProjects(totalProjects);
    setEditYearsExp(yearsExp);
    setEditShowYearsExp(showYearsExp);
    setEditAddress(address);
    setEditAddressAr(addressAr);
    setEditPhone(phone);
    setEditEmail(email);
    setEditSocialLinks([...socialLinks]);
    setEditProfileImage(profileImage);
    setEditFullName(fullName);
    setEditQuote(quote);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewPlatform("");
    setNewUrl("");
    setEditProfileImage(profileImage);
  };

  useEffect(() => {
    const loadFromDb = async () => {
      try {
        const { data } = await supabase
          .from("app_settings")
          .select("key, value")
          .in("key", SETTINGS_KEYS.map((k) => STORAGE_PREFIX + k));

        if (data) {
          const map = {};
          data.forEach(({ key, value }) => {
            map[key.replace(STORAGE_PREFIX, "")] = value;
          });

          if (map.totalProjects !== undefined) setTotalProjects(parseJSON(map.totalProjects, map.totalProjects));
          if (map.yearsExperience !== undefined) setYearsExp(parseJSON(map.yearsExperience, map.yearsExperience));
          if (map.showYearsExperience !== undefined) setShowYearsExp(map.showYearsExperience === "true");
          if (map.address) setAddress(map.address);
          if (map.addressAr) setAddressAr(map.addressAr);
          if (map.phone) setPhone(map.phone);
          if (map.email) setEmail(map.email);
          if (map.socialLinks !== undefined) {
            const parsed = parseJSON(map.socialLinks, []);
            if (parsed.length > 0) setSocialLinks(parsed);
          }
          if (map.profileImage) setProfileImage(map.profileImage);
          if (map.fullName) setFullName(map.fullName);
          if (map.quote) setQuote(map.quote);
        }
      } catch (err) {
        console.error("Failed to load personal info from DB", err);
      } finally {
        setLoading(false);
      }
    };

    loadFromDb();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setEditProfileImage(data.publicUrl);
    } catch (err) {
      console.error("Failed to upload profile image", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const addLink = () => {
    const platform = newPlatform.trim();
    const url = newUrl.trim();
    if (!platform || !url) return;
    setEditSocialLinks((prev) => [...prev, { platform, url }]);
    setNewPlatform("");
    setNewUrl("");
  };

  const removeLink = (index) => {
    setEditSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const finalTotal = editTotalProjects;
    const finalYearsExp = editYearsExp;
    const finalShowYearsExp = editShowYearsExp;
    const finalAddress = editAddress;
    const finalAddressAr = editAddressAr;
    const finalPhone = editPhone;
    const finalEmail = editEmail;
    const finalSocialLinks = editSocialLinks;
    const finalProfileImage = editProfileImage;
    const finalFullName = editFullName;
    const finalQuote = editQuote;
    try {
      const entries = [
        { key: STORAGE_PREFIX + "totalProjects", value: JSON.stringify(finalTotal) },
        { key: STORAGE_PREFIX + "yearsExperience", value: JSON.stringify(finalYearsExp) },
        { key: STORAGE_PREFIX + "showYearsExperience", value: finalShowYearsExp ? "true" : "false" },
        { key: STORAGE_PREFIX + "address", value: finalAddress },
        { key: STORAGE_PREFIX + "addressAr", value: finalAddressAr },
        { key: STORAGE_PREFIX + "phone", value: finalPhone },
        { key: STORAGE_PREFIX + "email", value: finalEmail },
        { key: STORAGE_PREFIX + "socialLinks", value: JSON.stringify(finalSocialLinks) },
        { key: STORAGE_PREFIX + "profileImage", value: finalProfileImage },
        { key: STORAGE_PREFIX + "fullName", value: finalFullName },
        { key: STORAGE_PREFIX + "quote", value: finalQuote },
      ];

      const { error } = await supabase
        .from("app_settings")
        .upsert(entries, { onConflict: "key" });

      if (error) throw error;

      entries.forEach(({ key, value }) => {
        const shortKey = key.replace(STORAGE_PREFIX, "");
        storeLocally(shortKey, parseJSON(value, value));
      });

      setTotalProjects(finalTotal);
      setYearsExp(finalYearsExp);
      setShowYearsExp(finalShowYearsExp);
      setAddress(finalAddress);
      setAddressAr(finalAddressAr);
      setPhone(finalPhone);
      setEmail(finalEmail);
      setSocialLinks(finalSocialLinks);
      setProfileImage(finalProfileImage);
      setFullName(finalFullName);
      setQuote(finalQuote);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: t("common.successTitle"),
        text: "Personal information saved successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
    } catch (err) {
      console.error("Failed to save personal info", err);
      Swal.fire({
        icon: "error",
        title: t("common.errorTitle"),
        text: err.message,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-accent-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl blur opacity-50 pointer-events-none" />
            <div className="relative w-9 h-9 bg-primary rounded-xl border border-primary flex items-center justify-center">
              <User className="w-4 h-4 text-accent-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              {t("dashboard.personalInfo")}
            </h1>
            <p className="text-secondary text-xs">
              {t("dashboard.personalInfoSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-500/30 text-gray-400 hover:bg-gray-500/10 transition-all text-sm"
              >
                <X className="w-4 h-4" />
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="relative group shrink-0"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
                <div className="relative flex items-center gap-2 px-4 py-2.5 bg-primary rounded-xl border border-primary">
                  {saving ? (
                    <Loader2 className="w-4 h-4 text-accent-primary animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 text-accent-primary" />
                  )}
                  <span className="text-sm text-primary">{t("common.save")}</span>
                </div>
              </button>
            </>
          ) : (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all text-sm font-medium"
            >
              <Pencil className="w-4 h-4" />
              {t("common.edit")}
            </button>
          )}
        </div>
      </div>

      {/* Profile Image, Full Name & Quote */}
      <Card>
        <div className="p-6">
          <div className="flex items-start gap-5">
            {/* Profile Picture */}
            <div className="shrink-0">
              {isEditing ? (
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent-primary/30 bg-secondary">
                    {editProfileImage ? (
                      <img src={editProfileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) handleImageUpload(e.target.files[0]);
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full bg-accent-primary border-2 border-primary flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    {imageUploading ? (
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    ) : (
                      <ImagePlus className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent-primary/30 bg-secondary">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Name & Quote */}
            <div className="flex-1 min-w-0 space-y-3">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-lg font-semibold outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
                  />
                  <textarea
                    value={editQuote}
                    onChange={(e) => setEditQuote(e.target.value)}
                    placeholder="Your quote or bio..."
                    rows={2}
                    className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all resize-none"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-primary whitespace-nowrap">
                    {fullName || "—"}
                  </h2>
                  <p className="text-sm text-secondary italic leading-relaxed whitespace-pre-wrap">
                    {quote || "—"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Projects */}
        <Card>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-xs text-secondary font-medium uppercase tracking-widest">
                {t("dashboard.totalProjects")}
              </p>
            </div>
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={editTotalProjects}
                onChange={(e) => setEditTotalProjects(e.target.value)}
                placeholder={t("dashboard.totalProjectsPlaceholder")}
                className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              />
            ) : (
              <p className="text-2xl font-bold text-primary">{totalProjects || "—"}</p>
            )}
          </div>
        </Card>

        {/* Years of Experience */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
                  <Briefcase className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-secondary font-medium uppercase tracking-widest mb-1">
                    {t("dashboard.yearsExperience")}
                  </p>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => setEditShowYearsExp((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    editShowYearsExp
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                      : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                  }`}
                >
                  {editShowYearsExp ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {editShowYearsExp ? "Visible" : "Hidden"}
                </button>
              )}
              {!isEditing && (
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  showYearsExp
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                    : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                }`}>
                  {showYearsExp ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {showYearsExp ? "Visible" : "Hidden"}
                </span>
              )}
            </div>

            {isEditing && editShowYearsExp && (
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-secondary shrink-0" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={editYearsExp}
                    onChange={(e) => setEditYearsExp(e.target.value)}
                    placeholder={t("dashboard.yearsExperiencePlaceholder")}
                    className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
                  />
                </div>
              </div>
            )}
            {!isEditing && showYearsExp && (
              <p className="text-lg font-semibold text-primary">{yearsExp || "—"}</p>
            )}
          </div>
        </Card>

        {/* Address */}
        <Card>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-secondary font-medium uppercase tracking-widest">
                {t("dashboard.address")}
              </p>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder={t("dashboard.addressPlaceholder")}
                className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              />
            ) : (
              <p className="text-sm text-primary">{address || "—"}</p>
            )}
          </div>
        </Card>

        {/* Address (Arabic) */}
        <Card>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-secondary font-medium uppercase tracking-widest">
                {t("dashboard.addressAr")}
              </p>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editAddressAr}
                onChange={(e) => setEditAddressAr(e.target.value)}
                placeholder={t("dashboard.addressArPlaceholder")}
                dir="rtl"
                className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              />
            ) : (
              <p className="text-sm text-primary" dir="rtl">{addressAr || "—"}</p>
            )}
          </div>
        </Card>

        {/* Phone Number */}
        <Card>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20">
                <Phone className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-xs text-secondary font-medium uppercase tracking-widest">
                {t("dashboard.phone")}
              </p>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder={t("dashboard.phonePlaceholder")}
                className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              />
            ) : (
              <p className="text-sm text-primary">{phone || "—"}</p>
            )}
          </div>
        </Card>

        {/* Email */}
        <Card>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20">
                <Mail className="w-5 h-5 text-rose-400" />
              </div>
              <p className="text-xs text-secondary font-medium uppercase tracking-widest">
                {t("dashboard.email")}
              </p>
            </div>
            {isEditing ? (
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder={t("dashboard.emailPlaceholder")}
                className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              />
            ) : (
              <p className="text-sm text-primary">{email || "—"}</p>
            )}
          </div>
        </Card>
      </div>

      {/* Social / External Links */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
              <Link2 className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-xs text-secondary font-medium uppercase tracking-widest">
              {t("dashboard.socialLinks")}
            </p>
          </div>

          {isEditing ? (
            <>
              {editSocialLinks.length > 0 && (
                <div className="space-y-3">
                  {editSocialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2 strong-shadow"
                    >
                      <GripVertical className="w-4 h-4 text-secondary shrink-0" />
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => {
                          const next = [...editSocialLinks];
                          next[index] = { ...next[index], platform: e.target.value };
                          setEditSocialLinks(next);
                        }}
                        placeholder={t("dashboard.platformPlaceholder")}
                        className="w-[120px] bg-primary rounded-lg px-3 py-1.5 text-primary text-sm outline-none focus:ring-1 focus:ring-accent-primary/20 transition-all"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const next = [...editSocialLinks];
                          next[index] = { ...next[index], url: e.target.value };
                          setEditSocialLinks(next);
                        }}
                        placeholder={t("dashboard.urlPlaceholder")}
                        className="min-w-0 flex-1 bg-primary rounded-lg px-3 py-1.5 text-primary text-sm outline-none focus:ring-1 focus:ring-accent-primary/20 transition-all"
                      />
                      <button
                        onClick={() => removeLink(index)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  placeholder={t("dashboard.platformPlaceholder")}
                  className="flex-1 bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
                />
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={t("dashboard.urlPlaceholder")}
                  className="flex-[2] bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
                />
                <button
                  onClick={addLink}
                  disabled={!newPlatform.trim() || !newUrl.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  {t("dashboard.addLink")}
                </button>
              </div>
            </>
          ) : (
            <>
              {socialLinks.length > 0 ? (
                <div className="space-y-2">
                  {socialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 strong-shadow"
                    >
                      <span className="text-sm font-semibold text-primary min-w-[100px]">
                        {link.platform}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-secondary truncate flex-1 hover:text-accent-primary transition-colors"
                        title={link.url}
                      >
                        {leadingEllipsis(link.url)}
                      </a>
                      <ExternalLink className="w-3.5 h-3.5 text-secondary shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-secondary">—</p>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
