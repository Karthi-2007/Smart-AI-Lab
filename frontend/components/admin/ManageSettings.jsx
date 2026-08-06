import ProfileSettings from "../../components/admin/settings/ProfileSettings";
import SystemSettings from "../../components/admin/settings/SystemSettings";
import NotificationSettings from "../../components/admin/settings/NotificationSettings";
import SecuritySettings from "../../components/admin/settings/SecuritySettings";
import BackupSettings from "../../components/admin/settings/BackupSettings";

const ManageSettings = () => {
  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white">System Settings & Configuration</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Manage administrator profile, system preferences, security, and system backups.
        </p>
      </div>

      <ProfileSettings />

      <SystemSettings />

      <NotificationSettings />

      <SecuritySettings />

      <BackupSettings />
    </div>
  );
};

export default ManageSettings;