import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { toast } from 'react-hot-toast';
import {
  User, Mail, Hash, Building2, Phone,
  Save, Edit2, Loader2, GraduationCap, RefreshCw
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    phone: '',
    year: ''
  });

  // Fetch fresh profile from DB on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const profileId = user?.id || user?.userId;
      if (!profileId) { setLoading(false); return; }
      try {
        const res = await studentService.getProfile(profileId);
        const body = res?.data || res;
        const data = body?.success ? body.data : body;
        setProfile(data);
        setFormData({
          name: data.name || user?.name || '',
          department: data.department || user?.department || '',
          phone: data.phone || user?.phone || '',
          year: data.year || ''
        });
        // Also sync AuthContext so topbar shows correct name
        if (data.name) updateUser({ name: data.name, department: data.department, phone: data.phone });
      } catch (err) {
        console.warn('Could not fetch profile from DB, using auth context:', err);
        setFormData({
          name: user?.name || '',
          department: user?.department || '',
          phone: user?.phone || '',
          year: ''
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id, user?.userId]);

  const handleSave = async () => {
    const profileId = user?.id || user?.userId;
    if (!profileId) { toast.error('User ID not found'); return; }
    try {
      setSaving(true);
      const res = await studentService.updateProfile(profileId, {
        ...formData,
        email: user?.email
      });
      const updated = res?.data || res || formData;
      const savedName  = updated.name       || formData.name;
      const savedDept  = updated.department || formData.department;
      const savedPhone = updated.phone      || formData.phone;
      const savedYear  = updated.year       || formData.year;

      updateUser({ name: savedName, department: savedDept, phone: savedPhone });
      setFormData({ name: savedName, department: savedDept, phone: savedPhone, year: savedYear });
      setProfile((prev) => ({ ...prev, name: savedName, department: savedDept, phone: savedPhone, year: savedYear }));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert to last saved values
    if (profile) {
      setFormData({
        name: profile.name || '',
        department: profile.department || '',
        phone: profile.phone || '',
        year: profile.year || ''
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

        {/* Banner + Avatar */}
        <div className="h-36 bg-gradient-to-r from-orange-600/30 via-amber-500/20 to-slate-900 relative">
          <div className="absolute -bottom-14 left-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 border-4 border-slate-900 flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl font-bold">{getInitials(formData.name)}</span>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          {/* Header row */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">{formData.name || 'Student'}</h1>
              <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm">
                <Hash className="w-3.5 h-3.5" />
                {user?.regNo || profile?.regNo || 'Reg No not available'}
              </p>
              {formData.department && (
                <p className="text-orange-400 text-sm mt-1 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  {formData.department}
                </p>
              )}
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              ) : (
                <div className="text-slate-200 py-2 text-sm">{formData.name || <span className="text-slate-500 italic">Not set</span>}</div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <div className="text-slate-200 py-2 text-sm">{user?.email || profile?.email || '-'}</div>
              <p className="text-xs text-slate-600">Email cannot be changed.</p>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-slate-600"
                />
              ) : (
                <div className="text-slate-200 py-2 text-sm">{formData.department || <span className="text-slate-500 italic">Not set</span>}</div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-slate-600"
                />
              ) : (
                <div className="text-slate-200 py-2 text-sm">{formData.phone || <span className="text-slate-500 italic">Not set</span>}</div>
              )}
            </div>

            {/* Year */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" /> Year of Study
              </label>
              {isEditing ? (
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              ) : (
                <div className="text-slate-200 py-2 text-sm">
                  {formData.year ? `Year ${formData.year}` : <span className="text-slate-500 italic">Not set</span>}
                </div>
              )}
            </div>

            {/* Reg No (read-only) */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-3.5 h-3.5" /> Registration No.
              </label>
              <div className="text-slate-200 py-2 text-sm">
                {user?.regNo || profile?.regNo || <span className="text-slate-500 italic">Not available</span>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}