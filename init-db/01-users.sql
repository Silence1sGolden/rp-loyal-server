SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_activated BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Таблица паролей
CREATE TABLE IF NOT EXISTS passwords (
    user_id INT PRIMARY KEY,
    pass_hash VARCHAR(255) NOT NULL,
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Таблица кодов подтверждения
CREATE TABLE IF NOT EXISTS codes (
    user_id INT PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 15 MINUTE),
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Таблица сессий
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 7 DAY),
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);