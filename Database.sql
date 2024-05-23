DROP DATABASE IF EXISTS MangoMelody;

CREATE DATABASE IF NOT EXISTS MangoMelody;

USE MangoMelody;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    spotify_token VARCHAR(255),
    refresh_token VARCHAR(255)
);

-- Spotify data table
CREATE TABLE IF NOT EXISTS spotify_data (
    data_id INT AUTO_INCREMENT PRIMARY KEY,
    spotify_username VARCHAR(150) NOT NULL,
    spotify_email VARCHAR(100) NOT NULL UNIQUE,
    spotify_token VARCHAR(255),
    refresh_token VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Friendships table
CREATE TABLE IF NOT EXISTS friendships (
    friendship_id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT,
    user2_id INT,
    status ENUM('PENDING', 'ACCEPTED') DEFAULT 'PENDING',
    FOREIGN KEY (user1_id) REFERENCES users (user_id),
    FOREIGN KEY (user2_id) REFERENCES users (user_id)
);