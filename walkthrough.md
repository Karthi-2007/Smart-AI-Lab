# Unified Spring Boot 3.x Backend — Walkthrough

## What Was Done

I have successfully generated a brand new, unified Spring Boot 3.x project in the `backend-v2/` directory! This monolith architecture replaces the microservices setup and consolidates all logic into a single, cohesive application.

---

### ✅ 1. Database & Core Configuration
- **MySQL & JPA**: Configured `application.yml` with MySQL datasource and Hibernate `ddl-auto: update`.
- **Entities & Relationships**: Created the core Domain Models:
  - `User.java` (with a `Role` enum for ADMIN, STUDENT, FACULTY).
  - `Equipment.java`, `Booking.java`, and `Fault.java`.
  - Configured proper `@ManyToOne` entity relationships to link Bookings and Faults to the respective Users and Equipment.
- **Repositories**: Set up Spring Data JPA repositories (`UserRepository`, `EquipmentRepository`, etc.) to interface with the database.

### 🛡️ 2. Security & JWT Authentication
- **JWT Generation & Validation**: Implemented `JwtUtils` using the latest `jjwt` library (`0.11.5`) with secure HMAC-SHA key signing.
- **Authentication Filter**: Created `JwtAuthenticationFilter` to intercept requests, parse the Bearer token, and authenticate the user via `SecurityContextHolder`.
- **Security Configuration**: Set up a stateless `SecurityFilterChain` permitting access to auth and Swagger endpoints, while securing all `/api/business/**` endpoints.
- **Auth Controller**: Implemented the `/api/auth/login` and `/api/auth/register` endpoints to issue JWT tokens upon successful authentication.

### ⚡ 3. Global Exception Handling
- **Production-Ready Exception Interception**: Upgraded the `GlobalExceptionHandler` (`@RestControllerAdvice`) to universally intercept and standardize errors into a consistent JSON response.
- **Handled HTTP Statuses**:
  - `400 Bad Request`: Captures `BadRequestException`, `BusinessException`, and Jakarta Validation failures (`MethodArgumentNotValidException`).
  - `401 Unauthorized`: Captures Spring Security's `AuthenticationException`.
  - `403 Forbidden`: Captures Spring Security's `AccessDeniedException`.
  - `404 Not Found`: Captures `ResourceNotFoundException`.
  - `409 Conflict`: Captures `ConflictException`.
  - `500 Internal Server Error`: Captures all unhandled `Exception.class` fallbacks.

### 📚 4. Business Controllers & Service Layer
- **Strict SOLID Separation**: All business logic has been extracted from Controllers and moved into dedicated Services (`EquipmentService`, `BookingService`, `FaultService`, `UserService`).
- **Dependency Injection**: Controllers strictly rely on Services via Constructor Injection.
- **Custom Exceptions**: Implemented `ResourceNotFoundException` and `BusinessException` which are thrown deeply from the Service layer (e.g. when trying to book non-existent equipment) and gracefully caught globally by the `GlobalExceptionHandler`.
- **Equipment Service**: Handles CRUD operations for the lab catalog.
- **Booking & Fault Services**: Features specialized logic for validating equipment and users during bookings, transitioning booking states, and managing fault life cycles.

### 📖 5. Swagger/OpenAPI Documentation
- Integrated `springdoc-openapi-starter-webmvc-ui` into the `pom.xml`.
- Configured a `SwaggerConfig` bean that globally enables JWT Bearer Token authorization in the Swagger UI.
- Once running, you can access the beautiful, interactive API docs at `http://localhost:8080/swagger-ui/index.html`.

### 📦 6. Complete DTO Architecture
- **No Entities Exposed**: Successfully scrubbed all JPA Entities (`Equipment`, `User`, `Booking`, `Fault`, `Notification`) from Controller outputs. The API now strictly consumes Request DTOs and returns Response DTOs.
- **Robust Validation**: Implemented `@Valid` on all POST and PUT endpoints, with DTOs configured using Jakarta constraints (`@NotBlank`, `@NotNull`, etc.). Invalid requests automatically trigger a 400 Bad Request via the Global Exception Handler.
- **Dashboard Aggregations**: Created a standalone `DashboardService` and `DashboardController` that aggregates database counts across multiple repositories, returning a consolidated `DashboardResponse`.
- **Notifications Engine Blueprint**: Set up the initial `Notification` JPA Entity and all corresponding DTOs for the future in-app alert system.

### 🔄 7. Dedicated Mapper Layer
- **Extracted Conversion Logic**: Removed all manual Entity-to-DTO and DTO-to-Entity mapping code out of the Business Services to strictly enforce the Single Responsibility Principle.
- **Spring `@Component` Mappers**: Built `UserMapper`, `EquipmentMapper`, `BookingMapper`, and `FaultMapper` as injectable Spring beans.
- **Nested DTO Mappings**: The complex `BookingMapper` and `FaultMapper` safely inject and reuse the `UserMapper` and `EquipmentMapper` to construct deep, nested DTOs without code duplication.

### 📊 8. Role-Based Dashboards
- **Expanded DTOs**: Overhauled the `DashboardResponse` to include comprehensive granular stats like `availableEquipment`, `bookedEquipment`, `pendingBookings`, `maintenanceCount`, `faultCount`, and a newly modeled `recentActivities` list.
- **Complex Aggregations**: Upgraded the `DashboardService` to dynamically query the database differently based on role. Added repository methods like `countByStudentIdAndStatus` to isolate faculty and student metrics from the global Admin metrics.
- **Activity Stream**: Merged the 5 most recent Bookings and Faults into a generic `ActivityDTO` list to populate the dashboard activity feed natively.

### 📖 9. Swagger OpenAPI Integration
- **Controller Annotations**: Configured the Swagger UI by tagging every Controller with `@Tag` and detailing every endpoint using `@Operation` and `@ApiResponses` (covering 200, 400, 401, 403, 404, 500 status codes).
- **Rich DTO Examples**: Saturated all 13 Request and Response DTOs with `@Schema` annotations, ensuring the Swagger UI beautifully renders realistic mock data for every single field so you can execute test payloads with one click.

### 🔔 10. Complete Notification Module
- **Full Architecture Built**: Scaffolded the complete `NotificationMapper`, `NotificationService`, and `NotificationController` layers on top of the previously built `Notification` Entity and Repository.
- **REST Endpoints**: 
  - `POST /api/business/notifications` to broadcast a new alert to a specific user.
  - `GET /api/business/notifications` for an Admin view of the global timeline.
  - `GET /api/business/notifications/user/{userId}` for Students/Faculty to view their personalized chronological feed.
  - `PUT .../{id}/read` to instantly mark alerts as read.
  - `GET .../user/{userId}/unread-count` for the frontend's red notification badge metric.
- **Chronological Sorting**: Ensured all repositories query with `OrderByCreatedAtDesc` to present the newest alerts at the top of the feed.

### 📈 11. Reports & Analytics Engine
- **Spring Data Specifications**: Upgraded the `EquipmentRepository`, `BookingRepository`, `FaultRepository`, and `UserRepository` to extend `JpaSpecificationExecutor`. Built a highly advanced `ReportSpecification` class that dynamically constructs SQL `WHERE` clauses and `JOIN`s on the fly, avoiding the need for dozens of hardcoded repository combinations.
- **Dynamic Filtering**: The `ReportFilterRequest` DTO seamlessly maps frontend query parameters (`?startDate=...&department=CS&status=Active`) to the backend, enabling deep, multi-dimensional filtering across all reports.
- **Report Controller**: Exposed `/api/business/reports/*` endpoints (`/equipments`, `/bookings`, `/faults`, `/students`, `/faculty`) that return precise analytics datasets to populate frontend Recharts.
- **New Maintenance Module**: To power the Maintenance Report, the entire `Maintenance` JPA Entity and its complete architectural stack (Repo, Service, Controller) were built from scratch.

### 🛡️ 12. JWT Resource Server & RBAC
- **Auth De-coupling**: Deleted `AuthController` entirely. The backend now operates strictly as a JWT Resource Server that validates tokens (e.g., from an API Gateway or Keycloak) rather than generating them locally.
- **Security Perimeter**: Hardened `SecurityConfig.java` to require an authenticated token for every single endpoint in the application (excluding Swagger docs).
- **Role-Based Access Control**: Extensively mapped `@PreAuthorize` rules across all 8 Controllers:
  - **Admin**: Has global `.hasRole('ADMIN')` access to Reports, Dashboards, deleting/modifying entities.
  - **Faculty**: Bound by `.hasAnyRole('FACULTY', 'ADMIN')` to approve bookings, manage maintenance, and view their specific dashboard.
  - **Student**: Bound by `.hasRole('STUDENT')` for creating bookings, reporting faults, and accessing their specific dashboard.

## Next Steps
To start your new unified backend:
1. Ensure your local MySQL server is running and create the database `smartlab_unified`.
2. Open a terminal in the `backend-v2/` directory.
3. Run `mvn spring-boot:run`.

Note: You might encounter a local Java SSL certificate warning (`PKIX path building failed`) when Maven tries to download dependencies for the first time if you are behind a corporate proxy. If this happens, you can bypass it locally by running: `mvn clean install -Dmaven.wagon.http.ssl.insecure=true`.
