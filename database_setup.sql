-- Create database
CREATE DATABASE IF NOT EXISTS school_events_app;
USE school_events_app;

-- Create users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create events table
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  description TEXT NOT NULL
);

-- Insert sample users
INSERT INTO users (email, password) VALUES 
('admin@school.com', 'admin123');

INSERT INTO users (email, password) VALUES 
('student@school.com', 'student123');

-- Insert sample events
INSERT INTO events (title, date, description) VALUES 
('School Assembly', '2026-03-25 10:00:00', 'Annual school assembly with all students and staff.');

INSERT INTO events (title, date, description) VALUES 
('Sports Day', '2026-04-01 08:00:00', 'Inter-house sports competition for all students.');
