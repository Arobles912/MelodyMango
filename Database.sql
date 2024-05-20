DROP DATABASE IF EXISTS MangoMelody;

CREATE DATABASE IF NOT EXISTS MangoMelody;

USE MangoMelody;

-- Users table
CREATE TABLE IF NOT EXISTS users
(
    user_id   INT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(50)            NOT NULL,
    email     VARCHAR(100)           NOT NULL UNIQUE,
    password  VARCHAR(255)           NOT NULL,
    user_role ENUM ('USER', 'ADMIN') NOT NULL DEFAULT 'USER'
);

-- Friendships table
CREATE TABLE IF NOT EXISTS friendships
(
    friendship_id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id      INT,
    user2_id      INT,
    status        ENUM ('PENDING', 'ACCEPTED') DEFAULT 'PENDING',
    FOREIGN KEY (user1_id) REFERENCES users (user_id),
    FOREIGN KEY (user2_id) REFERENCES users (user_id)
);
