-- Главная таблица пользователей
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
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 15 MINUTE),
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица профилей
CREATE TABLE IF NOT EXISTS profiles (
    user_id INT PRIMARY KEY,
    nickname VARCHAR(20) NULL,
    avatar VARCHAR(2048) NULL,
    about TEXT NULL,
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CREATE TABLE IF NOT EXISTS profile_stats (
--     user_id INT PRIMARY KEY,
--     stories INT NOT NULL DEFAULT 0,
--     turns BIGINT NOT NULL DEFAULT 0,
--     -- Связь с таблицей пользователей
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- )

CREATE TABLE IF NOT EXISTS profile_friends (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (user_id, friend_id),
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    age INT NOT NULL,
    height INT NOT NULL,
    sex VARCHAR(20) NOT NULL,
    about TEXT NOT NULL
    -- Связь с таблицей пользователей
    FOREIGN KEY (id) REFERENCES user_characters(character_id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS user_characters (
    user_id INT NOT NULL,
    character_id INT NOT NULL,

    PRIMARY KEY (user_id, character_id),
    -- Связь с таблицей пользователей
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)