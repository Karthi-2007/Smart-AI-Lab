import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Building, Phone, Edit2, Save, X, Briefcase, Loader2 } from 'lucide-react';

const FacultyProfile = () => {
  const { user, updateUser } = useAuth() || { user: {} };
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    designation: ''
  });

  // Fetch fresh profile from DB on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const profileId = user?.id || user?.userId;
      if (!profileId) { setLoading(false); return; }
      try {
        const res = await facultyService.getProfile(profileId);
        const data = res?.data || res;
        setProfile(data);
        setFormData({
          name: data.name || user?.name || '',
          phone: data.phone || user?.phone || '',
          department: data.department || user?.department || '',
          designation: data.designation || user?.designation || ''
        });
        if (data.name && updateUser) {
          updateUser({ name: data.name, department: data.department, phone: data.phone });
        }
      } catch (err) {
        console.warn('Could not fetch faculty profile from DB:', err);
        setFormData({
          name: user?.name || '',
          phone: user?.phone || '',
          department: user?.department || '',
          designation: user?.designation || ''
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id, user?.userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const profileId = user?.id || user?.userId;
    if (!profileId) { toast.error('User ID not found'); return; }
    try {
      setIsSaving(true);
      const res = await facultyService.updateProfile(profileId, formData);
      const updated = res?.data || res || formData;
      const savedName  = updated.name        || formData.name;
      const savedDept  = updated.department  || formData.department;
      const savedPhone = updated.phone       || formData.phone;
      const savedDesig = updated.designation || formData.designation;

      if (updateUser) updateUser({ name: savedName, department: savedDept, phone: savedPhone });
      setFormData({ name: savedName, phone: savedPhone, department: savedDept, designation: savedDesig });
      setProfile((prev) => ({ ...prev, name: savedName, department: savedDept, phone: savedPhone, designation: savedDesig }));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        department: profile.department || '',
        designation: profile.designation || ''
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Faculty Profile</h2>
          <p className="text-slate-400 text-sm">Your information from the SmartLab database.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      {/* Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        {/* Banner + Avatar */}
        <div className="h-32 bg-gradient-to-r from-orange-600/30 via-amber-500/20 to-slate-900 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 border-4 border-slate-900 flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-bold">{getInitials(formData.name)}</span>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">

          {/* Name + designation sub-header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">{formData.name || 'Faculty Member'}</h3>
            <p className="text-orange-400 text-sm mt-1 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" />
              {formData.designation || 'Faculty'}
              {formData.department ? ` · ${formData.department}` : ''}
            </p>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              ) : (
                <p className="text-white">
                  {formData.name || <span className="text-slate-500 italic text-sm">Not set</span>}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <p className="text-slate-300">{user?.email || profile?.email || 'Not provided'}</p>
              {isEditing && <p className="text-xs text-slate-600">Email cannot be changed.</p>}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Building className="w-4 h-4" /> Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-slate-600"
                />
              ) : (
                <p className="text-white">
                  {formData.department || <span className="text-slate-500 italic text-sm">Not set</span>}
                </p>
              )}
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Designation
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Assistant Professor"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-slate-600"
                />
              ) : (
                <p className="text-white">
                  {formData.designation || <span className="text-slate-500 italic text-sm">Not set</span>}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-slate-600"
                />
              ) : (
                <p className="text-white">
                  {formData.phone || <span className="text-slate-500 italic text-sm">Not set</span>}
                </p>
              )}
            </div>

          </div>

          {/* Save / Cancel buttons inside card when editing */}
          {isEditing && (
            <div className="pt-6 mt-2 flex items-center gap-4 border-t border-slate-800">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 font-medium"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;