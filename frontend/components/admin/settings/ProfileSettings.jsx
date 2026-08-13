import React, { useState, useEffect } from "react";
import { User, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import authService from "../../../services/authService";

const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [designation, setDesignation] = useState("System Administrator");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
      } else {
        setName("Dr. Administrator");
        setEmail("admin@smartlab.edu.in");
      }
    } catch (e) {
      setName("Dr. Administrator");
      setEmail("admin@smartlab.edu.in");
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const stored = localStorage.getItem("user");
      const u = stored ? JSON.parse(stored) : {};
      const currentEmail = u.email || "admin@smartlab.com";

      // Call backend API
      const res = await authService.updateProfile(currentEmail, email, name, phone, designation);
      
      u.name = name;
      u.email = email;
      u.phone = phone;
      u.designation = designation;
      localStorage.setItem("user", JSON.stringify(u));
      toast.success("Admin Profile saved successfully!");
    } catch (err) {
      toast.error(err.response?.data || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Admin Profile Settings</h2>
          <p className="text-xs text-slate-400">Update your administrator contact details and credentials</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Administrator Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Administrator"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-orange-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartlab.edu.in"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-orange-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-orange-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="System Administrator"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-white text-sm focus:border-orange-500 outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 text-sm transition shadow-lg disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Profile</span>
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;