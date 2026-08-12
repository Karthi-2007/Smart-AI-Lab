-- SmartLab AI - Auth Service Seed Data
USE auth_db;

-- 1. Insert into APP_USERS
INSERT IGNORE INTO APP_USERS (USER_ID, NAME, EMAIL, PASSWORD, ROLE, STATUS, REG_NO, FACULTY_ID, DOB) VALUES
(1, 'System Admin', 'admin@smartlab.com', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'ADMIN', 'ACTIVE', NULL, NULL, '1990-01-01'),
(2, 'Dr. Anitha Raman', '717824f218@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'FAC-102', '1985-05-15'),
(3, 'Karthikeyan S', 'student@smartlab.com', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '21CS101', NULL, '2002-08-20'),
(4, 'Dr. Sunita Williams', 'faculty.eee@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'FAC-EEE-110', '1980-05-12'),
(5, 'EEE Assistant Ram', 'assistant.eee@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'AST-EEE-111', '1992-01-20'),
(11, 'Dr. Vikram Sarabhai', 'faculty.mech@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'FAC-MECH-120', '1978-08-25'),
(12, 'Student 226', '717824f226@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '717824F226', NULL, '2004-01-15'),
(13, 'Student 220', '717824f220@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '717824F220', NULL, '2004-02-20'),
(14, 'Student 242', '717824f242@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '717824F242', NULL, '2004-03-25'),
(15, 'Karthikeyan RKS', 'karthikeyanrks2007@gmail.com', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '717824F207', NULL, '2007-05-10'),
(16, 'Student 250', '717824f250@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '717824F250', NULL, '2004-05-12'),
(17, 'Student 256', '717824f256@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '717824F256', NULL, '2004-06-18'),
(18, 'Student 251', '717824f251@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '717824F251', NULL, '2004-07-22'),
(19, 'Dr. Anitha Raman', 'faculty@smartlab.com', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'FAC-101', '1985-05-15'),
(24, 'Aditya EEE 1', 'student.eee1@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178EEE001', NULL, '2004-03-10'),
(25, 'Bhavana EEE 2', 'student.eee2@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178EEE002', NULL, '2003-11-15'),
(26, 'Chaitanya EEE 3', 'student.eee3@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178EEE003', NULL, '2004-04-18'),
(27, 'Divya EEE 4', 'student.eee4@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178EEE004', NULL, '2003-08-25'),
(28, 'Eshwar EEE 5', 'student.eee5@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178EEE005', NULL, '2004-01-12'),
(30, 'MECH Assistant Krish', 'assistant.mech@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'AST-MECH-121', '1993-02-22'),
(31, 'Madan MECH 1', 'student.mech1@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178MECH001', NULL, '2004-05-05'),
(32, 'Nitin MECH 2', 'student.mech2@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178MECH002', NULL, '2003-09-12'),
(33, 'Omkar MECH 3', 'student.mech3@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178MECH003', NULL, '2004-06-20'),
(34, 'Pranav MECH 4', 'student.mech4@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178MECH004', NULL, '2003-12-14'),
(35, 'Rahul MECH 5', 'student.mech5@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178MECH005', NULL, '2004-02-28'),
(36, 'Dr. S. Ramanujan', 'faculty.cse@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'FAC-CSE-130', '1982-12-22'),
(37, 'CSE Assistant Shyam', 'assistant.cse@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'AST-CSE-131', '1991-07-14'),
(500, 'Dr. Alan Turing', 'faculty.it@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'FAC-IT-140', '1980-06-23'),
(501, 'Dr. Grace Hopper', 'faculty.aids@kce.ac.in', '$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC', 'FACULTY', 'ACTIVE', NULL, 'FAC-AIDS-150', '1986-12-09'),
(601, 'Student Civil 1', 'student.civil1@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178CIVIL01', NULL, '2004-03-10'),
(602, 'Student Civil 2', 'student.civil2@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178CIVIL02', NULL, '2003-11-15'),
(603, 'Student IT 1', 'student.it1@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178IT001', NULL, '2004-04-18'),
(604, 'Student AIDS 1', 'student.aids1@kce.ac.in', '$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq', 'STUDENT', 'ACTIVE', '7178AIDS001', NULL, '2003-08-25');

-- 2. Insert into STUDENTS profile table
INSERT IGNORE INTO STUDENTS (STUDENT_ID, USER_ID, REG_NO, DOB) VALUES
(1, 3, '21CS101', '2002-08-20'),
(2, 12, '717824F226', '2004-01-15'),
(3, 13, '717824F220', '2004-02-20'),
(4, 14, '717824F242', '2004-03-25'),
(5, 15, '717824F207', '2007-05-10'),
(6, 16, '717824F250', '2004-05-12'),
(7, 17, '717824F256', '2004-06-18'),
(8, 18, '717824F251', '2004-07-22'),
(9, 24, '7178EEE001', '2004-03-10'),
(10, 25, '7178EEE002', '2003-11-15'),
(11, 26, '7178EEE003', '2004-04-18'),
(12, 27, '7178EEE004', '2003-08-25'),
(13, 28, '7178EEE005', '2004-01-12'),
(14, 31, '7178MECH001', '2004-05-05'),
(15, 32, '7178MECH002', '2003-09-12'),
(16, 33, '7178MECH003', '2004-06-20'),
(17, 34, '7178MECH004', '2003-12-14'),
(18, 35, '7178MECH005', '2004-02-28'),
(19, 601, '7178CIVIL01', '2004-03-10'),
(20, 602, '7178CIVIL02', '2003-11-15'),
(21, 603, '7178IT001', '2004-04-18'),
(22, 604, '7178AIDS001', '2003-08-25');

-- 3. Insert into FACULTY profile table
INSERT IGNORE INTO FACULTY (FACULTY_ID, USER_ID, FACULTY_CODE, DOB) VALUES
(1, 2, 'FAC-102', '1985-05-15'),
(2, 4, 'FAC-EEE-110', '1980-05-12'),
(3, 5, 'AST-EEE-111', '1992-01-20'),
(4, 11, 'FAC-MECH-120', '1978-08-25'),
(5, 19, 'FAC-101', '1985-05-15'),
(6, 30, 'AST-MECH-121', '1993-02-22'),
(7, 36, 'FAC-CSE-130', '1982-12-22'),
(8, 37, 'AST-CSE-131', '1991-07-14'),
(9, 500, 'FAC-IT-140', '1980-06-23'),
(10, 501, 'FAC-AIDS-150', '1986-12-09');

-- 4. Insert into ADMINS profile table
INSERT IGNORE INTO ADMINS (ADMIN_ID, USER_ID) VALUES
(1, 1);
