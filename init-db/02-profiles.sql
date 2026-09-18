SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
-- Таблица профилей
CREATE TABLE IF NOT EXISTS profiles (
    user_id INT PRIMARY KEY,
    nickname VARCHAR(20) NOT NULL,
    avatar_id INT NULL,
    about TEXT NULL DEFAULT NULL,
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);