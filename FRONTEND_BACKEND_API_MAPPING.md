# Frontend-to-Backend API Mapping Reference

This document maps user actions in the React/Vite frontend to their dedicated REST endpoints in the Spring Boot microservices backend.

| Frontend Component/Service | User Action | HTTP Method | Backend URL | Description |
|---|---|---|---|---|
| **ManageStudents.jsx** | View All Students | `GET` | `/api/business/students/all` | Fetch all student records. |
| **ManageStudents.jsx** | Filter Active Students | `GET` | `/api/business/students/active` | Fetch activated students. |
| **ManageStudents.jsx** | Filter Pending Students | `GET` | `/api/business/students/pending` | Fetch pending students. |
| **ManageStudents.jsx** | Filter Students by Department | `GET` | `/api/business/students/department/{deptCode}` | Fetch students by department code (`cse`, `ece`, `eee`, `mechanical`, `civil`). |
| **ManageStudents.jsx** | Filter Students by Year | `GET` | `/api/business/students/year/{yearNum}` | Fetch students by year (`1`, `2`, `3`, `4`). |
| **ManageStudents.jsx** | Search Students | `GET` | `/api/business/students/search` | Live free-text student search by name, email, regNo (`?q=...`). |
| **ManageStudents.jsx** | Toggle Activate Status | `PATCH` | `/api/business/students/{id}/activate` | Activates student profile. |
| **ManageStudents.jsx** | Toggle Deactivate Status | `PATCH` | `/api/business/students/{id}/deactivate` | Deactivates student profile. |
| **ManageStudents.jsx** | Bulk Import CSV | `POST` | `/api/business/students/import` | Imports parsed list of student records in bulk. |
| **ManageStudents.jsx** | Export CSV | `GET` | `/api/business/students/export` | Retrieves flat, complete student list for file download. |
| **ManageFaculty.jsx** | View All Faculty | `GET` | `/api/business/faculty/all` | Fetch all faculty members. |
| **ManageFaculty.jsx** | Filter Active Faculty | `GET` | `/api/business/faculty/active` | Fetch active faculty members. |
| **ManageFaculty.jsx** | Filter Pending Faculty | `GET` | `/api/business/faculty/pending` | Fetch pending faculty members. |
| **ManageFaculty.jsx** | Filter Faculty by Department | `GET` | `/api/business/faculty/department/{deptCode}` | Fetch faculty by department code (`cse`, `ece`, `eee`, `mechanical`, `civil`). |
| **ManageFaculty.jsx** | Search Faculty | `GET` | `/api/business/faculty/search` | Live free-text faculty search by name or email (`?q=...`). |
| **ManageFaculty.jsx** | Assign Lab to Faculty | `POST` | `/api/business/faculty/{id}/laboratories` | Associates faculty with a specific laboratory sub-resource. |
| **ManageFaculty.jsx** | Remove Lab from Faculty | `DELETE` | `/api/business/faculty/{id}/laboratories/{labId}` | Removes laboratory association. |
| **ManageDepartments.jsx** | View All Departments Tab | `GET` | `/api/business/departments/all` | Loads all engineering departments. |
| **ManageDepartments.jsx** | View Active Departments Tab | `GET` | `/api/business/departments/active` | Loads active engineering departments. |
| **ManageDepartments.jsx** | View Inactive Departments Tab | `GET` | `/api/business/departments/inactive` | Loads inactive engineering departments. |
| **ManageDepartments.jsx** | Assign HOD | `PATCH` | `/api/business/departments/{id}/hod` | Updates HOD name/assignment. |
| **ManageDepartments.jsx** | Remove HOD | `DELETE` | `/api/business/departments/{id}/hod` | Clears department HOD field. |
| **ManageLabs.jsx** | Toggle Lab Activation | `PATCH` | `/api/business/laboratories/{id}/activate` | Sets status to Active. |
| **ManageLabs.jsx** | Toggle Lab Deactivation | `PATCH` | `/api/business/laboratories/{id}/deactivate` | Sets status to Inactive. |
| **ManageEquipment.jsx** | View All Equipment Tab | `GET` | `/api/business/equipments/all` | Loads all department equipment. |
| **ManageEquipment.jsx** | View Available Equipment Tab | `GET` | `/api/business/equipments/available` | Loads available department equipment. |
| **ManageEquipment.jsx** | View Maintenance Equipment Tab | `GET` | `/api/business/equipments/under-maintenance` | Loads equipment under maintenance. |
| **ManageEquipment.jsx** | View Faulty Equipment Tab | `GET` | `/api/business/equipments/faulty` | Loads faulty department equipment. |
| **ManageEquipment.jsx** | Mark Equipment Available | `PUT` | `/api/business/equipments/{id}/mark-available` | Sets equipment status to Available. |
| **ManageEquipment.jsx** | Mark Equipment Booked | `PUT` | `/api/business/equipments/{id}/mark-booked` | Sets equipment status to Booked. |
| **ManageEquipment.jsx** | Mark Equipment Maintenance | `PUT` | `/api/business/equipments/{id}/mark-maintenance` | Sets equipment status to Under Maintenance. |
| **ManageEquipment.jsx** | Mark Equipment Faulty | `PUT` | `/api/business/equipments/{id}/mark-faulty` | Sets equipment status to Faulty. |
| **ManageEquipment.jsx** | Change Image | `PUT` | `/api/business/equipments/{id}/image` | Overwrites equipment image URL. |
| **ManageBookings.jsx** | Approve booking | `POST` | `/api/business/bookings/{id}/approve` | Approves booking request (resolves department). |
| **ManageBookings.jsx** | Reject booking | `POST` | `/api/business/bookings/{id}/reject` | Rejects booking request with reasons. |
| **ManageBookings.jsx** | Issue equipment | `POST` | `/api/business/bookings/{id}/issue` | Marks equipment status to In Use. |
| **ManageBookings.jsx** | Complete booking | `POST` | `/api/business/bookings/{id}/complete` | Marks booking as completed. |
| **Student Dashboard** | Cancel booking | `POST` | `/api/business/bookings/{id}/cancel` | Cancels pending booking request. |
| **MyBookings.jsx** | View All Bookings Tab | `GET` | `/api/business/bookings/my-bookings/all` | Loads all personal bookings for the student. |
| **MyBookings.jsx** | View Pending Bookings Tab | `GET` | `/api/business/bookings/my-bookings/pending` | Loads pending personal bookings for the student. |
| **MyBookings.jsx** | View Approved Bookings Tab | `GET` | `/api/business/bookings/my-bookings/approved` | Loads approved personal bookings for the student. |
| **MyBookings.jsx** | View Rejected Bookings Tab | `GET` | `/api/business/bookings/my-bookings/rejected` | Loads rejected personal bookings for the student. |
| **MyBookings.jsx** | View Completed Bookings Tab | `GET` | `/api/business/bookings/my-bookings/completed` | Loads completed personal bookings for the student. |
| **MyBookings.jsx** | View Cancelled Bookings Tab | `GET` | `/api/business/bookings/my-bookings/cancelled` | Loads cancelled personal bookings for the student. |
| **ManageFaults.jsx** | Assign Technician | `POST` | `/api/business/faults/{id}/assign` | Sets status to In Progress, updates description. |
| **ManageFaults.jsx** | Mark Resolved | `POST` | `/api/business/faults/{id}/resolve` | Sets status to Resolved. |
| **ManageMaintenance.jsx** | View All Maintenance Tab | `GET` | `/api/business/maintenance/all` | Loads all department maintenance schedules. |
| **ManageMaintenance.jsx** | View Scheduled Maintenance Tab | `GET` | `/api/business/maintenance/scheduled` | Loads scheduled maintenance tasks. |
| **ManageMaintenance.jsx** | View In Progress Maintenance Tab | `GET` | `/api/business/maintenance/in-progress` | Loads maintenance tasks in progress. |
| **ManageMaintenance.jsx** | View Completed Maintenance Tab | `GET` | `/api/business/maintenance/completed` | Loads completed maintenance tasks. |
| **ManageMaintenance.jsx** | Reschedule | `POST` | `/api/business/maintenance/{id}/schedule` | Updates scheduled date. |
| **ManageMaintenance.jsx** | Start | `POST` | `/api/business/maintenance/{id}/start` | Sets status to In Progress. |
| **ManageMaintenance.jsx** | Complete | `POST` | `/api/business/maintenance/${id}/complete` | Sets status to Completed, updates date. |
| **Notifications Panel** | View All Notifications Tab | `GET` | `/api/business/notifications/all` | Loads all notifications for current logged-in user. |
| **Notifications Panel** | View Booking Notifications Tab | `GET` | `/api/business/notifications/booking` | Loads booking notifications for current user. |
| **Notifications Panel** | View Equipment Notifications Tab | `GET` | `/api/business/notifications/equipment` | Loads equipment notifications for current user. |
| **Notifications Panel** | View Maintenance Notifications Tab | `GET` | `/api/business/notifications/maintenance` | Loads maintenance notifications for current user. |
| **Notifications Panel** | Read All Notifications | `PATCH` | `/api/business/notifications/read-all` | Marks all user notifications read. |
| **Notifications Panel** | Get Unread Count | `GET` | `/api/business/notifications/count` | Fetches integer count. |
| **Admin Notifications** | View All System Notifications Tab | `GET` | `/api/business/notifications/admin/all` | Loads all global system notifications. |
| **Admin Notifications** | View Unread System Notifications Tab | `GET` | `/api/business/notifications/admin/unread` | Loads unread global system notifications. |
| **Admin Notifications** | View Booking System Notifications Tab | `GET` | `/api/business/notifications/admin/booking` | Loads booking system notifications. |
| **Admin Notifications** | View Broadcast System Notifications Tab | `GET` | `/api/business/notifications/admin/system` | Loads system broadcast notifications. |
| **Admin Notifications** | View Fault System Notifications Tab | `GET` | `/api/business/notifications/admin/fault` | Loads fault system notifications. |
| **Admin Notifications** | View Maintenance System Notifications Tab | `GET` | `/api/business/notifications/admin/maintenance` | Loads maintenance system notifications. |
| **Dashboard** | Load Stats Summary | `GET` | `/api/business/dashboard/{role}/summary` | Fetches custom role statistics. |
| **StudentDashboard.jsx** | Load Dashboard | `GET` | `/api/business/dashboard/student` | Resolves student user stats and recent bookings from JWT. |
| **FacultyDashboard.jsx** | Load Dashboard | `GET` | `/api/business/dashboard/faculty` | Resolves faculty user stats and recent approvals from JWT. |
| **Dashboard.jsx** | Load Admin Stats | `GET` | `/api/business/dashboard/admin` | Retrieves global counts, today's bookings, pending faults, and maintenance. |
| **Statistics.jsx** | Load Live Stats | `GET` | `/api/business/dashboard/public/statistics` | Retrieves general public counts for equipment, labs, and students. |
| **DashboardPreview.jsx** | Load Metrics | `GET` | `/api/business/dashboard/public/statistics` | Fetches general stats and count of bookings/faults. |
| **AIPreview.jsx** | Load Telemetry | `GET` | `/api/business/dashboard/public/telemetry` | Loads dynamic sensor health list and alert notifications anonymously. |
| **Departments.jsx** | Load Labs List | `GET` | `/api/business/dashboard/public/laboratories` | Loads read-only list of engineering laboratories. |
| **EquipmentDetails.jsx** | View Available Equipment | `GET` | `/api/business/equipments/available-for-student` | Fetches available equipment scoped to student's department resolved from JWT. |
| **BookingApprovals.jsx** | View All Review Queue Tab | `GET` | `/api/business/bookings/my-review-queue/all` | Loads all department bookings for faculty review. |
| **BookingApprovals.jsx** | View Pending Review Queue Tab | `GET` | `/api/business/bookings/my-review-queue/pending` | Loads pending department bookings requiring review. |
| **BookingApprovals.jsx** | View Approved Review Queue Tab | `GET` | `/api/business/bookings/my-review-queue/approved` | Loads approved department bookings. |
| **BookingApprovals.jsx** | View Rejected Review Queue Tab | `GET` | `/api/business/bookings/my-review-queue/rejected` | Loads rejected department bookings. |
| **QR Pass Monitor** | View All QR Passes Tab | `GET` | `/api/business/qr-passes/all` | Loads all QR access passes. |
| **QR Pass Monitor** | View Approved QR Passes Tab | `GET` | `/api/business/qr-passes/approved` | Loads approved QR access passes. |
| **QR Pass Monitor** | View Pending QR Passes Tab | `GET` | `/api/business/qr-passes/pending` | Loads pending QR access passes. |
| **QR Pass Monitor** | View Completed QR Passes Tab | `GET` | `/api/business/qr-passes/completed` | Loads completed QR access passes. |
