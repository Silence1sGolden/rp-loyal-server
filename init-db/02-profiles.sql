-- Таблица профилей
CREATE TABLE IF NOT EXISTS profiles (
    user_id INT PRIMARY KEY,
    nickname VARCHAR(20) NOT NULL,
    avatar_id INT NULL,
    about TEXT NULL DEFAULT NULL,
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);