-- Migration: Add complete_submissions table
-- This table stores all 3 forms together when the user completes the final submission

USE padi;

CREATE TABLE IF NOT EXISTS complete_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  form1_data JSON,
  form2_data JSON,
  form3_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);
