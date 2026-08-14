import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/adminService';
import { 
  Download, RefreshCw, FileText, Users, UserCog, Package, 
  ClipboardList, Wrench, FlaskConical, Filter 
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#F97316', '#22C55E', '#EF4444', '#3B82F6', '#8B5CF6', '#FACC15'];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [datasets, setDatasets] = useState({
    users: [],
    departments: [],
    laboratories: [],
    equipments: [],
    bookings: [],
    faults: [],
    maintenance: []
  });

  const fetchLiveReportData = async () => {
    setLoading(true);
    try {
      const [stRes, facRes, deptRes, labRes, eqRes, bookRes, faultRes, maintRes] = await Promise.all([
        adminService.getStudentsAll().catch(() => ({ data: [] })),
        adminService.getFacultyAll().catch(() => ({ data: [] })),
        adminService.getDepartmentsAll().catch(() => ({ data: [] })),
        adminService.getLaboratories().catch(() => ({ data: [] })),
        adminService.getEquipments().catch(() => ({ data: [] })),
        adminService.getBookings().catch(() => ({ data: [] })),
        adminService.getFaults().catch(() => ({ data: [] })),
        adminService.getMaintenance().catch(() => ({ data: [] }))
      ]);

      const parseArray = (res) => {
        const body = res?.data || res;
        if (!body) return [];
        if (body.success && body.data) {
          return Array.isArray(body.data) ? body.data : (body.data.content || []);
        }
        if (Array.isArray(body)) return body;
        return body.content || [];
      };

      const students = parseArray(stRes);
      const faculty = parseArray(facRes);
      const departments = parseArray(deptRes);
      const laboratories = parseArray(labRes);
      const equipments = parseArray(eqRes);
      const bookings = parseArray(bookRes);
      const faults = parseArray(faultRes);
      const maintenance = parseArray(maintRes);

      setDatasets({
        students,
        faculty,
        users: [
          ...students.map(s => ({ ...s, role: 'STUDENT' })),
          ...faculty.map(f => ({ ...f, role: 'FACULTY' }))
        ],
        departments,
        laboratories,
        equipments,
        bookings,
        faults,
        maintenance
      });
    } catch (error) {
      toast.error('Failed to load system reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveReportData();
  }, []);

  // Filter Users
  const studentList = datasets.users.filter(u => (u.role === 'STUDENT' || u.userRole === 'STUDENT'));
  const facultyList = datasets.users.filter(u => (u.role === 'FACULTY' || u.userRole === 'FACULTY'));

  // Derived Trend Chart Data
  const monthMap = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
  datasets.bookings.forEach(b => {
    const dStr = b.bookingDate || b.date || b.bookedAt;
    if (dStr) {
      try {
        const dateObj = new Date(dStr);
        if (!isNaN(dateObj.getTime())) {
          const m = dateObj.toLocaleString('en-US', { month: 'short' });
          if (monthMap[m] !== undefined) monthMap[m]++;
        }
      } catch (e) {
        // ignore
      }
    }
  });
  const trendData = Object.keys(monthMap)
    .map(m => ({ month: m, bookings: monthMap[m] }))
    .filter((item, index) => index <= new Date().getMonth() + 1);

  // Equipment Utilization Ranking based on actual booking frequencies
  const eqUsageMap = {};
  datasets.equipments.forEach(eq => {
    eqUsageMap[eq.name] = 0;
  });
  datasets.bookings.forEach(b => {
    const name = typeof b.equipment === 'object' ? b.equipment?.name : b.equipment;
    if (name && eqUsageMap[name] !== undefined) {
      eqUsageMap[name]++;
    }
  });
  const usageData = Object.keys(eqUsageMap)
    .map(k => ({ name: k.length > 15 ? k.slice(0, 12) + '...' : k, usage: eqUsageMap[k] }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 6);

  // Status Distribution Data
  const bookingStatusMap = { Pending: 0, Approved: 0, Rejected: 0, Completed: 0 };
  datasets.bookings.forEach(b => {
    const st = b.status || 'Pending';
    const normalized = st.charAt(0).toUpperCase() + st.slice(1).toLowerCase();
    if (bookingStatusMap[normalized] !== undefined) {
      bookingStatusMap[normalized]++;
    } else {
      bookingStatusMap['Pending']++;
    }
  });
  const bookingStatusData = Object.keys(bookingStatusMap).map(k => ({ name: k, value: bookingStatusMap[k] }));

  // Equipment Status mapping dynamically linked to live Faults and Maintenance
  const eqStatusMap = { Available: 0, 'Under Maintenance': 0, Faulty: 0 };
  datasets.equipments.forEach(e => {
    const st = e.status || 'Available';
    const eqId = e.equipmentId || e.id;
    const isFaulty = datasets.faults.some(f => f.status && f.status.toLowerCase() !== 'resolved' && (f.equipment?.equipmentId || f.equipmentId) === eqId);
    const isMaint = datasets.maintenance.some(m => m.status && m.status.toLowerCase() !== 'completed' && (m.equipment?.equipmentId || m.equipmentId) === eqId);
    
    if (isFaulty) {
      eqStatusMap['Faulty']++;
    } else if (isMaint || st === 'Under Maintenance' || st === 'Maintenance') {
      eqStatusMap['Under Maintenance']++;
    } else if (eqStatusMap[st] !== undefined) {
      eqStatusMap[st]++;
    } else {
      eqStatusMap['Available']++;
    }
  });
  const equipmentStatusData = Object.keys(eqStatusMap).map(k => ({ name: k, value: eqStatusMap[k] }));

  /* ── Export CSV Helpers ───────────────────────────────────── */
  const exportCSV = (filename, headers, rows) => {
    if (!rows || rows.length === 0) {
      toast.error(`No ${filename} records available to export`);
      return;
    }
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filename} report!`);
  };

  const downloadReportModule = (type) => {
    if (type === 'STUDENTS') {
      const headers = ["ID", "Name", "Email", "Department", "RegNo", "Status"];
      const rows = (studentList.length ? studentList : datasets.users).map(s => [
        String(s.studentId || s.id || ''),
        `"${String(s.name || '').replace(/"/g, '""')}"`,
        `"${String(s.email || '').replace(/"/g, '""')}"`,
        `"${String(s.department || '').replace(/"/g, '""')}"`,
        `"${String(s.regNo || s.registerNo || '-').replace(/"/g, '""')}"`,
        `"${String(s.status || 'ACTIVE').replace(/"/g, '""')}"`
      ]);
      exportCSV("Students_Report", headers, rows);
    } else if (type === 'FACULTY') {
      const headers = ["ID", "Name", "Email", "Department", "Designation", "Status"];
      const rows = (facultyList.length ? facultyList : datasets.users).map(f => [
        String(f.facultyId || f.id || ''),
        `"${String(f.name || '').replace(/"/g, '""')}"`,
        `"${String(f.email || '').replace(/"/g, '""')}"`,
        `"${String(f.department || '').replace(/"/g, '""')}"`,
        `"${String(f.designation || 'Professor').replace(/"/g, '""')}"`,
        `"${String(f.status || 'ACTIVE').replace(/"/g, '""')}"`
      ]);
      exportCSV("Faculty_Report", headers, rows);
    } else if (type === 'EQUIPMENT') {
      const headers = ["ID", "Name", "Category", "Lab", "SerialNo", "Quantity", "Status"];
      const rows = datasets.equipments.map(e => [
        String(e.equipmentId || e.id || ''),
        `"${String(e.name || '').replace(/"/g, '""')}"`,
        `"${String(e.category || 'General').replace(/"/g, '""')}"`,
        `"${String(typeof e.laboratory === 'object' ? e.laboratory?.name : (e.laboratory || e.lab || 'N/A')).replace(/"/g, '""')}"`,
        `"${String(e.serialNo || '-').replace(/"/g, '""')}"`,
        `"${String(e.quantity || 1).replace(/"/g, '""')}"`,
        `"${String(e.status || 'Available').replace(/"/g, '""')}"`
      ]);
      exportCSV("Equipment_Report", headers, rows);
    } else if (type === 'BOOKINGS') {
      const headers = ["ID", "Student", "Equipment", "Date", "TimeSlot", "Status"];
      const rows = datasets.bookings.map(b => [
        String(b.bookingId || b.id || ''),
        `"${String(typeof b.student === 'object' ? b.student?.name : (b.student || '')).replace(/"/g, '""')}"`,
        `"${String(typeof b.equipment === 'object' ? b.equipment?.name : (b.equipment || '')).replace(/"/g, '""')}"`,
        `"${String(b.date || b.bookedAt || 'N/A').replace(/"/g, '""')}"`,
        `"${String(b.timeSlot || 'N/A').replace(/"/g, '""')}"`,
        `"${String(b.status || 'Pending').replace(/"/g, '""')}"`
      ]);
      exportCSV("Booking_Report", headers, rows);
    } else if (type === 'MAINTENANCE') {
      const headers = ["ID", "Equipment", "ScheduledDate", "Technician", "Type", "Status"];
      const rows = datasets.maintenance.map(m => [
        String(m.id || ''),
        `"${String(typeof m.equipment === 'object' ? m.equipment?.name : (m.equipment || '')).replace(/"/g, '""')}"`,
        `"${String(m.scheduledDate || '-').replace(/"/g, '""')}"`,
        `"${String(m.technician || 'Assigned Staff').replace(/"/g, '""')}"`,
        `"${String(m.type || 'Preventive').replace(/"/g, '""')}"`,
        `"${String(m.status || 'Scheduled').replace(/"/g, '""')}"`
      ]);
      exportCSV("Maintenance_Report", headers, rows);
    } else if (type === 'LABORATORIES') {
      const headers = ["ID", "Name", "Department", "Location", "Capacity", "Status"];
      const rows = datasets.laboratories.map(l => [
        String(l.labId || l.id || ''),
        `"${String(l.name || '').replace(/"/g, '""')}"`,
        `"${String(typeof l.department === 'object' ? l.department?.name : (l.department || '')).replace(/"/g, '""')}"`,
        `"${String(l.location || 'Main Building').replace(/"/g, '""')}"`,
        `"${String(l.capacity || 30).replace(/"/g, '""')}"`,
        `"${String(l.status || 'Active').replace(/"/g, '""')}"`
      ]);
      exportCSV("Laboratories_Report", headers, rows);
    }
  };

  const reportModules = [
    { type: 'STUDENTS', title: 'Students Report', desc: `${studentList.length} Enrolled Students`, icon: Users, color: 'bg-blue-500' },
    { type: 'FACULTY', title: 'Faculty Report', desc: `${facultyList.length} Registered Faculty`, icon: UserCog, color: 'bg-green-500' },
    { type: 'EQUIPMENT', title: 'Equipment Report', desc: `${datasets.equipments.length} Total Hardware Assets`, icon: Package, color: 'bg-orange-500' },
    { type: 'BOOKINGS', title: 'Bookings Report', desc: `${datasets.bookings.length} Reservation Logs`, icon: ClipboardList, color: 'bg-purple-500' },
    { type: 'MAINTENANCE', title: 'Maintenance Report', desc: `${datasets.maintenance.filter(m => m.status && m.status.toLowerCase() !== 'completed').length} Active Tasks`, icon: Wrench, color: 'bg-red-500' },
    { type: 'LABORATORIES', title: 'Laboratories Report', desc: `${datasets.laboratories.length} College Rooms`, icon: FlaskConical, color: 'bg-cyan-500' }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-orange-500" />
            System Analytical Reports
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics and instant multi-format data exports built on active database records.
          </p>
        </div>

        <button
          onClick={fetchLiveReportData}
          disabled={loading}
          className="self-start sm:self-center px-5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-2xl transition flex items-center gap-2 text-sm font-semibold border border-slate-700 shadow-md disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
          <span>Refresh Live Reports</span>
        </button>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Students', value: loading ? '-' : studentList.length },
          { label: 'Faculty', value: loading ? '-' : facultyList.length },
          { label: 'Departments', value: loading ? '-' : datasets.departments.length },
          { label: 'Laboratories', value: loading ? '-' : datasets.laboratories.length },
          { label: 'Total Equipment', value: loading ? '-' : datasets.equipments.length },
          { label: 'Total Bookings', value: loading ? '-' : datasets.bookings.length },
          { label: 'Active Faults', value: loading ? '-' : datasets.faults.filter(f => f.status && f.status.toLowerCase() !== 'resolved').length },
          { label: 'Maintenance Tasks', value: loading ? '-' : datasets.maintenance.filter(m => m.status && m.status.toLowerCase() !== 'completed').length }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-md hover:border-slate-700 transition">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Exportable Report Modules */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Generate & Export Data Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.type} 
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-orange-500/40 transition flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className={`w-14 h-14 ${mod.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mod.desc}</p>
                </div>

                <button 
                  onClick={() => downloadReportModule(mod.type)}
                  className="mt-6 w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <Download size={16} />
                  Download CSV Report
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="space-y-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Reservation Growth & Demand Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="bookings" stroke="#F97316" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Equipment Utilization Ranking</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData.length ? usageData : [{ name: 'Default', usage: 10 }]} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                  <Bar dataKey="usage" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Status Breakdown</h3>
            <div className="h-[300px] flex">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={bookingStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} paddingAngle={5} dataKey="value">
                    {bookingStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={equipmentStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} paddingAngle={5} dataKey="value">
                    {equipmentStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
