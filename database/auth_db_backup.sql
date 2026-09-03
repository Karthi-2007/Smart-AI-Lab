-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: auth_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `auth_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `auth_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `auth_db`;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `ADMIN_ID` bigint NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint NOT NULL,
  PRIMARY KEY (`ADMIN_ID`),
  KEY `FK_ADMIN_USER` (`USER_ID`),
  CONSTRAINT `FK_ADMIN_USER` FOREIGN KEY (`USER_ID`) REFERENCES `app_users` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,1);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_users`
--

DROP TABLE IF EXISTS `app_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_users` (
  `USER_ID` bigint NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(150) NOT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `role` enum('STUDENT','FACULTY','ADMIN') NOT NULL,
  `STATUS` varchar(20) NOT NULL DEFAULT 'INACTIVE',
  `REG_NO` varchar(50) DEFAULT NULL,
  `FACULTY_ID` varchar(50) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `EMAIL` (`EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=730 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_users`
--

LOCK TABLES `app_users` WRITE;
/*!40000 ALTER TABLE `app_users` DISABLE KEYS */;
INSERT INTO `app_users` VALUES (1,'System Admin','admin@smartlab.com','$2a$10$6tVCxlDdp4aTgioyYu.uZOLkCal6Ajy4oklsp4Yu9gjtXNR30RtUS','ADMIN','ACTIVE',NULL,NULL,'1990-01-01'),(2,'Dr. Anitha Raman','717824f218@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'FAC-102','1985-05-15'),(3,'Karthikeyan S','student@smartlab.com','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','21CS101',NULL,'2002-08-20'),(4,'Dr. Sunita Williams','faculty.eee@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'FAC-EEE-110','1980-05-12'),(5,'EEE Assistant Ram','assistant.eee@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'AST-EEE-111','1992-01-20'),(11,'Dr. Vikram Sarabhai','faculty.mech@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'FAC-MECH-120','1978-08-25'),(12,'Student 226','717824f226@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','717824F226',NULL,'2004-01-15'),(13,'Student 220','717824f220@kce.ac.in','$2a$10$JwgNfRSS9Tk20/bVmmGoLuVxcyqmVL.ST9kW6q2vKlA66CrvNfNIy','STUDENT','ACTIVE','717824F220',NULL,'2004-02-20'),(14,'Student 242','717824f242@kce.ac.in','$2a$10$J7mCla51OA3fh8FNbqcBUe1LXbta.rGf6TrrxGDlzgZwhlCLXfb7W','STUDENT','ACTIVE','717824F242',NULL,'2004-03-25'),(15,'Karthikeyan RKS','karthikeyanrks2007@gmail.com','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','717824F207',NULL,'2007-05-10'),(16,'Student 250','717824f250@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','717824F250',NULL,'2004-05-12'),(17,'Student 256','717824f256@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','717824F256',NULL,'2004-06-18'),(18,'Student 251','717824f251@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','717824F251',NULL,'2004-07-22'),(19,'Dr. Anitha Raman','faculty@smartlab.com','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'FAC-101','1985-05-15'),(24,'Aditya EEE 1','student.eee1@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178EEE001',NULL,'2004-03-10'),(25,'Bhavana EEE 2','student.eee2@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178EEE002',NULL,'2003-11-15'),(26,'Chaitanya EEE 3','student.eee3@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178EEE003',NULL,'2004-04-18'),(27,'Divya EEE 4','student.eee4@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178EEE004',NULL,'2003-08-25'),(28,'Eshwar EEE 5','student.eee5@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178EEE005',NULL,'2004-01-12'),(30,'MECH Assistant Krish','assistant.mech@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'AST-MECH-121','1993-02-22'),(31,'Madan MECH 1','student.mech1@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178MECH001',NULL,'2004-05-05'),(32,'Nitin MECH 2','student.mech2@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178MECH002',NULL,'2003-09-12'),(33,'Omkar MECH 3','student.mech3@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178MECH003',NULL,'2004-06-20'),(34,'Pranav MECH 4','student.mech4@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178MECH004',NULL,'2003-12-14'),(35,'Rahul MECH 5','student.mech5@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178MECH005',NULL,'2004-02-28'),(36,'Dr. S. Ramanujan','faculty.cse@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'FAC-CSE-130','1982-12-22'),(37,'CSE Assistant Shyam','assistant.cse@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'37','1991-07-14'),(500,'Dr. Alan Turing','faculty.it@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'FAC-IT-140','1980-06-23'),(501,'Dr. Grace Hopper','faculty.aids@kce.ac.in','$2a$10$6QYSTjD4BkcnQE.X8L0Qzuy.53tl3c.bidMqSbXkKISuW2EJjO2iC','FACULTY','ACTIVE',NULL,'FAC-AIDS-150','1986-12-09'),(601,'Student Civil 1','student.civil1@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178CIVIL01',NULL,'2004-03-10'),(602,'Student Civil 2','student.civil2@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178CIVIL02',NULL,'2003-11-15'),(603,'Student IT 1','student.it1@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178IT001',NULL,'2004-04-18'),(604,'Student AIDS 1','student.aids1@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178AIDS001',NULL,'2003-08-25'),(701,'Aditya ECE 1','student.ece1@kce.ac.in','$2a$10$uYXMgFDEQXO1DXiJ.GE5y.SOba0fs0BNhiQnoQJXxREqFqjoQE7ni','STUDENT','ACTIVE','7178ECE001',NULL,'2004-03-10'),(702,'Bhavana ECE 2','student.ece2@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178ECE002',NULL,'2003-11-15'),(703,'Chaitanya ECE 3','student.ece3@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178ECE003',NULL,'2004-04-18'),(704,'Divya ECE 4','student.ece4@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178ECE004',NULL,'2003-08-25'),(705,'Eshwar ECE 5','student.ece5@kce.ac.in','$2a$10$31A9YvGUH6pEER8eXuaHbO.z8KUOrSYoHPA.Q2dAYuR0wYE8lmKVq','STUDENT','ACTIVE','7178ECE005',NULL,'2004-01-12'),(722,'karthi','facult1@smartlab.com',NULL,'FACULTY','UNACTIVATED',NULL,'FAC-3101',NULL);
/*!40000 ALTER TABLE `app_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `FACULTY_ID` bigint NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint NOT NULL,
  `FACULTY_CODE` varchar(50) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  PRIMARY KEY (`FACULTY_ID`),
  KEY `FK_FACULTY_USER` (`USER_ID`),
  CONSTRAINT `FK_FACULTY_USER` FOREIGN KEY (`USER_ID`) REFERENCES `app_users` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES (1,2,'FAC-102','1985-05-15'),(2,4,'FAC-EEE-110','1980-05-12'),(3,5,'AST-EEE-111','1992-01-20'),(4,11,'FAC-MECH-120','1978-08-25'),(5,19,'FAC-101','1985-05-15'),(6,30,'AST-MECH-121','1993-02-22'),(7,36,'FAC-CSE-130','1982-12-22'),(8,37,'37','1991-07-14'),(9,500,'FAC-IT-140','1980-06-23'),(10,501,'FAC-AIDS-150','1986-12-09'),(11,722,'FAC-3101',NULL);
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_records`
--

DROP TABLE IF EXISTS `otp_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_records` (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(150) NOT NULL,
  `OTP` varchar(10) NOT NULL,
  `STATUS` varchar(20) DEFAULT 'ACTIVE',
  `ATTEMPT_COUNT` int DEFAULT '0',
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `EXPIRY_TIME` datetime NOT NULL,
  `VERIFIED` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_records`
--

LOCK TABLES `otp_records` WRITE;
/*!40000 ALTER TABLE `otp_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `STUDENT_ID` bigint NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint NOT NULL,
  `REG_NO` varchar(50) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  PRIMARY KEY (`STUDENT_ID`),
  KEY `FK_STUDENT_USER` (`USER_ID`),
  CONSTRAINT `FK_STUDENT_USER` FOREIGN KEY (`USER_ID`) REFERENCES `app_users` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=729 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,3,'21CS101','2002-08-20'),(2,12,'717824F226','2004-01-15'),(3,13,'717824F220','2004-02-20'),(4,14,'717824F242','2004-03-25'),(5,15,'717824F207','2007-05-10'),(6,16,'717824F250','2004-05-12'),(7,17,'717824F256','2004-06-18'),(8,18,'717824F251','2004-07-22'),(9,24,'7178EEE001','2004-03-10'),(10,25,'7178EEE002','2003-11-15'),(11,26,'7178EEE003','2004-04-18'),(12,27,'7178EEE004','2003-08-25'),(13,28,'7178EEE005','2004-01-12'),(14,31,'7178MECH001','2004-05-05'),(15,32,'7178MECH002','2003-09-12'),(16,33,'7178MECH003','2004-06-20'),(17,34,'7178MECH004','2003-12-14'),(18,35,'7178MECH005','2004-02-28'),(19,601,'7178CIVIL01','2004-03-10'),(20,602,'7178CIVIL02','2003-11-15'),(21,603,'7178IT001','2004-04-18'),(22,604,'7178AIDS001','2003-08-25'),(701,701,'7178ECE001','2004-03-10'),(702,702,'7178ECE002','2003-11-15'),(703,703,'7178ECE003','2004-04-18'),(704,704,'7178ECE004','2003-08-25'),(705,705,'7178ECE005','2004-01-12');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-03 11:48:52
