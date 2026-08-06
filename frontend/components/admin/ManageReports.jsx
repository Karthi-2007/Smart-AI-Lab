import ReportStats from "../../components/admin/reports/ReportStats";
import ReportCards from "../../components/admin/reports/ReportCards";
import ReportFilters from "../../components/admin/reports/ReportFilters";
import RecentReports from "../../components/admin/reports/RecentReports";
import ReportHistory from "../../components/admin/reports/ReportHistory";

const ManageReports = () => {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">

          Reports

        </h1>

        <p className="text-slate-400 mt-2">

          Generate, download and manage system reports.

        </p>

      </div>

      <ReportStats />

      <ReportCards />

      <ReportFilters />

      <RecentReports />

      <ReportHistory />

    </div>
  );
};

export default ManageReports;