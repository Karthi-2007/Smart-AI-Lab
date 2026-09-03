# SmartLab AI — Laboratory Equipment Booking & Predictive Maintenance System

SmartLab AI is an enterprise-grade academic laboratory asset management, equipment slot booking, predictive fault logging, and AI-powered analytics platform designed for multidisciplinary college departments.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, React Router, Lucide Icons, Recharts
- **API Gateway**: Spring Cloud Gateway (Port 8080)
- **Auth Service**: Spring Boot 3.2.5, Spring Security, JWT (Port 8081)
- **SmartLab Service**: Spring Boot 3.2.5, Spring Data JPA, Hibernate, Google Gemini RAG (Port 8082)
- **Database**: MySQL 8.0 (`auth_db` and `smartlab`)
- **AI Engine**: Google Gemini 1.5 Flash (Live Database Context RAG)
- **Email**: Gmail SMTP TLS

---

## 🚀 Quick Setup Guide for Teammates

Follow these steps to run the complete project on any laptop with identical database records and presentation demo data.

### Prerequisites
- **Java**: JDK 21
- **Node.js**: v18+ or v20+
- **MySQL Server**: 8.0+
- **Apache Maven**: 3.9+ (or use IDE Maven runner)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Karthi-2007/Smart-AI-Lab.git
cd Smart-AI-Lab
```

---

### Step 2: Set Up MySQL Databases & Import Presentation Data

Open MySQL CLI or your preferred MySQL workbench (e.g. DBeaver, TablePlus, MySQL Workbench) and create the two databases:

```sql
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS smartlab;
```

Now, import the pre-seeded schema and presentation data from the `database/` folder:

```bash
# On Windows PowerShell / Command Prompt:
mysql -u root -p auth_db < database/auth_db_backup.sql
mysql -u root -p smartlab < database/smartlab_backup.sql
```

*(Enter your local MySQL root password when prompted).*

---

### Step 3: Configure Environment Variables (Optional)

Default configurations work out-of-the-box for local development. If your MySQL credentials differ from `root` / `Karthi`, create a `.env` file from the template:

```bash
cp .env.example .env
```

---

### Step 4: Start Backend Microservices

Open 3 separate terminal windows (or run from IntelliJ / VS Code):

#### Terminal 1 — Auth Service (Port 8081)
```bash
cd "backend/Two Services/auth-service"
mvn spring-boot:run
```

#### Terminal 2 — SmartLab Business Service (Port 8082)
```bash
cd "backend/Two Services/smartlab-service"
mvn spring-boot:run
```

#### Terminal 3 — API Gateway (Port 8080)
```bash
cd "backend/api-gateway"
mvn spring-boot:run
```

---

### Step 5: Start the React Frontend

Open a 4th terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 👥 Presentation Demo Accounts & Credentials

All test accounts are pre-seeded in the database and ready for live presentation:

| Role | Email | Password | Department | Access / Capabilities |
|---|---|---|---|---|
| **System Admin** | `admin@smartlab.com` | `admin123` | All Depts | Full system control, analytics, department management, global approvals |
| **Faculty (CSE)** | `faculty@smartlab.com` | `faculty123` | CSE | CSE review queue, approve/reject bookings, manage lab maintenance |
| **Faculty (EEE)** | `faculty.eee@kce.ac.in` | `password123` | EEE | EEE review queue, EEE lab equipment supervision |
| **Student (CSE)** | `student@smartlab.com` | `student123` | CSE | Book CSE equipment (#303, #304, #305), report faults, view notifications |
| **Student (EEE)** | `student.eee1@kce.ac.in` | `student123` | EEE | Book EEE equipment (#100, #101, #102, #103), report faults |

---

## 🔬 Presentation Workflow Demo Checklist

1. **Student Login & Booking**:
   - Log in as `student@smartlab.com` / `student123`.
   - Browse CSE equipment &rarr; book *Dell PowerEdge Server (#303)*.
   - Verify booking status is `Pending`.
2. **Faculty Approval & Notification**:
   - Log in as `faculty@smartlab.com` / `faculty123`.
   - Open **Review Queue** &rarr; approve the pending booking.
   - Switch back to Student &rarr; verify `Approved` status and in-app Notification.
3. **Department Isolation**:
   - Log in as CSE Student &rarr; observe CSE-only equipment.
   - Log in as EEE Student &rarr; observe EEE-only equipment.
4. **Fault Reporting & Maintenance**:
   - Report a fault on an asset as a student &rarr; faculty/admin marks fault resolved with technician notes.
5. **AI Chatbot (Google Gemini RAG)**:
   - Ask in-scope question: *"What equipment is available in the lab?"* &rarr; responds with live database context.
   - Ask out-of-scope question: *"What is the weather in New York?"* &rarr; responds with SmartLab-only scope refusal.
