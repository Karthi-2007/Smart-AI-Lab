-- SmartLab AI - Business Service Seed Data
USE smartlab;

-- 1. DEPARTMENTS
INSERT IGNORE INTO DEPARTMENTS (DEPARTMENT_ID, NAME, CODE, HOD, STATUS) VALUES
(1, 'Computer Science & Technology / ECE', 'CSE-ECE', 'Dr. S. Ramanujan', 'ACTIVE'),
(2, 'Electrical & Electronics Engineering (EEE)', 'EEE', 'Dr. Sunita Williams', 'ACTIVE'),
(3, 'Mechanical Engineering', 'MECH', 'Dr. Vikram Sarabhai', 'ACTIVE'),
(4, 'Civil Engineering', 'CIVIL', 'Dr. Anitha Raman', 'ACTIVE'),
(5, 'Information Technology', 'IT', 'Dr. Alan Turing', 'ACTIVE'),
(6, 'Artificial Intelligence & Data Science', 'AIDS', 'Dr. Grace Hopper', 'ACTIVE');

-- 2. LABORATORIES
INSERT IGNORE INTO LABORATORIES (LAB_ID, NAME, DEPARTMENT_ID, LOCATION, CAPACITY, STATUS) VALUES
-- EEE Labs (Dept ID: 2)
(10, 'Electrical Machines Lab-I & II', 2, 'EEE Block - Room 101', 30, 'Active'),
(11, 'Measurements & Instrumentation Lab', 2, 'EEE Block - Room 104', 25, 'Active'),
(12, 'Linear Integrated Circuits (LIC) & Control Systems Lab', 2, 'EEE Block - Room 202', 30, 'Active'),
(13, 'Power Electronics & Drives Lab', 2, 'EEE Block - Room 205', 25, 'Active'),

-- Mechanical Labs (Dept ID: 3)
(20, 'Thermal Engineering Labs I & II', 3, 'Mech Hangar - Workshop A', 40, 'Active'),
(21, 'Fluid Mechanics & Machinery Lab', 3, 'Mech Hangar - Workshop B', 35, 'Active'),
(22, 'Strength of Materials Lab', 3, 'Mech Hangar - Workshop C', 30, 'Active'),
(23, 'CAD/CAM & Mechatronics Lab', 3, 'Main Block - Room 402', 25, 'Active'),
(24, '3D Printing Lab & Specialized Centre', 3, 'Innovation Centre - Bay 1', 15, 'Active'),
(25, 'Fabrication Lab & Centre of Composites', 3, 'Innovation Centre - Bay 2', 20, 'Active'),

-- Computer Science & Technology / ECE Labs (Dept ID: 1)
(30, 'Electronic Devices & Circuits Labs', 1, 'ECE Wing - Room 301', 30, 'Active'),
(31, 'VLSI & DSP Labs', 1, 'ECE Wing - Room 304', 25, 'Active'),
(32, 'Microprocessors & Microcontrollers Lab', 1, 'ECE Wing - Room 308', 35, 'Active'),

-- Civil Labs (Dept ID: 4)
(40, 'Structural Engineering Lab', 4, 'Civil Block - Room 105', 30, 'Active'),

-- IT Labs (Dept ID: 5)
(50, 'Software Engineering Lab', 5, 'IT Block - Room 205', 30, 'Active'),

-- AIDS Labs (Dept ID: 6)
(60, 'Deep Learning & NLP Lab', 6, 'AIDS Wing - Room 401', 25, 'Active');

-- -- 3. EQUIPMENT (20 unique-image records)
INSERT IGNORE INTO EQUIPMENT (EQUIPMENT_ID, NAME, LAB_ID, STATUS, DESCRIPTION, ASSET_ID, CATEGORY, PURCHASE_DATE, IMAGE_URL) VALUES
-- EEE Equipments (100-103, 106)
(100, 'AC Shunt Motor & DC Generator Set', 10, 'Available', 'Used to study speed control and loading characteristics of DC machines.', 'EQ-EEE-001', 'Electrical', '2023-01-15', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop'),
(101, '3-Phase Alternator Sync Panel', 10, 'Available', 'Sync and load-sharing panel for 3-Phase alternating current machines.', 'EQ-EEE-002', 'Electrical', '2023-03-22', 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=600&auto=format&fit=crop'),
(102, '3-Phase Transformer Trainer Kit', 10, 'Available', 'Equipped with multi-tap winding panels for voltage ratio studies.', 'EQ-EEE-003', 'Electrical', '2023-05-18', 'https://images.unsplash.com/photo-1620283085439-39620a1e21c4?w=600&auto=format&fit=crop'),
(103, 'Kelvin Double Bridge Trainer', 11, 'Available', 'High-precision resistance bridge setup to measure low resistance values.', 'EQ-EEE-004', 'Measurement', '2022-08-10', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop'),
(106, 'Servo Motor Control Hardware Unit', 12, 'Available', 'Feedback control rig for studying angular position/velocity tuning.', 'EQ-EEE-007', 'Control Systems', '2023-09-05', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop'),

-- Mechanical Equipments (200-202, 204, 206, 207)
(200, 'Steam Boiler & Turbine Test Rig', 20, 'Available', 'Thermal rig to evaluate steam energy efficiency and turbine torque.', 'EQ-MECH-001', 'Thermal', '2022-06-25', 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop'),
(201, 'IC Engine Test Setup (Variable Compression)', 20, 'Available', 'Multi-fuel engine rig with computerized torque and pressure sensors.', 'EQ-MECH-002', 'Thermal', '2022-10-18', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop'),
(202, 'Venturimeter and Orifice Calibration Rig', 21, 'Available', 'Fluid dynamics piping to calibrate discharge coefficients.', 'EQ-MECH-003', 'Fluids', '2023-02-12', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop'),
(204, 'Universal Testing Machine (UTM) 100kN', 22, 'Available', 'Measures tensile, compressive, and bending strength of materials.', 'EQ-MECH-005', 'Testing', '2021-08-30', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop'),
(206, 'CNC Lathe & Mechatronics Trainer Kit', 23, 'Available', 'Automated manufacturing center with programmable tool paths.', 'EQ-MECH-007', 'CAD/CAM', '2022-05-14', 'https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?w=600&auto=format&fit=crop'),
(207, 'Voxelab Industrial 3D Printer', 24, 'Available', 'Dual-extruder additive manufacturing system for functional prototyping.', 'EQ-MECH-008', '3D Printing', '2023-08-11', 'https://images.unsplash.com/photo-1634973357973-f2ed255753e1?w=600&auto=format&fit=crop'),

-- ECE / CSE Equipments (300-302, 308)
(300, 'Digital Storage Oscilloscope Tektronix', 30, 'Available', 'Dual-channel 100MHz scope for signal frequency and amplitude analysis.', 'EQ-ECE-001', 'Measurement', '2023-02-28', 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=600&auto=format&fit=crop'),
(301, 'Arbitrary Function Generator Keysight', 30, 'Available', 'Generates standard sine, square, triangle, and custom arbitrary waveforms.', 'EQ-ECE-002', 'Measurement', '2023-04-12', 'https://images.unsplash.com/photo-1581093196867-9f6c5e57a8a6?w=600&auto=format&fit=crop'),
(302, 'FPGA Spartan 6 Development Board', 31, 'Available', 'Programmable logic array trainer for digital design synthesis.', 'EQ-ECE-003', 'VLSI', '2022-09-08', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop'),
(308, 'Desktop Computer Dell OptiPlex', 31, 'Available', 'Workstation for software and simulation experiments.', 'EQ-CSE-003', 'Workstation', '2022-09-12', 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop'),

-- Civil Engineering Equipments (400, 406)
(400, 'Compression Testing Machine 2000kN', 40, 'Available', 'Tests compressive strength of concrete cylinders and cubes.', 'EQ-CIV-001', 'Testing', '2022-04-10', 'https://images.unsplash.com/photo-1581092226825-a6a2a5aee158?w=600&auto=format&fit=crop'),
(406, 'Theodolite Digital Transit', 40, 'Available', 'High precision angle measurement instrument for surveying.', 'EQ-CIV-007', 'Surveying', '2022-12-14', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop'),

-- IT Equipments (503)
(503, 'Network Attached Storage (NAS) 16TB', 50, 'Available', 'Shared network storage for student backups.', 'EQ-IT-004', 'Storage', '2022-09-22', 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&auto=format&fit=crop'),

-- AIDS Equipments (600, 605)
(600, 'NVIDIA RTX A6000 Workstation', 60, 'Available', 'GPU compute workstation for training deep learning models.', 'EQ-AIDS-001', 'Compute', '2023-04-10', 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=600&auto=format&fit=crop'),
(605, 'TurtleBot3 Mobile Robot Platform', 60, 'Available', 'Mobile robot for ROS mapping and AI navigation algorithms.', 'EQ-AIDS-006', 'Robotics', '2023-01-20', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop');

-- 4. STUDENT_PROFILES (20+ records)
INSERT IGNORE INTO STUDENT_PROFILES (STUDENT_ID, USER_ID, NAME, EMAIL, DEPARTMENT_ID, YEAR, SECTION, STATUS, PHONE, REG_NO) VALUES
-- Default fallback
(3, 3, 'Karthikeyan S', 'student@smartlab.com', 1, 3, 'A', 'Active', '9360536215', '21CS101'),

-- EEE Students (5 students)
(24, 24, 'Aditya EEE 1', 'student.eee1@kce.ac.in', 2, 3, 'A', 'Active', NULL, '7178EEE001'),
(25, 25, 'Bhavana EEE 2', 'student.eee2@kce.ac.in', 2, 3, 'A', 'Active', NULL, '7178EEE002'),
(26, 26, 'Chaitanya EEE 3', 'student.eee3@kce.ac.in', 2, 3, 'A', 'Active', NULL, '7178EEE003'),
(27, 27, 'Divya EEE 4', 'student.eee4@kce.ac.in', 2, 3, 'B', 'Active', NULL, '7178EEE004'),
(28, 28, 'Eshwar EEE 5', 'student.eee5@kce.ac.in', 2, 3, 'B', 'Active', NULL, '7178EEE005'),

-- MECH Students (5 students)
(31, 31, 'Madan MECH 1', 'student.mech1@kce.ac.in', 3, 3, 'A', 'Active', NULL, '7178MECH001'),
(32, 32, 'Nitin MECH 2', 'student.mech2@kce.ac.in', 3, 3, 'A', 'Active', NULL, '7178MECH002'),
(33, 33, 'Omkar MECH 3', 'student.mech3@kce.ac.in', 3, 3, 'A', 'Active', NULL, '7178MECH003'),
(34, 34, 'Pranav MECH 4', 'student.mech4@kce.ac.in', 3, 3, 'B', 'Active', NULL, '7178MECH004'),
(35, 35, 'Rahul MECH 5', 'student.mech5@kce.ac.in', 3, 3, 'B', 'Active', NULL, '7178MECH005'),

-- CSE Students (7 students)
(12, 12, 'Student 226', '717824f226@kce.ac.in', 1, 3, 'B', 'Active', NULL, '717824F226'),
(13, 13, 'Student 220', '717824f220@kce.ac.in', 1, 3, 'B', 'Active', NULL, '717824F220'),
(14, 14, 'Student 242', '717824f242@kce.ac.in', 1, 3, 'C', 'Active', NULL, '717824F242'),
(15, 15, 'Karthikeyan RKS', 'karthikeyanrks2007@gmail.com', 1, 3, 'C', 'Active', '9360536215', '717824F207'),
(16, 16, 'Student 250', '717824f250@kce.ac.in', 1, 3, 'C', 'Active', NULL, '717824F250'),
(17, 17, 'Student 256', '717824f256@kce.ac.in', 1, 3, 'C', 'Active', NULL, '717824F256'),
(18, 18, 'Student 251', '717824f251@kce.ac.in', 1, 3, 'C', 'Active', NULL, '717824F251'),

-- CIVIL Students (2 students)
(601, 601, 'Student Civil 1', 'student.civil1@kce.ac.in', 4, 3, 'A', 'Active', NULL, '7178CIVIL01'),
(602, 602, 'Student Civil 2', 'student.civil2@kce.ac.in', 4, 3, 'A', 'Active', NULL, '7178CIVIL02'),

-- IT Students (1 student)
(603, 603, 'Student IT 1', 'student.it1@kce.ac.in', 5, 3, 'A', 'Active', NULL, '7178IT001'),

-- AIDS Students (1 student)
(604, 604, 'Student AIDS 1', 'student.aids1@kce.ac.in', 6, 3, 'A', 'Active', NULL, '7178AIDS001');

-- 5. FACULTY_PROFILES (5+ records)
INSERT IGNORE INTO FACULTY_PROFILES (FACULTY_ID, USER_ID, NAME, EMAIL, DEPARTMENT_ID, DESIGNATION, PHONE, STATUS, LAB) VALUES
-- Default fallback HODs/Coordinators
(19, 19, 'Dr. Anitha Raman', 'faculty@smartlab.com', 1, 'Associate Professor', NULL, 'ACTIVE', 'Electronic Devices & Circuits Labs'),
(2, 2, 'Dr. Anitha Raman', '717824f218@kce.ac.in', 1, 'Associate Professor', NULL, 'ACTIVE', 'VLSI & DSP Labs'),

-- EEE Faculty & Lab Assistant
(22, 4, 'Dr. Sunita Williams', 'faculty.eee@kce.ac.in', 2, 'Associate Professor & HOD', NULL, 'ACTIVE', 'Electrical Machines Lab-I & II'),
(23, 5, 'EEE Assistant Ram', 'assistant.eee@kce.ac.in', 2, 'Lab Assistant', NULL, 'ACTIVE', 'Measurements & Instrumentation Lab'),

-- MECH Faculty & Lab Assistant
(29, 11, 'Dr. Vikram Sarabhai', 'faculty.mech@kce.ac.in', 3, 'Professor & HOD', NULL, 'ACTIVE', 'Thermal Engineering Labs I & II'),
(30, 30, 'MECH Assistant Krish', 'assistant.mech@kce.ac.in', 3, 'Lab Assistant', NULL, 'ACTIVE', 'Strength of Materials Lab'),

-- CSE Faculty & Lab Assistant
(36, 36, 'Dr. S. Ramanujan', 'faculty.cse@kce.ac.in', 1, 'Professor & HOD', NULL, 'ACTIVE', 'Electronic Devices & Circuits Labs'),
(37, 37, 'CSE Assistant Shyam', 'assistant.cse@kce.ac.in', 1, 'Lab Assistant', NULL, 'ACTIVE', 'Microprocessors & Microcontrollers Lab'),

-- IT & AIDS Faculty
(500, 500, 'Dr. Alan Turing', 'faculty.it@kce.ac.in', 5, 'Associate Professor', NULL, 'ACTIVE', 'Software Engineering Lab'),
(501, 501, 'Dr. Grace Hopper', 'faculty.aids@kce.ac.in', 6, 'Professor', NULL, 'ACTIVE', 'Deep Learning & NLP Lab');

-- 6. BOOKINGS (30 records referencing valid student and equipment)
INSERT IGNORE INTO BOOKINGS (BOOKING_ID, STUDENT_ID, EQUIPMENT_ID, BOOKING_DATE, START_TIME, END_TIME, STATUS, PURPOSE, BOOKED_AT, APPROVED_BY) VALUES
(1, 3, 300, '2026-08-12', '09:00', '11:00', 'Approved', 'Digital storage scope testing', '2026-08-10 10:00:00', 36),
(2, 12, 301, '2026-08-12', '11:00', '13:00', 'Approved', 'Waveform generation lab', '2026-08-10 10:30:00', 36),
(3, 13, 302, '2026-08-12', '14:00', '16:00', 'Pending', 'FPGA design synthesis', '2026-08-10 11:00:00', NULL),
(4, 24, 100, '2026-08-13', '09:00', '11:00', 'Approved', 'Speed control of DC motor', '2026-08-10 11:15:00', 22),
(5, 25, 101, '2026-08-13', '11:00', '13:00', 'Approved', 'Sync panel load sharing study', '2026-08-10 11:30:00', 22),
(6, 26, 102, '2026-08-13', '14:00', '16:00', 'Pending', 'Transformer wiring experiment', '2026-08-10 12:00:00', NULL),
(7, 31, 200, '2026-08-14', '09:00', '11:00', 'Approved', 'Steam Boiler efficiency test', '2026-08-10 12:15:00', 29),
(8, 32, 201, '2026-08-14', '11:00', '13:00', 'Approved', 'IC engine performance study', '2026-08-10 12:30:00', 29),
(9, 33, 202, '2026-08-14', '14:00', '16:00', 'Pending', 'Orifice calibration measurement', '2026-08-10 13:00:00', NULL),
(10, 601, 400, '2026-08-15', '09:00', '11:00', 'Approved', 'Concrete cube testing', '2026-08-10 13:15:00', 19),
(11, 602, 400, '2026-08-15', '11:00', '13:00', 'Approved', 'Cement paste consistency test', '2026-08-10 13:30:00', 19),
(12, 603, 503, '2026-08-15', '14:00', '16:00', 'Approved', 'Database performance metrics', '2026-08-10 14:00:00', 500),
(13, 604, 600, '2026-08-16', '09:00', '12:00', 'Approved', 'Deep learning model training', '2026-08-10 14:15:00', 501),
(14, 15, 308, '2026-08-16', '13:00', '15:00', 'Pending', 'Raspberry Pi IoT gateway set', '2026-08-10 14:30:00', NULL),
(15, 16, 308, '2026-08-16', '15:00', '17:00', 'Approved', 'Debugging microcontrollers logic', '2026-08-10 15:00:00', 36),
(16, 17, 308, '2026-08-17', '09:00', '11:00', 'Approved', 'Network routing simulation', '2026-08-10 15:15:00', 36),
(17, 18, 308, '2026-08-17', '11:00', '13:00', 'Pending', 'Signal frequency analysis', '2026-08-10 15:30:00', NULL),
(18, 27, 103, '2026-08-17', '14:00', '16:00', 'Approved', 'Precision resistance values check', '2026-08-10 16:00:00', 22),
(19, 28, 106, '2026-08-18', '09:00', '11:00', 'Approved', 'LVDT calibration characteristics', '2026-08-10 16:15:00', 22),
(20, 34, 204, '2026-08-18', '11:00', '13:00', 'Approved', 'Pelton wheel efficiency run', '2026-08-10 16:35:00', 29),
(21, 35, 204, '2026-08-18', '14:00', '16:00', 'Pending', 'UTM steel rod tensile testing', '2026-08-10 17:00:00', NULL),
(22, 3, 308, '2026-08-19', '09:00', '11:00', 'Approved', 'EPROM programming test', '2026-08-10 17:15:00', 36),
(23, 12, 308, '2026-08-19', '11:00', '13:00', 'Approved', 'Custom breadboard logic wiring', '2026-08-10 17:30:00', 36),
(24, 13, 308, '2026-08-19', '14:00', '16:00', 'Pending', 'Precision multimeter calibration', '2026-08-10 18:00:00', NULL),
(25, 24, 106, '2026-08-20', '09:00', '11:00', 'Approved', 'Logic gate chip verify testing', '2026-08-11 08:30:00', 22),
(26, 25, 106, '2026-08-20', '11:00', '13:00', 'Approved', 'Servo position tuning trials', '2026-08-11 09:00:00', 22),
(27, 31, 204, '2026-08-20', '14:00', '16:00', 'Pending', 'Rockwell hardness measurement', '2026-08-11 09:30:00', NULL),
(28, 32, 206, '2026-08-21', '09:00', '11:00', 'Approved', 'CNC lathe path simulation test', '2026-08-11 10:00:00', 29),
(29, 603, 503, '2026-08-21', '11:00', '13:00', 'Approved', 'Routing protocol tests on switch', '2026-08-11 10:30:00', 500),
(30, 604, 605, '2026-08-21', '14:00', '16:00', 'Approved', 'Jetson Nano AI tracking setup', '2026-08-11 11:00:00', 501);

-- 7. FAULT_REPORTS (15 records referencing valid equipment and user)
INSERT IGNORE INTO FAULT_REPORTS (FAULT_ID, EQUIPMENT_ID, REPORTED_BY_USER_ID, DESCRIPTION, STATUS, REPORTED_AT, RESOLVED_AT) VALUES
(1, 100, 24, 'Motor makes abnormal vibration noise at high RPM.', 'Open', '2026-08-05 10:00:00', NULL),
(2, 103, 27, 'Bridge galvanometer pointer is out of balance calibration.', 'Resolved', '2026-08-05 11:00:00', '2026-08-06 14:00:00'),
(3, 200, 31, 'Steam boiler pressure indicator shows fluctuating readings.', 'Open', '2026-08-06 09:00:00', NULL),
(4, 204, 35, 'UTM lower grip safety latch is stuck.', 'Open', '2026-08-06 14:00:00', NULL),
(5, 300, 12, 'DSO channel 2 signal display has static noise.', 'Resolved', '2026-08-07 10:30:00', '2026-08-08 11:30:00'),
(6, 302, 13, 'FPGA board power jack connection is loose.', 'Open', '2026-08-07 15:00:00', NULL),
(7, 400, 601, 'Compression testing hydraulic pump has oil leak.', 'Open', '2026-08-08 09:30:00', NULL),
(8, 503, 603, 'Cisco Switch port 7 is inactive.', 'Resolved', '2026-08-08 14:30:00', '2026-08-09 16:30:00'),
(9, 600, 604, 'A6000 Workstation GPU fan is rattling.', 'Open', '2026-08-09 11:00:00', NULL),
(10, 106, 25, 'IC Tester display backlight is flickering.', 'Open', '2026-08-09 16:00:00', NULL),
(11, 206, 32, 'CNC lathe spindle speed limit override sensor error.', 'Open', '2026-08-10 10:00:00', NULL),
(12, 308, 15, 'Raspberry Pi SD card slot pins damaged.', 'Open', '2026-08-10 12:00:00', NULL),
(13, 308, 16, 'OptiPlex Workstation does not power on.', 'Open', '2026-08-10 15:00:00', NULL),
(14, 406, 602, 'Theodolite lens adjustment knob is stiff.', 'Open', '2026-08-11 08:30:00', NULL),
(15, 503, 603, 'Router serial card slot has bent pins.', 'Open', '2026-08-11 10:00:00', NULL);

-- 8. MAINTENANCE (15 records referencing valid equipment and assigned user)
INSERT IGNORE INTO MAINTENANCE (MAINTENANCE_ID, EQUIPMENT_ID, ASSIGNED_TO_USER_ID, DESCRIPTION, STATUS, SCHEDULED_DATE, COMPLETED_DATE, TYPE) VALUES
(1, 100, 4, 'Annual motor windings insulation check.', 'Scheduled', '2026-08-15', NULL, 'Preventive'),
(2, 103, 4, 'High precision resistor bridge recertification.', 'Completed', '2026-08-06', '2026-08-06', 'Inspection'),
(3, 200, 11, 'Boiler pressure safety valve testing.', 'Scheduled', '2026-08-16', NULL, 'Preventive'),
(4, 204, 11, 'Hydraulic oil replacement and load cell calibration.', 'Scheduled', '2026-08-17', NULL, 'Preventive'),
(5, 300, 36, 'Oscilloscope vertical channel sweep calibration.', 'Completed', '2026-08-08', '2026-08-08', 'Inspection'),
(6, 302, 36, 'FPGA board firmware updates and socket clean.', 'Scheduled', '2026-08-18', NULL, 'Preventive'),
(7, 400, 1, 'Hydraulic ram oil seal replacement.', 'Scheduled', '2026-08-19', NULL, 'Corrective'),
(8, 503, 500, 'Switch IOS image patch update and testing.', 'Completed', '2026-08-09', '2026-08-09', 'Preventive'),
(9, 600, 501, 'Workstation clean out and GPU thermal paste swap.', 'Scheduled', '2026-08-20', NULL, 'Preventive'),
(10, 106, 4, 'IC tester chip pin connector cleanup.', 'Scheduled', '2026-08-21', NULL, 'Preventive'),
(11, 206, 11, 'CNC Lathe way lube fill and sensor test.', 'Scheduled', '2026-08-22', NULL, 'Inspection'),
(12, 308, 36, 'Raspberry Pi cluster storage clean.', 'Scheduled', '2026-08-23', NULL, 'Preventive'),
(13, 308, 36, 'Computer operating system security updates.', 'Scheduled', '2026-08-24', NULL, 'Preventive'),
(14, 406, 1, 'Theodolite optical alignment check.', 'Scheduled', '2026-08-25', NULL, 'Inspection'),
(15, 503, 500, 'Router interface module card check.', 'Scheduled', '2026-08-26', NULL, 'Corrective');

-- 9. NOTIFICATIONS (20 records referencing valid user_id)
INSERT IGNORE INTO NOTIFICATIONS (NOTIFICATION_ID, USER_ID, USER_ROLE, TITLE, MESSAGE, TYPE, IS_READ, CREATED_AT) VALUES
(1, 3, 'STUDENT', 'Booking Approved', 'Your booking for Tektronix DSO is approved.', 'Booking', 0, '2026-08-10 10:05:00'),
(2, 12, 'STUDENT', 'Booking Approved', 'Your booking for Keysight Function Generator is approved.', 'Booking', 0, '2026-08-10 10:35:00'),
(3, 36, 'FACULTY', 'New Booking Request', 'New pending booking request from Student 220.', 'System', 0, '2026-08-10 11:00:00'),
(4, 24, 'STUDENT', 'Booking Approved', 'Your booking for AC Shunt Motor is approved.', 'Booking', 0, '2026-08-10 11:20:00'),
(5, 25, 'STUDENT', 'Booking Approved', 'Your booking for Alternator Sync Panel is approved.', 'Booking', 0, '2026-08-10 11:35:00'),
(6, 22, 'FACULTY', 'New Booking Request', 'New pending booking request from Chaitanya EEE 3.', 'System', 0, '2026-08-10 12:00:00'),
(7, 31, 'STUDENT', 'Booking Approved', 'Your booking for Steam Boiler Test Rig is approved.', 'Booking', 0, '2026-08-10 12:20:00'),
(8, 32, 'STUDENT', 'Booking Approved', 'Your booking for IC Engine Setup is approved.', 'Booking', 0, '2026-08-10 12:35:00'),
(9, 29, 'FACULTY', 'New Booking Request', 'New pending booking request from Omkar MECH 3.', 'System', 0, '2026-08-10 13:00:00'),
(10, 601, 'STUDENT', 'Booking Approved', 'Your booking for Concrete Compression Machine is approved.', 'Booking', 0, '2026-08-10 13:20:00'),
(11, 602, 'STUDENT', 'Booking Approved', 'Your booking for Vicat Needle Apparatus is approved.', 'Booking', 0, '2026-08-10 13:35:00'),
(12, 603, 'STUDENT', 'Booking Approved', 'Your booking for HP Workstation is approved.', 'Booking', 0, '2026-08-10 14:05:00'),
(13, 604, 'STUDENT', 'Booking Approved', 'Your booking for NVIDIA RTX Workstation is approved.', 'Booking', 0, '2026-08-10 14:20:00'),
(14, 36, 'FACULTY', 'New Booking Request', 'New pending booking request from Karthikeyan RKS.', 'System', 0, '2026-08-10 14:30:00'),
(15, 16, 'STUDENT', 'Booking Approved', 'Your booking for Logic Analyzer is approved.', 'Booking', 0, '2026-08-10 15:05:00'),
(16, 17, 'STUDENT', 'Booking Approved', 'Your booking for Dell Desktop computer is approved.', 'Booking', 0, '2026-08-10 15:20:00'),
(17, 36, 'FACULTY', 'New Booking Request', 'New pending booking request from Student 251.', 'System', 0, '2026-08-10 15:30:00'),
(18, 27, 'STUDENT', 'Booking Approved', 'Your booking for Kelvin Bridge is approved.', 'Booking', 0, '2026-08-10 16:05:00'),
(19, 28, 'STUDENT', 'Booking Approved', 'Your booking for LVDT Calibration is approved.', 'Booking', 0, '2026-08-10 16:20:00'),
(20, 34, 'STUDENT', 'Booking Approved', 'Your booking for Pelton Wheel is approved.', 'Booking', 0, '2026-08-10 16:35:00');
