-- SmartLab AI - Auth Service Schema
-- Database: auth_db
-- Run manually once, or let Hibernate ddl-auto=update handle table creation.

CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

-- Users table
CREATE TABLE IF NOT EXISTS APP_USERS (
    USER_ID    BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME       VARCHAR(100) NOT NULL,
    EMAIL      VARCHAR(150) UNIQUE NOT NULL,
    PASSWORD   VARCHAR(255),
    ROLE       VARCHAR(20) NOT NULL,
    STATUS     VARCHAR(20) DEFAULT 'INACTIVE',
    REG_NO     VARCHAR(50),
    FACULTY_ID VARCHAR(50),
    DOB        DATE
);

-- OTP Records table
-- Replaces the old in-memory ConcurrentHashMap approach.
CREATE TABLE IF NOT EXISTS OTP_RECORDS (
    ID            BIGINT AUTO_INCREMENT PRIMARY KEY,
    EMAIL         VARCHAR(150) NOT NULL,
    OTP           VARCHAR(6) NOT NULL,
    CREATED_AT    DATETIME(6) NOT NULL,
    EXPIRY_TIME   DATETIME(6) NOT NULL,
    VERIFIED      TINYINT(1) DEFAULT 0 NOT NULL,
    ATTEMPT_COUNT INT DEFAULT 0 NOT NULL,
    STATUS        VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    INDEX idx_otp_email_status (EMAIL, STATUS)
);