import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Settings as SettingsIcon, Bell, Lock, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export default function Settings() {
  const { user } = useAuth();

  const [emailNotif, setEmailNotif] = useState(() => {
    const saved = localStorage.getItem('emailNotif');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [smsNotif, setSmsNotif] = useState(() => {
    const saved = localStorage.getItem('smsNotif');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPwd, setChangingPwd] = useState(false);

  const toggleEmailNotif = () => {
    const nextVal = !emailNotif;
    setEmailNotif(nextVal);
    localStorage.setItem('emailNotif', JSON.stringify(nextVal));
    toast.success(nextVal ? 'Email notifications enabled' : 'Email notifications disabled');
  };

  const toggleSmsNotif = () => {
    const nextVal = !smsNotif;
    setSmsNotif(nextVal);
    localStorage.setItem('smsNotif', JSON.stringify(nextVal));
    toast.success(nextVal ? 'SMS alerts enabled' : 'SMS alerts disabled');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPwd(true);
    try {
      await authService.changePassword(
        user?.email,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success('Password changed successfully! Use the new password next time you log in.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
      setChangingPwd(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-orange-500" />
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" /> Notifications
          </h3>
          <p className="text-sm text-slate-400">Manage how you receive alerts and updates about your bookings.</p>
        </div>
        
        <div className="md:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email Notifications</h4>
              <p className="text-sm text-slate-400 mt-1">Receive booking confirmations and reminders via email.</p>
            </div>
            <button 
              type="button"
              onClick={toggleEmailNotif}
              className={`w-12 h-6 rounded-full transition-colors relative ${emailNotif ? 'bg-orange-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${emailNotif ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="h-px bg-slate-800 w-full" />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">SMS Alerts</h4>
              <p className="text-sm text-slate-400 mt-1">Get text messages for important lab announcements.</p>
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

      <div className="h-px bg-slate-800/50 w-full" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" /> Security
          </h3>
          <p className="text-sm text-slate-400">Update your password and secure your account.</p>
        </div>
        
        <div className="md:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={changingPwd}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {changingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}