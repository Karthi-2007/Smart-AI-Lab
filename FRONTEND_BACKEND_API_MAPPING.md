# Frontend-to-Backend API Mapping Reference

This document maps user actions in the React/Vite frontend to their dedicated REST endpoints in the Spring Boot microservices backend.

| Frontend Component/Service | User Action | HTTP Method | Backend URL | Description |
|---|---|---|---|---|
| **ManageStudents.jsx** | View Student List | `GET` | `/api/business/students` | Loads students dynamically (supports search, filters, pagination). |
| **ManageStudents.jsx** | Toggle Activate Status | `PATCH` | `/api/business/students/{id}/activate` | Activates student profile. |
| **ManageStudents.jsx** | Toggle Deactivate Status | `PATCH` | `/api/business/students/{id}/deactivate` | Deactivates student profile. |
| **ManageStudents.jsx** | Bulk Import CSV | `POST` | `/api/business/students/import` | Imports parsed list of student records in bulk. |
| **ManageStudents.jsx** | Export CSV | `GET` | `/api/business/students/export` | Retrieves flat, complete student list for file download. |
| **ManageFaculty.jsx** | View Faculty List | `GET` | `/api/business/faculty` | Loads faculty dynamically (supports filters and search). |
| **ManageFaculty.jsx** | Assign Lab to Faculty | `POST` | `/api/business/faculty/{id}/laboratories` | Associates faculty with a specific laboratory sub-resource. |
| **ManageFaculty.jsx** | Remove Lab from Faculty | `DELETE` | `/api/business/faculty/{id}/laboratories/{labId}` | Removes laboratory association. |
| **ManageDepartments.jsx** | Assign HOD | `PATCH` | `/api/business/departments/{id}/hod` | Updates HOD name/assignment. |
| **ManageDepartments.jsx** | Remove HOD | `DELETE` | `/api/business/departments/{id}/hod` | Clears department HOD field. |
| **ManageLabs.jsx** | Toggle Lab Activation | `PATCH` | `/api/business/laboratories/{id}/activate` | Sets status to Active. |
| **ManageLabs.jsx** | Toggle Lab Deactivation | `PATCH` | `/api/business/laboratories/{id}/deactivate` | Sets status to Inactive. |
| **ManageEquipment.jsx** | Change Status | `PATCH` | `/api/business/equipments/{id}/status` | Updates equipment status (e.g. Under Maintenance). |
| **ManageEquipment.jsx** | Change Image | `PUT` | `/api/business/equipments/{id}/image` | Overwrites equipment image URL. |
| **ManageBookings.jsx** | Approve booking | `POST` | `/api/business/bookings/{id}/approve` | Approves booking request (resolves department). |
| **ManageBookings.jsx** | Reject booking | `POST` | `/api/business/bookings/{id}/reject` | Rejects booking request with reasons. |
| **ManageBookings.jsx** | Issue equipment | `POST` | `/api/business/bookings/{id}/issue` | Marks equipment status to In Use. |
| **ManageBookings.jsx** | Complete booking | `POST` | `/api/business/bookings/{id}/complete` | Marks booking as completed. |
| **Student Dashboard** | Cancel booking | `POST` | `/api/business/bookings/{id}/cancel` | Cancels pending booking request. |
| **MyBookings.jsx** | View Personal Bookings | `GET` | `/api/business/bookings/my-bookings` | Loads logged-in user's bookings, supports status filter buttons (All, Pending, Approved, Rejected, Completed, Cancelled). |
| **ManageFaults.jsx** | Assign Technician | `POST` | `/api/business/faults/{id}/assign` | Sets status to In Progress, updates description. |
| **ManageFaults.jsx** | Mark Resolved | `POST` | `/api/business/faults/{id}/resolve` | Sets status to Resolved. |
| **ManageMaintenance.jsx** | Reschedule | `POST` | `/api/business/maintenance/{id}/schedule` | Updates scheduled date. |
| **ManageMaintenance.jsx** | Start | `POST` | `/api/business/maintenance/{id}/start` | Sets status to In Progress. |
| **ManageMaintenance.jsx** | Complete | `POST` | `/api/business/maintenance/${id}/complete` | Sets status to Completed, updates date. |
| **Notifications Panel** | Read All Notifications | `PATCH` | `/api/business/notifications/read-all` | Marks all user notifications read. |
| **Notifications Panel** | Get Unread Count | `GET` | `/api/business/notifications/count` | Fetches integer count. |
| **Dashboard** | Load Stats Summary | `GET` | `/api/business/dashboard/{role}/summary` | Fetches custom role statistics. |
| **StudentDashboard.jsx** | Load Dashboard | `GET` | `/api/business/dashboard/student` | Resolves student user stats and recent bookings from JWT. |
| **FacultyDashboard.jsx** | Load Dashboard | `GET` | `/api/business/dashboard/faculty` | Resolves faculty user stats and recent approvals from JWT. |
| **Dashboard.jsx** | Load Admin Stats | `GET` | `/api/business/dashboard/admin` | Retrieves global counts, today's bookings, pending faults, and maintenance. |
| **Statistics.jsx** | Load Live Stats | `GET` | `/api/business/dashboard/public/statistics` | Retrieves general public counts for equipment, labs, and students. |
| **DashboardPreview.jsx** | Load Metrics | `GET` | `/api/business/dashboard/public/statistics` | Fetches general stats and count of bookings/faults. |
| **AIPreview.jsx** | Load Telemetry | `GET` | `/api/business/dashboard/public/telemetry` | Loads dynamic sensor health list and alert notifications anonymously. |
| **Departments.jsx** | Load Labs List | `GET` | `/api/business/dashboard/public/laboratories` | Loads read-only list of engineering laboratories. |
| **EquipmentDetails.jsx** | View Available Equipment | `GET` | `/api/business/equipments/available-for-student` | Fetches available equipment scoped to student's department resolved from JWT. |
| **BookingApprovals.jsx** | View Pending Reviews | `GET` | `/api/business/bookings/my-review-queue` | Fetches pending booking reviews scoped to reviewer's department resolved from JWT. |
