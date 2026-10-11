-- ==============================================================================
-- APEX 3D ATHLETICS & PERFORMANCE - SQL DATABASE BACKUP
-- Generated: Sun, 04 Oct 2026 09:11:51 GMT
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `gym_database`;
USE `gym_database`;

-- ------------------------------------------------------------------------------
-- Table structure for `gym_users`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `gym_users`;
CREATE TABLE `gym_users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(20) DEFAULT '8889990012',
  `role` VARCHAR(20) DEFAULT 'member',
  `membership_plan` VARCHAR(100) DEFAULT 'Pro Performance 3-Month',
  `membership_status` VARCHAR(20) DEFAULT 'active',
  `start_date` DATETIME DEFAULT NULL,
  `expiry_date` DATETIME DEFAULT NULL,
  `check_ins` INT DEFAULT 0
);

-- Dumping data for table `gym_users`
INSERT INTO `gym_users` (`id`, `name`, `email`, `phone`, `role`, `membership_plan`, `membership_status`, `start_date`, `expiry_date`, `check_ins`) VALUES
('usr_001', 'Amrit Dwivedi', 'amrit@gym.com', '9971284797', 'admin', 'VIP Elite Annual Pass', 'active', '2026-01-01 00:00:00', '2026-12-31 00:00:00', 22),
('usr_002', 'Rohit Sharma', 'rohit@gmail.com', '9811223344', 'member', 'Pro Performance 3-Month', 'active', '2026-09-01 00:00:00', '2026-11-30 00:00:00', 14);

-- ------------------------------------------------------------------------------
-- Table structure for `gym_trainer_bookings`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `gym_trainer_bookings`;
CREATE TABLE `gym_trainer_bookings` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `trainer_name` VARCHAR(100) NOT NULL,
  `member_name` VARCHAR(100) DEFAULT 'Gym Member',
  `phone` VARCHAR(20) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `goal` VARCHAR(150) DEFAULT NULL,
  `status` VARCHAR(30) DEFAULT 'CONFIRMED'
);

-- ------------------------------------------------------------------------------
-- Table structure for `gym_trial_passes`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `gym_trial_passes`;
CREATE TABLE `gym_trial_passes` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(20) DEFAULT '3 Days',
  `pass_code` VARCHAR(50) NOT NULL,
  `status` VARCHAR(30) DEFAULT 'ACTIVE_PASS'
);

-- End of SQL Backup Dump
