CREATE DATABASE IF NOT EXISTS padi;
USE padi;

-- Main dive center table (must be created first due to foreign key reference)
CREATE TABLE IF NOT EXISTS dive_centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `user` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  birthday DATE NOT NULL,
  language VARCHAR(20) NOT NULL,
  dive_center_id INT,
  FOREIGN KEY (dive_center_id) REFERENCES dive_centers(id)
);

CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  signature_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

-- Separate tables for each form's data (one record per submission)
CREATE TABLE IF NOT EXISTS form1_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  data JSON NOT NULL,
  signature_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS form2_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  data JSON NOT NULL,
  signature_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS form3_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  data JSON NOT NULL,
  signature_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

-- Templates table (list of available PDF templates)
CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drafts table: stores per-user per-form draft data
CREATE TABLE IF NOT EXISTS drafts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  form_step INT NOT NULL,
  data JSON NOT NULL,
  signature_path VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

-- Staff table with role differentiation
CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dive_center_id INT,
    name VARCHAR(255) NOT NULL,
    role ENUM('divemaster', 'instructor', 'crew', 'captain') NOT NULL,
    certification_level VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (dive_center_id) REFERENCES dive_centers(id)
);

-- Vessels table
CREATE TABLE vessels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dive_center_id INT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    capacity INT,
    specifications TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (dive_center_id) REFERENCES dive_centers(id)
);
