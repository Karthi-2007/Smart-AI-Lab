-- SmartLab AI - Expanded and Organized Seed Data SQL Script
USE smartlab;

-- 1. DEPARTMENTS
INSERT IGNORE INTO DEPARTMENTS (DEPARTMENT_ID, NAME) VALUES
(1, 'Computer Science & Technology / ECE'),
(2, 'Electrical & Electronics Engineering (EEE)'),
(3, 'Mechanical Engineering');

-- 2. LABORATORIES
INSERT IGNORE INTO LABORATORIES (LAB_ID, NAME, DEPARTMENT_ID, LOCATION) VALUES
-- EEE Labs (Dept ID: 2)
(10, 'Electrical Machines Lab-I & II', 2, 'EEE Block - Room 101'),
(11, 'Measurements & Instrumentation Lab', 2, 'EEE Block - Room 104'),
(12, 'Linear Integrated Circuits (LIC) & Control Systems Lab', 2, 'EEE Block - Room 202'),
(13, 'Power Electronics & Drives Lab', 2, 'EEE Block - Room 205'),

-- Mechanical Labs (Dept ID: 3)
(20, 'Thermal Engineering Labs I & II', 3, 'Mech Hangar - Workshop A'),
(21, 'Fluid Mechanics & Machinery Lab', 3, 'Mech Hangar - Workshop B'),
(22, 'Strength of Materials Lab', 3, 'Mech Hangar - Workshop C'),
(23, 'CAD/CAM & Mechatronics Lab', 3, 'Main Block - Room 402'),
(24, '3D Printing Lab & Specialized Centre', 3, 'Innovation Centre - Bay 1'),
(25, 'Fabrication Lab & Centre of Composites', 3, 'Innovation Centre - Bay 2'),

-- Computer Science & Technology / ECE Labs (Dept ID: 1)
(30, 'Electronic Devices & Circuits Labs', 1, 'ECE Wing - Room 301'),
(31, 'VLSI & DSP Labs', 1, 'ECE Wing - Room 304'),
(32, 'Microprocessors & Microcontrollers Lab', 1, 'ECE Wing - Room 308');

-- 3. EQUIPMENTS
INSERT IGNORE INTO EQUIPMENTS (EQUIPMENT_ID, NAME, LAB_ID, STATUS) VALUES
-- EEE Equipments
(100, 'AC Shunt Motor & DC Generator Set', 10, 'Available'),
(101, '3-Phase Alternator Sync Panel', 10, 'Available'),
(102, '3-Phase Transformer Trainer Kit', 10, 'Available'),
(103, 'Kelvin Double Bridge Trainer', 11, 'Available'),
(104, 'LVDT Transducer Calibration Rig', 11, 'Available'),
(105, 'Analog IC Tester Board', 12, 'Available'),
(106, 'Servo Motor Control Hardware Unit', 12, 'Available'),
(107, 'SCR & IGBT Chopper Power Circuit', 13, 'Available'),
(108, 'MATLAB & NI LabVIEW Academy System', 13, 'Available'),

-- Mechanical Equipments
(200, 'Steam Boiler & Turbine Test Rig', 20, 'Available'),
(201, 'IC Engine Test Setup (Variable Compression)', 20, 'Available'),
(202, 'Venturimeter and Orifice Calibration Rig', 21, 'Available'),
(203, 'Pelton Wheel Turbine Setup', 21, 'Available'),
(204, 'Universal Testing Machine (UTM) 100kN', 22, 'Available'),
(205, 'Brinell/Rockwell Hardness Tester', 22, 'Available'),
(206, 'CNC Lathe & Mechatronics Trainer Kit', 23, 'Available'),
(207, 'Voxelab Industrial 3D Printer', 24, 'Available'),
(208, 'Vacuum Bagging Fabrication Set', 25, 'Available'),

-- ECE / CSE Equipments
(300, 'Digital Storage Oscilloscope Tektronix', 30, 'Available'),
(301, 'Arbitrary Function Generator Keysight', 30, 'Available'),
(302, 'FPGA Spartan 6 Development Board', 31, 'Available'),
(303, 'TMS320C6713 DSP Starter Kit', 31, 'Available'),
(304, '8086 Microprocessor Emulator Board', 32, 'Available'),
(305, 'ARM Cortex-M4 IoT Kit', 32, 'Available');

-- 4. STUDENTS (Department mapping aligned, total 15 department students + fallback students)
INSERT IGNORE INTO STUDENTS (STUDENT_ID, NAME, EMAIL, DEPARTMENT, YEAR, STATUS, PHONE) VALUES
-- Default fallback
(3, 'Karthikeyan S', 'student@smartlab.com', 'Computer Science & Technology / ECE', 3, 'Active', '9360536215'),

-- EEE Students (5 students)
(1001, 'Aditya EEE 1', 'student.eee1@smartlab.com', 'Electrical & Electronics Engineering (EEE)', 3, 'Active', NULL),
(1002, 'Bhavana EEE 2', 'student.eee2@smartlab.com', 'Electrical & Electronics Engineering (EEE)', 3, 'Active', NULL),
(1003, 'Chaitanya EEE 3', 'student.eee3@smartlab.com', 'Electrical & Electronics Engineering (EEE)', 3, 'Active', NULL),
(1004, 'Divya EEE 4', 'student.eee4@smartlab.com', 'Electrical & Electronics Engineering (EEE)', 3, 'Active', NULL),
(1005, 'Eshwar EEE 5', 'student.eee5@smartlab.com', 'Electrical & Electronics Engineering (EEE)', 3, 'Active', NULL),

-- MECH Students (5 students)
(2001, 'Madan MECH 1', 'student.mech1@smartlab.com', 'Mechanical Engineering', 3, 'Active', NULL),
(2002, 'Nitin MECH 2', 'student.mech2@smartlab.com', 'Mechanical Engineering', 3, 'Active', NULL),
(2003, 'Omkar MECH 3', 'student.mech3@smartlab.com', 'Mechanical Engineering', 3, 'Active', NULL),
(2004, 'Pranav MECH 4', 'student.mech4@smartlab.com', 'Mechanical Engineering', 3, 'Active', NULL),
(2005, 'Rahul MECH 5', 'student.mech5@smartlab.com', 'Mechanical Engineering', 3, 'Active', NULL),

-- CSE Students (5 students)
(3001, 'Siddharth CSE 1', 'student.cse1@smartlab.com', 'Computer Science & Technology / ECE', 3, 'Active', NULL),
(3002, 'Tarun CSE 2', 'student.cse2@smartlab.com', 'Computer Science & Technology / ECE', 3, 'Active', NULL),
(3003, 'Uday CSE 3', 'student.cse3@smartlab.com', 'Computer Science & Technology / ECE', 3, 'Active', NULL),
(3004, 'Varun CSE 4', 'student.cse4@smartlab.com', 'Computer Science & Technology / ECE', 3, 'Active', NULL),
(3005, 'Yash CSE 5', 'student.cse5@smartlab.com', 'Computer Science & Technology / ECE', 3, 'Active', NULL);

-- 5. FACULTY & LAB ASSISTANTS (Saved under FACULTY table with Designation)
INSERT IGNORE INTO FACULTY (FACULTY_ID, NAME, EMAIL, DEPARTMENT, DESIGNATION, PHONE) VALUES
-- Default fallback HODs/Coordinators
(2, 'Dr. Anitha Raman', 'faculty@smartlab.com', 'Computer Science & Technology / ECE', 'Associate Professor', NULL),

-- EEE Faculty & Lab Assistant
(110, 'Dr. Sunita Williams', 'faculty.eee@smartlab.com', 'Electrical & Electronics Engineering (EEE)', 'Associate Professor & HOD', NULL),
(111, 'EEE Assistant Ram', 'assistant.eee@smartlab.com', 'Electrical & Electronics Engineering (EEE)', 'Lab Assistant', NULL),

-- MECH Faculty & Lab Assistant
(120, 'Dr. Vikram Sarabhai', 'faculty.mech@smartlab.com', 'Mechanical Engineering', 'Professor & HOD', NULL),
(121, 'MECH Assistant Krish', 'assistant.mech@smartlab.com', 'Mechanical Engineering', 'Lab Assistant', NULL),

-- CSE Faculty & Lab Assistant
(130, 'Dr. S. Ramanujan', 'faculty.cse@smartlab.com', 'Computer Science & Technology / ECE', 'Professor & HOD', NULL),
(131, 'CSE Assistant Shyam', 'assistant.cse@smartlab.com', 'Computer Science & Technology / ECE', 'Lab Assistant', NULL);
