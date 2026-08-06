import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";

import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";
import ActivateAccount from "../pages/public/ActivateAccount";
import Login from "../pages/public/Login";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageStudents from "../pages/admin/ManageStudents";
import AdminManageEquipment from "../pages/admin/ManageEquipment";
import AdminManageLaboratories from "../pages/admin/ManageLabs";
import ManageFaculty from "../pages/admin/ManageFaculty";
import ManageDepartments from "../pages/admin/ManageDepartments";
import ManageBookings from "../components/admin/ManageBookings";
import ManageMaintenance from "../pages/admin/Maintenance";
import ManageReports from "../pages/admin/Reports";
import AIAnalytics from "../pages/admin/AIAnalytics";
import ManageSettings from "../pages/admin/Settings";
import ManageFaults from "../components/admin/ManageFaults";
import AdminNotifications from "../pages/admin/Notifications";
import AdminQRMonitorPage from "../pages/admin/QRMonitorPage";
import FacultyQRMonitorPage from "../pages/faculty/QRMonitorPage";

import StudentDashboard from "../pages/student/StudentDashboard";
import Equipment from "../pages/student/Equipment";
import EquipmentDetails from "../pages/student/EquipmentDetails";
import BookEquipment from "../pages/student/BookEquipment";
import MyBookings from "../pages/student/MyBookings";
import BookingHistory from "../pages/student/BookingHistory";
import UsageHistory from "../pages/student/UsageHistory";
import ReportFault from "../pages/student/ReportFault";
import StudentNotifications from "../pages/student/Notifications";
import StudentSettings from "../pages/student/Settings.jsx";
import StudentProfile from "../pages/student/Profile";

import BookingApproval from "../pages/faculty/BookingApprovals";
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import FacultyManageLaboratories from "../pages/faculty/ManageLaboratories";
import FacultyManageEquipment from "../pages/faculty/ManageEquipment";
import MaintenanceRequests from "../pages/faculty/MaintenanceRequests";
import FacultyReports from "../pages/faculty/FacultyReports";
import EquipmentUsage from "../pages/faculty/EquipmentUsage";
import FacultyNotifications from "../pages/faculty/Notifications";
import FacultyProfile from "../pages/faculty/FacultyProfile";
import FacultySettings from "../pages/faculty/FacultySettings";
import FacultyLayout from "../layouts/FacultyLayout";
import StudentLayout from "../layouts/StudentLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/activate-account" element={<ActivateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/students" element={<ManageStudents />} />
              <Route path="/admin/equipment" element={<AdminManageEquipment />} />
              <Route path="/admin/laboratories" element={<AdminManageLaboratories />} />
              <Route path="/admin/faculty" element={<ManageFaculty />} />
              <Route path="/admin/departments" element={<ManageDepartments />} />
              <Route path="/admin/bookings" element={<ManageBookings />} />
              <Route path="/admin/qr-monitor" element={<AdminQRMonitorPage />} />
              <Route path="/admin/maintenance" element={<ManageMaintenance />} />
              <Route path="/admin/reports" element={<ManageReports />} />
              <Route path="/admin/analytics" element={<AIAnalytics />} />
              <Route path="/admin/faults" element={<ManageFaults />} />
              <Route path="/admin/settings" element={<ManageSettings />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
            </Route>
          </Route>

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/equipment" element={<EquipmentDetails />} />
              <Route path="/student/book-equipment" element={<BookEquipment />} />
              <Route path="/student/bookings" element={<MyBookings />} />
              <Route path="/student/usage" element={<UsageHistory />} />
              <Route path="/student/fault-reports" element={<ReportFault />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/settings" element={<StudentSettings />} />
            </Route>
          </Route>

          {/* Protected Faculty Routes */}
          <Route element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']} />}>
            <Route path="/faculty" element={<FacultyLayout />}>
              <Route index element={<FacultyDashboard />} />
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/bookings" element={<BookingApproval />} />
              <Route path="/faculty/qr-monitor" element={<FacultyQRMonitorPage />} />
              <Route path="/faculty/labs" element={<FacultyManageLaboratories />} />
              <Route path="/faculty/equipment" element={<FacultyManageEquipment />} />
              <Route path="/faculty/maintenance" element={<MaintenanceRequests />} />
              <Route path="/faculty/reports" element={<FacultyReports />} />
              <Route path="/faculty/equipment-usage" element={<EquipmentUsage />} />
              <Route path="/faculty/notifications" element={<FacultyNotifications />} />
              <Route path="/faculty/profile" element={<FacultyProfile />} />
              <Route path="/faculty/settings" element={<FacultySettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;