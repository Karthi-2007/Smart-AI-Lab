import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Bell, Shield, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

const FacultySettings = () => {
  const { user } = useAuth();

  const [emailNotif, setEmailNotif] = useState(() => {
    const saved = localStorage.getItem('facultyEmailNotif');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [smsNotif, setSmsNotif] = useState(() => {
    const saved = localStorage.getItem('facultySmsNotif');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const toggleEmailNotif = () => {
    const nextVal = !emailNotif;
    setEmailNotif(nextVal);
    localStorage.setItem('facultyEmailNotif', JSON.stringify(nextVal));
    toast.success(nextVal ? 'Email notifications enabled' : 'Email notifications disabled');
  };

  const toggleSmsNotif = () => {
    const nextVal = !smsNotif;
    setSmsNotif(nextVal);
    localStorage.setItem('facultySmsNotif', JSON.stringify(nextVal));
    toast.success(nextVal ? 'SMS alerts enabled' : 'SMS alerts disabled');
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await authService.changePassword(
        user?.email,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success('Password changed successfully! Use the new password next time you log in.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const serverMsg = err?.response?.data;
      if (err?.response?.status === 401) {
        toast.error('Current password is incorrect');
      } else if (typeof serverMsg === 'string') {
        toast.error(serverMsg);
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Manage your preferences and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Bell className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-slate-400">Receive updates about requests via email.</p>
              </div>
              <button
                type="button"
                onClick={toggleEmailNotif}
                className={`w-12 h-6 rounded-full transition-colors relative ${emailNotif ? 'bg-orange-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${emailNotif ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium flex items-center gap-2">
                  SMS Alerts
                </p>
                <p className="text-sm text-slate-400">Receive urgent notifications via SMS.</p>
              </div>
              <button
                type="button"
                onClick={toggleSmsNotif}
                className={`w-12 h-6 rounded-full transition-colors relative ${smsNotif ? 'bg-orange-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${smsNotif ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  name="currentPassword"
                  required
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Enter current password"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Create new password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultySettings;