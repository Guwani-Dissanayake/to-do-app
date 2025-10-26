-- Create database if not exists
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_completed ON tasks(completed);
CREATE INDEX idx_created_at ON tasks(created_at);