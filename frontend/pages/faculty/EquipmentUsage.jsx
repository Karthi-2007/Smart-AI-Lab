import React, { useState, useEffect } from 'react';
import ReportChart from '../../components/faculty/ReportChart';
import facultyService from '../../services/facultyService';
import initialUsageHistory from '../../src/data/usageHistory';

const EquipmentUsagePage = () => {
  const [usageList, setUsageList] = useState(initialUsageHistory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsage = async () => {
      setLoading(true);
      try {
        const res = await facultyService.getReportsSummary();
        const body = res?.data || res;
        const data = body?.data || body;
        if (data && data.usageList) {
          setUsageList(data.usageList);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial usage history fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipment Usage Analytics</h1>
          <p className="text-slate-400 text-sm">Monitor laboratory equipment utilization metrics and peak hours</p>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <h2 className="text-md font-semibold text-white mb-4">Utilization Trends</h2>
        <ReportChart />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <h2 className="text-md font-semibold text-white mb-4">Recent Usage Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Used By</th>
                <th className="py-3 px-3">Lab Name</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usageList.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-3 font-medium text-white">{item.equipmentName}</td>
                  <td className="py-3 px-3">{item.usedBy}</td>
                  <td className="py-3 px-3 text-slate-400">{item.labName}</td>
                  <td className="py-3 px-3 text-slate-400">{item.date}</td>
                  <td className="py-3 px-3 text-cyan-400 font-semibold">{item.duration}</td>
                  <td className="py-3 px-3 text-slate-300">{item.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipmentUsagePage;
