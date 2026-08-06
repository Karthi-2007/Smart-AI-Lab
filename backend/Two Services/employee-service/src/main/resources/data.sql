-- SmartLab AI - Aligned Seed Data SQL Script for MySQL
USE smartlab;

-- 1. DEPARTMENTS
INSERT IGNORE INTO DEPARTMENTS (DEPARTMENT_ID, NAME) VALUES
(1, 'Computer Science & Engineering'),
(2, 'Electrical & Electronics Engineering'),
(3, 'Mechanical Engineering'),
(4, 'Civil & Structural Engineering');

-- 2. LABORATORIES
INSERT IGNORE INTO LABORATORIES (LAB_ID, NAME, DEPARTMENT_ID, LOCATION) VALUES
(1, 'Deep Learning & AI Research Lab', 1, 'Tech Block A - Room 302'),
(2, 'VLSI & Embedded Systems Lab', 2, 'Electronics Wing - Room 108'),
(3, 'Robotics & Automation Research Lab', 3, 'Mechanical Complex - Bay 4'),
(4, 'Nanotechnology & Bio-Sensors Lab', 1, 'Science & Tech Tower - Room 505'),
(5, 'Fluid Dynamics & Thermal Testing Lab', 3, 'Mechanical Complex - Bay 1');

-- 3. EQUIPMENTS
INSERT IGNORE INTO EQUIPMENTS (EQUIPMENT_ID, NAME, LAB_ID, STATUS) VALUES
(1, 'GPU Server Alpha (NVIDIA A100 80GB)', 1, 'Available'),
(2, 'GPU Server Beta (NVIDIA H100 80GB)', 1, 'In Use'),
(3, 'Digital Storage Oscilloscope Tektronix TBS2000B', 2, 'Available'),
(4, 'Keysight Logic Analyzer 16800 Series', 2, 'Faulty'),
(5, 'Industrial 6-Axis Robotic Arm KUKA KR6', 3, 'In Use'),
(6, 'Ultimaker S5 Industrial 3D Printer', 3, 'Available'),
(7, 'Optical Microscope Olympus BX53', 4, 'Available'),
(8, 'Atomic Force Microscope Nanosurf CoreAFM', 4, 'Faulty'),
(9, 'Subsonic Wind Tunnel Test Rig', 5, 'In Use'),
(10, 'Hydraulic Universal Testing Machine 100kN', 5, 'Available');

-- 4. STUDENTS (Aligned 1-to-1 with auth_db APP_USERS)
INSERT IGNORE INTO STUDENTS (STUDENT_ID, NAME, EMAIL, DEPARTMENT, YEAR, STATUS, PHONE) VALUES
(1, 'Aarav Mehta', 'aarav.mehta@university.edu', 'Computer Science & Engineering', 4, 'Active', NULL),
(2, 'Ananya Sharma', 'ananya.sharma@university.edu', 'Computer Science & Engineering', 4, 'Active', NULL),
(3, 'Karthikeyan S', 'student@smartlab.com', 'Computer Science & Engineering', 3, 'Active', '9360536215'),
(4, 'Rohan Kapoor', 'rohan.kapoor@university.edu', 'Mechanical Engineering', 3, 'Active', NULL),
(5, 'Priya Patel', 'priya.patel@university.edu', 'Electrical & Electronics Engineering', 3, 'Active', NULL),
(6, 'Vikram Singh', 'vikram.singh@university.edu', 'Mechanical Engineering', 4, 'Active', NULL),
(7, 'Student 226', '717824f226@kce.ac.in', 'Computer Science & Engineering', 3, 'Active', NULL),
(8, 'Student 220', '717824f220@kce.ac.in', 'Computer Science & Engineering', 3, 'Active', NULL),
(9, 'Student 242', '717824f242@kce.ac.in', 'Computer Science & Engineering', 3, 'Active', NULL),
(10, 'Student 250', '717824f250@kce.ac.in', 'Electrical & Electronics Engineering', 3, 'Active', NULL),
(11, 'Student 251', '717824f251@kce.ac.in', 'Mechanical Engineering', 3, 'Active', NULL),
(12, 'Student 256', '717824f256@kce.ac.in', 'Electrical & Electronics Engineering', 3, 'Active', NULL),
(14, 'Karthikeyan RKS', 'karthikeyanrks2007@gmail.com', 'Computer Science & Engineering', 3, 'Active', '9360536215');

-- 5. FACULTY (Aligned 1-to-1 with auth_db APP_USERS)
INSERT IGNORE INTO FACULTY (FACULTY_ID, NAME, EMAIL, DEPARTMENT, DESIGNATION) VALUES
(2, 'Dr. Anitha Raman', 'faculty@smartlab.com', 'Computer Science & Engineering', 'Associate Professor'),
(9, 'Dr. S. Ramanujan', 's.ramanujan@university.edu', 'Computer Science & Engineering', 'Professor & HOD'),
(10, 'Dr. Sunita Williams', 'sunita.williams@university.edu', 'Electrical & Electronics Engineering', 'Associate Professor'),
(11, 'Dr. Vikram Sarabhai', 'vikram.sarabhai@university.edu', 'Mechanical Engineering', 'Professor');

-- Note: MAINTENANCE and CONTACT_MESSAGES tables have ZERO auto-generated seed records.
-- Records are populated 100% dynamically when Faculty schedules maintenance or Visitors submit contact forms.
