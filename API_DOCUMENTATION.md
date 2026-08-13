# SmartLab AI - Backend API Documentation

This document outlines the detailed HTTP APIs exposed by the SmartLab AI microservices (`auth-service` and `smartlab-service`).

---

## 1. Student Management API (Business Service)

### Get Students (Paginated, Filtered)
* **Method**: `GET`
* **URL**: `/api/business/students`
* **Query Parameters**:
  * `search` (String): Search keyword matching name, email, or registration number.
  * `department` (String): Department filter.
  * `year` (Integer): Student academic year (1-4).
  * `status` (String): Status filter (`Active`, `Inactive`, `Pending`).
  * `page` (Integer): Page number (0-indexed).
  * `size` (Integer): Page size.
* **Roles**: `STUDENT`, `FACULTY`, `ADMIN`
* **Response Wrapper**: `ApiResponse<Page<Student>>`

### Get Student Profile By ID
* **Method**: `GET`
* **URL**: `/api/business/students/{id}`
* **Roles**: `STUDENT`, `FACULTY`, `ADMIN`

### Create Student Profile
* **Method**: `POST`
* **URL**: `/api/business/students`
* **Roles**: `ADMIN`

### Update Student Profile
* **Method**: `PUT`
* **URL**: `/api/business/students/{id}`
* **Headers**: `X-User-Sync: true/false` (optional)
* **Roles**: `STUDENT`, `FACULTY`, `ADMIN`

### Activate Student
* **Method**: `PATCH`
* **URL**: `/api/business/students/{id}/activate`
* **Roles**: `ADMIN`

### Deactivate Student
* **Method**: `PATCH`
* **URL**: `/api/business/students/{id}/deactivate`
* **Roles**: `ADMIN`

### Student Statistics Summary
* **Method**: `GET`
* **URL**: `/api/business/students/statistics`
* **Roles**: `ADMIN`

### Bulk Import Students
* **Method**: `POST`
* **URL**: `/api/business/students/import`
* **Body**: `List<Student>`
* **Roles**: `ADMIN`

### Export Students
* **Method**: `GET`
* **URL**: `/api/business/students/export`
* **Roles**: `ADMIN`

---

## 2. Faculty Management API (Business Service)

### Get Faculty (Paginated, Filtered)
* **Method**: `GET`
* **URL**: `/api/business/faculty`
* **Query Parameters**:
  * `search`, `department`, `designation`, `status`, `page`, `size`
* **Roles**: `FACULTY`, `ADMIN`

### Assign Laboratory to Faculty
* **Method**: `POST`
* **URL**: `/api/business/faculty/{id}/laboratories`
* **Body**: `{"labId": 123}`
* **Roles**: `ADMIN`

### Remove Laboratory from Faculty
* **Method**: `DELETE`
* **URL**: `/api/business/faculty/{id}/laboratories/{labId}`
* **Roles**: `ADMIN`

---

## 3. Department Management API (Business Service)

### Get Departments
* **Method**: `GET`
* **URL**: `/api/business/departments`
* **Roles**: `STUDENT`, `FACULTY`, `ADMIN`

### Assign HOD to Department
* **Method**: `PATCH`
* **URL**: `/api/business/departments/{id}/hod`
* **Body**: `{"hod": "Faculty Name"}`
* **Roles**: `ADMIN`

### Remove HOD from Department
* **Method**: `DELETE`
* **URL**: `/api/business/departments/{id}/hod`
* **Roles**: `ADMIN`

---

## 4. Laboratory Management API (Business Service)

### Get Laboratories
* **Method**: `GET`
* **URL**: `/api/business/laboratories`
* **Roles**: `STUDENT`, `FACULTY`, `ADMIN`

### Get Laboratory Sub-resources
* **Equipment**: `GET /api/business/laboratories/{id}/equipment`
* **Bookings**: `GET /api/business/laboratories/{id}/bookings`
* **Faculty**: `GET /api/business/laboratories/{id}/faculty`

---

## 5. Equipment Management API (Business Service)

### Change Equipment Status
* **Method**: `PATCH`
* **URL**: `/api/business/equipments/{id}/status`
* **Body**: `{"status": "Under Maintenance"}`
* **Roles**: `FACULTY`, `ADMIN`

### Upload Equipment Image
* **Method**: `PUT`
* **URL**: `/api/business/equipments/{id}/image`
* **Body**: `{"imageUrl": "https://url-to-image"}`
* **Roles**: `FACULTY`, `ADMIN`

### Get Available Equipment for Student (Department-Scoped)
* **Method**: `GET`
* **URL**: `/api/business/equipments/available-for-student`
* **Query Parameters**: `search`
* **Roles**: `STUDENT`
* **Response Wrapper**: `ApiResponse<List<Equipment>>`

---

## 6. Booking Management API (Business Service)

### Action Mappings
* **Get My Bookings (Filtered by Status)**: `GET /api/business/bookings/my-bookings` (Roles: `STUDENT`, `FACULTY`, `ADMIN`, Query parameters: `status`, `page`, `size`)
* **Get My Review Queue (Pending Reviews)**: `GET /api/business/bookings/my-review-queue` (Roles: `FACULTY`, `ADMIN`, Query parameters: `search`, `page`, `size`)
* **Approve Booking**: `POST/PUT /api/business/bookings/{id}/approve` (Roles: `FACULTY`, `ADMIN`)
* **Reject Booking**: `POST/PUT /api/business/bookings/{id}/reject` (Roles: `FACULTY`, `ADMIN`, Body: `{"reason": "Conflict"}`)
* **Cancel Booking**: `POST/PUT /api/business/bookings/{id}/cancel` (Roles: `STUDENT`, `FACULTY`, `ADMIN`)
* **Issue Equipment**: `POST/PUT /api/business/bookings/{id}/issue` (Roles: `FACULTY`, `ADMIN`)
* **Complete Booking**: `POST/PUT /api/business/bookings/{id}/complete` (Roles: `FACULTY`, `ADMIN`)

---

## 7. Fault Reporting API (Business Service)

### Assign Fault to Technician
* **Method**: `POST/PUT`
* **URL**: `/api/business/faults/{id}/assign`
* **Body**: `{"assignee": "Tech Name"}`
* **Roles**: `FACULTY`, `ADMIN`

### Resolve Fault
* **Method**: `POST/PUT`
* **URL**: `/api/business/faults/{id}/resolve`
* **Roles**: `FACULTY`, `ADMIN`

---

## 8. Maintenance Scheduling API (Business Service)

### Action Mappings
* **Reschedule Maintenance**: `POST/PUT /api/business/maintenance/{id}/schedule`
* **Start Maintenance**: `POST/PUT /api/business/maintenance/{id}/start`
* **Complete Maintenance**: `POST/PUT /api/business/maintenance/{id}/complete`
* **Cancel Maintenance**: `POST/PUT /api/business/maintenance/{id}/cancel`
* **Assign Technician**: `POST/PUT /api/business/maintenance/{id}/assign` (Body: `{"technician": "Name"}`)

---

## 9. Dashboard Summary API (Business Service)

### Summary Endpoints
* **Admin Dashboard**: `GET /api/business/dashboard/admin` (Roles: `ADMIN`)
* **Faculty Dashboard**: `GET /api/business/dashboard/faculty` (Roles: `FACULTY`)
* **Student Dashboard**: `GET /api/business/dashboard/student` (Roles: `STUDENT`)
* **Admin Summary**: `GET /api/business/dashboard/admin/summary` (Roles: `ADMIN`)
* **Faculty Summary**: `GET /api/business/dashboard/faculty/summary` (Roles: `FACULTY`)
* **Student Summary**: `GET /api/business/dashboard/student/summary` (Roles: `STUDENT`)
* **Public Stats Summary**: `GET /api/business/dashboard/public/statistics` (Anonymous/Public)
* **Public AI Telemetry**: `GET /api/business/dashboard/public/telemetry` (Anonymous/Public)
* **Public Laboratories**: `GET /api/business/dashboard/public/laboratories` (Anonymous/Public)
