-- 1. Главная таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    -- уменьшил до 20 символов для username
    email VARCHAR(255) NOT NULL UNIQUE,
    is_activated BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2. Таблица профилей
CREATE TABLE IF NOT EXISTS profiles (
    user_id INT PRIMARY KEY,
    nickname VARCHAR(20) NULL,
    -- уменьшил до 20 символов в nickname
    avatar VARCHAR(2048) NULL,
    -- увеличил до 2048 на всякий случай для ссылок на аватарки
    about TEXT NULL,
    -- увеличил до 3000 так как ограничение на символы должно быть всё равно
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 3. Таблица паролей
CREATE TABLE IF NOT EXISTS passwords (
    user_id INT PRIMARY KEY,
    pass_hash VARCHAR(255) NOT NULL,
    -- Добавляем связь с каскадным удалением
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 4. Таблица хэшей верификации
CREATE TABLE IF NOT EXISTS verification_hashes (
    user_id INT PRIMARY KEY,
    hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    -- Добавляем связь с каскадным удалением
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 5. Таблица кодов подтверждения
CREATE TABLE IF NOT EXISTS verification_codes (
    user_id INT PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 6. Таблица сессий
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);