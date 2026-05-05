-- Create database
CREATE DATABASE IF NOT EXISTS school_events_app;
USE school_events_app;

-- Create users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student'
);

-- Create events table
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  description TEXT NOT NULL
);

-- Create attendance table
CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  student_id INT NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  section VARCHAR(50) NOT NULL,
  year_level VARCHAR(20) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (event_id, student_id)
);

-- Insert sample users
INSERT INTO users (email, password, firstName, lastName, role) VALUES 
('admin@school.com', 'admin123', 'School', 'Admin', 'admin');

INSERT INTO users (email, password, firstName, lastName, role) VALUES 
('student@school.com', 'student123', 'John', 'Doe', 'student');

-- Insert sample events
INSERT INTO events (title, date, description) VALUES 
('School Assembly', '2026-03-25 10:00:00', 'Annual school assembly with all students and staff.');

INSERT INTO events (title, date, description) VALUES 
('Sports Day', '2026-04-01 08:00:00', 'Inter-house sports competition for all students.');
